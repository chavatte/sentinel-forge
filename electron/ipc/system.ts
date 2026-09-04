import {
  app,
  ipcMain,
  dialog,
  Notification,
  nativeImage,
  BrowserWindow,
} from "electron";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { getMessages } from "../utils";
import { logger } from "../logger";

function detectPackageManager(startPath: string): string {
  let currentPath = startPath;
  let depth = 0;
  const MAX_DEPTH = 10;

  while (depth < MAX_DEPTH) {
    if (fs.existsSync(path.join(currentPath, "bun.lockb"))) return "bun";
    if (fs.existsSync(path.join(currentPath, "pnpm-lock.yaml"))) return "pnpm";
    if (fs.existsSync(path.join(currentPath, "yarn.lock"))) return "yarn";
    if (fs.existsSync(path.join(currentPath, "package-lock.json")))
      return "npm";

    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) break;

    currentPath = parentPath;
    depth++;
  }

  return "npm";
}

export function setupSystemIPC(win: BrowserWindow) {
  ipcMain.handle("select-folder", async (_, lang = "en") => {
    const t = getMessages(lang);
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: t.dialogTitle,
      properties: ["openDirectory"],
    });

    if (canceled || filePaths.length === 0) return null;

    const projectPath = filePaths[0];
    const manager = detectPackageManager(projectPath);

    logger.info(
      `Project selected: ${projectPath} | Package Manager detected: ${manager}`,
    );

    return { path: projectPath, defaultManager: manager };
  });

  ipcMain.handle("select-file", async (_, lang = "en") => {
    const t = getMessages(lang);
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: t.sshKeyDialog,
      properties: ["openFile"],
    });
    return canceled || filePaths.length === 0 ? null : filePaths[0];
  });

  ipcMain.on("show-notification", (_event, { title, body }) => {
    if (Notification.isSupported()) {
      const iconExt = process.platform === "win32" ? "ico" : "png";
      const iconPath = app.isPackaged
        ? path.join(process.resourcesPath, "public", `sentinel.${iconExt}`)
        : path.join(
            process.env.APP_ROOT || process.cwd(),
            "public",
            `sentinel.${iconExt}`,
          );

      const notification = new Notification({
        title,
        body,
        icon: nativeImage.createFromPath(iconPath),
        urgency: "critical",
      });

      notification.on("click", () => {
        if (win) {
          if (!win.isVisible()) win.show();
          if (win.isMinimized()) win.restore();
          win.focus();
        }
      });

      notification.show();
    }
  });

  ipcMain.on("window-minimize", () => {
    if (win) win.minimize();
  });

  ipcMain.on("window-maximize", () => {
    if (win) {
      if (win.isMaximized()) win.unmaximize();
      else win.maximize();
    }
  });

  ipcMain.on("window-close", () => {
    if (win) win.close();
  });

  ipcMain.handle(
    "export-report",
    async (_event, { content, format, defaultName, lang = "en" }) => {
      const t = getMessages(lang);
      try {
        const filters =
          format === "pdf"
            ? [{ name: "PDF Document", extensions: ["pdf"] }]
            : format === "html"
              ? [{ name: "HTML Web Page", extensions: ["html"] }]
              : [{ name: "JSON Data", extensions: ["json"] }];

        const { canceled, filePath } = await dialog.showSaveDialog({
          title: t.saveReportDialog,
          defaultPath: defaultName,
          filters,
        });
        if (canceled || !filePath) return { success: false, canceled: true };

        if (format === "json" || format === "html") {
          await fs.promises.writeFile(filePath, content, "utf8");
          return { success: true, filePath };
        }

        if (format === "pdf") {
          const printWin = new BrowserWindow({
            show: false,
            webPreferences: {
              offscreen: true,
              nodeIntegration: false,
              contextIsolation: true,
              sandbox: true,
              javascript: false,
            },
          });
          const tempHtmlPath = path.join(
            os.tmpdir(),
            `sentinel-report-${Date.now()}.html`,
          );
          await fs.promises.writeFile(tempHtmlPath, content, "utf8");
          await printWin.loadFile(tempHtmlPath);
          const pdfData = await printWin.webContents.printToPDF({
            printBackground: true,
            pageSize: "A4",
            margins: { top: 0.4, bottom: 0.4, left: 0.4, right: 0.4 },
          });
          await fs.promises.writeFile(filePath, pdfData);
          printWin.close();
          fs.promises.unlink(tempHtmlPath).catch((err) => {
            logger.error(
              `Failed to clean up temporary PDF file: ${err.message}`,
            );
          });

          return { success: true, filePath };
        }
      } catch (error: any) {
        logger.error(`Error exporting report: ${error.message}`);
        return { success: false, error: error.message };
      }
    },
  );
}
