import { contextBridge } from "electron";
import { systemAPI } from "./preload/system";
import { auditAPI } from "./preload/audit";
import { commandsAPI } from "./preload/commands";
import { updaterAPI } from "./preload/updater";

contextBridge.exposeInMainWorld("api", {
  ...systemAPI,
  ...auditAPI,
  ...commandsAPI,
  ...updaterAPI,
});
