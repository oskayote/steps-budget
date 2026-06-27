import { createContext, useContext, useEffect, useState } from 'react'
import { themes, getTheme, DEFAULT_THEME } from '../themes/themes'
import { storage } from '../data/storage'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(DEFAULT_THEME)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    storage.getSetting('theme', DEFAULT_THEME).then((id) => {
      setThemeId(id)
      setReady(true)
    })
  }, [])

  // Apply CSS variables to <html> whenever the theme changes.
  useEffect(() => {
    if (!ready) return
    const theme = getTheme(themeId)
    const root = document.documentElement
    Object.entries(theme.colors).forEach(([k, v]) => root.style.setProperty(k, v))
    root.style.colorScheme = theme.scheme
    storage.setSetting('theme', themeId)
  }, [themeId, ready])

  const value = { themeId, setThemeId, themes, current: getTheme(themeId) }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
