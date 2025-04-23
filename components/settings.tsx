"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Add import for background presets
import { gradientPresets, imagePresets, colorPresets } from "@/utils/background-presets"

interface SettingsProps {
  onClose: () => void
  background: { type: string; value: string }
  setBackground: (value: { type: string; value: string }) => void
  timeFormat: string
  setTimeFormat: (value: string) => void
  activeGadgets: string[]
  setActiveGadgets: (value: string[]) => void
  layout: string
  setLayout: (value: string) => void
  font: string
  setFont: (value: string) => void
  iconSet: string
  setIconSet: (value: string) => void
  retroMode: { enabled: boolean; theme: string }
  setRetroMode: (value: { enabled: boolean; theme: string }) => void
}

export default function Settings({
  onClose,
  background,
  setBackground,
  timeFormat,
  setTimeFormat,
  activeGadgets,
  setActiveGadgets,
  layout,
  setLayout,
  font,
  setFont,
  iconSet,
  setIconSet,
  retroMode,
  setRetroMode,
}: SettingsProps) {
  const handleGadgetToggle = (gadgetId: string) => {
    if (activeGadgets.includes(gadgetId)) {
      setActiveGadgets(activeGadgets.filter((id) => id !== gadgetId))
    } else {
      setActiveGadgets([...activeGadgets, gadgetId])
    }
  }

  // Replace the gradientOptions with the imported presets
  // const gradientOptions = [...]

  const fontOptions = [
    { name: "System Default", value: "system-ui, sans-serif" },
    { name: "Arial", value: "Arial, sans-serif" },
    { name: "Roboto", value: "Roboto, sans-serif" },
    { name: "Open Sans", value: "Open Sans, sans-serif" },
    { name: "Montserrat", value: "Montserrat, sans-serif" },
    { name: "Playfair Display", value: "Playfair Display, serif" },
    { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
    { name: "Courier New", value: "Courier New, monospace" },
  ]

  const iconSetOptions = [
    { name: "Default", value: "default" },
    { name: "Minimal", value: "minimal" },
    { name: "Colorful", value: "colorful" },
    { name: "Retro", value: "retro" },
  ]

  const retroThemeOptions = [
    { name: "Windows XP", value: "windows-xp" },
    { name: "GameCube", value: "gamecube" },
    { name: "Game Boy", value: "gameboy" },
    { name: "PlayStation 2", value: "ps2" },
  ]

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Customize your new tab experience</CardDescription>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance">
          <TabsList className="mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="gadgets">Gadgets</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
            <TabsTrigger value="retro">Retro Mode</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-6">
            <div className="space-y-2">
              <Label>Background Type</Label>
              <RadioGroup
                value={background.type}
                onValueChange={(value) => setBackground({ ...background, type: value })}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="color" id="color" />
                  <Label htmlFor="color">Solid Color</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gradient" id="gradient" />
                  <Label htmlFor="gradient">Gradient</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="image" id="image" />
                  <Label htmlFor="image">Image URL</Label>
                </div>
              </RadioGroup>
            </div>

            {background.type === "color" && (
              <div className="space-y-2">
                <Label htmlFor="background-color">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="background-color"
                    type="color"
                    value={background.value}
                    onChange={(e) => setBackground({ ...background, value: e.target.value })}
                    className="w-12 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={background.value}
                    onChange={(e) => setBackground({ ...background, value: e.target.value })}
                    className="flex-1"
                  />
                </div>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {colorPresets.map((color) => (
                    <div
                      key={color.name}
                      className="w-8 h-8 rounded-full cursor-pointer border border-gray-300 dark:border-gray-700"
                      style={{ backgroundColor: color.value }}
                      onClick={() => setBackground({ ...background, value: color.value })}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {background.type === "gradient" && (
              <div className="space-y-2">
                <Label htmlFor="gradient-select">Select Gradient</Label>
                <Select value={background.value} onValueChange={(value) => setBackground({ ...background, value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a gradient" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradientPresets.map((gradient) => (
                      <SelectItem key={gradient.name} value={gradient.value}>
                        {gradient.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="h-12 w-full rounded-md mt-2" style={{ backgroundImage: background.value }} />
              </div>
            )}

            {background.type === "image" && (
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  type="text"
                  value={background.value}
                  onChange={(e) => setBackground({ ...background, value: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {imagePresets.map((image) => (
                    <div
                      key={image.name}
                      className="h-20 rounded-md overflow-hidden cursor-pointer border border-gray-300 dark:border-gray-700 bg-cover bg-center"
                      style={{ backgroundImage: `url(${image.value})` }}
                      onClick={() => setBackground({ ...background, value: image.value })}
                    >
                      <div className="w-full h-full bg-black/30 flex items-end p-1">
                        <span className="text-xs text-white">{image.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {background.value && (
                  <div
                    className="mt-2 rounded-md overflow-hidden h-32 bg-cover bg-center"
                    style={{ backgroundImage: `url(${background.value})` }}
                  />
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label>Font</Label>
              <Select value={font} onValueChange={setFont}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a font" />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((fontOption) => (
                    <SelectItem key={fontOption.name} value={fontOption.value}>
                      <span style={{ fontFamily: fontOption.value }}>{fontOption.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="mt-2 p-2 border rounded-md" style={{ fontFamily: font }}>
                The quick brown fox jumps over the lazy dog.
              </div>
            </div>

            <div className="space-y-2">
              <Label>Icon Set</Label>
              <Select value={iconSet} onValueChange={setIconSet}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon set" />
                </SelectTrigger>
                <SelectContent>
                  {iconSetOptions.map((option) => (
                    <SelectItem key={option.name} value={option.value}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Format</Label>
              <RadioGroup value={timeFormat} onValueChange={setTimeFormat}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="12h" id="12h" />
                  <Label htmlFor="12h">12-hour (1:30 PM)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="24h" id="24h" />
                  <Label htmlFor="24h">24-hour (13:30)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Layout</Label>
              <RadioGroup value={layout} onValueChange={setLayout}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="centered" id="centered" />
                  <Label htmlFor="centered">Centered (Stacked)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="grid" id="grid" />
                  <Label htmlFor="grid">Grid Layout</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">Custom (Drag & Drop)</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="gadgets" className="space-y-6">
            <div className="space-y-2">
              <Label>Active Gadgets</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="search"
                    checked={activeGadgets.includes("search")}
                    onCheckedChange={() => handleGadgetToggle("search")}
                  />
                  <Label htmlFor="search">Search Bar</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="time"
                    checked={activeGadgets.includes("time")}
                    onCheckedChange={() => handleGadgetToggle("time")}
                  />
                  <Label htmlFor="time">Time Display</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quicklinks"
                    checked={activeGadgets.includes("quicklinks")}
                    onCheckedChange={() => handleGadgetToggle("quicklinks")}
                  />
                  <Label htmlFor="quicklinks">Quick Links</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="weather"
                    checked={activeGadgets.includes("weather")}
                    onCheckedChange={() => handleGadgetToggle("weather")}
                  />
                  <Label htmlFor="weather">Weather</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notes"
                    checked={activeGadgets.includes("notes")}
                    onCheckedChange={() => handleGadgetToggle("notes")}
                  />
                  <Label htmlFor="notes">Quick Notes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="todo"
                    checked={activeGadgets.includes("todo")}
                    onCheckedChange={() => handleGadgetToggle("todo")}
                  />
                  <Label htmlFor="todo">Todo List</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="bookmarks"
                    checked={activeGadgets.includes("bookmarks")}
                    onCheckedChange={() => handleGadgetToggle("bookmarks")}
                  />
                  <Label htmlFor="bookmarks">Bookmarks</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="calculator"
                    checked={activeGadgets.includes("calculator")}
                    onCheckedChange={() => handleGadgetToggle("calculator")}
                  />
                  <Label htmlFor="calculator">Calculator</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="currency"
                    checked={activeGadgets.includes("currency")}
                    onCheckedChange={() => handleGadgetToggle("currency")}
                  />
                  <Label htmlFor="currency">Currency Converter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="quote"
                    checked={activeGadgets.includes("quote")}
                    onCheckedChange={() => handleGadgetToggle("quote")}
                  />
                  <Label htmlFor="quote">Quote of the Day</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="focus"
                    checked={activeGadgets.includes("focus")}
                    onCheckedChange={() => handleGadgetToggle("focus")}
                  />
                  <Label htmlFor="focus">Focus Timer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="minigames"
                    checked={activeGadgets.includes("minigames")}
                    onCheckedChange={() => handleGadgetToggle("minigames")}
                  />
                  <Label htmlFor="minigames">Minigames</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uselessfacts"
                    checked={activeGadgets.includes("uselessfacts")}
                    onCheckedChange={() => handleGadgetToggle("uselessfacts")}
                  />
                  <Label htmlFor="uselessfacts">Useless Facts</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="musicplayer"
                    checked={activeGadgets.includes("musicplayer")}
                    onCheckedChange={() => handleGadgetToggle("musicplayer")}
                  />
                  <Label htmlFor="musicplayer">Music Player</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="events"
                    checked={activeGadgets.includes("events")}
                    onCheckedChange={() => handleGadgetToggle("events")}
                  />
                  <Label htmlFor="events">Events</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="history"
                    checked={activeGadgets.includes("history")}
                    onCheckedChange={() => handleGadgetToggle("history")}
                  />
                  <Label htmlFor="history">History</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsfeed"
                    checked={activeGadgets.includes("newsfeed")}
                    onCheckedChange={() => handleGadgetToggle("newsfeed")}
                  />
                  <Label htmlFor="newsfeed">News Feed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="motivation"
                    checked={activeGadgets.includes("motivation")}
                    onCheckedChange={() => handleGadgetToggle("motivation")}
                  />
                  <Label htmlFor="motivation">Motivational Messages</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="musicrecommendation"
                    checked={activeGadgets.includes("musicrecommendation")}
                    onCheckedChange={() => handleGadgetToggle("musicrecommendation")}
                  />
                  <Label htmlFor="musicrecommendation">Music Recommendations</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="virtualpet"
                    checked={activeGadgets.includes("virtualpet")}
                    onCheckedChange={() => handleGadgetToggle("virtualpet")}
                  />
                  <Label htmlFor="virtualpet">Virtual Pet</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="countdown"
                    checked={activeGadgets.includes("countdown")}
                    onCheckedChange={() => handleGadgetToggle("countdown")}
                  />
                  <Label htmlFor="countdown">Countdown Timer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="worldclock"
                    checked={activeGadgets.includes("worldclock")}
                    onCheckedChange={() => handleGadgetToggle("worldclock")}
                  />
                  <Label htmlFor="worldclock">World Clock</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="stocks"
                    checked={activeGadgets.includes("stocks")}
                    onCheckedChange={() => handleGadgetToggle("stocks")}
                  />
                  <Label htmlFor="stocks">Stock Tracker</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="asciiart"
                    checked={activeGadgets.includes("asciiart")}
                    onCheckedChange={() => handleGadgetToggle("asciiart")}
                  />
                  <Label htmlFor="asciiart">ASCII Art Generator</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emulator"
                    checked={activeGadgets.includes("emulator")}
                    onCheckedChange={() => handleGadgetToggle("emulator")}
                  />
                  <Label htmlFor="emulator">Retro Game Emulator</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="retrogamecollection"
                    checked={activeGadgets.includes("retrogamecollection")}
                    onCheckedChange={() => handleGadgetToggle("retrogamecollection")}
                  />
                  <Label htmlFor="retrogamecollection">Retro Game Collection</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="retrogamequiz"
                    checked={activeGadgets.includes("retrogamequiz")}
                    onCheckedChange={() => handleGadgetToggle("retrogamequiz")}
                  />
                  <Label htmlFor="retrogamequiz">Retro Game Quiz</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="retromusic"
                    checked={activeGadgets.includes("retromusic")}
                    onCheckedChange={() => handleGadgetToggle("retromusic")}
                  />
                  <Label htmlFor="retromusic">Music Player</Label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="space-y-2">
              <Label>Default Search Engine</Label>
              <RadioGroup defaultValue="google">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="google" id="google" />
                  <Label htmlFor="google">Google</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bing" id="bing" />
                  <Label htmlFor="bing">Bing</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="duckduckgo" id="duckduckgo" />
                  <Label htmlFor="duckduckgo">DuckDuckGo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yahoo" id="yahoo" />
                  <Label htmlFor="yahoo">Yahoo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="startpage" id="startpage" />
                  <Label htmlFor="startpage">Startpage</Label>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>

          <TabsContent value="retro" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="retro-mode"
                  checked={retroMode.enabled}
                  onCheckedChange={(checked) => setRetroMode({ ...retroMode, enabled: checked === true })}
                />
                <Label htmlFor="retro-mode">Enable Retro Mode</Label>
              </div>

              {retroMode.enabled && (
                <div className="space-y-2">
                  <Label>Retro Theme</Label>
                  <Select
                    value={retroMode.theme}
                    onValueChange={(value) => setRetroMode({ ...retroMode, theme: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a retro theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {retroThemeOptions.map((option) => (
                        <SelectItem key={option.name} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {retroThemeOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`border-2 rounded-md overflow-hidden cursor-pointer ${
                          retroMode.theme === option.value ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => setRetroMode({ ...retroMode, theme: option.value })}
                      >
                        <div
                          className="h-24 bg-cover bg-center"
                          style={{
                            backgroundImage: `url(/retro-themes/${option.value}-preview.jpg)`,
                            backgroundImage: `url(/placeholder.svg?height=96&width=160)`,
                          }}
                        />
                        <div className="p-2 text-center text-sm">{option.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-6">
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Export Settings
              </Button>
              <Button variant="outline" className="w-full">
                Import Settings
              </Button>
              <Button variant="destructive" className="w-full">
                Reset All Settings
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="shortcuts" className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Focus Search</span>
                  <kbd className="px-2 py-1 bg-background rounded border">/</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Toggle Settings</span>
                  <kbd className="px-2 py-1 bg-background rounded border">S</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Toggle Dark Mode</span>
                  <kbd className="px-2 py-1 bg-background rounded border">D</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Add Quick Link</span>
                  <kbd className="px-2 py-1 bg-background rounded border">A</kbd>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span>Game Controls</span>
                  <span className="text-xs">See individual games</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Note: Shortcuts only work when not typing in an input field.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
