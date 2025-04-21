"use client"

import { useState, useEffect } from "react"
import SearchBar from "@/components/search-bar"
import TimeDisplay from "@/components/time-display"
import Settings from "@/components/settings"
import Gadgets from "@/components/gadgets"
import QuickLinks from "@/components/quick-links"
import FocusTimer from "@/components/focus-timer"
import QuoteOfDay from "@/components/quote-of-day"
import { Settings2, Moon, Sun, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/hooks/use-local-storage"
import CustomLayoutEditor from "@/components/custom-layout-editor"
import CustomLayoutGadgets from "@/components/custom-layout-gadgets"
import QuirkySettings from "@/components/quirky-settings"
import QuirkyEffects from "@/components/quirky-effects"
import RetroStartup from "@/components/retro-startup"

export default function NewTab() {
  const [showSettings, setShowSettings] = useState(false)
  const [showQuirkySettings, setShowQuirkySettings] = useState(false)
  const [background, setBackground] = useLocalStorage("background", { type: "color", value: "#f5f5f5" })
  const [timeFormat, setTimeFormat] = useLocalStorage("timeFormat", "24h")
  const [activeGadgets, setActiveGadgets] = useLocalStorage("activeGadgets", [
    "search",
    "time",
    "quicklinks",
    "weather",
    "notes",
    "todo",
    "quote",
    "minigames",
  ])
  const [darkMode, setDarkMode] = useLocalStorage("darkMode", false)
  const [layout, setLayout] = useLocalStorage("layout", "centered") // centered or grid
  const [isClient, setIsClient] = useState(false)
  const [keyboardShortcutsEnabled] = useState(true)
  const [font, setFont] = useLocalStorage("font", "system-ui, sans-serif")
  const [iconSet, setIconSet] = useLocalStorage("iconSet", "default")
  const [retroMode, setRetroMode] = useLocalStorage("retroMode", { enabled: false, theme: "windows-xp" })

  const [editingCustomLayout, setEditingCustomLayout] = useState(false) // Add state for custom layout editing mode

  // Only run client-side code after hydration
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Apply dark mode class to document
  useEffect(() => {
    if (!isClient) return

    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode, isClient])

  // Add keyboard shortcuts - moved before the early return
  useEffect(() => {
    if (!isClient || !keyboardShortcutsEnabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search bar when pressing '/'
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      }

      // Toggle settings with 's'
      if (e.key === "s" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        setShowSettings(!showSettings)
        setShowQuirkySettings(false)
      }

      // Toggle dark mode with 'd'
      if (e.key === "d" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        setDarkMode(!darkMode)
      }

      // Toggle quirky settings with 'q'
      if (e.key === "q" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        setShowQuirkySettings(!showQuirkySettings)
        setShowSettings(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showSettings, setShowSettings, darkMode, setDarkMode, keyboardShortcutsEnabled, isClient, showQuirkySettings])

  // Generate background style based on settings
  const getBackgroundStyle = () => {
    if (!background) return {}

    if (background.type === "color") {
      return { backgroundColor: background.value }
    } else if (background.type === "gradient") {
      return { backgroundImage: background.value }
    } else if (background.type === "image") {
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    }
    return {}
  }

  // Don't render anything until client-side hydration is complete
  if (!isClient) {
    return null
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-6 transition-all duration-300 dark:text-white ${
        background?.type === "image" ? "bg-black/10 backdrop-blur-sm" : ""
      } ${retroMode.enabled ? `retro-mode retro-${retroMode.theme}` : ""}`}
      style={{
        ...getBackgroundStyle(),
        fontFamily: font,
      }}
    >
      <RetroStartup />
      <QuirkyEffects />

      {editingCustomLayout && (
        <CustomLayoutEditor
          activeGadgets={activeGadgets}
          onSave={() => setEditingCustomLayout(false)}
          onCancel={() => {
            setEditingCustomLayout(false)
            setLayout("grid") // Fallback to grid layout if canceled
          }}
        />
      )}

      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowQuirkySettings(!showQuirkySettings)
            setShowSettings(false)
          }}
          aria-label="Quirky Settings"
          className="relative"
        >
          <Sparkles className="h-5 w-5 text-yellow-500" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          aria-label={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} aria-label="Settings">
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>

      {showSettings ? (
        <Settings
          onClose={() => setShowSettings(false)}
          background={background}
          setBackground={setBackground}
          timeFormat={timeFormat}
          setTimeFormat={setTimeFormat}
          activeGadgets={activeGadgets}
          setActiveGadgets={setActiveGadgets}
          layout={layout}
          setLayout={(newLayout) => {
            setLayout(newLayout)
            if (newLayout === "custom") {
              setEditingCustomLayout(true)
            }
          }}
          font={font}
          setFont={setFont}
          iconSet={iconSet}
          setIconSet={setIconSet}
          retroMode={retroMode}
          setRetroMode={setRetroMode}
        />
      ) : showQuirkySettings ? (
        <QuirkySettings />
      ) : (
        <div
          className={`flex flex-col items-center justify-center w-full max-w-6xl gap-8 ${
            layout === "centered" ? "items-center" : ""
          }`}
        >
          {layout !== "custom" && (
            <>
              <div className="mt-16 mb-4">
                <TimeDisplay format={timeFormat} />
              </div>

              <div className="w-full max-w-2xl">
                <SearchBar />
              </div>

              <QuickLinks />

              {activeGadgets.includes("quote") && <QuoteOfDay />}

              {activeGadgets.includes("focus") && <FocusTimer />}
            </>
          )}

          <div
            className={`w-full mt-8 ${
              layout === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : layout === "custom"
                  ? "relative min-h-[500px]"
                  : "flex flex-col gap-4 max-w-3xl"
            }`}
          >
            {layout === "custom" ? (
              <CustomLayoutGadgets activeGadgets={activeGadgets} />
            ) : (
              <Gadgets activeGadgets={activeGadgets} layout={layout} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
