"use client"

import * as React from "react"

type Theme = "light" | "dark" | "system"

const THEME_STORAGE_KEY = "theme"

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system"
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
  return stored ?? "system"
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return

  const root = document.documentElement
  const actualTheme = theme === "system" ? getSystemTheme() : theme

  if (actualTheme === "dark") {
    root.classList.add("dark")
  } else {
    root.classList.remove("dark")
  }
}

export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return "system"
    return getStoredTheme()
  })

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    applyTheme(newTheme)
  }, [])

  React.useEffect(() => {
    // 初期テーマを適用
    applyTheme(theme)

    // システムモードの場合は、システムの変更を監視
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        applyTheme("system")
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  return { theme, setTheme }
}

