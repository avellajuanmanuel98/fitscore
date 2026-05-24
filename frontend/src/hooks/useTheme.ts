import { useEffect, useState } from 'react'

export function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.remove('light-mode')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.add('light-mode')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return { isDark, toggle: () => setIsDark(d => !d) }
}
