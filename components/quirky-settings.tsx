"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Sparkles, Zap, Cpu, BookOpen } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useRef } from "react"

export default function QuirkySettings() {
  const [cursorTrail, setCursorTrail] = useLocalStorage("quirkySettings.cursorTrail", false)
  const [rainbowText, setRainbowText] = useLocalStorage("quirkySettings.rainbowText", false)
  const [pageFlip, setPageFlip] = useLocalStorage("quirkySettings.pageFlip", false)
  const [dialupSound, setDialupSound] = useLocalStorage("quirkySettings.dialupSound", false)
  const [blinkingText, setBlinkingText] = useLocalStorage("quirkySettings.blinkingText", false)
  const [hitCounter, setHitCounter] = useLocalStorage("quirkySettings.hitCounter", false)
  const [underConstruction, setUnderConstruction] = useLocalStorage("quirkySettings.underConstruction", false)
  const [marqueeText, setMarqueeText] = useLocalStorage("quirkySettings.marqueeText", false)
  const [geocitiesTheme, setGeocitiesTheme] = useLocalStorage("quirkySettings.geocitiesTheme", false)
  const [clippy, setClippy] = useLocalStorage("quirkySettings.clippy", false)
  const [wordArt, setWordArt] = useLocalStorage("quirkySettings.wordArt", false)
  const [comicSans, setComicSans] = useLocalStorage("quirkySettings.comicSans", false)
  const [flyingToaster, setFlyingToaster] = useLocalStorage("quirkySettings.flyingToaster", false)
  const [bouncingDVD, setBouncingDVD] = useLocalStorage("quirkySettings.bouncingDVD", false)
  const [webRing, setWebRing] = useLocalStorage("quirkySettings.webRing", false)
  const [visitorMap, setVisitorMap] = useLocalStorage("quirkySettings.visitorMap", false)
  const [guestbook, setGuestbook] = useLocalStorage("quirkySettings.guestbook", false)

  const [cursorType, setCursorType] = useLocalStorage("quirkySettings.cursorType", "default")
  const [soundEffects, setSoundEffects] = useLocalStorage("quirkySettings.soundEffects", "off")
  const [animationSpeed, setAnimationSpeed] = useLocalStorage("quirkySettings.animationSpeed", 1)

  const [hitCount, setHitCount] = useLocalStorage("quirkySettings.hitCount", 1337)
  const [marqueeMessage, setMarqueeMessage] = useLocalStorage(
    "quirkySettings.marqueeMessage",
    "Welcome to my awesome website! Thanks for visiting! Don't forget to sign my guestbook!",
  )

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleHitCounterReset = () => {
    setHitCount(1)
  }

  const handleHitCounterRandom = () => {
    setHitCount(Math.floor(Math.random() * 9999) + 1)
  }

  const playDialupSound = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/dialup.mp3")
    }

    audioRef.current.currentTime = 0
    audioRef.current.play().catch((e) => console.log("Error playing sound:", e))
  }

  const applyAllEffects = () => {
    setCursorTrail(true)
    setRainbowText(true)
    setBlinkingText(true)
    setHitCounter(true)
    setMarqueeText(true)
    setUnderConstruction(true)
    setClippy(true)
    setWordArt(true)
    setComicSans(true)
    setGeocitiesTheme(true)
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          Quirky 90s/2000s Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="cursor-trail">Cursor Trail</Label>
                <div className="text-xs text-muted-foreground">Adds a sparkly trail to your cursor</div>
              </div>
              <Switch id="cursor-trail" checked={cursorTrail} onCheckedChange={setCursorTrail} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="rainbow-text">Rainbow Text</Label>
                <div className="text-xs text-muted-foreground">Makes headings cycle through rainbow colors</div>
              </div>
              <Switch id="rainbow-text" checked={rainbowText} onCheckedChange={setRainbowText} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="page-flip">Page Flip Effect</Label>
                <div className="text-xs text-muted-foreground">Adds a page flip animation when changing views</div>
              </div>
              <Switch id="page-flip" checked={pageFlip} onCheckedChange={setPageFlip} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dialup-sound">Dial-up Sound on Load</Label>
                <div className="text-xs text-muted-foreground">
                  Plays the nostalgic dial-up internet sound on page load
                </div>
              </div>
              <Switch id="dialup-sound" checked={dialupSound} onCheckedChange={setDialupSound} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="blinking-text">Blinking Text</Label>
                <div className="text-xs text-muted-foreground">Makes important text blink like it's 1996</div>
              </div>
              <Switch id="blinking-text" checked={blinkingText} onCheckedChange={setBlinkingText} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hit-counter">Hit Counter</Label>
                <div className="text-xs text-muted-foreground">Adds an old-school visitor counter</div>
              </div>
              <Switch id="hit-counter" checked={hitCounter} onCheckedChange={setHitCounter} />
            </div>

            {hitCounter && (
              <div className="ml-6 p-3 border rounded-md bg-muted/30">
                <div className="mb-2 flex items-center gap-2">
                  <div className="bg-black text-green-500 font-mono px-2 py-1 rounded">
                    Visitors: {hitCount.toString().padStart(6, "0")}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleHitCounterReset}>
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleHitCounterRandom}>
                    Random
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="under-construction">Under Construction</Label>
                <div className="text-xs text-muted-foreground">Adds "Under Construction" GIFs to your page</div>
              </div>
              <Switch id="under-construction" checked={underConstruction} onCheckedChange={setUnderConstruction} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marquee-text">Marquee Text</Label>
                <div className="text-xs text-muted-foreground">Adds scrolling text at the top of the page</div>
              </div>
              <Switch id="marquee-text" checked={marqueeText} onCheckedChange={setMarqueeText} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="geocities-theme">GeoCities Theme</Label>
                <div className="text-xs text-muted-foreground">Transforms your page into a GeoCities masterpiece</div>
              </div>
              <Switch id="geocities-theme" checked={geocitiesTheme} onCheckedChange={setGeocitiesTheme} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="clippy">Clippy Assistant</Label>
                <div className="text-xs text-muted-foreground">Adds Clippy to help you with your browsing</div>
              </div>
              <Switch id="clippy" checked={clippy} onCheckedChange={setClippy} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="word-art">WordArt Title</Label>
                <div className="text-xs text-muted-foreground">Adds a classic WordArt title to your page</div>
              </div>
              <Switch id="word-art" checked={wordArt} onCheckedChange={setWordArt} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="comic-sans">Comic Sans Font</Label>
                <div className="text-xs text-muted-foreground">Changes all text to the beloved Comic Sans font</div>
              </div>
              <Switch id="comic-sans" checked={comicSans} onCheckedChange={setComicSans} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="flying-toaster">Flying Toasters</Label>
                <div className="text-xs text-muted-foreground">Adds the classic flying toasters screensaver</div>
              </div>
              <Switch id="flying-toaster" checked={flyingToaster} onCheckedChange={setFlyingToaster} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="bouncing-dvd">Bouncing DVD Logo</Label>
                <div className="text-xs text-muted-foreground">Adds a bouncing DVD logo screensaver</div>
              </div>
              <Switch id="bouncing-dvd" checked={bouncingDVD} onCheckedChange={setBouncingDVD} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="web-ring">Web Ring</Label>
                <div className="text-xs text-muted-foreground">Adds a classic web ring to your page</div>
              </div>
              <Switch id="web-ring" checked={webRing} onCheckedChange={setWebRing} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="visitor-map">Visitor Map</Label>
                <div className="text-xs text-muted-foreground">Shows a map of where your visitors are from</div>
              </div>
              <Switch id="visitor-map" checked={visitorMap} onCheckedChange={setVisitorMap} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="guestbook">Guestbook</Label>
                <div className="text-xs text-muted-foreground">Adds a guestbook for visitors to sign</div>
              </div>
              <Switch id="guestbook" checked={guestbook} onCheckedChange={setGuestbook} />
            </div>
          </div>
        </div>

        {marqueeText && (
          <div className="p-3 border rounded-md bg-muted/30">
            <Label htmlFor="marquee-message" className="text-sm">
              Marquee Message
            </Label>
            <input
              id="marquee-message"
              value={marqueeMessage}
              onChange={(e) => setMarqueeMessage(e.target.value)}
              className="w-full p-2 mt-1 border rounded-md"
            />
            <div className="mt-2 overflow-hidden border bg-black text-lime-500 p-1">
              <div className="whitespace-nowrap animate-marquee">{marqueeMessage}</div>
            </div>
          </div>
        )}

        <div className="space-y-4 pt-4 border-t">
          <div className="space-y-2">
            <Label>Cursor Type</Label>
            <Select value={cursorType} onValueChange={setCursorType}>
              <SelectTrigger>
                <SelectValue placeholder="Select cursor style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="hand">Pointing Hand</SelectItem>
                <SelectItem value="sword">Sword</SelectItem>
                <SelectItem value="dinosaur">Dinosaur</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sound Effects</Label>
            <Select value={soundEffects} onValueChange={setSoundEffects}>
              <SelectTrigger>
                <SelectValue placeholder="Select sound effect style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="off">Off</SelectItem>
                <SelectItem value="windows98">Windows 98</SelectItem>
                <SelectItem value="mac">Classic Mac</SelectItem>
                <SelectItem value="videogame">Video Game</SelectItem>
                <SelectItem value="typewriter">Typewriter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Animation Speed</Label>
              <span className="text-sm">{animationSpeed}x</span>
            </div>
            <Slider
              value={[animationSpeed]}
              min={0.5}
              max={3}
              step={0.5}
              onValueChange={(value) => setAnimationSpeed(value[0])}
            />
          </div>
        </div>

        <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="outline" className="flex items-center gap-2" onClick={applyAllEffects}>
            <Zap className="h-4 w-4" />
            Apply All Effects
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={playDialupSound}>
            <Cpu className="h-4 w-4" />
            Test Dial-up Sound
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.open("https://archive.org/details/internetarcade", "_blank")}
          >
            <BookOpen className="h-4 w-4" />
            Internet Archive
          </Button>
        </div>

        <div className="p-4 border rounded-md bg-yellow-50 text-sm">
          <p className="font-bold mb-2">🎮 Nostalgic Tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Try combining GeoCities theme with Comic Sans and Blinking Text for the full 90s experience</li>
            <li>The Flying Toasters and Bouncing DVD Logo are classic screensavers from the era</li>
            <li>Web Rings were how people discovered new websites before search engines became popular</li>
            <li>Guestbooks let visitors leave messages, like a visitor's book at a museum</li>
            <li>Hit counters were a way to show off how many visitors your site had</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
