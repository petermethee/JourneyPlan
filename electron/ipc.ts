import { ipcMain } from "electron";
import { EIpcChanels } from "./EIpcChannels";

export const initIPCHandlers = () => {
  ipcMain.handle(EIpcChanels.getIp, () => {
    return "exmple";
  });
};
