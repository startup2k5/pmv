import { ElectronAPI } from '@electron-toolkit/preload'

export interface WindowApi {
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<boolean>
  closeWindow: () => Promise<void>
  isMaximized: () => Promise<boolean>
  onWindowStateChange: (cb: (maximized: boolean) => void) => () => void
}

export interface SetupApi {
  getStatus: () => Promise<{ completed: boolean; install_path: string }>
  selectDirectory: () => Promise<string | null>
  complete: (installPath: string) => Promise<{ success: boolean; error?: string }>
}

export interface SystemApi {
  getMetrics: () => Promise<{
    cpu: number
    appRamMB: number
    systemRamPercent: number
    systemRamUsedGB: string
    totalMemGB: string
  }>
}

export interface Api {
  setup: SetupApi
  system: SystemApi
}

declare global {
  interface Window {
    electron: ElectronAPI
    windowApi: WindowApi
    api: Api
  }
}
