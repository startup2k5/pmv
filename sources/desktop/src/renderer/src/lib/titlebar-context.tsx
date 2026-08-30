// src/renderer/src/lib/titlebar-context.tsx
import { createContext, useContext } from 'react'

interface TitlebarContextType {
  setTitlebar: (content: React.ReactNode) => void
}

export const TitlebarContext = createContext<TitlebarContextType>({
  setTitlebar: () => {}
})

export const useTitlebar = (): TitlebarContextType => useContext(TitlebarContext)
