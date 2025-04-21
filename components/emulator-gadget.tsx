"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gamepad2, Play, Info, HelpCircle, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Label } from "@/components/ui/label"

// Supported emulator systems and their cores
const SUPPORTED_SYSTEMS = [
  { id: "nes", name: "Nintendo (NES)", extensions: [".nes"], core: "nes" },
  { id: "snes", name: "Super Nintendo (SNES)", extensions: [".snes", ".sfc"], core: "snes" },
  { id: "n64", name: "Nintendo 64", extensions: [".n64", ".z64"], core: "n64" },
  { id: "gb", name: "Game Boy", extensions: [".gb"], core: "gb" },
  { id: "gbc", name: "Game Boy Color", extensions: [".gbc"], core: "gbc" },
  { id: "gba", name: "Game Boy Advance", extensions: [".gba"], core: "gba" },
  { id: "genesis", name: "Sega Genesis", extensions: [".md", ".gen"], core: "segaMD" },
  { id: "segaCD", name: "Sega CD", extensions: [".bin", ".cue"], core: "segaCD" },
  { id: "32x", name: "Sega 32X", extensions: [".32x"], core: "sega32x" },
  { id: "arcade", name: "Arcade", extensions: [".zip"], core: "arcade" },
  { id: "psx", name: "PlayStation", extensions: [".iso", ".bin", ".cue"], core: "psx" },
  { id: "atari2600", name: "Atari 2600", extensions: [".a26"], core: "atari2600" },
  { id: "nds", name: "Nintendo DS", extensions: [".nds"], core: "nds" },
]

// Interface for saved ROMs
interface SavedRom {
  id: string
  name: string
  system: string
  core: string
  lastPlayed: string
  objectUrl?: string
}

declare global {
  interface Window {
    EJS_player: string
    EJS_core: string
    EJS_pathtodata: string
    EJS_gameUrl: string
    EJS_biosUrl?: string
    EJS_gameID?: number
    EJS_onGameStart?: () => void
    EJS_startOnLoaded?: boolean
    EJS_loadStateOnStart?: boolean
    EJS_saveStateOnExit?: boolean
    EJS_color?: string
  }
}

export default function EmulatorGadget() {
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [selectedSystem, setSelectedSystem] = useState<string>("nes")
  const [romFile, setRomFile] = useState<File | null>(null)
  const [romObjectUrl, setRomObjectUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [savedRoms, setSavedRoms] = useLocalStorage<SavedRom[]>("emulator-roms", [])
  const [selectedRom, setSelectedRom] = useState<string | null>(null)

  const emulatorContainerRef = useRef<HTMLDivElement>(null)
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const emulatorScriptRef = useRef<HTMLScriptElement | null>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) {
      setRomFile(null)
      return
    }

    const file = files[0]
    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()

    // Check if file extension is supported
    const matchingSystem = SUPPORTED_SYSTEMS.find((system) => system.extensions.includes(extension))

    if (matchingSystem) {
      setSelectedSystem(matchingSystem.id)
      setRomFile(file)
      setError(null)

      // Create object URL for the file
      if (romObjectUrl) {
        URL.revokeObjectURL(romObjectUrl)
      }
      const objectUrl = URL.createObjectURL(file)
      setRomObjectUrl(objectUrl)
    } else {
      setRomFile(null)
      setError(`Unsupported file type: ${extension}. Please upload a supported ROM file.`)
    }
  }

  // Load EmulatorJS
  const loadEmulator = async () => {
    if (!romFile || !romObjectUrl) {
      setError("Please select a ROM file first.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Get the system core
      const system = SUPPORTED_SYSTEMS.find((sys) => sys.id === selectedSystem)
      if (!system) {
        throw new Error("Invalid system selected")
      }

      // Validate file extension
      const fileExtension = romFile.name.substring(romFile.name.lastIndexOf(".")).toLowerCase()
      if (!system.extensions.includes(fileExtension)) {
        throw new Error(
          `This file type (${fileExtension}) is not supported for ${system.name}. Supported types: ${system.extensions.join(", ")}`,
        )
      }

      // Save ROM to history
      const newRom: SavedRom = {
        id: Date.now().toString(),
        name: romFile.name,
        system: selectedSystem,
        core: system.core,
        lastPlayed: new Date().toISOString(),
        objectUrl: romObjectUrl,
      }

      setSavedRoms((prev) => {
        // Don't add duplicates
        if (prev.some((rom) => rom.name === romFile.name && rom.system === selectedSystem)) {
          return prev.map((rom) =>
            rom.name === romFile.name && rom.system === selectedSystem
              ? { ...rom, lastPlayed: newRom.lastPlayed, objectUrl: romObjectUrl }
              : rom,
          )
        }
        return [...prev, newRom]
      })

      // Initialize EmulatorJS
      initializeEmulator(system.core, romObjectUrl)

      setIsPlaying(true)
      setActiveTab("play")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load the emulator. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize EmulatorJS
  const initializeEmulator = (core: string, gameUrl: string) => {
    if (!gameContainerRef.current) return

    // Clean up any existing emulator elements first
    cleanupEmulator()

    // Create a unique ID for the game container
    const gameContainerId = `game-container-${Date.now()}`
    gameContainerRef.current.id = gameContainerId

    // Set EmulatorJS variables
    window.EJS_player = `#${gameContainerId}`
    window.EJS_core = core
    window.EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/"
    window.EJS_gameUrl = gameUrl

    // Add these additional configurations
    window.EJS_startOnLoaded = true
    window.EJS_loadStateOnStart = false
    window.EJS_saveStateOnExit = true
    window.EJS_color = "#0066ff"

    // Add event handler for game start
    window.EJS_onGameStart = () => {
      console.log("Game started!")
    }

    // Load the EmulatorJS script
    const script = document.createElement("script")
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js"
    script.async = true

    // Make sure the script loads properly
    script.onload = () => {
      console.log("EmulatorJS loader script loaded successfully")
    }

    script.onerror = (e) => {
      console.error("Error loading EmulatorJS script:", e)
      setError("Failed to load the emulator. Please check your internet connection and try again.")
    }

    document.body.appendChild(script)
    emulatorScriptRef.current = script
  }

  // Load a saved ROM
  const loadSavedRom = (romId: string) => {
    const rom = savedRoms.find((r) => r.id === romId)
    if (rom && rom.objectUrl) {
      setSelectedSystem(rom.system)
      setSelectedRom(romId)

      // Clean up any existing emulator
      cleanupEmulator()

      // Initialize EmulatorJS with the saved ROM
      initializeEmulator(rom.core, rom.objectUrl)

      setIsPlaying(true)
      setActiveTab("play")
    } else {
      setError("ROM file is no longer available. Please upload it again.")
    }
  }

  // Clean up emulator
  const cleanupEmulator = () => {
    if (gameContainerRef.current) {
      gameContainerRef.current.innerHTML = ""
    }

    if (emulatorScriptRef.current && emulatorScriptRef.current.parentNode) {
      emulatorScriptRef.current.parentNode.removeChild(emulatorScriptRef.current)
      emulatorScriptRef.current = null
    }

    // Remove any EmulatorJS elements from the DOM
    const emulatorElements = document.querySelectorAll('[id^="emulator-"]')
    emulatorElements.forEach((el) => {
      if (el.parentNode) {
        el.parentNode.removeChild(el)
      }
    })

    // Clear global EmulatorJS variables
    window.EJS_player = undefined
    window.EJS_core = undefined
    window.EJS_gameUrl = undefined
    window.EJS_pathtodata = undefined
    window.EJS_gameID = undefined
    window.EJS_onGameStart = undefined
  }

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      cleanupEmulator()

      // Revoke any object URLs
      if (romObjectUrl) {
        URL.revokeObjectURL(romObjectUrl)
      }

      savedRoms.forEach((rom) => {
        if (rom.objectUrl) {
          URL.revokeObjectURL(rom.objectUrl)
        }
      })
    }
  }, [])

  // Reset emulator when not playing
  useEffect(() => {
    if (!isPlaying) {
      cleanupEmulator()
    }
  }, [isPlaying])

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Retro Game Emulator
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Supported Systems</h4>
                  <div className="text-sm">
                    <p>This emulator supports ROMs for the following systems:</p>
                    <ul className="list-disc pl-4 mt-1">
                      {SUPPORTED_SYSTEMS.map((system) => (
                        <li key={system.id}>
                          {system.name} ({system.extensions.join(", ")})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4 bg-amber-50 dark:bg-amber-950/30">
          <Info className="h-4 w-4" />
          <AlertTitle>Legal Disclaimer</AlertTitle>
          <AlertDescription>
            Please make sure your copy of the game is not pirated. Only use ROM files from physical media that you own.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="upload">Upload ROM</TabsTrigger>
            <TabsTrigger value="library">ROM Library</TabsTrigger>
            <TabsTrigger value="play" disabled={!isPlaying}>
              Play Game
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system">Select System</Label>
              <Select value={selectedSystem} onValueChange={setSelectedSystem}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a system" />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_SYSTEMS.map((system) => (
                    <SelectItem key={system.id} value={system.id}>
                      {system.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rom-file">Upload ROM File</Label>
              <div className="flex gap-2">
                <Input id="rom-file" type="file" onChange={handleFileChange} className="flex-1" />
              </div>
              {romFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {romFile.name} ({(romFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <Button onClick={loadEmulator} disabled={!romFile || isLoading} className="w-full">
              {isLoading ? "Loading..." : "Load Game"}
              {!isLoading && <Play className="ml-2 h-4 w-4" />}
            </Button>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            {savedRoms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No ROMs in your library yet.</p>
                <p className="text-sm mt-2">Upload a ROM to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {savedRoms.map((rom) => (
                  <div
                    key={rom.id}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-muted cursor-pointer"
                    onClick={() => loadSavedRom(rom.id)}
                  >
                    <div>
                      <p className="font-medium">{rom.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {SUPPORTED_SYSTEMS.find((s) => s.id === rom.system)?.name || rom.system} • Last played:{" "}
                        {new Date(rom.lastPlayed).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSavedRoms(savedRoms.filter((r) => r.id !== rom.id))
                          if (rom.objectUrl) {
                            URL.revokeObjectURL(rom.objectUrl)
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="play" className="space-y-4">
            <div ref={emulatorContainerRef} className="w-full aspect-video bg-black rounded-md overflow-hidden">
              {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white">Loading emulator...</div>
                </div>
              ) : (
                <div ref={gameContainerRef} className="w-full h-full"></div>
              )}
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPlaying(false)
                  setActiveTab("upload")
                  cleanupEmulator()
                }}
              >
                Back to Upload
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // Reload the emulator
                  if (romObjectUrl) {
                    const system = SUPPORTED_SYSTEMS.find((sys) => sys.id === selectedSystem)
                    if (system) {
                      cleanupEmulator()
                      initializeEmulator(system.core, romObjectUrl)
                    }
                  }
                }}
              >
                Reload Emulator
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
