import { Tray, Menu, app, BrowserWindow, shell } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getTrayMessages } from "./utils";
import { autoUpdater } from "electron-updater";
import { logger } from "./logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let tray: Tray | null = null;
let storedWin: BrowserWindow | null = null;
let docsWin: BrowserWindow | null = null;

function buildContextMenu(lang: string) {
  const t = getTrayMessages(lang);

  return Menu.buildFromTemplate([
    {
      label: t.openPanel,
      click: () => {
        if (storedWin) {
          storedWin.show();
          storedWin.focus();
        }
      },
    },
    {
      label: t.docs,
      click: () => {
        if (docsWin) {
          if (docsWin.isMinimized()) docsWin.restore();
          docsWin.show();
          docsWin.focus();
          return;
        }

        docsWin = new BrowserWindow({
          width: 1100,
          height: 800,
          title: "Sentinel Forge - Documentation",
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
          },
        });

        docsWin.on("closed", () => {
          docsWin = null;
        });

        docsWin.webContents.setWindowOpenHandler((details) => {
          shell.openExternal(details.url);
          return { action: "deny" };
        });

        if (process.env.VITE_DEV_SERVER_URL) {
          docsWin.loadURL(
            `${process.env.VITE_DEV_SERVER_URL}help.html?lang=${lang}`,
          );
        } else {
          docsWin.loadFile(path.join(__dirname, "../dist/help.html"), {
            search: `lang=${lang}`,
          });
        }
      },
    },
    { type: "separator" },
    {
      label: t.checkUpdates,
      click: () => {
        autoUpdater.checkForUpdatesAndNotify().catch((err) => {
          logger.warn(`Manual update check failed: ${err.message}`);
        });
      },
    },
    { type: "separator" },
    {
      label: t.closeEngine,
      click: () => {
        app.quit();
      },
    },
  ]);
}

export function setupTray(
  win: BrowserWindow,
  iconPath: string,
  lang: string = "en",
) {
  storedWin = win;

  if (tray) {
    tray.destroy();
  }

  tray = new Tray(iconPath);
  const t = getTrayMessages(lang);

  tray.setToolTip(t.tooltip);
  tray.setContextMenu(buildContextMenu(lang));

  tray.on("click", () => {
    if (storedWin) {
      if (storedWin.isVisible()) {
        storedWin.hide();
      } else {
        storedWin.show();
        storedWin.focus();
      }
    }
  });
}

export function updateTrayLanguage(lang: string) {
  if (!tray) return;

  const t = getTrayMessages(lang);
  tray.setToolTip(t.tooltip);
  tray.setContextMenu(buildContextMenu(lang));
}
