"use client"

import { useState, useEffect } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function RetroStartup() {
  const [retroMode] = useLocalStorage("retroMode", { enabled: false, theme: "windows-xp" })
  const [showStartup, setShowStartup] = useState(false)

  useEffect(() => {
    // Only show startup screen if retro mode is enabled
    if (retroMode.enabled) {
      setShowStartup(true)

      // Hide startup after animation completes
      const timeout = setTimeout(() => {
        setShowStartup(false)
      }, getStartupDuration(retroMode.theme))

      return () => clearTimeout(timeout)
    }
  }, [retroMode])

  if (!showStartup) return null

  return (
    <div className="startup">
      {retroMode.theme === "windows-xp" && (
        <>
          <div className="startup-logo"></div>
          <div className="startup-text">Microsoft Windows XP</div>
          <div className="startup-progress">
            <div className="startup-progress-inner"></div>
          </div>
        </>
      )}

      {retroMode.theme === "gamecube" && (
        <>
          <div className="startup-logo"></div>
          <div className="startup-sound">Nintendo GameCube™</div>
        </>
      )}

      {retroMode.theme === "gameboy" && (
        <>
          <div className="startup-logo">
            <pre>
              {`NINTENDO™
GAME BOY`}
            </pre>
          </div>
          <div className="startup-sound">Press START</div>
        </>
      )}

      {retroMode.theme === "ps2" && (
        <>
          <div className="startup-logo"></div>
          <div className="startup-towers">
            <div className="tower"></div>
            <div className="tower"></div>
            <div className="tower"></div>
            <div className="tower"></div>
            <div className="tower"></div>
          </div>
        </>
      )}
    </div>
  )
}

// Helper function to get startup animation duration based on theme
function getStartupDuration(theme: string): number {
  switch (theme) {
    case "windows-xp":
      return 3000
    case "gamecube":
      return 4000
    case "gameboy":
      return 5000
    case "ps2":
      return 7000
    default:
      return 3000
  }
}
