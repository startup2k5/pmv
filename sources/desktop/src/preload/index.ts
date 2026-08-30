import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const invoke = ipcRenderer.invoke.bind(ipcRenderer)

const windowApi = {
  minimizeWindow: (): Promise<void> => invoke('minimize-window'),
  maximizeWindow: (): Promise<boolean> => invoke('maximize-window'),
  closeWindow: (): Promise<void> => invoke('close-window'),
  isMaximized: (): Promise<boolean> => invoke('is-window-maximized'),
  onWindowStateChange(cb: (maximized: boolean) => void): () => void {
    const handler = (_: Electron.IpcRendererEvent, d: { isMaximized: boolean }): void =>
      cb(d.isMaximized)
    ipcRenderer.on('window-state-changed', handler)
    return () => ipcRenderer.removeListener('window-state-changed', handler)
  }
}

const api = {
  setup: {
    getStatus: (): Promise<{ completed: boolean; install_path: string }> =>
      invoke('setup:get-status'),
    selectDirectory: (): Promise<string | null> => invoke('setup:select-directory'),
    complete: (installPath: string): Promise<{ success: boolean; error?: string }> =>
      invoke('setup:complete', installPath)
  },
  system: {
    getMetrics: (): Promise<{
      cpu: number
      appRamMB: number
      systemRamPercent: number
      totalMemGB: string
    }> => invoke('system:get-metrics')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('windowApi', windowApi)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.windowApi = windowApi
  // @ts-ignore (define in dts)
  window.api = api
}
