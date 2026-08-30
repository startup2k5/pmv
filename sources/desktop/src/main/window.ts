import { BrowserWindow, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'
import { store } from './store'

export function createWindow(): void {
  const width = store.get('window.width', 1280)
  const height = store.get('window.height', 800)
  const isMaximize = store.get('window.isMaxmize', false)

  const mainWindow = new BrowserWindow({
    width,
    height,
    minWidth: 900,
    minHeight: 670,
    show: false,
    backgroundColor: '#f8fafc',
    autoHideMenuBar: true,
    frame: false,
    icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (isMaximize) {
    mainWindow.maximize()
  }

  mainWindow.show()

  let resizeTimeout: NodeJS.Timeout
  mainWindow.on('resize', () => {
    if (mainWindow.isMaximized()) return
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      const [w, h] = mainWindow.getSize()
      store.set('window.width', w)
      store.set('window.height', h)
    }, 400)
  })

  mainWindow.on('maximize', () => {
    store.set('window.isMaxmize', true)
    mainWindow.webContents.send('window-state-changed', { isMaximized: true })
  })

  mainWindow.on('unmaximize', () => {
    store.set('window.isMaxmize', false)
    mainWindow.webContents.send('window-state-changed', { isMaximized: false })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
