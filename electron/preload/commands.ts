import { ipcRenderer, IpcRendererEvent } from "electron";

export const commandsAPI = {
  runCommand: (
    projectPath: string,
    commandType: string,
    manager: string,
    lang: string,
    args: string = "",
  ) => {
    ipcRenderer.send("run-package-command", {
      projectPath,
      commandType,
      manager,
      lang,
      args,
    });
  },

  onTerminalLog: (callback: (log: string) => void) => {
    const subscription = (_event: IpcRendererEvent, log: string) =>
      callback(log);
    ipcRenderer.on("terminal-log", subscription);

    return () => ipcRenderer.removeListener("terminal-log", subscription);
  },

  onCommandFinished: (callback: (data: any) => void) => {
    const subscription = (_event: IpcRendererEvent, data: any) =>
      callback(data);
    ipcRenderer.on("command-finished", subscription);

    return () => ipcRenderer.removeListener("command-finished", subscription);
  },

  removeTerminalListeners: () => ipcRenderer.removeAllListeners("terminal-log"),
  removeCommandFinishedListeners: () =>
    ipcRenderer.removeAllListeners("command-finished"),

  addRemoteProject: (url: string, sshKeyPath: string, lang: string) => {
    ipcRenderer.send("add-remote-project", { url, sshKeyPath, lang });
  },

  onRemoteProjectAdded: (callback: (project: any) => void) => {
    const subscription = (_event: IpcRendererEvent, project: any) =>
      callback(project);
    ipcRenderer.on("remote-project-added", subscription);

    return () =>
      ipcRenderer.removeListener("remote-project-added", subscription);
  },

  removeRemoteProjectListeners: () => {
    ipcRenderer.removeAllListeners("remote-project-added");
  },
};
