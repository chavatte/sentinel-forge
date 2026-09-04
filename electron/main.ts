import {
  app,
  BrowserWindow,
  shell,
  session,
  ipcMain,
  nativeImage,
} from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { setupIPC } from "./ipc/index";
import { setupTray, updateTrayLanguage } from "./tray";
import { logger } from "./logger";
import { setupUpdater } from "./updater";

app.name = "Sentinel Forge";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null = null;
let isQuitting = false;
let currentLanguage = "en";

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      if (!win.isVisible()) win.show();
      win.focus();
      logger.info("Prevented duplicate instance. Restoring active window.");
    }
  });

  if (process.platform === "win32") {
    const appId = app.isPackaged
      ? "com.sentinelforge.app"
      : "com.sentinelforge.dev.app";
    app.setAppUserModelId(appId);
  }

  function createWindow() {
    logger.info("Building Sentinel Forge main window...");

    if (!VITE_DEV_SERVER_URL) {
      session.defaultSession.webRequest.onHeadersReceived(
        (details, callback) => {
          callback({
            responseHeaders: {
              ...details.responseHeaders,
              "Content-Security-Policy": [
                "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';",
              ],
            },
          });
        },
      );
    }

    session.defaultSession.setPermissionRequestHandler(
      (_webContents, permission, callback) => {
        logger.warn(
          `Blocked frontend attempt to access hardware permission: ${permission}`,
        );
        callback(false);
      },
    );

    const iconExt = process.platform === "win32" ? "ico" : "png";
    const iconPath = app.isPackaged
      ? path.join(process.resourcesPath, "public", `sentinel.${iconExt}`)
      : path.join(
        process.env.APP_ROOT as string,
        "public",
        `sentinel.${iconExt}`,
      );

    const appIcon = nativeImage.createFromPath(iconPath);

    win = new BrowserWindow({
      width: 1200,
      height: 800,
      icon: appIcon,
      backgroundColor: "#020617",
      show: false,
      autoHideMenuBar: true,
      frame: false,
      titleBarStyle: "hidden",
      webPreferences: {
        preload: path.join(__dirname, "preload.cjs"),
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: true,
      },
    });

    win.once("ready-to-show", () => {
      win?.show();
      if (process.platform === "win32") {
        win?.setIcon(appIcon);
      }
      logger.info("Interface rendered successfully.");
    });

    win.on("close", (event) => {
      if (!isQuitting) {
        event.preventDefault();
        win?.hide();
        logger.info("Window minimized to system tray.");
        return false;
      }
    });

    win.webContents.setWindowOpenHandler((details) => {
      if (details.url.includes("help.html")) {
        return {
          action: "allow",
          overrideBrowserWindowOptions: {
            autoHideMenuBar: true,
            width: 1100,
            height: 800,
            title: "Sentinel Forge - Documentation",
            webPreferences: {
              nodeIntegration: false,
              contextIsolation: true,
            },
          },
        };
      }
      logger.warn(`External URL opening attempt intercepted: ${details.url}`);
      shell.openExternal(details.url);
      return { action: "deny" };
    });

    win.webContents.on("render-process-gone", (_event, details) => {
      logger.error("The rendering process (Frontend) crashed!", details.reason);
    });

    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
    } else {
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }

    setupTray(win, iconPath, currentLanguage);
    setupIPC(win);

    if (app.isPackaged) {
      setupUpdater(win);
    }
  }

  ipcMain.on("change-language", (_event, lang: string) => {
    currentLanguage = lang;
    updateTrayLanguage(lang);
    logger.info(`Engine language changed to: ${lang}`);
  });

  app.on("before-quit", () => {
    logger.info("Shutdown process started (before-quit).");
    isQuitting = true;
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      logger.info("All windows closed. Terminating application.");
      app.quit();
      win = null;
    }
  });

  app.whenReady().then(() => {
    logger.init();
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        logger.info("Reactivating application (activate).");
        createWindow();
      } else win?.show();
    });
  });
}
