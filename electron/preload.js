const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  runPuppeteer: (url) => ipcRenderer.invoke("run-puppeteer", url),
  onUpdateStatus: (callback) => {
    ipcRenderer.on("update-status", (_event, message) => {
      callback(message);
    });
  },
});
