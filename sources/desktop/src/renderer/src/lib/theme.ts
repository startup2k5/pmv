export type ThemeMode = 'light' | 'dark'

const THEME_STORAGE_KEY = 'pmv_app_theme'

export function getInitialTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'dark' || saved === 'light') {
      return saved
    }
  } catch {
    // fallback
  }
  return 'light'
}

export function applyTheme(theme: ThemeMode): void {
  try {
    document.documentElement.setAttribute('data-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch (e) {
    console.error('Failed to apply theme:', e)
  }
}
