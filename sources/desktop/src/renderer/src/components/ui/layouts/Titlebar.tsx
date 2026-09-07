import React, { useState, useEffect } from 'react'

import { WindowIcons } from '@renderer/components/icon'
import { getInitialTheme, applyTheme, type ThemeMode } from '@renderer/lib/theme'
import { useI18n } from '@renderer/lib/i18n'

export interface TitleBarProps {
  showMaximize?: boolean
  children?: React.ReactNode
}

const WindowControlStyle =
  'w-10.5 h-9 flex items-center justify-center text-[10px] text-icon transition-colors duration-200 cursor-pointer'

function Titlebar({ showMaximize = true, children }: TitleBarProps): React.JSX.Element {
  const [maximized, setMaximized] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>(() => getInitialTheme())
  const { language, toggleLanguage } = useI18n()

  const win = window.windowApi

  useEffect(() => {
    return win?.onWindowStateChange((isMaximized) => {
      setMaximized(isMaximized)
    })
  }, [win])

  const handleToggleTheme = (): void => {
    const nextTheme: ThemeMode = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    applyTheme(nextTheme)
  }

  return (
    <div className="flex h-9 w-full items-center select-none drag z-50 shrink-0 border-b border-line bg-surface">
      {children && <div className="flex h-full flex-1 items-center">{children}</div>}

      <div className="flex shrink-0 items-center no-drag">
        {/* Language Switcher (VI / EN) */}
        <button
          type="button"
          onClick={toggleLanguage}
          title={language === 'vi' ? 'Chuyển sang Tiếng Anh (English)' : 'Switch to Vietnamese (Tiếng Việt)'}
          className="h-9 px-2.5 flex items-center justify-center gap-1 text-[11px] font-semibold text-content/75 hover:text-content hover:bg-surface-hover transition-colors cursor-pointer border-r border-line"
        >
          <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-surface-secondary border border-line text-accent font-bold">
            {language.toUpperCase()}
          </span>
        </button>

        {/* Theme Switcher */}
        <button
          type="button"
          onClick={handleToggleTheme}
          title={theme === 'light' ? 'Đang dùng Theme Sáng (Bấm để bật Theme Tối đã lưu)' : 'Đang dùng Theme Tối (Bấm để về Theme Sáng)'}
          className="h-9 px-2.5 flex items-center justify-center text-xs text-content/70 hover:text-content hover:bg-surface-hover transition-colors cursor-pointer"
        >
          {theme === 'light' ? (
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          ) : (
            <svg className="size-3.5 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </button>

        <div className="flex shrink-0 font-segoe-mdl2">
          <button
            className={`${WindowControlStyle} hover:bg-surface-hover`}
            title="Minimize"
            onClick={() => win?.minimizeWindow()}
          >
            {WindowIcons.Minimize}
          </button>

          {showMaximize && (
            <button
              className={`${WindowControlStyle} hover:bg-surface-hover`}
              title={maximized ? 'Restore Down' : 'Maximize'}
              onClick={() => win?.maximizeWindow()}
            >
              {maximized ? WindowIcons.Restore : WindowIcons.Maximize}
            </button>
          )}

          <button
            className={`${WindowControlStyle} hover:bg-red-500 hover:text-white`}
            title="Close"
            onClick={() => win?.closeWindow()}
          >
            {WindowIcons.Close}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Titlebar
