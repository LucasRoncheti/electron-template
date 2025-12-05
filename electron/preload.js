const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  runPuppeteer: (url) => ipcRenderer.invoke("run-puppeteer",url)
});
