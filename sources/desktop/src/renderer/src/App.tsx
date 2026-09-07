import { useEffect, useState } from 'react'
import { TitlebarContext } from '@renderer/lib/titlebar-context'
import Titlebar from '@renderer/components/ui/layouts/Titlebar'
import Bottombar from '@renderer/components/ui/layouts/Bottombar'
import LoginPage from './features/auth/page'
import MainPage from './features/main/page'
import { authService } from './services/auth'
import type { User } from '@renderer/types'
import { getInitialTheme, applyTheme } from './lib/theme'
import { I18nProvider } from './lib/i18n'

export default function App(): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true)
  const [titlebarContent, setTitlebarContent] = useState<React.ReactNode>(null)

  useEffect(() => {
    applyTheme(getInitialTheme())

    // Nạp thông tin tài khoản qua token khi mở ứng dụng (nếu đã lưu phiên token hợp lệ)
    const initAuth = async (): Promise<void> => {
      const token = authService.getToken()
      if (token) {
        try {
          const user = await authService.loadUserFromToken(token)
          if (user) {
            setCurrentUser(user)
            setIsAuthenticated(true)
          } else {
            authService.clearAuth()
          }
        } catch {
          authService.clearAuth()
        }
      }
      setIsLoadingAuth(false)
    }

    initAuth()
  }, [])

  const handleLoginSuccess = (user: User): void => {
    setCurrentUser(user)
    setIsAuthenticated(true)
  }

  const handleLogout = (): void => {
    authService.clearAuth()
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  return (
    <I18nProvider>
      <TitlebarContext.Provider value={{ setTitlebar: setTitlebarContent }}>
        <div className="flex h-screen w-screen flex-col">
          <Titlebar>{titlebarContent}</Titlebar>

          <div className="relative flex flex-1 overflow-hidden">
            {isLoadingAuth ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 bg-surface">
                <div className="size-8 rounded-full border-2 border-accent/20 border-t-accent animate-spin" />
                <span className="text-xs text-content/50">Đang khởi tạo hệ thống qua token...</span>
              </div>
            ) : isAuthenticated && currentUser ? (
              <MainPage currentUser={currentUser} onLogout={handleLogout} />
            ) : (
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            )}
          </div>
          <Bottombar />
        </div>
      </TitlebarContext.Provider>
    </I18nProvider>
  )
}
