import { ipcMain, Notification, nativeImage, app } from "electron";
import path from "node:path";
import { watch, type FSWatcher } from "chokidar";
import { runProcessAsync, parseAuditData } from "./audit";
import { logger } from "../logger";
import { getMessages, getYarnMajorVersion } from "../utils";

let watcher: FSWatcher | null = null;
const projectManagers = new Map<string, string>();
let currentWatcherLanguage = "en";

const pendingAudits = new Map<string, NodeJS.Timeout>();

export function setupWatcherIPC() {
  ipcMain.on("change-language", (_event, lang: string) => {
    currentWatcherLanguage = lang;
  });

  ipcMain.on(
    "sync-watched-projects",
    (event, projects: { path: string; manager: string }[]) => {
      if (watcher) {
        watcher.close();
        pendingAudits.forEach(clearTimeout);
        pendingAudits.clear();
      }
      projectManagers.clear();

      const pathsToWatch = projects
        .map((p) => {
          projectManagers.set(p.path, p.manager);
          return [
            path.join(p.path, "package.json"),
            path.join(p.path, "yarn.lock"),
            path.join(p.path, "package-lock.json"),
            path.join(p.path, "pnpm-lock.yaml"),
          ];
        })
        .flat();

      if (pathsToWatch.length === 0) return;

      watcher = watch(pathsToWatch, {
        persistent: true,
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 2000, pollInterval: 100 },
      });

      watcher.on("change", (filePath: string) => {
        const projectDir = path.dirname(filePath);
        const manager = projectManagers.get(projectDir) || "npm";
        const projectName = path.basename(projectDir);

        if (pendingAudits.has(projectDir)) {
          clearTimeout(pendingAudits.get(projectDir)!);
        }

        const auditTask = setTimeout(async () => {
          pendingAudits.delete(projectDir);

          logger.info(
            `[EDR Watcher] Modification stabilized in ${path.basename(filePath)}. Starting silent scan...`,
          );

          const executable = manager;
          let spawnArgs = ["audit", "--json"];

          if (manager === "yarn" && getYarnMajorVersion(projectDir) >= 2) {
            spawnArgs = ["npm", "audit", "--json"];
          }

          try {
            const { stdout } = await runProcessAsync(
              executable,
              spawnArgs,
              projectDir,
            );
            const parsedJson = parseAuditData(stdout, manager);

            if (
              parsedJson &&
              parsedJson.metadata &&
              parsedJson.metadata.vulnerabilities
            ) {
              const vulns = parsedJson.metadata.vulnerabilities;
              const critical = Number(vulns.critical) || 0;
              const high = Number(vulns.high) || 0;

              if (critical > 0 || high > 0) {
                logger.warn(
                  `[EDR Watcher] Severe threat injected in ${projectName}! C:${critical} H:${high}`,
                );

                const iconExt = process.platform === "win32" ? "ico" : "png";
                const iconPath = app.isPackaged
                  ? path.join(
                      process.resourcesPath,
                      "public",
                      `sentinel.${iconExt}`,
                    )
                  : path.join(
                      process.env.APP_ROOT || process.cwd(),
                      "public",
                      `sentinel.${iconExt}`,
                    );
                const t = getMessages(currentWatcherLanguage);
                const notification = new Notification({
                  title: t.watcherAlertTitle,
                  body: t.watcherAlertBody(
                    projectName.toUpperCase(),
                    critical,
                    high,
                  ),
                  icon: nativeImage.createFromPath(iconPath),
                  urgency: "critical",
                });

                notification.on("click", () => {
                  const wins =
                    require("electron").BrowserWindow.getAllWindows();
                  if (wins.length > 0) {
                    if (wins[0].isMinimized()) wins[0].restore();
                    wins[0].show();
                    wins[0].focus();
                  }
                });
                notification.show();
                event.sender.send("silent-audit-result", {
                  success: true,
                  projectPath: projectDir,
                  data: parsedJson,
                });
              } else {
                logger.info(
                  `[EDR Watcher] ${projectName} updated. No critical threats detected.`,
                );
              }
            }
          } catch (error) {
            logger.error(
              `[EDR Watcher] Failed to silently audit ${projectDir}`,
              error,
            );
          }
        }, 1500);
        pendingAudits.set(projectDir, auditTask);
      });
    },
  );
}
