import { ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import { spawn } from "node:child_process";
import { attachGitBlameToVulnerabilities } from "./gitBlame";
import { runSastScan } from "./sast";
import { queryOsvBatch, OsvResult } from "./osv";
import { logger } from "../logger";
import { getMessages, checkNetwork, getYarnMajorVersion } from "../utils";

export function runProcessAsync(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs: number = 180000,
  onData?: (data: string) => void,
): Promise<{
  stdout: string;
  stderr: string;
  code: number | null;
  timedOut?: boolean;
}> {
  return new Promise((resolve) => {
    const isWin = process.platform === "win32";
    const child = spawn(command, args, {
      cwd,
      shell: isWin,
      windowsHide: true,
      env: {
        ...process.env,
        FORCE_COLOR: "3",
        COLORTERM: "truecolor",
        TERM: "xterm-256color",
      },
    });

    let stdout = "";
    let stderr = "";
    let isTimedOut = false;

    const timer = setTimeout(() => {
      isTimedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    const processChunk = (data: Buffer, isError = false) => {
      const text = data.toString();
      if (isError) {
        stderr += text;
      } else {
        stdout += text;
      }
      if (onData) onData(text);
    };

    child.stdout?.on("data", (data) => processChunk(data, false));
    child.stderr?.on("data", (data) => processChunk(data, true));

    child.on("error", (err) => {
      clearTimeout(timer);
      if (!isTimedOut) {
        resolve({
          stdout,
          stderr: stderr || err.message,
          code: -1,
        });
      }
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr,
        code: isTimedOut ? -1 : code,
        timedOut: isTimedOut,
      });
    });
  });
}

function parseOutdatedData(stdoutData: string, manager: string, cwd: string) {
  const result: Record<
    string,
    { current: string; wanted: string; latest: string }
  > = Object.create(null);

  let packageJsonDeps: Record<string, string> = {};
  try {
    const pkgPath = path.join(cwd, "package.json");
    if (fs.existsSync(pkgPath)) {
      const pkgRaw = fs.readFileSync(pkgPath, "utf-8");
      const pkg = JSON.parse(pkgRaw);
      packageJsonDeps = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };
    }
  } catch (e) {
    logger.debug(`Could not read package.json for fallback parsing at ${cwd}`);
  }

  const cleanVersion = (v: string | undefined) =>
    v ? v.replace(/^[^\d]+/, "") : "?";

  if (!stdoutData || stdoutData.trim() === "") return result;

  const isYarnBerry = manager === "yarn" && getYarnMajorVersion(cwd) >= 2;

  try {
    if (isYarnBerry) {
      const jsonStart = stdoutData.indexOf("{");
      const jsonEnd = stdoutData.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanData = stdoutData.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(cleanData);
        for (const [pkgName, latestVersion] of Object.entries(parsed)) {
          const cleanLatest = cleanVersion(latestVersion as string);
          result[pkgName] = {
            current: cleanVersion(packageJsonDeps[pkgName]),
            wanted: cleanLatest,
            latest: cleanLatest,
          };
        }
      }
    } else if (manager === "yarn") {
      const lines = stdoutData.split("\n");
      for (const line of lines) {
        if (line.includes('"type":"table"')) {
          const parsed = JSON.parse(line);
          if (parsed?.data?.body) {
            parsed.data.body.forEach((row: string[]) => {
              const pkgName = row[0];
              let currentVal = row[1];

              if (
                !currentVal ||
                currentVal === "exotic" ||
                currentVal === "MISSING" ||
                currentVal.trim() === ""
              ) {
                currentVal = cleanVersion(packageJsonDeps[pkgName]);
              }

              result[pkgName] = {
                current: currentVal,
                wanted: row[2] || "?",
                latest: row[3] || "?",
              };
            });
          }
        }
      }
    } else {
      const jsonStart = stdoutData.indexOf("{");
      const jsonEnd = stdoutData.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const cleanData = stdoutData.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(cleanData);
        for (const [pkgName, info] of Object.entries(parsed)) {
          const i = info as any;
          let currentVal = i.current;

          if (
            !currentVal ||
            currentVal === "?" ||
            currentVal === "MISSING" ||
            currentVal.trim() === ""
          ) {
            currentVal = cleanVersion(packageJsonDeps[pkgName]);
          }

          result[pkgName] = {
            current: currentVal || "?",
            wanted: i.wanted || "?",
            latest: i.latest || "?",
          };
        }
      }
    }
  } catch (e) {
    logger.warn(`Failed to extract outdated packages: ${e}`);
  }
  return result;
}

export function parseAuditData(stdoutData: string, manager: string) {
  let cleanData = stdoutData.trim();

  if (manager === "npm") {
    const jsonStart = cleanData.indexOf("{");
    const jsonEnd = cleanData.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanData = cleanData.substring(jsonStart, jsonEnd + 1);
    }
    return JSON.parse(cleanData);
  }

  try {
    const parsed = JSON.parse(cleanData);
    if (parsed.type === "error") {
      return {
        error: { code: "PACKAGE_MANAGER_FAILURE", summary: parsed.data },
      };
    }

    if (parsed.advisories && !parsed.vulnerabilities) {
      parsed.vulnerabilities = {};
      parsed.metadata = parsed.metadata || {
        vulnerabilities: { info: 0, low: 0, moderate: 0, high: 0, critical: 0 },
        dependencies: { total: 0 },
      };

      for (const adv of Object.values(parsed.advisories as any)) {
        const moduleName = (adv as any).module_name;
        if (!parsed.vulnerabilities[moduleName]) {
          parsed.vulnerabilities[moduleName] = {
            name: moduleName,
            title: (adv as any).title || "Vulnerabilidade identificada",
            patchedIn: (adv as any).patched_versions || null,
            url: (adv as any).url || null,
            severity: (adv as any).severity || "moderate",
            isDirect: true,
            fixAvailable: (adv as any).recommendation ? true : false,
            via: [(adv as any).title || moduleName],
            effects: [],
            sources: [],
          };

          const sev = (
            (adv as any).severity || "moderate"
          ).toLowerCase() as keyof typeof parsed.metadata.vulnerabilities;

          if (parsed.metadata.vulnerabilities[sev] !== undefined) {
            parsed.metadata.vulnerabilities[sev]++;
          }
        }
      }
    }

    return parsed;
  } catch {
    const lines = cleanData.split("\n").filter((l) => l.trim().startsWith("{"));
    const payload = {
      vulnerabilities: {} as Record<string, any>,
      metadata: {
        vulnerabilities: { info: 0, low: 0, moderate: 0, high: 0, critical: 0 },
        dependencies: { total: 0 },
      },
    };

    let hasError = false;
    let errorMessage = "";

    for (const line of lines) {
      try {
        const parsed = JSON.parse(line);
        if (parsed.type === "error") {
          hasError = true;
          errorMessage = parsed.data;
        } else if (parsed.type === "auditSummary") {
          Object.assign(
            payload.metadata.vulnerabilities,
            parsed.data.vulnerabilities,
          );
          payload.metadata.dependencies.total = parsed.data.dependencies || 0;
        } else if (parsed.type === "auditAdvisory") {
          const adv = parsed.data.advisory;
          const res = parsed.data.resolution;
          const moduleName = adv.module_name;
          const rootDependency = res?.path ? res.path.split(">")[0] : null;
          const isDirect = res?.path ? res.path.split(">").length === 1 : false;

          if (!payload.vulnerabilities[moduleName]) {
            payload.vulnerabilities[moduleName] = {
              name: moduleName,
              title: adv.title || "Unspecified vulnerability",
              patchedIn: adv.patched_versions || null,
              url: adv.url || null,
              severity: adv.severity,
              isDirect: isDirect,
              fixAvailable: adv.recommendation || false,
              via: [adv.title || moduleName],
              effects: [],
              sources: [],
            };
          }
          if (
            rootDependency &&
            !payload.vulnerabilities[moduleName].effects.includes(
              rootDependency,
            )
          ) {
            payload.vulnerabilities[moduleName].effects.push(rootDependency);
          }
        } else if (
          parsed.children &&
          parsed.children.ID &&
          parsed.children.Issue
        ) {
          const moduleName = parsed.value || "unknown";
          const adv = parsed.children;
          const severity = (
            adv.Severity || "moderate"
          ).toLowerCase() as keyof typeof payload.metadata.vulnerabilities;

          if (!payload.vulnerabilities[moduleName]) {
            payload.vulnerabilities[moduleName] = {
              name: moduleName,
              title: adv.Issue || "Vulnerabilidade não detalhada",
              patchedIn: adv["Vulnerable Versions"] || null,
              url: adv.URL || null,
              severity: severity,
              isDirect: true,
              fixAvailable: false,
              via: [],
              effects: [],
              sources: [],
            };
          }

          const issueTitle = adv.Issue || moduleName;
          if (!payload.vulnerabilities[moduleName].via.includes(issueTitle)) {
            payload.vulnerabilities[moduleName].via.push(issueTitle);
          }

          if (payload.metadata.vulnerabilities[severity] !== undefined) {
            payload.metadata.vulnerabilities[severity]++;
          }
        }
      } catch (e) {}
    }

    if (hasError)
      return { error: { code: "YARN_AUDIT_ERROR", summary: errorMessage } };
    return payload;
  }
}

function mergeOsvData(
  parsedAudit: any,
  osvResults: OsvResult[],
  manager: string,
) {
  if (!parsedAudit.vulnerabilities) parsedAudit.vulnerabilities = {};
  if (!parsedAudit.metadata) {
    parsedAudit.metadata = {
      vulnerabilities: { info: 0, low: 0, moderate: 0, high: 0, critical: 0 },
    };
  }

  for (const key of Object.keys(parsedAudit.vulnerabilities)) {
    parsedAudit.vulnerabilities[key].sources = [manager.toUpperCase()];
  }

  if (osvResults && osvResults.length > 0) {
    for (const osvPkg of osvResults) {
      const pkgName = osvPkg.name;

      if (!parsedAudit.vulnerabilities[pkgName]) {
        let highestSeverity = "moderate";
        const strDump = JSON.stringify(osvPkg.vulnerabilities).toLowerCase();
        if (strDump.includes("critical")) highestSeverity = "critical";
        else if (strDump.includes("high")) highestSeverity = "high";

        parsedAudit.vulnerabilities[pkgName] = {
          name: pkgName,
          title:
            osvPkg.vulnerabilities[0].summary ||
            "OSV Global Vulnerability Alert",
          patchedIn: "Check OSV.dev DB",
          severity: highestSeverity,
          isDirect: true,
          fixAvailable: false,
          via: osvPkg.vulnerabilities.map((v: any) => v.id),
          effects: [],
          sources: ["OSV.dev"],
          osvData: osvPkg.vulnerabilities,
        };
        parsedAudit.metadata.vulnerabilities[highestSeverity] =
          (parsedAudit.metadata.vulnerabilities[highestSeverity] || 0) + 1;
      } else {
        if (!parsedAudit.vulnerabilities[pkgName].sources.includes("OSV.dev")) {
          parsedAudit.vulnerabilities[pkgName].sources.push("OSV.dev");
        }
        const newVias = osvPkg.vulnerabilities.map((v: any) => v.id);
        parsedAudit.vulnerabilities[pkgName].via = [
          ...new Set([
            ...(parsedAudit.vulnerabilities[pkgName].via || []),
            ...newVias,
          ]),
        ];
        parsedAudit.vulnerabilities[pkgName].osvData = osvPkg.vulnerabilities;
      }
    }
  }
  return parsedAudit;
}

export function setupAuditIPC() {
  ipcMain.on(
    "run-security-audit",
    async (
      event,
      { projectPath, manager = "npm", lang = "en", customSastRules = [] },
    ) => {
      const t = getMessages(lang);
      const validManagers = ["npm", "yarn", "pnpm", "bun"];
      if (!validManagers.includes(manager)) {
        logger.error(
          `[SECURITY ALERT] Execution attempt with invalid manager: ${manager}`,
        );
        return event.sender.send(
          "audit-error",
          "Invalid package manager detected.",
        );
      }

      if (!projectPath || typeof projectPath !== "string") {
        logger.error("Audit attempt with invalid path.");
        return event.sender.send("audit-error", "Invalid project path.");
      }

      const cwd = path.resolve(projectPath);
      if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
        logger.error(`Audit aborted. Directory not found: ${cwd}`);
        return event.sender.send("audit-error", "Directory not found.");
      }

      const isOnline = await checkNetwork();
      let parsedAudit: any = {
        vulnerabilities: {},
        metadata: {
          vulnerabilities: {
            info: 0,
            low: 0,
            moderate: 0,
            high: 0,
            critical: 0,
          },
          dependencies: { total: 0 },
        },
      };
      let parsedOutdated: any = {};
      let auditCode = 0;

      if (!isOnline) {
        logger.warn(`Network offline. Bypassing Triple-Scan for ${cwd}`);
        event.sender.send("terminal-log", t.offlineWarn);
        event.sender.send("terminal-log", t.offlineSast);
      } else {
        logger.info(
          `Starting Triple-Scan (Audit + Outdated + OSV) via ${manager} at: ${cwd}`,
        );

        event.sender.send(
          "terminal-log",
          `\r\n\x1b[36m[SYSTEM]: Starting TRIPLE-SCAN (Security, OSV.dev & Tech Debt) via ${manager.toUpperCase()}...\x1b[0m\r\n`,
        );

        let auditExecutable = manager;
        let outdatedExecutable = manager;
        let auditArgs = ["audit", "--json"];
        let outdatedArgs = ["outdated"];

        if (manager === "yarn") {
          const yarnVersion = getYarnMajorVersion(cwd);
          if (yarnVersion >= 2) {
            auditExecutable = "yarn";
            auditArgs = ["npm", "audit", "--json"];
            outdatedExecutable = "yarn";
            outdatedArgs = ["dlx", "-q", "npm-check-updates", "--jsonUpgraded"];
          } else {
            outdatedArgs.push("--json");
          }
        } else if (manager === "pnpm") {
          outdatedArgs.push("--format", "json");
        } else {
          outdatedArgs.push("--json");
        }

        try {
          const AUDIT_TIMEOUT_MS = 120000;
          const [auditResult, outdatedResult, osvResults] = await Promise.all([
            runProcessAsync(auditExecutable, auditArgs, cwd, AUDIT_TIMEOUT_MS),
            runProcessAsync(
              outdatedExecutable,
              outdatedArgs,
              cwd,
              AUDIT_TIMEOUT_MS,
            ),
            queryOsvBatch(cwd),
          ]);

          if (auditResult.timedOut || outdatedResult.timedOut) {
            logger.warn(
              `Triple-Scan at ${cwd} aborted due to network timeout.`,
            );
            event.sender.send("terminal-log", t.timeoutErr(AUDIT_TIMEOUT_MS));
            return event.sender.send("audit-error", t.cloneTimeoutErr);
          }

          auditCode = auditResult.code ?? 0;
          parsedAudit = parseAuditData(auditResult.stdout, manager);
          parsedOutdated = parseOutdatedData(
            outdatedResult.stdout,
            manager,
            cwd,
          );
          parsedAudit = mergeOsvData(parsedAudit, osvResults, manager);

          if (osvResults.length > 0) {
            event.sender.send(
              "terminal-log",
              `\x1b[33m[SYSTEM]: OSV.dev Global Database detected threats in ${osvResults.length} packages!\x1b[0m\r\n`,
            );
          } else {
            event.sender.send(
              "terminal-log",
              `\x1b[32m[SYSTEM]: OSV.dev Global Database scan clear.\x1b[0m\r\n`,
            );
          }

          event.sender.send(
            "terminal-log",
            `\x1b[35m[SYSTEM]: Starting SAST (Static Application Security Testing) scan...\x1b[0m\r\n`,
          );
        } catch (error: any) {
          logger.error(`Fatal failure during Triple-Scan at ${cwd}`, error);
          return event.sender.send(
            "audit-error",
            `Catastrophic failure: ${error.message}`,
          );
        }
      }
      try {
        const sastFindings = await runSastScan(cwd, customSastRules);

        if (sastFindings.length > 0) {
          event.sender.send(
            "terminal-log",
            `\x1b[31m[FATAL ALERT]: Detected ${sastFindings.length} hardcoded secrets (passwords/tokens) in the source code!\x1b[0m\r\n`,
          );
        } else {
          event.sender.send(
            "terminal-log",
            `\x1b[32m[SYSTEM]: Clean SAST scan. No exposed secrets.\x1b[0m\r\n`,
          );
        }

        if (!parsedAudit.error) {
          parsedAudit.outdated = parsedOutdated;
          parsedAudit.sast = sastFindings;

          if (
            parsedAudit.vulnerabilities &&
            Object.keys(parsedAudit.vulnerabilities).length > 0
          ) {
            event.sender.send(
              "terminal-log",
              `\x1b[33m[SYSTEM]: Tracking forensic culprits via Git Blame...\x1b[0m\r\n`,
            );
            parsedAudit.vulnerabilities = await attachGitBlameToVulnerabilities(
              cwd,
              parsedAudit.vulnerabilities,
            );
          }
        }

        logger.info(`Triple-Scan completed for: ${cwd}`);
        event.sender.send("audit-result", {
          success: true,
          data: parsedAudit,
          code: auditCode,
        });
      } catch (error: any) {
        logger.error(`Error during SAST or finalizing audit at ${cwd}`, error);
        event.sender.send("audit-error", `Internal failure: ${error.message}`);
      }
    },
  );

  ipcMain.on(
    "run-silent-audit",
    async (event, { projectPath, manager = "npm" }) => {
      const isOnline = await checkNetwork();
      if (!isOnline) return;

      const validManagers = ["npm", "yarn", "pnpm", "bun"];
      if (!validManagers.includes(manager)) return;

      const cwd = path.resolve(projectPath);
      if (!fs.existsSync(cwd)) return;

      const executable = manager;

      let auditArgs = ["audit", "--json"];
      if (manager === "yarn" && getYarnMajorVersion(cwd) >= 2) {
        auditArgs = ["npm", "audit", "--json"];
      }

      try {
        const [{ stdout, timedOut }, osvResults] = await Promise.all([
          runProcessAsync(executable, auditArgs, cwd, 120000),
          queryOsvBatch(cwd),
        ]);

        if (timedOut) return;

        let parsedJson = parseAuditData(stdout, manager);
        if (parsedJson && !parsedJson.error) {
          parsedJson = mergeOsvData(parsedJson, osvResults, manager);
          event.sender.send("silent-audit-result", {
            success: true,
            projectPath,
            data: parsedJson,
          });
        }
      } catch (error) {}
    },
  );
}
