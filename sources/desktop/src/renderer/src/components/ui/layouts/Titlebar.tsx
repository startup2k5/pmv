import React, { useState, useEffect } from 'react'

import { WindowIcons } from '@renderer/components/icon'

export interface TitleBarProps {
  showMaximize?: boolean
  children?: React.ReactNode
}

const WindowControlStyle =
  'w-10.5 h-9 flex items-center justify-center text-[10px] text-icon transition-colors duration-200'

function Titlebar({ showMaximize = true, children }: TitleBarProps): React.JSX.Element {
  const [maximized, setMaximized] = useState(false)

  const win = window.windowApi

  useEffect(() => {
    return win?.onWindowStateChange((isMaximized) => {
      setMaximized(isMaximized)
    })
  }, [win])

  return (
    <div className="flex h-9 w-full items-center select-none drag z-50 shrink-0 border-b border-line bg-surface">
      {children && <div className="flex h-full flex-1 items-center">{children}</div>}

      <div className="flex shrink-0 font-segoe-mdl2 no-drag">
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
          className={`${WindowControlStyle} hover:bg-red-500`}
          title="Close"
          onClick={() => win?.closeWindow()}
        >
          {WindowIcons.Close}
        </button>
      </div>
    </div>
  )
}

export default Titlebar
