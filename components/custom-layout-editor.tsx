"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Save, X, Move, Grid, Lock, Unlock } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { snapToGrid } from "@/utils/custom-layout-helper"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface LayoutItem {
  id: string
  gadgetId: string
  x: number
  y: number
  width: number
  height: number
  locked?: boolean
}

interface CustomLayoutEditorProps {
  activeGadgets: string[]
  onSave: () => void
  onCancel: () => void
}

export default function CustomLayoutEditor({ activeGadgets, onSave, onCancel }: CustomLayoutEditorProps) {
  const [layoutItems, setLayoutItems] = useLocalStorage<LayoutItem[]>("customLayoutItems", [])
  const [draggingItem, setDraggingItem] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [useGrid, setUseGrid] = useState(true)
  const [gridSize, setGridSize] = useState(10)
  const [showHelp, setShowHelp] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Initialize layout items if empty
  useEffect(() => {
    if (layoutItems.length === 0 && activeGadgets.length > 0) {
      const initialItems: LayoutItem[] = activeGadgets.map((gadgetId, index) => {
        // Create a grid-like initial layout
        const cols = 2
        const col = index % cols
        const row = Math.floor(index / cols)

        return {
          id: `item-${index}`,
          gadgetId,
          x: col * 320,
          y: row * 300,
          width: 300,
          height: 280,
          locked: false,
        }
      })

      setLayoutItems(initialItems)
    }
  }, [activeGadgets, layoutItems, setLayoutItems])

  // Handle mouse down on a draggable item
  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    const item = layoutItems.find((item) => item.id === itemId)
    if (!item || item.locked) return

    // Calculate offset from the top-left corner of the item
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    setDraggingItem(itemId)
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingItem || !containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    let newX = e.clientX - containerRect.left - dragOffset.x
    let newY = e.clientY - containerRect.top - dragOffset.y

    // Snap to grid if enabled
    if (useGrid) {
      const snapped = snapToGrid({ x: newX, y: newY }, gridSize)
      newX = snapped.x
      newY = snapped.y
    }

    // Ensure item stays within container bounds
    newX = Math.max(0, newX)
    newY = Math.max(0, newY)

    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth
      const item = layoutItems.find((item) => item.id === draggingItem)
      if (item) {
        newX = Math.min(newX, containerWidth - item.width)
      }
    }

    // Update the position of the dragged item
    setLayoutItems((items) => items.map((item) => (item.id === draggingItem ? { ...item, x: newX, y: newY } : item)))
  }

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setDraggingItem(null)
  }

  // Toggle lock state for an item
  const toggleLock = (itemId: string) => {
    setLayoutItems((items) => items.map((item) => (item.id === itemId ? { ...item, locked: !item.locked } : item)))
  }

  // Resize an item
  const handleResize = (itemId: string, width: number, height: number) => {
    setLayoutItems((items) => items.map((item) => (item.id === itemId ? { ...item, width, height } : item)))
  }

  // Get gadget name from ID
  const getGadgetName = (gadgetId: string) => {
    const names: Record<string, string> = {
      weather: "Weather",
      notes: "Quick Notes",
      todo: "Todo List",
      bookmarks: "Bookmarks",
      calculator: "Calculator",
      currency: "Currency Converter",
      quote: "Quote of the Day",
      focus: "Focus Timer",
      minigames: "Minigames",
      uselessfacts: "Useless Facts",
      musicplayer: "Music Player",
      events: "Events",
      history: "History",
      newsfeed: "News Feed",
      motivation: "Motivational Messages",
      musicrecommendation: "Music Recommendations",
      virtualpet: "Virtual Pet",
      countdown: "Countdown Timer",
      worldclock: "World Clock",
      stocks: "Stock Tracker",
    }

    return names[gadgetId] || gadgetId
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col">
      <div className="bg-card p-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Custom Layout Editor</h2>
          <p className="text-sm text-muted-foreground">Drag and position your gadgets</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="grid-mode" checked={useGrid} onCheckedChange={setUseGrid} />
            <Label htmlFor="grid-mode" className="flex items-center gap-1">
              <Grid className="h-4 w-4" />
              Snap to Grid
            </Label>
          </div>
          <Button onClick={onSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Done
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Cancel
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-8 relative bg-muted/20"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {showHelp && (
          <div className="absolute top-4 left-4 right-4 bg-card p-4 rounded-lg shadow-lg border border-primary/20 z-10">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Custom Layout Instructions</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowHelp(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex items-center gap-2">
                <Move className="h-4 w-4 text-primary" /> Drag the title bar of any gadget to reposition it
              </li>
              <li className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> Lock a gadget to prevent accidental movement
              </li>
              <li className="flex items-center gap-2">
                <Grid className="h-4 w-4 text-primary" /> Toggle grid snapping for precise alignment
              </li>
              <li className="flex items-center gap-2">
                <Save className="h-4 w-4 text-primary" /> Click "Done" when finished to save your layout
              </li>
            </ul>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(10px,1fr))] gap-[1px] absolute inset-0 pointer-events-none opacity-10">
          {useGrid &&
            Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="h-10 w-10 border border-gray-300 dark:border-gray-700"></div>
            ))}
        </div>

        {layoutItems.map((item) => (
          <div
            key={item.id}
            className={`absolute border-2 rounded-lg shadow-md transition-shadow duration-200 ${
              draggingItem === item.id
                ? "border-primary shadow-lg z-10"
                : item.locked
                  ? "border-yellow-500"
                  : "border-transparent hover:border-primary/50"
            }`}
            style={{
              left: `${item.x}px`,
              top: `${item.y}px`,
              width: `${item.width}px`,
              height: `${item.height}px`,
            }}
          >
            <div
              className={`bg-primary/10 hover:bg-primary/20 p-2 rounded-t-md flex items-center justify-between ${
                item.locked ? "cursor-not-allowed" : "cursor-move"
              }`}
              onMouseDown={(e) => handleMouseDown(e, item.id)}
            >
              <span>{getGadgetName(item.gadgetId)}</span>
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleLock(item.id)}>
                        {item.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>{item.locked ? "Unlock gadget" : "Lock gadget position"}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Move className="h-4 w-4" />
              </div>
            </div>
            <div className="bg-card/50 border rounded-b-md h-[calc(100%-36px)]"></div>
          </div>
        ))}
      </div>
    </div>
  )
}
