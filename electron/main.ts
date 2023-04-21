#!/usr/bin/env node
import { app, BrowserWindow } from "electron";
import * as path from "path";
import IPC_API_Trip from "./IPC_API/IPC_API_Trip";
import IPC_API_Activity from "./IPC_API/IPC_API_Activity";
import installExtension, { REDUX_DEVTOOLS } from "electron-devtools-installer";

function createWindow() {
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      webSecurity: app.isPackaged,
      sandbox: false, //important pour charger des modules dans preload
    },
    width: 1200,
    height: 800,
    icon: path.join(__dirname, "../favicon.ico"),
  });
  win.removeMenu();

  if (app.isPackaged) {
    win.loadURL(`file://${path.join(__dirname, "../index.html")}`);
  } else {
    win.loadURL("http://localhost:3000");
  }

  if (!app.isPackaged) {
    win.webContents.openDevTools({ mode: "detach" });
  }

  const ipcAPITrip = new IPC_API_Trip();
  ipcAPITrip.initIPCHandlers();
  const ipcAPIActivity = new IPC_API_Activity();
  ipcAPIActivity.initIPCHandlers();
}

app.whenReady().then(() => {
  installExtension(REDUX_DEVTOOLS);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});
