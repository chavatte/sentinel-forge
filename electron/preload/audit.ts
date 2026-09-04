import { ipcRenderer, IpcRendererEvent } from "electron";

export const auditAPI = {
  generateSbom: (projectPath: string) =>
    ipcRenderer.invoke("generate-sbom", projectPath),

  runSecurityAudit: (
    projectPath: string,
    manager: string,
    lang: string,
    customSastRules: any[] = [],
  ) => {
    ipcRenderer.send("run-security-audit", {
      projectPath,
      manager,
      lang,
      customSastRules,
    });
  },

  onAuditResult: (callback: (result: any) => void) => {
    const subscription = (_event: IpcRendererEvent, result: any) =>
      callback(result);
    ipcRenderer.on("audit-result", subscription);

    return () => ipcRenderer.removeListener("audit-result", subscription);
  },

  onAuditError: (callback: (error: string) => void) => {
    const subscription = (_event: IpcRendererEvent, error: string) =>
      callback(error);
    ipcRenderer.on("audit-error", subscription);

    return () => ipcRenderer.removeListener("audit-error", subscription);
  },

  removeAuditListeners: () => {
    ipcRenderer.removeAllListeners("audit-result");
    ipcRenderer.removeAllListeners("audit-error");
  },

  runSilentAudit: (projectPath: string, manager: string) => {
    ipcRenderer.send("run-silent-audit", { projectPath, manager });
  },

  onSilentAuditResult: (callback: (result: any) => void) => {
    const subscription = (_event: IpcRendererEvent, result: any) =>
      callback(result);
    ipcRenderer.on("silent-audit-result", subscription);

    return () =>
      ipcRenderer.removeListener("silent-audit-result", subscription);
  },

  removeSilentAuditListeners: () => {
    ipcRenderer.removeAllListeners("silent-audit-result");
  },

  syncWatchedProjects: (projects: { path: string; manager: string }[]) => {
    ipcRenderer.send("sync-watched-projects", projects);
  },
};
