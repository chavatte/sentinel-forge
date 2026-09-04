import { ipcMain, app } from "electron";
import path from "node:path";
import fs from "node:fs";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { getMessages, getYarnMajorVersion } from "../utils";
import { logger } from "../logger";

const execFileAsync = promisify(execFile);

export function setupCommandsIPC() {
  ipcMain.on(
    "run-package-command",
    async (
      event,
      {
        projectPath,
        commandType,
        manager = "yarn",
        lang = "en",
        args: extraArgs = "",
      },
    ) => {
      const t = getMessages(lang);
      if (!projectPath || typeof projectPath !== "string") {
        logger.warn(`Command attempt (${commandType}) with invalid path.`);
        event.sender.send("terminal-log", t.errPath);
        return;
      }

      const cwd = path.resolve(projectPath);
      if (!fs.existsSync(cwd) || !fs.statSync(cwd).isDirectory()) {
        logger.error(`Command aborted. Directory not found: ${cwd}`);
        event.sender.send("terminal-log", t.errDir(cwd));
        return;
      }

      const isWin = process.platform === "win32";
      const isGitRepo = fs.existsSync(path.join(cwd, ".git"));
      const isRemoteProject = cwd.includes("sentinel-workspaces");

      const lockfileName =
        manager === "pnpm"
          ? "pnpm-lock.yaml"
          : manager === "yarn"
            ? "yarn.lock"
            : manager === "bun"
              ? "bun.lockb"
              : "package-lock.json";
      const lockPath = path.join(cwd, lockfileName);

      const lockStatSafe = () => {
        try {
          if (!fs.existsSync(lockPath)) return null;
          const s = fs.statSync(lockPath);
          return { size: s.size, mtimeMs: s.mtimeMs };
        } catch {
          return null;
        }
      };

      const rawArgs = extraArgs.split(" ").filter(Boolean);
      const isValidArg = (arg: string) => /^[a-zA-Z0-9\-_=.@/]+$/.test(arg);
      const uiArgs = rawArgs.filter(isValidArg);
      const blockedArgs = rawArgs.filter((arg: string) => !isValidArg(arg));

      if (blockedArgs.length > 0) {
        logger.warn(
          `[SECURITY ALERT] Execution blocked in repository ${cwd}. Dangerous characters detected: ${blockedArgs.join(" ")}`,
        );
        event.sender.send("terminal-log", t.secAlert(blockedArgs.join(" ")));
        event.sender.send("command-finished", {
          code: -1,
          commandType,
          projectPath: cwd,
        });
        return;
      }

      let command = manager;
      let args: string[] = [];

      const yarnVersion = manager === "yarn" ? getYarnMajorVersion(cwd) : 1;
      const isYarnBerry = yarnVersion >= 2;

      const commandMap: Record<string, Record<string, () => void>> = {
        yarn: {
          dedupe: () => {
            if (isYarnBerry) {
              args = ["dedupe"];
            } else {
              command = "npx";
              args = ["yarn-deduplicate", lockfileName];
            }
          },
          "force-install": () => {
            args = isYarnBerry
              ? ["install", "--check-cache"]
              : ["install", "--force", ...uiArgs];
          },
          "clean-cache": () => {
            args = isYarnBerry
              ? ["cache", "clean", "--all"]
              : ["cache", "clean", ...uiArgs];
          },
          outdated: () => {
            if (isYarnBerry) {
              command = "npm";
              args = ["outdated", ...uiArgs];
            } else {
              args = ["outdated", ...uiArgs];
            }
          },
          upgrade: () => {
            args = isYarnBerry ? ["up", ...uiArgs] : ["upgrade", ...uiArgs];
          },
          upgradeLatest: () => {
            if (isYarnBerry) {
              const packagesToUpdate =
                uiArgs.length > 0
                  ? uiArgs.map((pkg: string) => `${pkg}@latest`)
                  : ["*@latest"];
              args = ["up", ...packagesToUpdate];
            } else {
              args = ["upgrade", "--latest", ...uiArgs];
            }
          },
          "upgrade-selection": () => {
            if (isYarnBerry) {
              args = ["up", ...uiArgs];
            } else {
              args = ["upgrade", ...uiArgs];
            }
          },
          "audit-fix": () => {
            if (isYarnBerry) {
              command = "yarn";
              args = ["npm", "audit"];
            } else {
              command = "npx";
              args = ["yarn-audit-fix"];
            }
          },
        },
        pnpm: {
          dedupe: () => {
            args = ["dedupe", ...uiArgs];
          },
          "force-install": () => {
            args = ["install", "--force", ...uiArgs];
          },
          "clean-cache": () => {
            args = ["store", "prune", ...uiArgs];
          },
          "clean-cache-global": () => {
            command = "pnpm";
            args = ["store", "prune"];
          },
          outdated: () => {
            args = ["outdated", ...uiArgs];
          },
          upgrade: () => {
            args = ["update", ...uiArgs];
          },
          upgradeLatest: () => {
            args = ["update", "--latest", ...uiArgs];
          },
          "upgrade-selection": () => {
            command = "pnpm";
            args = ["add", ...uiArgs];
          },
          "audit-fix": () => {
            command = "pnpm";
            args = ["audit", "--fix"];
          },
        },
        npm: {
          dedupe: () => {
            args = ["dedupe", ...uiArgs];
          },
          "force-install": () => {
            args = ["install", "--force", ...uiArgs];
          },
          "clean-cache": () => {
            args = ["cache", "clean", "--force", ...uiArgs];
          },
          "clean-cache-global": () => {
            command = "npm";
            args = ["cache", "clean", "--force"];
          },
          outdated: () => {
            args = ["outdated", ...uiArgs];
          },
          upgrade: () => {
            args = ["update", ...uiArgs];
          },
          upgradeLatest: () => {
            command = "npx";
            args = ["npm-check-updates", "-u", ...uiArgs];
          },
          "upgrade-selection": () => {
            command = "npm";
            args = ["install", ...uiArgs];
          },
          "audit-fix": () => {
            command = "npm";
            args = ["audit", "fix"];
          },
        },
        bun: {
          dedupe: () => {
            args = ["pm", "dedupe", ...uiArgs];
          },
          "force-install": () => {
            args = ["install", "--force", ...uiArgs];
          },
          "clean-cache": () => {
            args = ["pm", "cache", "rm"];
          },
          "clean-cache-global": () => {
            command = "bun";
            args = ["pm", "cache", "rm"];
          },
          outdated: () => {
            args = ["outdated", ...uiArgs];
          },
          upgrade: () => {
            args = ["update", ...uiArgs];
          },
          upgradeLatest: () => {
            args = ["update", "--latest", ...uiArgs];
          },
          "upgrade-selection": () => {
            command = "bun";
            args = ["add", ...uiArgs];
          },
          "audit-fix": () => {
            command = "bun";
            args = ["update"];
          },
        },
      };

      if (commandMap[manager]?.[commandType]) {
        commandMap[manager][commandType]();
      } else {
        args = [commandType, ...uiArgs];
      }

      logger.info(
        `Executing command [${command} ${args.join(" ")}] in repository: ${cwd}`,
      );

      const before = commandType === "dedupe" ? lockStatSafe() : null;
      event.sender.send(
        "terminal-log",
        t.pipeline(manager.toUpperCase(), command, args.join(" "), cwd),
      );

      const child = spawn(command, args, {
        cwd,
        shell: isWin,
        windowsHide: true,
        env: { ...process.env, FORCE_COLOR: "1" },
      });

      const TIMEOUT_MS = 180000;
      let isTimedOut = false;

      const timer = setTimeout(() => {
        isTimedOut = true;
        logger.warn(
          `[TIMEOUT] Killing process [${commandType}] at ${cwd} after ${TIMEOUT_MS}ms`,
        );
        event.sender.send("terminal-log", t.timeoutErr(TIMEOUT_MS));
        child.kill("SIGKILL");
      }, TIMEOUT_MS);

      child.stdout.on("data", (data) =>
        event.sender.send("terminal-log", data.toString()),
      );
      child.stderr.on("data", (data) =>
        event.sender.send("terminal-log", data.toString()),
      );

      child.on("error", (err) => {
        clearTimeout(timer);
        logger.error(
          `Fatal failure executing command [${commandType}] at ${cwd}`,
          err,
        );
        event.sender.send(
          "terminal-log",
          t.spawnErr(String(err?.message ?? err)),
        );
        event.sender.send("command-finished", {
          code: -1,
          commandType,
          projectPath: cwd,
        });
      });

      child.on("close", async (code) => {
        clearTimeout(timer);

        if (isTimedOut) {
          event.sender.send("command-finished", {
            code: -1,
            commandType,
            projectPath: cwd,
          });
          return;
        }

        logger.info(
          `Command [${commandType}] at ${cwd} finished with code ${code}`,
        );

        if (commandType === "audit-fix" && isRemoteProject) {
          event.sender.send("terminal-log", `${t.done(code ?? 0)}\r\n`);
          event.sender.send(
            "terminal-log",
            `\x1b[36m[SYSTEM]: Initializing Sentinel Git-OPS (DevChavatte)...\x1b[0m\r\n`,
          );
          event.sender.send(
            "terminal-log",
            `\x1b[33m[GIT-OPS]: Synchronizing remediation with remote origin...\x1b[0m\r\n`,
          );

          try {
            const gitEnv = { ...process.env, GIT_TERMINAL_PROMPT: "0" };
            const gitCmd = isWin ? "cmd.exe" : "git";
            const execGit = async (gitArgs: string[]) => {
              const fullArgs = isWin ? ["/c", "git", ...gitArgs] : gitArgs;
              const { stdout, stderr } = await execFileAsync(gitCmd, fullArgs, {
                cwd,
                env: gitEnv,
                windowsHide: true,
              });
              return stdout + stderr;
            };

            await execGit(["config", "user.name", "Sentinel Forge EDR"]);
            await execGit([
              "config",
              "user.email",
              "secops@sentinelforge.local",
            ]);
            await execGit([
              "add",
              "package.json",
              "package-lock.json",
              "yarn.lock",
              "pnpm-lock.yaml",
              "bun.lockb",
            ]);

            try {
              await execGit([
                "commit",
                "-m",
                "fix(security): auto-remediation applied via Sentinel Forge SOC",
              ]);
              await execGit(["push"]);
              event.sender.send(
                "terminal-log",
                `\x1b[1;32m[GIT-OPS SUCCESS]: Threat neutralized and patch pushed to remote repository!\x1b[0m\r\n---\r\n`,
              );
            } catch (commitErr: any) {
              const errStr =
                String(commitErr.stdout || "") +
                String(commitErr.stderr || "") +
                String(commitErr.message || "");
              if (
                errStr.includes("nothing to commit") ||
                errStr.includes("clean")
              ) {
                event.sender.send(
                  "terminal-log",
                  `\x1b[1;32m[GIT-OPS]: No dependency changes detected (requires manual mitigation).\x1b[0m\r\n---\r\n`,
                );
              } else {
                throw commitErr;
              }
            }
          } catch (gitErr: any) {
            event.sender.send(
              "terminal-log",
              `\x1b[1;31m[GIT-OPS ERROR]: Push failed. Ensure SSH auth is active or repo is writable.\x1b[0m\r\n${gitErr.message}\r\n---\r\n`,
            );
          }

          event.sender.send("command-finished", {
            code,
            commandType,
            projectPath: cwd,
          });
          return;
        }

        if (commandType === "dedupe") {
          const after = lockStatSafe();
          const changed =
            before && after
              ? before.size !== after.size || before.mtimeMs !== after.mtimeMs
              : Boolean(after) && !before;
          let gitLine = t.gitNotRepo;

          if (isGitRepo) {
            gitLine = await new Promise((resolve) => {
              const gitCmd = isWin ? "cmd.exe" : "git";
              const gitArgs = isWin
                ? [
                    "/d",
                    "/s",
                    "/c",
                    "git",
                    "diff",
                    "--numstat",
                    "--",
                    lockfileName,
                  ]
                : ["diff", "--numstat", "--", lockfileName];
              const git = spawn(gitCmd, gitArgs, {
                cwd,
                windowsHide: true,
                shell: false,
              });

              let out = "";
              git.stdout.on("data", (d) => (out += d.toString()));
              git.on("close", () => {
                const parts = out.trim().split(/\s+/);
                if (!parts[0]) return resolve(t.gitErr);
                resolve(
                  t.gitDiff(Number(parts[0]), Number(parts[1]), lockfileName),
                );
              });
            });
          }
          event.sender.send(
            "terminal-log",
            `${t.done(code ?? 0)}\r\n${before ? t.before(before.size) : t.beforeNotFound(lockfileName)}\r\n${after ? t.after(after.size) : t.afterNotFound(lockfileName)}\r\n${gitLine}\r\n${changed ? t.resUpdate(lockfileName) : t.resNoChange(lockfileName)}\r\n---\r\n`,
          );
        } else {
          event.sender.send("terminal-log", `${t.done(code ?? 0)}\r\n---\r\n`);
        }
        event.sender.send("command-finished", {
          code,
          commandType,
          projectPath: cwd,
        });
      });
    },
  );

  ipcMain.on(
    "add-remote-project",
    async (event, { url, sshKeyPath, lang = "en" }) => {
      const t = getMessages(lang);
      try {
        if (!url.startsWith("http") && !url.startsWith("git@")) {
          logger.warn(`Cloning attempt rejected. Invalid URL: ${url}`);
          event.sender.send("terminal-log", t.cloneInvalidUrl);
          event.sender.send("command-finished", { code: 1 });
          return;
        }

        logger.info(`Starting Sparse Checkout of remote repository: ${url}`);
        event.sender.send("terminal-log", t.cloneSysInit);

        const projectName =
          url.split("/").pop()?.replace(".git", "") || "repo-remoto";
        const hash = Math.random().toString(36).substring(2, 8);
        const userDataPath = app.getPath("userData");
        const tempClonePath = path.join(
          userDataPath,
          "sentinel-workspaces",
          `${projectName}-${hash}`,
        );
        fs.mkdirSync(path.dirname(tempClonePath), { recursive: true });

        const cloneEnv = { ...process.env };
        if (sshKeyPath) {
          logger.info(
            `Using SSH authentication with key located at: ${sshKeyPath}`,
          );
          cloneEnv.GIT_SSH_COMMAND = `ssh -i "${sshKeyPath.replace(/\\/g, "/")}" -o StrictHostKeyChecking=no`;
          event.sender.send("terminal-log", t.cloneSshMsg);
        }

        const CLONE_TIMEOUT = 300000;
        const EXTRACT_TIMEOUT = 60000;

        event.sender.send("terminal-log", t.cloneMetaMsg);

        await execFileAsync(
          "git",
          ["clone", "--filter=blob:none", "--sparse", url, tempClonePath],
          { env: cloneEnv, timeout: CLONE_TIMEOUT, killSignal: "SIGKILL" },
        );

        event.sender.send("terminal-log", t.cloneExtractMsg);

        await execFileAsync(
          "git",
          [
            "sparse-checkout",
            "set",
            "--no-cone",
            "package.json",
            "package-lock.json",
            "yarn.lock",
            "pnpm-lock.yaml",
            ".yarnrc.yml",
            ".yarn/releases/*",
            ".yarn/plugins/*",
          ],
          {
            cwd: tempClonePath,
            env: cloneEnv,
            timeout: EXTRACT_TIMEOUT,
            killSignal: "SIGKILL",
          },
        );

        let detectedManager = "npm";
        if (fs.existsSync(path.join(tempClonePath, "pnpm-lock.yaml")))
          detectedManager = "pnpm";
        else if (fs.existsSync(path.join(tempClonePath, "yarn.lock")))
          detectedManager = "yarn";
        else if (fs.existsSync(path.join(tempClonePath, "bun.lockb")))
          detectedManager = "bun";

        logger.info(
          `Remote repository (${projectName}) isolated successfully. Detected manager: ${detectedManager}.`,
        );

        event.sender.send("terminal-log", t.cloneSuccess);
        event.sender.send("command-finished", { code: 0 });
        event.sender.send("remote-project-added", {
          id: `remote-${hash}`,
          name: `☁️ ${projectName}`,
          path: tempClonePath,
          defaultManager: detectedManager,
        });
      } catch (error: any) {
        logger.error(
          `Critical failure during cloning of remote repository: ${url}`,
          error,
        );
        const errorMsg =
          error.killed && error.code === "SIGKILL"
            ? t.cloneTimeoutErr
            : error.message;
        event.sender.send("terminal-log", t.cloneError(errorMsg));
        event.sender.send("command-finished", { code: 1 });
      }
    },
  );
}
