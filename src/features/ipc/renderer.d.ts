import { IElectronAPI } from "./IElectronAPI";

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
