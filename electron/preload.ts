import { contextBridge, ipcRenderer } from "electron";
import { IElectronAPI } from "../src/features/ipc/IElectronAPI";

import { EIpcChanels } from "./EIpcChannels";

type SameAPI<T> = { [k in keyof T]: Function };
contextBridge.exposeInMainWorld("electronAPI", {
  exemple: () => ipcRenderer.invoke(EIpcChanels.getIp),
} as SameAPI<IElectronAPI>);
