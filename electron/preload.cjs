const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("masarDesktop", {
  platform: process.platform,
});
