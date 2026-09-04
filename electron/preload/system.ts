import { ipcRenderer } from "electron";

export const systemAPI = {
  selectFolder: (lang: string) => ipcRenderer.invoke("select-folder", lang),

 selectFile: (lang: string) => ipcRenderer.invoke("select-file", lang),

  showNotification: (title: string, body: string) => {
    ipcRenderer.send("show-notification", { title, body });
  },

  exportReport: (
    content: string,
    format: "json" | "html" | "pdf",
    defaultName: string,
    lang: string,
  ) => {
    return ipcRenderer.invoke("export-report", {
      content,
      format,
      defaultName,
      lang,
    });
  },

  minimizeWindow: () => ipcRenderer.send("window-minimize"),

  maximizeWindow: () => ipcRenderer.send("window-maximize"),

  closeWindow: () => ipcRenderer.send("window-close"),

  changeLanguage: (lang: string) => ipcRenderer.send("change-language", lang),
};
