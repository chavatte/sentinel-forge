import { ipcRenderer, IpcRendererEvent } from "electron";

export const updaterAPI = {
  onUpdateStatus: (
    callback: (data: {
      status: string;
      version?: string;
      error?: string;
    }) => void,
  ) => {
    const subscription = (_event: IpcRendererEvent, data: any) =>
      callback(data);
    ipcRenderer.on("update-status", subscription);

    return () => ipcRenderer.removeListener("update-status", subscription);
  },

  onUpdateProgress: (
    callback: (data: {
      percent: number;
      bytesPerSecond: number;
      transferred: number;
      total: number;
    }) => void,
  ) => {
    const subscription = (_event: IpcRendererEvent, data: any) =>
      callback(data);
    ipcRenderer.on("update-progress", subscription);

    return () => ipcRenderer.removeListener("update-progress", subscription);
  },

  restartToUpdate: () => {
    ipcRenderer.send("restart-to-update");
  },
};
