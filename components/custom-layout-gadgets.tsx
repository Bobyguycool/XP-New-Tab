"use client"

import { useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import WeatherGadget from "./gadgets/weather-gadget"
import NotesGadget from "./gadgets/notes-gadget"
import TodoGadget from "./gadgets/todo-gadget"
import BookmarksGadget from "./gadgets/bookmarks-gadget"
import CalculatorGadget from "./calculator-gadget"
import CurrencyConverterGadget from "./currency-converter-gadget"
import MinigameGadget from "./minigame-gadget"
import UselessFactsGadget from "./useless-facts-gadget"
import MusicPlayerGadget from "./music-player-gadget"
import EventsGadget from "./events-gadget"
import HistoryGadget from "./history-gadget"
import NewsFeedGadget from "./news-feed-gadget"
import MotivationalMessagesGadget from "./motivational-messages-gadget"
import MusicRecommendationGadget from "./music-recommendation-gadget"
import VirtualPetGadget from "./virtual-pet-gadget"
import CountdownTimerGadget from "./countdown-timer-gadget"
import WorldClockGadget from "./world-clock-gadget"
import StockTrackerGadget from "./stock-tracker-gadget"
import QuoteOfDay from "./quote-of-day"
import FocusTimer from "./focus-timer"
import SearchBar from "./search-bar"
import TimeDisplay from "./time-display"
import QuickLinks from "./quick-links"
import AsciiArtGadget from "./ascii-art-gadget"
import EmulatorGadget from "./emulator-gadget"
import RetroMusicPlayer from "./retro-music-player"

interface LayoutItem {
  id: string
  gadgetId: string
  x: number
  y: number
  width: number
  height: number
}

interface CustomLayoutGadgetsProps {
  activeGadgets: string[]
}

export default function CustomLayoutGadgets({ activeGadgets }: CustomLayoutGadgetsProps) {
  const [layoutItems] = useLocalStorage<LayoutItem[]>("customLayoutItems", [])
  const [mounted, setMounted] = useState(false)
  const [containerHeight, setContainerHeight] = useState(1000)

  useEffect(() => {
    setMounted(true)

    // Calculate the maximum height needed for the container
    if (layoutItems.length > 0) {
      const maxY = Math.max(...layoutItems.map((item) => item.y + item.height))
      setContainerHeight(Math.max(1000, maxY + 100)) // Add some padding
    }
  }, [layoutItems])

  if (!mounted) return null

  // Filter layout items to only include active gadgets
  const filteredItems = layoutItems.filter((item) => activeGadgets.includes(item.gadgetId))

  // Render the appropriate gadget based on the gadgetId
  const renderGadget = (gadgetId: string) => {
    switch (gadgetId) {
      case "weather":
        return <WeatherGadget />
      case "notes":
        return <NotesGadget />
      case "todo":
        return <TodoGadget />
      case "bookmarks":
        return <BookmarksGadget />
      case "calculator":
        return <CalculatorGadget />
      case "currency":
        return <CurrencyConverterGadget />
      case "minigames":
        return <MinigameGadget />
      case "uselessfacts":
        return <UselessFactsGadget />
      case "musicplayer":
        return <MusicPlayerGadget />
      case "events":
        return <EventsGadget />
      case "history":
        return <HistoryGadget />
      case "newsfeed":
        return <NewsFeedGadget />
      case "motivation":
        return <MotivationalMessagesGadget />
      case "musicrecommendation":
        return <MusicRecommendationGadget />
      case "virtualpet":
        return <VirtualPetGadget />
      case "countdown":
        return <CountdownTimerGadget />
      case "worldclock":
        return <WorldClockGadget />
      case "stocks":
        return <StockTrackerGadget />
      case "quote":
        return <QuoteOfDay />
      case "focus":
        return <FocusTimer />
      case "search":
        return <SearchBar />
      case "time":
        return <TimeDisplay format="24h" />
      case "quicklinks":
        return <QuickLinks />
      case "asciiart":
        return <AsciiArtGadget />
      case "emulator":
        return <EmulatorGadget />
      case "retromusic":
        return <RetroMusicPlayer />
      default:
        return null
    }
  }

  return (
    <div className="relative w-full" style={{ minHeight: `${containerHeight}px` }}>
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className="absolute transition-all duration-300 hover:z-10"
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`,
            width: `${item.width}px`,
          }}
        >
          {renderGadget(item.gadgetId)}
        </div>
      ))}

      {filteredItems.length === 0 && (
        <div className="flex items-center justify-center h-[400px] text-center text-muted-foreground">
          <div>
            <p>No gadgets in custom layout.</p>
            <p>Go to Settings and select gadgets to display.</p>
          </div>
        </div>
      )}
    </div>
  )
}
