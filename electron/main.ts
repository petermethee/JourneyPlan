#!/usr/bin/env node
import { app, BrowserWindow } from "electron";
import * as path from "path";
import TripIpcHandlers from "./IPC_API/TripIpcHandlers";
import ArtifactIpcHandlers from "./IPC_API/ArtifactIpcHandlers";
import DatabaseAPI from "./DatabaseClass";
import PlanningIpcHandlers from "./IPC_API/PlanningIpcHandlers";
import { createProjectFolders } from "./helpers";

require("dotenv").config();

createProjectFolders();
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
    win.webContents.openDevTools({ mode: "detach" });
  }

  const dbPath = app.isPackaged
    ? "./journey_plan_PROD.db"
    : "./journey_plan.db";

  const dataBaseAPI = new DatabaseAPI(dbPath);
  const ipcAPITrip = new TripIpcHandlers(dataBaseAPI);
  const ipcAPIPlanning = new PlanningIpcHandlers(dataBaseAPI);
  const ipcAPIActivity = new ArtifactIpcHandlers(dataBaseAPI);
  ipcAPITrip.initIPCHandlers();
  ipcAPIActivity.initIPCHandlers();
  ipcAPIPlanning.initIPCHandlers();
}

app.whenReady().then(() => {
  // !app.isPackaged && installReduxDevTools();
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

function installReduxDevTools() {
  try {
    const {
      default: installExtension,
      REDUX_DEVTOOLS,
    } = require("electron-devtools-installer");
    installExtension(REDUX_DEVTOOLS);
  } catch (error) {
    console.error("Erreur lors de l'installation de Redux DevTools :", error);
  }
}
