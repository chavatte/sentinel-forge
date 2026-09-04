import { autoUpdater } from "electron-updater";
import { ipcMain, BrowserWindow, app } from "electron";
import { logger } from "./logger";

export function setupUpdater(win: BrowserWindow) {
  autoUpdater.logger = logger;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on("error", (error) => {
    logger.error("Auto-updater critical error:", error);
    win.webContents.send("update-status", {
      status: "error",
      error: error.message,
    });
  });

  autoUpdater.checkForUpdatesAndNotify().catch((err) => {
    logger.error("Failed to initially check for updates:", err);
  });

  autoUpdater.on("update-available", (info) => {
    logger.info(`New version available: ${info.version}`);
    win.webContents.send("update-status", {
      status: "available",
      version: info.version,
    });
  });

  autoUpdater.on("download-progress", (progressObj) => {
    const percent = Math.round(progressObj.percent);
    logger.debug(`Downloading update: ${percent}%`);

    win.webContents.send("update-progress", {
      percent: percent,
      bytesPerSecond: progressObj.bytesPerSecond,
      transferred: progressObj.transferred,
      total: progressObj.total,
    });
  });

  autoUpdater.on("update-downloaded", (info) => {
    logger.info(`Update downloaded and ready to install: ${info.version}`);
    win.webContents.send("update-status", {
      status: "downloaded",
      version: info.version,
    });
  });

  autoUpdater.on("update-not-available", () => {
    logger.info("No updates available. App is up to date.");
    win.webContents.send("update-status", {
      status: "up-to-date",
      version: app.getVersion(),
    });
  });

  ipcMain.on("restart-to-update", () => {
    logger.info("User requested restart to install the update.");
    autoUpdater.quitAndInstall(false, true);
  });
}
