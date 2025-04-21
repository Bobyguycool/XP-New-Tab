"use client"

import type React from "react"

import { useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [retroMode] = useLocalStorage("retroMode", { enabled: false, theme: "windows-xp" })
  const [darkMode] = useLocalStorage("darkMode", false)

  useEffect(() => {
    // Apply dark mode
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Apply retro mode theme
    if (retroMode.enabled) {
      document.documentElement.classList.add("retro-mode")
      document.documentElement.classList.add(`retro-${retroMode.theme}`)

      // Load theme-specific CSS dynamically
      const themeLink =
        (document.getElementById("retro-theme-css") as HTMLLinkElement) || document.createElement("link")
      themeLink.id = "retro-theme-css"
      themeLink.rel = "stylesheet"
      themeLink.href = `/themes/${retroMode.theme}.css`
      document.head.appendChild(themeLink)
    } else {
      document.documentElement.classList.remove("retro-mode")
      document.documentElement.classList.remove(`retro-windows-xp`)
      document.documentElement.classList.remove(`retro-gamecube`)
      document.documentElement.classList.remove(`retro-gameboy`)
      document.documentElement.classList.remove(`retro-ps2`)

      // Remove theme CSS if it exists
      const existingThemeLink = document.getElementById("retro-theme-css")
      if (existingThemeLink) {
        existingThemeLink.remove()
      }
    }
  }, [retroMode, darkMode])

  return <>{children}</>
}
