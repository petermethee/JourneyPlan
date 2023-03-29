#!/usr/bin/env node
import { app, BrowserWindow } from "electron";
import * as path from "path";
import { initIPCHandlers } from "./ipc";
import DatabaseAPI from "./DatabaseAPI";

function createWindow() {
  const dbClass = new DatabaseAPI();
  initIPCHandlers(dbClass.getDataBase());
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
}

app.whenReady().then(() => {
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
