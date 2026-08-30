import { useState } from 'react'
import { TitlebarContext } from '@renderer/lib/titlebar-context'
import Titlebar from '@renderer/components/ui/layouts/Titlebar'
import Bottombar from '@renderer/components/ui/layouts/Bottombar'
import LoginPage from './features/auth/page'
import MainPage from './features/main/page'

export default function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [titlebarContent, setTitlebarContent] = useState<React.ReactNode>(null)

  return (
    <TitlebarContext.Provider value={{ setTitlebar: setTitlebarContent }}>
      <div className="flex h-screen w-screen flex-col bg-aurora-glow">
        <Titlebar>{titlebarContent}</Titlebar>

        <div className="relative flex flex-1 overflow-hidden">
          {isAuthenticated ? (
            <MainPage onLogout={() => setIsAuthenticated(false)} />
          ) : (
            <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />
          )}
        </div>
        <Bottombar />
      </div>
    </TitlebarContext.Provider>
  )
}
