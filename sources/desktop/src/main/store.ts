import { app } from 'electron'
import Store from 'electron-store'

export interface WindowConfig {
  width: number
  height: number
  isMaxmize: boolean
}

export interface BartenderConfig {
  path: string
}

export interface ServerConfig {
  api_primary: string
  api_vat: string
}

export interface OptionConfig {
  theme: string
  lang: string
}

export interface AppConfig {
  window: WindowConfig
  bartender: BartenderConfig
  server: ServerConfig
  option: OptionConfig
}

export const store = new Store<AppConfig>({
  name: 'config',
  cwd: app.getPath('userData'),
  defaults: {
    window: {
      width: 1280,
      height: 800,
      isMaxmize: false
    },
    bartender: {
      path: 'C:\\Program Files (x86)\\Seagull\\BarTender Suite\\bartend.exe'
    },
    server: {
      api_primary: 'http://localhost:8386',
      api_vat: 'http://localhost:8387'
    },
    option: {
      theme: 'light',
      lang: 'vi'
    }
  }
})
