import { BrowserWindow, dialog, ipcMain } from 'electron'
import os from 'os'

function getCpuSnapshot(): { idle: number; total: number } {
  const cpus = os.cpus()
  let idleMs = 0
  let totalMs = 0

  for (const cpu of cpus) {
    for (const type in cpu.times) {
      totalMs += cpu.times[type]
    }
    idleMs += cpu.times.idle
  }

  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length
  }
}

let lastCpuSnapshot = getCpuSnapshot()

export function registerIPC(): void {
  ipcMain.handle('is-window-maximized', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    return window ? window.isMaximized() : false
  })

  ipcMain.handle('minimize-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.minimize()
    }
  })

  ipcMain.handle('maximize-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      if (window.isMaximized()) {
        window.unmaximize()
        return false
      } else {
        window.maximize()
        return true
      }
    }
    return false
  })

  ipcMain.handle('close-window', (event) => {
    const window = BrowserWindow.fromWebContents(event.sender)
    if (window) {
      window.close()
    }
  })

  ipcMain.handle('setup:select-directory', async (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    const result = await dialog.showOpenDialog(win!, {
      properties: ['openDirectory', 'createDirectory'],
      title: 'Chọn thư mục cài đặt'
    })
    if (result.canceled || result.filePaths.length === 0) return null
    return result.filePaths[0]
  })

  ipcMain.handle('system:get-metrics', async () => {
    const currentCpuSnapshot = getCpuSnapshot()
    const idleDiff = currentCpuSnapshot.idle - lastCpuSnapshot.idle
    const totalDiff = currentCpuSnapshot.total - lastCpuSnapshot.total
    lastCpuSnapshot = currentCpuSnapshot

    const cpuPercent =
      totalDiff > 0 ? Math.max(0, Math.min(100, Math.round(100 - (100 * idleDiff) / totalDiff))) : 0

    const memory = process.memoryUsage()
    const appRamMB = Math.round(memory.rss / (1024 * 1024))
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const systemRamPercent = Math.round(((totalMem - freeMem) / totalMem) * 100)
    const systemRamUsedGB = ((totalMem - freeMem) / (1024 * 1024 * 1024)).toFixed(1)
    const totalMemGB = (totalMem / (1024 * 1024 * 1024)).toFixed(1)

    return {
      cpu: cpuPercent,
      appRamMB,
      systemRamPercent,
      systemRamUsedGB,
      totalMemGB
    }
  })
}
