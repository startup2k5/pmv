import Sidebar from '@renderer/components/ui/layouts/Sidebar'
import { useTitlebar } from '@renderer/lib/titlebar-context'
import { useEffect, useState } from 'react'
import { DashboardView } from './views/DashboardView'
import { SidebarIcon, BellIcon, GearIcon, SearchIcon } from '@renderer/assets'

interface MainPageProps {
  onLogout: () => void
}

function MainPage({ onLogout }: MainPageProps): React.JSX.Element {
  const { setTitlebar } = useTitlebar()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isTabLoading, setIsTabLoading] = useState(false)

  const handleTabChange = (tab: string): void => {
    if (tab === activeTab) return
    setIsTabLoading(true)
    setActiveTab(tab)
    window.setTimeout(() => setIsTabLoading(false), 350)
  }

  useEffect(() => {
    setTitlebar(
      <div className="h-9 flex w-full items-center gap-4 text-content px-2 no-drag">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="hover:bg-surface-hover rounded-sm transition flex items-center justify-center p-1"
          >
            <SidebarIcon className="h-5 w-5" />
          </button>
          <ul className="flex items-center text-xs font-medium">
            <li className="hover:bg-surface-hover rounded-sm transition flex items-center justify-center py-1 px-2">
              File
            </li>
            <li className="hover:bg-surface-hover rounded-sm transition flex items-center justify-center py-1 px-2">
              Tool
            </li>
            <li className="hover:bg-surface-hover rounded-sm transition flex items-center justify-center py-1 px-2">
              Window
            </li>
            <li className="hover:bg-surface-hover rounded-sm transition flex items-center justify-center py-1 px-2">
              Help
            </li>
          </ul>
        </div>

        <div className="flex-1 drag h-full self-stretch"></div>

        <div className="flex items-center gap-3 no-drag">
          <button className="hover:bg-surface-hover rounded-sm transition flex items-center justify-center p-1">
            <SearchIcon className="h-5 w-5" />
          </button>
          <button className="hover:bg-surface-hover rounded-sm transition flex items-center justify-center p-1">
            <BellIcon className="h-5 w-5" />
          </button>
          <button className="hover:bg-surface-hover rounded-sm transition flex items-center justify-center p-1">
            <GearIcon className="h-5 w-5" />
          </button>
          <label className="border-l border-line h-5"></label>
        </div>
      </div>
    )
    return () => setTitlebar(null)
  }, [setTitlebar])

  return (
    <div className="flex flex-1 overflow-hidden">
      <Sidebar
        open={sidebarOpen}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onLogout={onLogout}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-surface-secondary">
        {isTabLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
            <div className="size-7 rounded-full border-2 border-accent/20 border-t-accent animate-spin"></div>
            <span className="text-xs text-content/40">Đang tải...</span>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab !== 'dashboard' && (
              <div className="flex-1 flex items-center justify-center p-8 text-content text-sm">
                Tính năng đang được phát triển...
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default MainPage
