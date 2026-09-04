import { BrowserWindow } from "electron";
import { setupSystemIPC } from "./system";
import { setupAuditIPC } from "./audit";
import { setupCommandsIPC } from "./commands";
import { setupSbomIPC } from "./sbom";
import { setupWatcherIPC } from "./watcher";

export function setupIPC(win: BrowserWindow) {
  setupSystemIPC(win);
  setupAuditIPC();
  setupCommandsIPC();
  setupSbomIPC();
  setupWatcherIPC();
}
