import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiSun, FiMoon } from 'react-icons/fi'

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = stored ? stored === 'dark' : prefersDark
    
    setIsDark(initialTheme)
    document.documentElement.classList.toggle('light-theme', !initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    document.documentElement.classList.toggle('light-theme', !newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/15 transition-colors"
      aria-label={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
      title={isDark ? 'Thème clair' : 'Thème sombre'}
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3, type: 'spring' }}
      >
        {isDark ? (
          <FiMoon className="w-5 h-5 text-[var(--text-silver)]" />
        ) : (
          <FiSun className="w-5 h-5 text-[var(--accent-orange)]" />
        )}
      </motion.div>
    </button>
  )
}