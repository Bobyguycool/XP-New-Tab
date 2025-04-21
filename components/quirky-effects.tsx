"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function QuirkyEffects() {
  // Settings from localStorage
  const [cursorTrail] = useLocalStorage("quirkySettings.cursorTrail", false)
  const [rainbowText] = useLocalStorage("quirkySettings.rainbowText", false)
  const [pageFlip] = useLocalStorage("quirkySettings.pageFlip", false)
  const [dialupSound] = useLocalStorage("quirkySettings.dialupSound", false)
  const [blinkingText] = useLocalStorage("quirkySettings.blinkingText", false)
  const [hitCounter] = useLocalStorage("quirkySettings.hitCounter", false)
  const [underConstruction] = useLocalStorage("quirkySettings.underConstruction", false)
  const [marqueeText] = useLocalStorage("quirkySettings.marqueeText", false)
  const [geocitiesTheme] = useLocalStorage("quirkySettings.geocitiesTheme", false)
  const [clippy] = useLocalStorage("quirkySettings.clippy", false)
  const [wordArt] = useLocalStorage("quirkySettings.wordArt", false)
  const [comicSans] = useLocalStorage("quirkySettings.comicSans", false)
  const [flyingToaster] = useLocalStorage("quirkySettings.flyingToaster", false)
  const [bouncingDVD] = useLocalStorage("quirkySettings.bouncingDVD", false)
  const [webRing] = useLocalStorage("quirkySettings.webRing", false)
  const [visitorMap] = useLocalStorage("quirkySettings.visitorMap", false)
  const [guestbook] = useLocalStorage("quirkySettings.guestbook", false)

  const [cursorType] = useLocalStorage("quirkySettings.cursorType", "default")
  const [soundEffects] = useLocalStorage("quirkySettings.soundEffects", "off")
  const [animationSpeed] = useLocalStorage("quirkySettings.animationSpeed", 1)

  const [hitCount] = useLocalStorage("quirkySettings.hitCount", 1337)
  const [marqueeMessage] = useLocalStorage(
    "quirkySettings.marqueeMessage",
    "Welcome to my awesome website! Thanks for visiting! Don't forget to sign my guestbook!",
  )

  // Component state
  const [showClippy, setShowClippy] = useState(false)
  const [clippyMessage, setClippyMessage] = useState("")
  const [showGuestbook, setShowGuestbook] = useState(false)
  const [guestbookEntries, setGuestbookEntries] = useLocalStorage("quirkySettings.guestbookEntries", [
    { name: "WebMaster", message: "Welcome to my site!", date: "April 21, 1999" },
    { name: "CoolDude2000", message: "Awesome page! Love the GIFs!", date: "May 15, 1999" },
  ])
  const [newGuestEntry, setNewGuestEntry] = useState({ name: "", message: "" })
  const [dvdPosition, setDvdPosition] = useState({ x: 50, y: 50 })
  const [dvdColor, setDvdColor] = useState("rgb(255, 0, 0)")

  // Refs to avoid re-renders
  const trailElementsRef = useRef<HTMLDivElement[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  const dvdAnimationRef = useRef<number | null>(null)
  const toasterElementsRef = useRef<HTMLDivElement[]>([])

  // Style refs
  const geocitiesStyleRef = useRef<HTMLStyleElement | null>(null)
  const rainbowStyleRef = useRef<HTMLStyleElement | null>(null)
  const blinkStyleRef = useRef<HTMLStyleElement | null>(null)
  const comicSansStyleRef = useRef<HTMLStyleElement | null>(null)

  // Timeout refs
  const clippyTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const hideClippyTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/dialup.mp3")
      clickSoundRef.current = new Audio("/sounds/click.mp3")
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      if (clickSoundRef.current) {
        clickSoundRef.current.pause()
      }
    }
  }, [])

  // Play sound effects on clicks
  useEffect(() => {
    if (soundEffects === "off") return

    const handleClick = () => {
      if (!clickSoundRef.current) return

      const soundMap: Record<string, string> = {
        windows98: "/sounds/windows98-click.mp3",
        mac: "/sounds/mac-click.mp3",
        videogame: "/sounds/videogame-click.mp3",
        typewriter: "/sounds/typewriter-click.mp3",
      }

      clickSoundRef.current.src = soundMap[soundEffects] || "/sounds/click.mp3"
      clickSoundRef.current.currentTime = 0
      clickSoundRef.current.play().catch((e) => console.log("Error playing sound:", e))
    }

    document.addEventListener("click", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
    }
  }, [soundEffects])

  // Play dialup sound on page load
  useEffect(() => {
    if (dialupSound && audioRef.current) {
      try {
        audioRef.current.play().catch((e) => console.log("Error playing sound:", e))
      } catch (e) {
        console.log("Error playing sound")
      }
    }
  }, [dialupSound])

  // Handle cursor trail
  useEffect(() => {
    if (!cursorTrail) {
      // Clean up any existing trail elements
      trailElementsRef.current.forEach((element) => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
      trailElementsRef.current = []
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Create a new trail element
      const trailElement = document.createElement("div")
      trailElement.className = "cursor-trail"
      trailElement.style.position = "fixed"
      trailElement.style.left = `${e.clientX}px`
      trailElement.style.top = `${e.clientY}px`
      trailElement.style.width = "10px"
      trailElement.style.height = "10px"
      trailElement.style.borderRadius = "50%"
      trailElement.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`
      trailElement.style.pointerEvents = "none"
      trailElement.style.zIndex = "9999"
      trailElement.style.opacity = "1"
      trailElement.style.transition = `opacity ${1 / animationSpeed}s, transform ${1 / animationSpeed}s`

      document.body.appendChild(trailElement)

      // Add to our ref array
      trailElementsRef.current.push(trailElement)

      // Animate and remove after a delay
      setTimeout(() => {
        trailElement.style.opacity = "0"
        trailElement.style.transform = "scale(0.5) translateY(10px)"

        setTimeout(() => {
          if (trailElement.parentNode) {
            trailElement.parentNode.removeChild(trailElement)
            trailElementsRef.current = trailElementsRef.current.filter((el) => el !== trailElement)
          }
        }, 1000 / animationSpeed)
      }, 100 / animationSpeed)
    }

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [cursorTrail, animationSpeed])

  // Handle cursor type
  useEffect(() => {
    if (cursorType === "default") {
      document.body.style.cursor = ""
      return
    }

    const cursorMap: Record<string, string> = {
      hand: "pointer",
      sword: "url('/cursors/sword.png'), auto",
      dinosaur: "url('/cursors/dinosaur.png'), auto",
      banana: "url('/cursors/banana.png'), auto",
    }

    document.body.style.cursor = cursorMap[cursorType] || ""

    return () => {
      document.body.style.cursor = ""
    }
  }, [cursorType])

  // Handle Clippy
  useEffect(() => {
    // Clear any existing timeouts
    if (clippyTimeoutRef.current) {
      clearTimeout(clippyTimeoutRef.current)
    }
    if (hideClippyTimeoutRef.current) {
      clearTimeout(hideClippyTimeoutRef.current)
    }

    if (!clippy) {
      setShowClippy(false)
      return
    }

    // Show Clippy with a random message after a delay
    const messages = [
      "It looks like you're browsing the web. Would you like help?",
      "Would you like to search for something?",
      "Did you know you can customize this page?",
      "Need help finding something?",
      "Try clicking on different elements to see what they do!",
      "Would you like to add a bookmark?",
      "Remember to check the weather before going out!",
      "Have you tried the minigames yet?",
    ]

    const showRandomClippy = () => {
      setClippyMessage(messages[Math.floor(Math.random() * messages.length)])
      setShowClippy(true)

      // Hide Clippy after 10 seconds
      hideClippyTimeoutRef.current = setTimeout(() => {
        setShowClippy(false)

        // Schedule next appearance
        clippyTimeoutRef.current = setTimeout(showRandomClippy, Math.random() * 30000 + 20000) // 20-50 seconds
      }, 10000)
    }

    // Initial show
    clippyTimeoutRef.current = setTimeout(showRandomClippy, 5000)

    return () => {
      if (clippyTimeoutRef.current) clearTimeout(clippyTimeoutRef.current)
      if (hideClippyTimeoutRef.current) clearTimeout(hideClippyTimeoutRef.current)
    }
  }, [clippy])

  // Apply GeoCities theme
  useEffect(() => {
    if (!geocitiesTheme) {
      // Remove any GeoCities styling
      if (geocitiesStyleRef.current && geocitiesStyleRef.current.parentNode) {
        geocitiesStyleRef.current.parentNode.removeChild(geocitiesStyleRef.current)
        geocitiesStyleRef.current = null
      }
      return
    }

    // Add GeoCities styling if not already added
    if (!geocitiesStyleRef.current) {
      const style = document.createElement("style")
      style.id = "geocities-style"
      style.innerHTML = `
        body {
          background-image: url('/backgrounds/stars.gif') !important;
          color: #ff00ff !important;
        }
        
        .card {
          background-color: rgba(0, 0, 255, 0.3) !important;
          border: 3px solid yellow !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: lime !important;
          font-family: "Comic Sans MS", cursive !important;
        }
        
        button {
          background: linear-gradient(to bottom, #ff00ff, #00ffff) !important;
          color: yellow !important;
          border: 2px outset #c0c0c0 !important;
        }
        
        input, select {
          background-color: #000080 !important;
          color: #ffffff !important;
          border: 2px inset #c0c0c0 !important;
        }
        
        a {
          color: #00ffff !important;
          text-decoration: underline !important;
        }
        
        a:visited {
          color: #ff00ff !important;
        }
      `

      document.head.appendChild(style)
      geocitiesStyleRef.current = style
    }

    return () => {
      if (geocitiesStyleRef.current && geocitiesStyleRef.current.parentNode) {
        geocitiesStyleRef.current.parentNode.removeChild(geocitiesStyleRef.current)
        geocitiesStyleRef.current = null
      }
    }
  }, [geocitiesTheme])

  // Handle rainbow text
  useEffect(() => {
    if (!rainbowText) {
      // Remove any rainbow text styling
      if (rainbowStyleRef.current && rainbowStyleRef.current.parentNode) {
        rainbowStyleRef.current.parentNode.removeChild(rainbowStyleRef.current)
        rainbowStyleRef.current = null
      }
      return
    }

    // Add rainbow text styling if not already added
    if (!rainbowStyleRef.current) {
      const style = document.createElement("style")
      style.id = "rainbow-text-style"
      style.innerHTML = `
        @keyframes rainbow {
          0% { color: red; }
          14% { color: orange; }
          28% { color: yellow; }
          42% { color: green; }
          57% { color: blue; }
          71% { color: indigo; }
          85% { color: violet; }
          100% { color: red; }
        }
        
        h1, h2, h3, .card-title {
          animation: rainbow ${5 / animationSpeed}s linear infinite;
        }
      `

      document.head.appendChild(style)
      rainbowStyleRef.current = style
    }

    return () => {
      if (rainbowStyleRef.current && rainbowStyleRef.current.parentNode) {
        rainbowStyleRef.current.parentNode.removeChild(rainbowStyleRef.current)
        rainbowStyleRef.current = null
      }
    }
  }, [rainbowText, animationSpeed])

  // Handle blinking text
  useEffect(() => {
    if (!blinkingText) {
      // Remove any blinking text styling
      if (blinkStyleRef.current && blinkStyleRef.current.parentNode) {
        blinkStyleRef.current.parentNode.removeChild(blinkStyleRef.current)
        blinkStyleRef.current = null
      }
      return
    }

    // Add blinking text styling if not already added
    if (!blinkStyleRef.current) {
      const style = document.createElement("style")
      style.id = "blink-text-style"
      style.innerHTML = `
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        
        .card-title, button, .important {
          animation: blink ${1 / animationSpeed}s step-end infinite;
        }
      `

      document.head.appendChild(style)
      blinkStyleRef.current = style
    }

    return () => {
      if (blinkStyleRef.current && blinkStyleRef.current.parentNode) {
        blinkStyleRef.current.parentNode.removeChild(blinkStyleRef.current)
        blinkStyleRef.current = null
      }
    }
  }, [blinkingText, animationSpeed])

  // Handle Comic Sans
  useEffect(() => {
    if (!comicSans) {
      // Remove any Comic Sans styling
      if (comicSansStyleRef.current && comicSansStyleRef.current.parentNode) {
        comicSansStyleRef.current.parentNode.removeChild(comicSansStyleRef.current)
        comicSansStyleRef.current = null
      }
      return
    }

    // Add Comic Sans styling if not already added
    if (!comicSansStyleRef.current) {
      const style = document.createElement("style")
      style.id = "comic-sans-style"
      style.innerHTML = `
        * {
          font-family: "Comic Sans MS", cursive, sans-serif !important;
        }
      `

      document.head.appendChild(style)
      comicSansStyleRef.current = style
    }

    return () => {
      if (comicSansStyleRef.current && comicSansStyleRef.current.parentNode) {
        comicSansStyleRef.current.parentNode.removeChild(comicSansStyleRef.current)
        comicSansStyleRef.current = null
      }
    }
  }, [comicSans])

  // Handle Flying Toasters
  useEffect(() => {
    if (!flyingToaster) {
      // Clean up any existing toaster elements
      toasterElementsRef.current.forEach((element) => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
      toasterElementsRef.current = []
      return
    }

    // Create flying toasters
    const createToaster = () => {
      const toaster = document.createElement("div")
      toaster.className = "flying-toaster"
      toaster.style.position = "fixed"
      toaster.style.width = "64px"
      toaster.style.height = "64px"
      toaster.style.backgroundImage = "url('/screensavers/toaster.gif')"
      toaster.style.backgroundSize = "contain"
      toaster.style.backgroundRepeat = "no-repeat"
      toaster.style.pointerEvents = "none"
      toaster.style.zIndex = "9998"

      // Random starting position on the right edge
      const startY = Math.random() * window.innerHeight
      toaster.style.right = "-64px"
      toaster.style.top = `${startY}px`

      document.body.appendChild(toaster)
      toasterElementsRef.current.push(toaster)

      // Animate toaster flying across the screen
      let position = -64
      const moveToaster = () => {
        position += 2 * animationSpeed
        toaster.style.right = `${position}px`

        // Remove when it flies off screen
        if (position > window.innerWidth) {
          if (toaster.parentNode) {
            toaster.parentNode.removeChild(toaster)
            toasterElementsRef.current = toasterElementsRef.current.filter((t) => t !== toaster)
          }
          return
        }

        requestAnimationFrame(moveToaster)
      }

      requestAnimationFrame(moveToaster)
    }

    // Create initial toasters
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createToaster(), i * 2000)
    }

    // Create new toasters periodically
    const interval = setInterval(() => {
      if (toasterElementsRef.current.length < 5) {
        createToaster()
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      toasterElementsRef.current.forEach((element) => {
        if (element && element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })
      toasterElementsRef.current = []
    }
  }, [flyingToaster, animationSpeed])

  // Handle Bouncing DVD Logo
  useEffect(() => {
    if (!bouncingDVD) {
      if (dvdAnimationRef.current) {
        cancelAnimationFrame(dvdAnimationRef.current)
        dvdAnimationRef.current = null
      }
      return
    }

    let x = dvdPosition.x
    let y = dvdPosition.y
    let xSpeed = 2 * animationSpeed
    let ySpeed = 2 * animationSpeed

    const animate = () => {
      // Update position
      x += xSpeed
      y += ySpeed

      // Bounce off edges
      if (x <= 0 || x >= window.innerWidth - 100) {
        xSpeed = -xSpeed
        setDvdColor(
          `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        )
      }

      if (y <= 0 || y >= window.innerHeight - 50) {
        ySpeed = -ySpeed
        setDvdColor(
          `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`,
        )
      }

      // Keep within bounds
      x = Math.max(0, Math.min(window.innerWidth - 100, x))
      y = Math.max(0, Math.min(window.innerHeight - 50, y))

      setDvdPosition({ x, y })

      dvdAnimationRef.current = requestAnimationFrame(animate)
    }

    dvdAnimationRef.current = requestAnimationFrame(animate)

    return () => {
      if (dvdAnimationRef.current) {
        cancelAnimationFrame(dvdAnimationRef.current)
      }
    }
  }, [bouncingDVD, animationSpeed])

  // Handle page flip effect
  useEffect(() => {
    if (!pageFlip) return

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (link && !link.getAttribute("href")?.startsWith("#")) {
        e.preventDefault()

        // Create page flip overlay
        const overlay = document.createElement("div")
        overlay.style.position = "fixed"
        overlay.style.top = "0"
        overlay.style.left = "0"
        overlay.style.width = "100%"
        overlay.style.height = "100%"
        overlay.style.backgroundColor = "#fff"
        overlay.style.zIndex = "10000"
        overlay.style.transform = "translateX(100%)"
        overlay.style.transition = `transform ${0.5 / animationSpeed}s ease-in-out`

        document.body.appendChild(overlay)

        // Trigger page flip animation
        setTimeout(() => {
          overlay.style.transform = "translateX(0)"

          // Navigate after animation
          setTimeout(() => {
            window.location.href = link.href
          }, 500 / animationSpeed)
        }, 10)
      }
    }

    document.addEventListener("click", handleLinkClick)

    return () => {
      document.removeEventListener("click", handleLinkClick)
    }
  }, [pageFlip, animationSpeed])

  // Handle guestbook submission
  const handleGuestbookSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGuestEntry.name || !newGuestEntry.message) return

    const today = new Date()
    const formattedDate = `${today.toLocaleString("default", { month: "long" })} ${today.getDate()}, ${today.getFullYear()}`

    const newEntry = {
      name: newGuestEntry.name,
      message: newGuestEntry.message,
      date: formattedDate,
    }

    setGuestbookEntries([...guestbookEntries, newEntry])
    setNewGuestEntry({ name: "", message: "" })
  }

  // Only render if needed
  if (
    !underConstruction &&
    !hitCounter &&
    !marqueeText &&
    !showClippy &&
    !wordArt &&
    !bouncingDVD &&
    !webRing &&
    !visitorMap &&
    !guestbook
  ) {
    return null
  }

  return (
    <>
      {/* Marquee Text */}
      {marqueeText && (
        <div className="fixed top-0 left-0 right-0 bg-black text-yellow-300 py-1 z-50 overflow-hidden">
          <div className="whitespace-nowrap animate-marquee inline-block">
            {marqueeMessage} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            {marqueeMessage} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
      )}

      {/* Hit Counter */}
      {hitCounter && (
        <div className="fixed bottom-4 right-4 bg-black text-green-500 font-mono px-3 py-1 rounded z-50 border-2 border-green-500">
          Visitors: {hitCount.toString().padStart(6, "0")}
        </div>
      )}

      {/* Under Construction */}
      {underConstruction && (
        <>
          <div className="fixed bottom-4 left-4 z-50">
            <img src="/construction/under_construction.gif" alt="Under Construction" width={150} height={60} />
          </div>
          <div className="fixed top-20 right-4 z-50 rotate-12">
            <img src="/construction/construction.gif" alt="Construction" width={100} height={100} />
          </div>
        </>
      )}

      {/* Clippy */}
      {showClippy && (
        <div className="fixed bottom-20 right-10 z-50 flex items-end">
          <div className="bg-yellow-100 p-3 rounded-lg mb-2 mr-2 max-w-xs">
            <p className="text-black text-sm">{clippyMessage}</p>
          </div>
          <img src="/clippy.png" alt="Clippy" width={80} height={80} className="drop-shadow-md" />
        </div>
      )}

      {/* WordArt Title */}
      {wordArt && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className="wordart rainbow"
            style={{
              fontFamily: "'Arial Black', Gadget, sans-serif",
              fontSize: "36px",
              fontWeight: "bold",
              textTransform: "uppercase",
              color: "#fff",
              textShadow:
                "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #ff00de, 0 0 35px #ff00de, 0 0 40px #ff00de",
              background: "linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Awesome Page
          </div>
        </div>
      )}

      {/* Bouncing DVD Logo */}
      {bouncingDVD && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${dvdPosition.x}px`,
            top: `${dvdPosition.y}px`,
            color: dvdColor,
            fontFamily: "Arial, sans-serif",
            fontWeight: "bold",
            fontSize: "36px",
            width: "100px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "color 0.3s ease",
          }}
        >
          DVD
        </div>
      )}

      {/* Web Ring */}
      {webRing && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-white p-2 rounded-md border border-gray-400 shadow-md">
          <div className="flex items-center gap-2 text-xs">
            <a href="#" className="text-blue-600 underline">
              ← Prev
            </a>
            <span>|</span>
            <div className="flex items-center">
              <img src="/webring.gif" alt="Web Ring" width={20} height={20} />
              <span className="mx-1">Web Ring</span>
            </div>
            <span>|</span>
            <a href="#" className="text-blue-600 underline">
              Next →
            </a>
            <span>|</span>
            <a href="#" className="text-blue-600 underline">
              Random
            </a>
          </div>
        </div>
      )}

      {/* Visitor Map */}
      {visitorMap && (
        <div className="fixed bottom-16 right-4 z-50 bg-white p-2 rounded-md border border-gray-400 shadow-md">
          <div className="text-xs text-center mb-1">Visitors From:</div>
          <div className="w-[150px] h-[80px] bg-[#003366] relative">
            {/* Dots representing visitors */}
            <div className="absolute top-[20px] left-[30px] w-1 h-1 bg-red-500 rounded-full"></div>
            <div className="absolute top-[30px] left-[70px] w-1 h-1 bg-red-500 rounded-full"></div>
            <div className="absolute top-[40px] left-[110px] w-1 h-1 bg-red-500 rounded-full"></div>
            <div className="absolute top-[50px] left-[50px] w-1 h-1 bg-red-500 rounded-full"></div>
            <div className="absolute top-[15px] left-[90px] w-1 h-1 bg-red-500 rounded-full"></div>
          </div>
          <div className="text-xs text-center mt-1">42 Countries</div>
        </div>
      )}

      {/* Guestbook Button */}
      {guestbook && !showGuestbook && (
        <button
          onClick={() => setShowGuestbook(true)}
          className="fixed bottom-16 left-4 z-50 bg-gradient-to-b from-blue-500 to-blue-700 text-white px-3 py-1 rounded border-2 border-blue-300 shadow-md text-sm font-bold"
        >
          Sign My Guestbook!
        </button>
      )}

      {/* Guestbook Modal */}
      {guestbook && showGuestbook && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
          <div className="bg-[#ffffcc] border-4 border-[#996633] rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[#990000] text-xl font-bold" style={{ fontFamily: "Comic Sans MS, cursive" }}>
                My Guestbook
              </h2>
              <button onClick={() => setShowGuestbook(false)} className="bg-[#cc0000] text-white px-2 py-1 rounded">
                X
              </button>
            </div>

            <div className="mb-6 border-2 border-[#996633] bg-white p-3 rounded">
              <form onSubmit={handleGuestbookSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-bold mb-1">Your Name:</label>
                  <input
                    type="text"
                    value={newGuestEntry.name}
                    onChange={(e) => setNewGuestEntry({ ...newGuestEntry, name: e.target.value })}
                    className="w-full border border-gray-400 p-1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">Message:</label>
                  <textarea
                    value={newGuestEntry.message}
                    onChange={(e) => setNewGuestEntry({ ...newGuestEntry, message: e.target.value })}
                    className="w-full border border-gray-400 p-1 h-20"
                    required
                  ></textarea>
                </div>
                <div className="text-center">
                  <button type="submit" className="bg-[#009900] text-white px-4 py-1 rounded font-bold">
                    Sign Guestbook
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              {guestbookEntries.map((entry, index) => (
                <div key={index} className="border-2 border-[#996633] bg-white p-3 rounded">
                  <div className="flex justify-between">
                    <span className="font-bold text-[#990000]">{entry.name}</span>
                    <span className="text-xs text-gray-600">{entry.date}</span>
                  </div>
                  <p className="mt-2 text-sm">{entry.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
