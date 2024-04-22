import { ElectronAPI } from '@electron-toolkit/preload'
import { IElectronAPI } from '@renderer/features/ipc/IElectronAPI'

declare global {
  interface Window {
    electron: ElectronAPI
    api: IElectronAPI
  }
}
