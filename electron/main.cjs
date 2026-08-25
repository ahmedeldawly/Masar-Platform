const { app, BrowserWindow, shell } = require("electron");

const { appUrl } = require("./app-config.cjs");

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    autoHideMenuBar: true,
    backgroundColor: "#0f1720",
    webPreferences: {
      preload: require("path").join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  window.loadURL(appUrl);

  window.webContents.setWindowOpenHandler(({ url }) => {
    if (new URL(url).origin !== new URL(appUrl).origin) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
