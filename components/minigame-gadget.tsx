"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"

// Add imports for tooltip components
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"

type Game = {
  id: string
  name: string
  component: React.FC
}

export default function MinigameGadget() {
  const [activeGame, setActiveGame] = useState<string>("flappy")

  const games: Game[] = [
    { id: "flappy", name: "Flappy Bird", component: FlappyBirdGame },
    { id: "mario", name: "Super Mario Land", component: SuperMarioLandGame },
    { id: "runner", name: "Geometry Runner", component: RunnerGame },
    { id: "snake", name: "Snake", component: SnakeGame },
    { id: "tictactoe", name: "Tic Tac Toe", component: TicTacToeGame },
    { id: "minesweeper", name: "Minesweeper", component: MinesweeperGame },
    { id: "mario64", name: "Super Mario 64", component: SuperMario64Game },
  ]

  const ActiveGameComponent = games.find((game) => game.id === activeGame)?.component || games[0].component

  return (
    <Card className="w-full">
      {/* Update the CardHeader to include a help tooltip */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Minigames
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
                  <h4 className="font-medium">Game Controls</h4>
                  <div className="text-sm">
                    <p>
                      <strong>Flappy Bird:</strong> Click or Space/Up Arrow to flap
                    </p>
                    <p>
                      <strong>Super Mario Land:</strong> Arrow keys to move, Space to jump, Z/X to shoot
                    </p>
                    <p>
                      <strong>Geometry Runner:</strong> Space/Up Arrow to jump
                    </p>
                    <p>
                      <strong>Snake:</strong> Arrow keys to change direction
                    </p>
                    <p>
                      <strong>Tic Tac Toe:</strong> Click on a cell to place your mark
                    </p>
                    <p>
                      <strong>Minesweeper:</strong> Left click to reveal, right click to flag
                    </p>
                    <p>
                      <strong>Super Mario 64:</strong> WASD to move, Space to jump, Mouse to look around
                    </p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeGame} onValueChange={setActiveGame} className="w-full">
          <TabsList className="w-full grid grid-cols-4 mb-2">
            {games.slice(0, 4).map((game) => (
              <TabsTrigger key={game.id} value={game.id}>
                {game.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsList className="w-full grid grid-cols-3">
            {games.slice(4).map((game) => (
              <TabsTrigger key={game.id} value={game.id}>
                {game.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-4 h-[300px] bg-muted/30 rounded-md overflow-hidden">
            <ActiveGameComponent />
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Flappy Bird Game
function FlappyBirdGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Game state refs to avoid dependency issues in animation loop
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const scoreRef = useRef(0)

  // Game objects
  const birdRef = useRef({
    x: 50,
    y: 150,
    velocity: 0,
    gravity: 0.5,
    jumpStrength: -8,
    size: 20,
  })

  const pipesRef = useRef<{ x: number; topHeight: number; gap: number }[]>([])
  const pipeWidthRef = useRef(50)
  const pipeGapRef = useRef(150)
  const pipeSpeedRef = useRef(2)
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Game loop
    const gameLoop = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!gameStartedRef.current) {
        // Draw start screen
        ctx.fillStyle = "#000"
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Click to start", canvas.width / 2, canvas.height / 2)
        ctx.fillStyle = "#f0c674"
        ctx.beginPath()
        ctx.arc(birdRef.current.x, birdRef.current.y, birdRef.current.size, 0, Math.PI * 2)
        ctx.fill()

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      if (gameOverRef.current) {
        // Draw game over screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20)
        ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 20)
        ctx.font = "16px Arial"
        ctx.fillText("Click to restart", canvas.width / 2, canvas.height / 2 + 60)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      // Update bird
      const bird = birdRef.current
      bird.velocity += bird.gravity
      bird.y += bird.velocity

      // Check boundaries
      if (bird.y < 0) {
        bird.y = 0
        bird.velocity = 0
      }

      if (bird.y > canvas.height - bird.size) {
        gameOverRef.current = true
        setGameOver(true)
      }

      // Draw bird
      ctx.fillStyle = "#f0c674"
      ctx.beginPath()
      ctx.arc(bird.x, bird.y, bird.size, 0, Math.PI * 2)
      ctx.fill()

      // Update and draw pipes
      const pipes = pipesRef.current
      for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i]
        pipe.x -= pipeSpeedRef.current

        // Draw top pipe
        ctx.fillStyle = "#8abf64"
        ctx.fillRect(pipe.x, 0, pipeWidthRef.current, pipe.topHeight)

        // Draw bottom pipe
        ctx.fillRect(
          pipe.x,
          pipe.topHeight + pipeGapRef.current,
          pipeWidthRef.current,
          canvas.height - pipe.topHeight - pipeGapRef.current,
        )

        // Check collision
        if (
          bird.x + bird.size > pipe.x &&
          bird.x - bird.size < pipe.x + pipeWidthRef.current &&
          (bird.y - bird.size < pipe.topHeight || bird.y + bird.size > pipe.topHeight + pipeGapRef.current)
        ) {
          gameOverRef.current = true
          setGameOver(true)
        }

        // Score point when passing pipe
        if (pipe.x + pipeWidthRef.current < bird.x && !pipe.passed) {
          pipe.passed = true
          scoreRef.current += 1
          setScore(scoreRef.current)
        }
      }

      // Remove off-screen pipes
      pipesRef.current = pipes.filter((pipe) => pipe.x > -pipeWidthRef.current)

      // Draw score
      ctx.fillStyle = "#000"
      ctx.font = "24px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${scoreRef.current}`, 10, 30)

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // Start game loop
    gameLoop()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  // Handle game start/restart
  const handleCanvasClick = () => {
    if (!gameStarted || gameOver) {
      // Reset game state
      birdRef.current = {
        x: 50,
        y: 150,
        velocity: 0,
        gravity: 0.5,
        jumpStrength: -8,
        size: 20,
      }
      pipesRef.current = []
      scoreRef.current = 0
      setScore(0)
      gameOverRef.current = false
      setGameOver(false)
      gameStartedRef.current = true
      setGameStarted(true)

      // Start spawning pipes
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
      spawnIntervalRef.current = setInterval(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const minHeight = 50
        const maxHeight = canvas.height - pipeGapRef.current - minHeight
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight)

        pipesRef.current.push({
          x: canvas.width,
          topHeight,
          gap: pipeGapRef.current,
          passed: false,
        })
      }, 2000)
    } else {
      // Jump
      birdRef.current.velocity = birdRef.current.jumpStrength
    }
  }

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        handleCanvasClick()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameStarted, gameOver])

  return (
    <div className="w-full h-full flex flex-col">
      <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full cursor-pointer" />
    </div>
  )
}

// Super Mario Land Game
function SuperMarioLandGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [world, setWorld] = useState(1)
  const [level, setLevel] = useState(1)
  const [lives, setLives] = useState(3)
  const [showHomeScreen, setShowHomeScreen] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [gameSpeed, setGameSpeed] = useState(1.0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)

  // Game state refs
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const scoreRef = useRef(0)
  const worldRef = useRef(1)
  const levelRef = useRef(1)
  const livesRef = useRef(3)
  const showHomeScreenRef = useRef(true)
  const gameSpeedRef = useRef(1.0)
  const soundEnabledRef = useRef(true)
  const musicEnabledRef = useRef(true)

  // Audio refs
  const jumpSoundRef = useRef<HTMLAudioElement | null>(null)
  const coinSoundRef = useRef<HTMLAudioElement | null>(null)
  const powerupSoundRef = useRef<HTMLAudioElement | null>(null)
  const deathSoundRef = useRef<HTMLAudioElement | null>(null)
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null)
  const levelCompleteSoundRef = useRef<HTMLAudioElement | null>(null)

  // Game objects
  const playerRef = useRef({
    x: 50,
    y: 0,
    width: 16,
    height: 24,
    velocityX: 0,
    velocityY: 0,
    speed: 2.5, // Reduced from 3 to match original game's pace
    sprintSpeed: 4.0, // Speed when sprint key is pressed
    jumpStrength: -10,
    gravity: 0.4,
    isJumping: false,
    direction: "right",
    state: "small", // small, super, flower
    invincible: false,
    invincibleTimer: 0,
    frame: 0,
    frameCount: 0,
    isSprinting: false,
  })

  const platformsRef = useRef<{ x: number; y: number; width: number; height: number; type: string; item?: string }[]>(
    [],
  )
  const enemiesRef = useRef<
    {
      x: number
      y: number
      width: number
      height: number
      type: string
      direction: string
      speed: number
      alive: boolean
      frame?: number
      frameCount?: number
    }[]
  >([])
  const itemsRef = useRef<
    {
      x: number
      y: number
      width: number
      height: number
      type: string
      collected: boolean
    }[]
  >([])
  const projectilesRef = useRef<
    {
      x: number
      y: number
      width: number
      height: number
      velocityX: number
      velocityY: number
      bounces: number
    }[]
  >([])

  const keysRef = useRef({
    left: false,
    right: false,
    up: false,
    down: false,
    action: false,
    sprint: false,
  })

  const cameraXRef = useRef(0)
  const worldWidthRef = useRef(1000)
  const animationFrameRef = useRef<number | null>(null)

  // World themes
  const worldThemes = [
    { name: "Birabuto", color: "#e8c170" }, // Egypt
    { name: "Muda", color: "#70c2e8" }, // Water
    { name: "Easton", color: "#a0a0a0" }, // Easter Island
    { name: "Chai", color: "#e87070" }, // China
  ]

  // Load game state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedState = localStorage.getItem("superMarioLandState")
        if (savedState) {
          const state = JSON.parse(savedState)
          worldRef.current = state.world
          levelRef.current = state.level
          scoreRef.current = state.score
          livesRef.current = state.lives
          setWorld(state.world)
          setLevel(state.level)
          setScore(state.score)
          setLives(state.lives)
        }
      } catch (error) {
        console.error("Error loading game state:", error)
      }
    }
  }, [])

  // Initialize audio with error handling
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create dummy audio elements that won't actually try to load files
      // This prevents errors when the actual sound files don't exist
      jumpSoundRef.current = new Audio()
      coinSoundRef.current = new Audio()
      powerupSoundRef.current = new Audio()
      deathSoundRef.current = new Audio()
      backgroundMusicRef.current = new Audio()
      levelCompleteSoundRef.current = new Audio()

      // Set properties
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.loop = true
        backgroundMusicRef.current.volume = 0.5
      }

      // Cleanup
      return () => {
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.pause()
        }
      }
    }
  }, [])

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize level
    const initializeLevel = () => {
      const world = worldRef.current
      const level = levelRef.current

      // Reset player position
      playerRef.current.x = 50
      playerRef.current.y = 0
      playerRef.current.velocityX = 0
      playerRef.current.velocityY = 0

      // Set world width based on level
      worldWidthRef.current = 2000 + world * 500

      // Reset camera
      cameraXRef.current = 0

      // Create platforms
      const platforms = []
      const groundHeight = 32

      // Ground platform
      for (let x = 0; x < worldWidthRef.current; x += 64) {
        platforms.push({
          x: x,
          y: canvas.height - groundHeight,
          width: 64,
          height: groundHeight,
          type: "ground",
        })
      }

      // Add some gaps in the ground
      const gapPositions = [500, 900, 1400]
      gapPositions.forEach((pos) => {
        // Make the first gap smaller
        const gapWidth = pos === 500 ? 64 : 128
        // Remove a few ground blocks to create a gap
        platforms.forEach((platform, index) => {
          if (platform.type === "ground" && platform.x >= pos && platform.x < pos + gapWidth) {
            platforms[index] = { ...platform, type: "removed" }
          }
        })
      })

      // Add floating platforms
      const platformPositions = [
        { x: 300, y: canvas.height - 100, width: 128 },
        { x: 600, y: canvas.height - 150, width: 64 },
        { x: 900, y: canvas.height - 200, width: 128 },
        { x: 1100, y: canvas.height - 150, width: 64 },
        { x: 1300, y: canvas.height - 100, width: 128 },
        { x: 1500, y: canvas.height - 200, width: 96 },
      ]

      platformPositions.forEach((pos) => {
        platforms.push({
          x: pos.x,
          y: pos.y,
          width: pos.width,
          height: 16,
          type: "platform",
        })
      })

      // Add blocks with items
      const itemBlockPositions = [
        { x: 200, y: canvas.height - 150, item: "coin" },
        { x: 350, y: canvas.height - 150, item: "mushroom" },
        { x: 700, y: canvas.height - 200, item: "flower" },
        { x: 1000, y: canvas.height - 150, item: "coin" },
        { x: 1400, y: canvas.height - 150, item: "star" },
      ]

      itemBlockPositions.forEach((pos) => {
        platforms.push({
          x: pos.x,
          y: pos.y,
          width: 32,
          height: 32,
          type: "itemBlock",
          item: pos.item,
        })
      })

      // Filter out removed platforms
      platformsRef.current = platforms.filter((p) => p.type !== "removed")

      // Create enemies
      const enemies = []

      // Add Goombos
      const goomboPositions = [400, 700, 1000, 1300, 1600]
      goomboPositions.forEach((x) => {
        enemies.push({
          x: x,
          y: canvas.height - groundHeight - 24,
          width: 16,
          height: 16,
          type: "goombo",
          direction: "left",
          speed: 0.8, // Slower speed to match original game
          alive: true,
          frame: 0,
          frameCount: 0,
        })
      })

      // Add Piranha Plants
      const piranhaPositions = [500, 900, 1400]
      piranhaPositions.forEach((x) => {
        enemies.push({
          x: x,
          y: canvas.height - groundHeight - 32,
          width: 16,
          height: 32,
          type: "piranha",
          direction: "up",
          speed: 0.5,
          alive: true,
        })
      })

      // Add Tamao (rolling boulders)
      if (world >= 3) {
        const tamaoPositions = [800, 1200]
        tamaoPositions.forEach((x) => {
          enemies.push({
            x: x,
            y: canvas.height - groundHeight - 24,
            width: 24,
            height: 24,
            type: "tamao",
            direction: "left",
            speed: 1.5,
            alive: true,
          })
        })
      }

      enemiesRef.current = enemies

      // Create items
      itemsRef.current = []

      // Add end doors
      itemsRef.current.push({
        x: worldWidthRef.current - 100,
        y: canvas.height - groundHeight - 64,
        width: 32,
        height: 64,
        type: "doorHigh",
        collected: false,
      })

      itemsRef.current.push({
        x: worldWidthRef.current - 150,
        y: canvas.height - groundHeight - 64,
        width: 32,
        height: 64,
        type: "doorLow",
        collected: false,
      })

      // Reset projectiles
      projectilesRef.current = []
    }

    // Save game state
    const saveGameState = () => {
      if (typeof window !== "undefined") {
        try {
          const state = {
            world: worldRef.current,
            level: levelRef.current,
            score: scoreRef.current,
            lives: livesRef.current,
          }
          localStorage.setItem("superMarioLandState", JSON.stringify(state))
        } catch (error) {
          console.error("Error saving game state:", error)
        }
      }
    }

    // Game loop
    const gameLoop = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set background color based on world
      const worldIndex = (worldRef.current - 1) % worldThemes.length
      ctx.fillStyle = worldThemes[worldIndex].color
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (showHomeScreenRef.current) {
        // Draw home screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw title
        ctx.fillStyle = "#fff"
        ctx.font = "30px Arial"
        ctx.textAlign = "center"
        ctx.fillText("SUPER MARIO LAND", canvas.width / 2, canvas.height / 3)

        // Draw menu options
        ctx.font = "20px Arial"

        // New Game option
        ctx.fillStyle = "#fff"
        ctx.fillText("NEW GAME", canvas.width / 2, canvas.height / 2)

        // Continue option (grayed out if no saved game)
        const savedState = localStorage.getItem("superMarioLandState")
        if (savedState) {
          ctx.fillStyle = "#fff"
        } else {
          ctx.fillStyle = "#888"
        }
        ctx.fillText("CONTINUE", canvas.width / 2, canvas.height / 2 + 40)

        // Settings option
        ctx.fillStyle = "#fff"
        ctx.fillText("SETTINGS", canvas.width / 2, canvas.height / 2 + 80)

        // Instructions
        ctx.font = "16px Arial"
        ctx.fillText("Click on an option to select", canvas.width / 2, canvas.height / 2 + 140)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      if (showSettings) {
        // Draw settings screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw title
        ctx.fillStyle = "#fff"
        ctx.font = "30px Arial"
        ctx.textAlign = "center"
        ctx.fillText("SETTINGS", canvas.width / 2, canvas.height / 3)

        // Draw settings options
        ctx.font = "20px Arial"

        // Game Speed option
        ctx.fillStyle = "#fff"
        ctx.fillText(`Game Speed: ${gameSpeedRef.current.toFixed(1)}x`, canvas.width / 2, canvas.height / 2)

        // Sound option
        ctx.fillStyle = "#fff"
        ctx.fillText(`Sound: ${soundEnabledRef.current ? "ON" : "OFF"}`, canvas.width / 2, canvas.height / 2 + 40)

        // Music option
        ctx.fillStyle = "#fff"
        ctx.fillText(`Music: ${musicEnabledRef.current ? "ON" : "OFF"}`, canvas.width / 2, canvas.height / 2 + 80)

        // Back option
        ctx.fillStyle = "#fff"
        ctx.fillText("BACK", canvas.width / 2, canvas.height / 2 + 120)

        // Instructions
        ctx.font = "16px Arial"
        ctx.fillText("Click on an option to change it", canvas.width / 2, canvas.height / 2 + 180)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      if (!gameStartedRef.current) {
        // Draw start screen
        ctx.fillStyle = "#000"
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Super Mario Land", canvas.width / 2, canvas.height / 2 - 40)
        ctx.font = "16px Arial"
        ctx.fillText("Click to start", canvas.width / 2, canvas.height / 2)
        ctx.fillText("Arrow keys to move, Space to jump/action", canvas.width / 2, canvas.height / 2 + 30)
        ctx.fillText("Shift to sprint, Z/X to shoot", canvas.width / 2, canvas.height / 2 + 60)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      if (gameOverRef.current) {
        // Draw game over screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20)
        ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 20)
        ctx.font = "16px Arial"
        ctx.fillText("Click to restart", canvas.width / 2, canvas.height / 2 + 60)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      // Update player
      const player = playerRef.current
      const keys = keysRef.current

      // Horizontal movement
      if (keys.left) {
        player.velocityX = keys.sprint ? -player.sprintSpeed : -player.speed
        player.direction = "left"
        player.isSprinting = keys.sprint
      } else if (keys.right) {
        player.velocityX = keys.sprint ? player.sprintSpeed : player.speed
        player.direction = "right"
        player.isSprinting = keys.sprint
      } else {
        player.velocityX = 0
        player.isSprinting = false
      }

      // Apply gravity
      player.velocityY += player.gravity

      // Update position
      player.x += player.velocityX * gameSpeedRef.current
      player.y += player.velocityY * gameSpeedRef.current

      // Check boundaries
      if (player.x < 0) player.x = 0
      if (player.x + player.width > worldWidthRef.current) {
        player.x = worldWidthRef.current - player.width
      }

      // Check if player fell off the bottom
      if (player.y > canvas.height) {
        // Player died
        if (soundEnabledRef.current && deathSoundRef.current) {
          try {
            deathSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
          } catch (e) {
            console.log("Error playing sound")
          }
        }

        livesRef.current -= 1
        setLives(livesRef.current)

        if (livesRef.current <= 0) {
          // Game over
          gameOverRef.current = true
          setGameOver(true)
        } else {
          // Respawn player
          player.x = 50
          player.y = 0
          player.velocityX = 0
          player.velocityY = 0
          player.state = "small"
          player.height = 24
          player.invincible = false
          cameraXRef.current = 0
        }
      }

      // Update camera position to follow player
      cameraXRef.current = player.x - canvas.width / 3
      if (cameraXRef.current < 0) cameraXRef.current = 0
      if (cameraXRef.current > worldWidthRef.current - canvas.width) {
        cameraXRef.current = worldWidthRef.current - canvas.width
      }

      // Check platform collisions
      let onPlatform = false
      platformsRef.current.forEach((platform) => {
        // Skip if platform is off-screen
        if (platform.x + platform.width < cameraXRef.current || platform.x > cameraXRef.current + canvas.width) {
          return
        }

        // Draw platform
        const platformX = platform.x - cameraXRef.current

        if (platform.type === "ground") {
          ctx.fillStyle = "#8b4513" // brown
          ctx.fillRect(platformX, platform.y, platform.width, platform.height)

          ctx.fillStyle = "#8b8113" // darker brown for top
          ctx.fillRect(platformX, platform.y, platform.width, 8)
        } else if (platform.type === "platform") {
          ctx.fillStyle = "#8b4513"
          ctx.fillRect(platformX, platform.y, platform.width, platform.height)
        } else if (platform.type === "itemBlock") {
          // Draw animated question block
          const blockFrame = Math.floor(Date.now() / 200) % 4

          ctx.fillStyle = "#e8b010" // gold
          ctx.fillRect(platformX, platform.y, platform.width, platform.height)

          // Draw question mark with animation
          ctx.fillStyle = blockFrame === 3 ? "#ffff00" : "#ffffff"
          ctx.font = "20px Arial"
          ctx.textAlign = "center"
          ctx.fillText("?", platformX + platform.width / 2, platform.y + platform.height / 2 + 6)
        } else if (platform.type === "used") {
          ctx.fillStyle = "#a0a0a0" // gray for used block
          ctx.fillRect(platformX, platform.y, platform.width, platform.height)
        }

        // Check collision
        if (
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.width &&
          player.y + player.height > platform.y &&
          player.y + player.height < platform.y + platform.height &&
          player.velocityY > 0
        ) {
          player.y = platform.y - player.height
          player.velocityY = 0
          player.isJumping = false
          onPlatform = true
        }

        // Check if player hits item block from below
        if (
          platform.type === "itemBlock" &&
          player.x + player.width > platform.x &&
          player.x < platform.x + platform.width &&
          player.y < platform.y + platform.height &&
          player.y + player.height > platform.y &&
          player.velocityY < 0
        ) {
          // Player hit item block from below
          player.velocityY = 0

          // Play sound
          if (soundEnabledRef.current && coinSoundRef.current && platform.item === "coin") {
            try {
              coinSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
            } catch (e) {
              console.log("Error playing sound")
            }
          } else if (soundEnabledRef.current && powerupSoundRef.current) {
            try {
              powerupSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
            } catch (e) {
              console.log("Error playing sound")
            }
          }

          // Spawn item
          if (platform.item) {
            const item = {
              x: platform.x + platform.width / 2 - 8,
              y: platform.y - 16,
              width: 16,
              height: 16,
              type: platform.item,
              collected: false,
            }

            itemsRef.current.push(item)

            // Add points for coin
            if (platform.item === "coin") {
              scoreRef.current += 100
              setScore(scoreRef.current)
            }
          }

          // Convert block to used
          platform.type = "used"
          platform.item = undefined
        }
      })

      // Update and draw enemies
      enemiesRef.current.forEach((enemy, index) => {
        if (!enemy.alive) return

        // Skip if enemy is off-screen
        if (enemy.x + enemy.width < cameraXRef.current || enemy.x > cameraXRef.current + canvas.width) {
          return
        }

        // Update enemy position
        if (enemy.type === "goombo" || enemy.type === "tamao") {
          enemy.x += (enemy.direction === "left" ? -enemy.speed : enemy.speed) * gameSpeedRef.current

          // Update animation frame
          if (enemy.frameCount !== undefined) {
            enemy.frameCount += gameSpeedRef.current
            if (enemy.frameCount >= 10) {
              enemy.frame = enemy.frame !== undefined ? (enemy.frame + 1) % 2 : 0
              enemy.frameCount = 0
            }
          }

          // Check for platform edges and reverse direction
          let onGround = false
          let hitWall = false

          platformsRef.current.forEach((platform) => {
            // Check if enemy is on this platform
            if (
              enemy.x + enemy.width > platform.x &&
              enemy.x < platform.x + platform.width &&
              enemy.y + enemy.height >= platform.y &&
              enemy.y + enemy.height <= platform.y + 10
            ) {
              onGround = true
            }

            // Check if enemy hit a wall
            if (
              ((enemy.direction === "left" && enemy.x <= platform.x + platform.width && enemy.x > platform.x) ||
                (enemy.direction === "right" && enemy.x + enemy.width >= platform.x && enemy.x < platform.x)) &&
              enemy.y + enemy.height > platform.y &&
              enemy.y < platform.y + platform.height
            ) {
              hitWall = true
            }
          })

          // If about to fall off or hit a wall, reverse direction
          if (!onGround || hitWall) {
            enemy.direction = enemy.direction === "left" ? "right" : "left"
          }
        } else if (enemy.type === "piranha") {
          // Piranha plants just move up and down
          enemy.y += (enemy.direction === "up" ? -enemy.speed : enemy.speed) * gameSpeedRef.current

          // Reverse direction at limits
          if (enemy.direction === "up" && enemy.y <= canvas.height - 120) {
            enemy.direction = "down"
          } else if (enemy.direction === "down" && enemy.y >= canvas.height - 64) {
            enemy.direction = "up"
          }
        }

        // Draw enemy
        const enemyX = enemy.x - cameraXRef.current

        if (enemy.type === "goombo") {
          // Draw more detailed Goombo with animation
          ctx.fillStyle = "#a05000" // body
          ctx.fillRect(enemyX, enemy.y, enemy.width, enemy.height)

          // Eyes
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(enemyX + 2, enemy.y + 4, 4, 4)
          ctx.fillRect(enemyX + 10, enemy.y + 4, 4, 4)

          // Pupils
          ctx.fillStyle = "#000000"
          ctx.fillRect(enemyX + 3, enemy.y + 5, 2, 2)
          ctx.fillRect(enemyX + 11, enemy.y + 5, 2, 2)

          // Feet - animate based on frame
          ctx.fillStyle = "#000000"
          if (enemy.frame === 0) {
            ctx.fillRect(enemyX, enemy.y + enemy.height - 4, 6, 4)
            ctx.fillRect(enemyX + enemy.width - 6, enemy.y + enemy.height - 4, 6, 4)
          } else {
            ctx.fillRect(enemyX + 1, enemy.y + enemy.height - 4, 6, 4)
            ctx.fillRect(enemyX + enemy.width - 7, enemy.y + enemy.height - 4, 6, 4)
          }
        } else if (enemy.type === "piranha") {
          // Draw more detailed Piranha Plant
          ctx.fillStyle = "#00a000" // stem
          ctx.fillRect(enemyX + enemy.width / 2 - 4, enemy.y + 10, 8, enemy.height - 10)

          // Head
          ctx.fillStyle = "#00c000"
          ctx.beginPath()
          ctx.arc(enemyX + enemy.width / 2, enemy.y + 10, 10, 0, Math.PI * 2)
          ctx.fill()

          // Mouth
          ctx.fillStyle = "#ff0000"
          ctx.beginPath()
          ctx.arc(enemyX + enemy.width / 2, enemy.y + 10, 6, 0, Math.PI)
          ctx.fill()

          // Teeth
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(enemyX + enemy.width / 2 - 5, enemy.y + 10, 2, 4)
          ctx.fillRect(enemyX + enemy.width / 2 + 3, enemy.y + 10, 2, 4)
        } else if (enemy.type === "tamao") {
          // Draw more detailed Tamao (boulder) with rotation animation
          const angle = (Date.now() / 200) % (Math.PI * 2)

          ctx.save()
          ctx.translate(enemyX + enemy.width / 2, enemy.y + enemy.height / 2)
          ctx.rotate(angle)

          ctx.fillStyle = "#a0a0a0"
          ctx.beginPath()
          ctx.arc(0, 0, enemy.width / 2, 0, Math.PI * 2)
          ctx.fill()

          // Add some texture
          ctx.fillStyle = "#808080"
          ctx.beginPath()
          ctx.arc(-3, -3, 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(4, 2, 3, 0, Math.PI * 2)
          ctx.fill()

          ctx.restore()
        }

        // Check collision with player
        if (
          player.x + player.width > enemy.x &&
          player.x < enemy.x + enemy.width &&
          player.y + player.height > enemy.y &&
          player.y < enemy.y + enemy.height
        ) {
          // If player is falling and above enemy, stomp the enemy
          if (player.velocityY > 0 && player.y + player.height < enemy.y + enemy.height / 2) {
            enemy.alive = false
            player.velocityY = -6 // Bounce
            scoreRef.current += 200
            setScore(scoreRef.current)

            // Play sound
            if (soundEnabledRef.current && jumpSoundRef.current) {
              try {
                jumpSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
              } catch (e) {
                console.log("Error playing sound")
              }
            }
          } else if (!player.invincible) {
            // Player gets hit
            if (player.state === "small") {
              // Lose a life
              livesRef.current -= 1
              setLives(livesRef.current)

              if (livesRef.current <= 0) {
                gameOverRef.current = true
                setGameOver(true)

                // Play death sound
                if (soundEnabledRef.current && deathSoundRef.current) {
                  try {
                    deathSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
                  } catch (e) {
                    console.log("Error playing sound")
                  }
                }
              } else {
                // Respawn player
                player.x = 50
                player.y = 0
                player.velocityX = 0
                player.velocityY = 0
                player.invincible = true
                player.invincibleTimer = 60 // Frames of invincibility

                // Play hit sound
                if (soundEnabledRef.current && deathSoundRef.current) {
                  try {
                    deathSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
                  } catch (e) {
                    console.log("Error playing sound")
                  }
                }
              }
            } else {
              // Downgrade player state
              player.state = "small"
              player.height = 24
              player.invincible = true
              player.invincibleTimer = 60 // Frames of invincibility

              // Play hit sound
              if (soundEnabledRef.current && powerupSoundRef.current) {
                try {
                  powerupSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
                } catch (e) {
                  console.log("Error playing sound")
                }
              }
            }
          }
        }
      })

      // Update and draw items
      itemsRef.current.forEach((item, index) => {
        if (item.collected) return

        // Skip if item is off-screen
        if (item.x + item.width < cameraXRef.current || item.x > cameraXRef.current + canvas.width) {
          return
        }

        // Draw item
        const itemX = item.x - cameraXRef.current

        if (item.type === "coin") {
          // Draw animated coin
          const coinFrame = Math.floor(Date.now() / 100) % 4
          const coinWidth = item.width * (coinFrame === 0 || coinFrame === 2 ? 1 : 0.7)

          ctx.fillStyle = "#ffd700"
          ctx.beginPath()
          ctx.ellipse(
            itemX + item.width / 2,
            item.y + item.height / 2,
            coinWidth / 2,
            item.height / 2,
            0,
            0,
            Math.PI * 2,
          )
          ctx.fill()

          // Add shine
          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(itemX + item.width / 2 - 2, item.y + item.height / 2 - 2, 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (item.type === "mushroom") {
          // Draw more detailed mushroom
          ctx.fillStyle = "#ff0000" // Red cap
          ctx.fillRect(itemX, item.y, item.width, item.height / 2)

          // White spots
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(itemX + 3, item.y + 3, 3, 3)
          ctx.fillRect(itemX + 10, item.y + 2, 3, 3)

          // Stem
          ctx.fillStyle = "#ffcc99"
          ctx.fillRect(itemX + 3, item.y + item.height / 2, item.width - 6, item.height / 2)
        } else if (item.type === "flower") {
          // Draw more detailed flower with animation
          const flowerFrame = Math.floor(Date.now() / 200) % 4

          ctx.fillStyle = flowerFrame % 2 === 0 ? "#ff8000" : "#ff0000" // Alternating colors
          ctx.beginPath()
          ctx.arc(itemX + item.width / 2, item.y + item.height / 2, item.width / 2, 0, Math.PI * 2)
          ctx.fill()

          // Petals
          ctx.fillStyle = flowerFrame % 2 === 0 ? "#ff0000" : "#ff8000"
          ctx.beginPath()
          ctx.arc(itemX + item.width / 2, item.y + 3, 4, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(itemX + item.width - 3, item.y + item.height / 2, 4, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(itemX + item.width / 2, item.y + item.height - 3, 4, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(itemX + 3, item.y + item.height / 2, 4, 0, Math.PI * 2)
          ctx.fill()
        } else if (item.type === "star") {
          // Draw animated star
          const starFrame = Math.floor(Date.now() / 100) % 4
          const starColor =
            starFrame === 0 ? "#ffff00" : starFrame === 1 ? "#ffaa00" : starFrame === 2 ? "#ff5500" : "#ffff00"

          ctx.fillStyle = starColor
          ctx.beginPath()
          ctx.moveTo(itemX + item.width / 2, item.y)
          ctx.lineTo(itemX + item.width * 0.7, item.y + item.height * 0.4)
          ctx.lineTo(itemX + item.width, item.y + item.height * 0.5)
          ctx.lineTo(itemX + item.width * 0.8, item.y + item.height * 0.7)
          ctx.lineTo(itemX + item.width * 0.9, item.y + item.height)
          ctx.lineTo(itemX + item.width * 0.5, item.y + item.height * 0.8)
          ctx.lineTo(itemX + item.width * 0.1, item.y + item.height)
          ctx.lineTo(itemX + item.width * 0.2, item.y + item.height * 0.7)
          ctx.lineTo(itemX, item.y + item.height * 0.5)
          ctx.lineTo(itemX + item.width * 0.3, item.y + item.height * 0.4)
          ctx.closePath()
          ctx.fill()

          // Add shine
          ctx.fillStyle = "#ffffff"
          ctx.beginPath()
          ctx.arc(itemX + item.width / 2 - 2, item.y + item.height / 2 - 2, 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (item.type === "doorHigh" || item.type === "doorLow") {
          // Draw more detailed door
          ctx.fillStyle = item.type === "doorHigh" ? "#00a000" : "#a00000"
          ctx.fillRect(itemX, item.y, item.width, item.height)

          // Door frame
          ctx.fillStyle = "#8b4513"
          ctx.fillRect(itemX, item.y, 4, item.height)
          ctx.fillRect(itemX + item.width - 4, item.y, 4, item.height)
          ctx.fillRect(itemX, item.y, item.width, 4)

          // Doorknob
          ctx.fillStyle = "#ffff00"
          ctx.beginPath()
          ctx.arc(itemX + item.width - 8, item.y + item.height / 2, 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Check collision with player
        if (
          player.x + player.width > item.x &&
          player.x < item.x + item.width &&
          player.y + player.height > item.y &&
          player.y < item.y + item.height
        ) {
          if (item.type === "coin") {
            item.collected = true
            scoreRef.current += 100
            setScore(scoreRef.current)

            // Play coin sound
            if (soundEnabledRef.current && coinSoundRef.current) {
              try {
                coinSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
              } catch (e) {
                console.log("Error playing sound")
              }
            }
          } else if (item.type === "mushroom") {
            item.collected = true
            if (player.state === "small") {
              player.state = "super"
              player.height = 32
            }
            scoreRef.current += 1000
            setScore(scoreRef.current)

            // Play powerup sound
            if (soundEnabledRef.current && powerupSoundRef.current) {
              try {
                powerupSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
              } catch (e) {
                console.log("Error playing sound")
              }
            }
          } else if (item.type === "flower") {
            item.collected = true
            player.state = "flower"
            scoreRef.current += 1000
            setScore(scoreRef.current)

            // Play powerup sound
            if (soundEnabledRef.current && powerupSoundRef.current) {
              try {
                powerupSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
              } catch (e) {
                console.log("Error playing sound")
              }
            }
          } else if (item.type === "star") {
            item.collected = true
            player.invincible = true
            player.invincibleTimer = 300 // Longer invincibility
            scoreRef.current += 1000
            setScore(scoreRef.current)

            // Play powerup sound
            if (soundEnabledRef.current && powerupSoundRef.current) {
              try {
                powerupSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
              } catch (e) {
                console.log("Error playing sound")
              }
            }
          } else if (item.type === "doorHigh" || item.type === "doorLow") {
            // Level complete!
            item.collected = true

            // Play level complete sound
            if (soundEnabledRef.current && levelCompleteSoundRef.current) {
              try {
                levelCompleteSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
              } catch (e) {
                console.log("Error playing sound")
              }
            }

            // Bonus for high door
            if (item.type === "doorHigh") {
              scoreRef.current += 5000
              setScore(scoreRef.current)
            }

            // Advance to next level
            levelRef.current++
            if (levelRef.current > 3) {
              levelRef.current = 1
              worldRef.current++
              if (worldRef.current > 4) {
                // Game complete!
                scoreRef.current += 10000 // Big bonus
                setScore(scoreRef.current)
                gameOverRef.current = true
                setGameOver(true)
                return
              }
            }

            setLevel(levelRef.current)
            setWorld(worldRef.current)

            // Save game state
            saveGameState()

            // Initialize new level
            initializeLevel()
          }
        }
      })

      // Update and draw projectiles (superballs)
      projectilesRef.current.forEach((projectile, index) => {
        // Update position
        projectile.x += projectile.velocityX * gameSpeedRef.current
        projectile.y += projectile.velocityY * gameSpeedRef.current

        // Apply gravity to superballs
        projectile.velocityY += 0.2 * gameSpeedRef.current

        // Check for bounces
        let bounced = false

        // Bounce off platforms
        platformsRef.current.forEach((platform) => {
          if (
            projectile.x + projectile.width > platform.x &&
            projectile.x < platform.x + platform.width &&
            projectile.y + projectile.height > platform.y &&
            projectile.y < platform.y + platform.height
          ) {
            // Determine which side was hit
            const overlapLeft = projectile.x + projectile.width - platform.x
            const overlapRight = platform.x + platform.width - projectile.x
            const overlapTop = projectile.y + projectile.height - platform.y
            const overlapBottom = platform.y + platform.height - projectile.y

            // Find smallest overlap
            const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom)

            if (minOverlap === overlapLeft || minOverlap === overlapRight) {
              // Horizontal bounce
              projectile.velocityX = -projectile.velocityX
            } else {
              // Vertical bounce
              projectile.velocityY = -projectile.velocityY
            }

            bounced = true
            projectile.bounces++
          }
        })

        // Bounce off screen edges
        if (projectile.x < 0 || projectile.x + projectile.width > worldWidthRef.current) {
          projectile.velocityX = -projectile.velocityX
          bounced = true
          projectile.bounces++
        }

        if (projectile.y < 0) {
          projectile.velocityY = -projectile.velocityY
          bounced = true
          projectile.bounces++
        }

        // Remove if off bottom of screen or too many bounces
        if (projectile.y > canvas.height || projectile.bounces > 5) {
          projectilesRef.current.splice(index, 1)
          return
        }

        // Check collision with enemies
        enemiesRef.current.forEach((enemy, enemyIndex) => {
          if (!enemy.alive) return

          if (
            projectile.x + projectile.width > enemy.x &&
            projectile.x < enemy.x + enemy.width &&
            projectile.y + projectile.height > enemy.y &&
            projectile.y < enemy.y + enemy.height
          ) {
            // Hit enemy with projectile
            enemy.alive = false
            projectilesRef.current.splice(index, 1)
            scoreRef.current += 200
            setScore(scoreRef.current)
            return
          }
        })

        // Draw projectile
        const projectileX = projectile.x - cameraXRef.current

        // Animated superball
        const ballFrame = Math.floor(Date.now() / 100) % 4
        ctx.fillStyle =
          ballFrame === 0 ? "#ffffff" : ballFrame === 1 ? "#ffaaaa" : ballFrame === 2 ? "#aaaaff" : "#aaffaa"
        ctx.beginPath()
        ctx.arc(
          projectileX + projectile.width / 2,
          projectile.y + projectile.height / 2,
          projectile.width / 2,
          0,
          Math.PI * 2,
        )
        ctx.fill()
      })

      // Draw player
      const playerX = player.x - cameraXRef.current

      // Flash if invincible
      if (player.invincible) {
        player.invincibleTimer--
        if (player.invincibleTimer <= 0) {
          player.invincible = false
        }

        // Flash every few frames
        if (player.invincibleTimer % 6 >= 3) {
          ctx.globalAlpha = 0.5
        }
      }

      // Update animation frame
      player.frameCount += gameSpeedRef.current
      if (player.frameCount >= (player.isSprinting ? 5 : 8)) {
        player.frame = (player.frame + 1) % 4
        player.frameCount = 0
      }

      // Draw player based on state and animation frame
      if (player.state === "small") {
        // Small Mario - more detailed with animation
        ctx.fillStyle = "#ff0000" // Red overalls
        ctx.fillRect(playerX, player.y, player.width, player.height)

        // Face
        ctx.fillStyle = "#ffcc99" // Skin tone
        ctx.fillRect(playerX, player.y, player.width, player.height / 3)

        // Hat
        ctx.fillStyle = "#ff0000" // Red hat
        ctx.fillRect(playerX, player.y, player.width, player.height / 6)

        // Eyes
        ctx.fillStyle = "#000000"
        if (player.direction === "right") {
          ctx.fillRect(playerX + player.width / 2 + 2, player.y + player.height / 8, 2, 2)
        } else {
          ctx.fillRect(playerX + player.width / 2 - 4, player.y + player.height / 8, 2, 2)
        }

        // Mustache
        ctx.fillStyle = "#000000"
        ctx.fillRect(playerX + player.width / 3, player.y + player.height / 4, player.width / 3, 2)

        // Buttons
        ctx.fillStyle = "#ffff00" // Yellow buttons
        ctx.fillRect(playerX + player.width / 3, player.y + player.height / 2, 2, 2)
        ctx.fillRect(playerX + (player.width * 2) / 3, player.y + player.height / 2, 2, 2)

        // Legs - animate based on movement and frame
        ctx.fillStyle = "#0000ff" // Blue pants
        if (player.velocityX !== 0) {
          if (player.frame % 2 === 0) {
            // Standing or first running frame
            ctx.fillRect(playerX, player.y + player.height / 2, player.width, player.height / 2 - 4)
          } else {
            // Running frame
            ctx.fillRect(playerX + 2, player.y + player.height / 2, player.width - 4, player.height / 2 - 4)
          }
        } else {
          // Standing still
          ctx.fillRect(playerX, player.y + player.height / 2, player.width, player.height / 2 - 4)
        }

        // Shoes
        ctx.fillStyle = "#663300" // Brown shoes
        ctx.fillRect(playerX, player.y + player.height - 4, player.width / 2, 4)
        ctx.fillRect(playerX + player.width / 2, player.y + player.height - 4, player.width / 2, 4)
      } else if (player.state === "super") {
        // Super Mario
        ctx.fillStyle = "#ff0000" // Red overalls
        ctx.fillRect(playerX, player.y, player.width, player.height)

        // Face
        ctx.fillStyle = "#ffcc99" // Skin tone
        ctx.fillRect(playerX, player.y, player.width, player.height / 4)

        // Hat
        ctx.fillStyle = "#ff0000" // Red hat
        ctx.fillRect(playerX, player.y, player.width, player.height / 8)

        // Eyes
        ctx.fillStyle = "#000000"
        if (player.direction === "right") {
          ctx.fillRect(playerX + player.width / 2 + 2, player.y + player.height / 10, 2, 2)
        } else {
          ctx.fillRect(playerX + player.width / 2 - 4, player.y + player.height / 10, 2, 2)
        }

        // Mustache
        ctx.fillStyle = "#000000"
        ctx.fillRect(playerX + player.width / 3, player.y + player.height / 5, player.width / 3, 2)

        // Body
        ctx.fillStyle = "#0000ff" // Blue overalls
        ctx.fillRect(playerX, player.y + player.height / 4, player.width, (player.height * 3) / 4 - 6)

        // Buttons
        ctx.fillStyle = "#ffff00" // Yellow buttons
        ctx.fillRect(playerX + player.width / 3, player.y + player.height / 2, 2, 2)
        ctx.fillRect(playerX + (player.width * 2) / 3, player.y + player.height / 2, 2, 2)

        // Legs - animate based on movement and frame
        if (player.velocityX !== 0) {
          if (player.frame % 2 === 0) {
            // Standing or first running frame
            ctx.fillStyle = "#0000ff" // Blue pants
            ctx.fillRect(playerX, player.y + (player.height * 3) / 4, player.width, player.height / 4 - 6)
          } else {
            // Running frame
            ctx.fillStyle = "#0000ff" // Blue pants
            ctx.fillRect(playerX + 2, player.y + (player.height * 3) / 4, player.width - 4, player.height / 4 - 6)
          }
        } else {
          // Standing still
          ctx.fillStyle = "#0000ff" // Blue pants
          ctx.fillRect(playerX, player.y + (player.height * 3) / 4, player.width, player.height / 4 - 6)
        }

        // Shoes
        ctx.fillStyle = "#663300" // Brown shoes
        ctx.fillRect(playerX, player.y + player.height - 6, player.width / 2, 6)
        ctx.fillRect(playerX + player.width / 2, player.y + player.height - 6, player.width / 2, 6)
      } else if (player.state === "flower") {
        // Flower Mario (white overalls)
        ctx.fillStyle = "#ffffff" // White overalls
        ctx.fillRect(playerX, player.y, player.width, player.height)

        // Face
        ctx.fillStyle = "#ffcc99" // Skin tone
        ctx.fillRect(playerX, player.y, player.width, player.height / 4)

        // Hat
        ctx.fillStyle = "#ff0000" // Red hat
        ctx.fillRect(playerX, player.y, player.width, player.height / 8)

        // Eyes
        ctx.fillStyle = "#000000"
        if (player.direction === "right") {
          ctx.fillRect(playerX + player.width / 2 + 2, player.y + player.height / 10, 2, 2)
        } else {
          ctx.fillRect(playerX + player.width / 2 - 4, player.y + player.height / 10, 2, 2)
        }

        // Mustache
        ctx.fillStyle = "#000000"
        ctx.fillRect(playerX + player.width / 3, player.y + player.height / 5, player.width / 3, 2)

        // Body
        ctx.fillStyle = "#ff0000" // Red shirt
        ctx.fillRect(playerX, player.y + player.height / 4, player.width, player.height / 4)

        // Overalls
        ctx.fillStyle = "#ffffff" // White overalls
        ctx.fillRect(playerX, player.y + player.height / 2, player.width, player.height / 2 - 6)

        // Buttons
        ctx.fillStyle = "#ffff00" // Yellow buttons
        ctx.fillRect(playerX + player.width / 3, player.y + player.height / 2, 2, 2)
        ctx.fillRect(playerX + (player.width * 2) / 3, player.y + player.height / 2, 2, 2)

        // Legs - animate based on movement and frame
        if (player.velocityX !== 0) {
          if (player.frame % 2 === 0) {
            // Standing or first running frame
            ctx.fillStyle = "#ffffff" // White pants
            ctx.fillRect(playerX, player.y + (player.height * 3) / 4, player.width, player.height / 4 - 6)
          } else {
            // Running frame
            ctx.fillStyle = "#ffffff" // White pants
            ctx.fillRect(playerX + 2, player.y + (player.height * 3) / 4, player.width - 4, player.height / 4 - 6)
          }
        } else {
          // Standing still
          ctx.fillStyle = "#ffffff" // White pants
          ctx.fillRect(playerX, player.y + (player.height * 3) / 4, player.width, player.height / 4 - 6)
        }

        // Shoes
        ctx.fillStyle = "#663300" // Brown shoes
        ctx.fillRect(playerX, player.y + player.height - 6, player.width / 2, 6)
        ctx.fillRect(playerX + player.width / 2, player.y + player.height - 6, player.width / 2, 6)
      }

      // Reset opacity
      ctx.globalAlpha = 1.0

      // Draw HUD
      ctx.fillStyle = "#000000"
      ctx.font = "16px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`SCORE: ${scoreRef.current}`, 10, 20)
      ctx.fillText(`WORLD: ${worldRef.current}-${levelRef.current}`, 10, 40)
      ctx.fillText(`LIVES: ${livesRef.current}`, 10, 60)
      ctx.fillText(`${worldThemes[worldIndex].name} KINGDOM`, canvas.width - 150, 20)

      // Handle action button (shoot superball)
      if (keys.action && player.state === "flower" && projectilesRef.current.length < 2) {
        keys.action = false // Reset to prevent multiple shots

        const direction = player.direction === "right" ? 1 : -1

        projectilesRef.current.push({
          x: player.x + (direction === 1 ? player.width : 0),
          y: player.y + player.height / 4,
          width: 8,
          height: 8,
          velocityX: 6 * direction,
          velocityY: -2,
          bounces: 0,
        })

        // Play sound
        if (soundEnabledRef.current && coinSoundRef.current) {
          try {
            coinSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
          } catch (e) {
            console.log("Error playing sound")
          }
        }
      }

      // Jump if up key is pressed and player is on a platform
      if (keys.up && !player.isJumping && onPlatform) {
        player.velocityY = player.jumpStrength
        player.isJumping = true

        // Play jump sound
        if (soundEnabledRef.current && jumpSoundRef.current) {
          try {
            jumpSoundRef.current.play().catch((e) => console.log("Error playing sound: " + e.message))
          } catch (e) {
            console.log("Error playing sound")
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // Start game loop
    gameLoop()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause()
      }
    }
  }, [])

  // Handle game start/restart
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (showHomeScreenRef.current) {
      // Get click position
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if click is on a menu option
      if (x > canvas.width / 2 - 50 && x < canvas.width / 2 + 50) {
        // New Game option
        if (y > canvas.height / 2 - 15 && y < canvas.height / 2 + 15) {
          // Start new game
          worldRef.current = 1
          levelRef.current = 1
          scoreRef.current = 0
          livesRef.current = 3
          setWorld(1)
          setLevel(1)
          setScore(0)
          setLives(3)
          showHomeScreenRef.current = false
          setShowHomeScreen(false)
          gameStartedRef.current = true
          setGameStarted(true)

          // Start background music
          if (musicEnabledRef.current && backgroundMusicRef.current) {
            try {
              backgroundMusicRef.current.play().catch((e) => console.log("Error playing music: " + e.message))
            } catch (e) {
              console.log("Error playing music")
            }
          }

          return
        }

        // Continue option
        if (y > canvas.height / 2 + 25 && y < canvas.height / 2 + 55) {
          const savedState = localStorage.getItem("superMarioLandState")
          if (savedState) {
            // Load saved game
            const state = JSON.parse(savedState)
            worldRef.current = state.world
            levelRef.current = state.level
            scoreRef.current = state.score
            livesRef.current = state.lives
            setWorld(state.world)
            setLevel(state.level)
            setScore(state.score)
            setLives(state.lives)
            showHomeScreenRef.current = false
            setShowHomeScreen(false)
            gameStartedRef.current = true
            setGameStarted(true)

            // Start background music
            if (musicEnabledRef.current && backgroundMusicRef.current) {
              try {
                backgroundMusicRef.current.play().catch((e) => console.log("Error playing music: " + e.message))
              } catch (e) {
                console.log("Error playing music")
              }
            }
          }
          return
        }

        // Settings option
        if (y > canvas.height / 2 + 65 && y < canvas.height / 2 + 95) {
          setShowSettings(true)
          return
        }
      }

      return
    }

    if (showSettings) {
      // Get click position
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if click is on a settings option
      if (x > canvas.width / 2 - 100 && x < canvas.width / 2 + 100) {
        // Game Speed option
        if (y > canvas.height / 2 - 15 && y < canvas.height / 2 + 15) {
          // Cycle through game speeds: 0.5, 1.0, 1.5, 2.0
          const speeds = [0.5, 1.0, 1.5, 2.0]
          const currentIndex = speeds.indexOf(gameSpeedRef.current)
          const nextIndex = (currentIndex + 1) % speeds.length
          gameSpeedRef.current = speeds[nextIndex]
          setGameSpeed(gameSpeedRef.current)
          return
        }

        // Sound option
        if (y > canvas.height / 2 + 25 && y < canvas.height / 2 + 55) {
          // Toggle sound
          soundEnabledRef.current = !soundEnabledRef.current
          setSoundEnabled(soundEnabledRef.current)
          return
        }

        // Music option
        if (y > canvas.height / 2 + 65 && y < canvas.height / 2 + 95) {
          // Toggle music
          musicEnabledRef.current = !musicEnabledRef.current
          setMusicEnabled(musicEnabledRef.current)

          // Start or stop background music
          if (musicEnabledRef.current && backgroundMusicRef.current) {
            try {
              backgroundMusicRef.current.play().catch((e) => console.log("Error playing music: " + e.message))
            } catch (e) {
              console.log("Error playing music")
            }
          } else if (backgroundMusicRef.current) {
            backgroundMusicRef.current.pause()
          }
          return
        }

        // Back option
        if (y > canvas.height / 2 + 105 && y < canvas.height / 2 + 135) {
          setShowSettings(false)
          return
        }
      }

      return
    }

    if (!gameStarted || gameOver) {
      // Reset game state
      worldRef.current = 1
      levelRef.current = 1
      scoreRef.current = 0
      livesRef.current = 3
      setWorld(1)
      setLevel(1)
      setScore(0)
      setLives(3)
      gameOverRef.current = false
      setGameOver(false)
      gameStartedRef.current = true
      setGameStarted(true)
      showHomeScreenRef.current = false
      setShowHomeScreen(false)

      const canvas = canvasRef.current
      if (canvas) {
        // Initialize level
        const platforms = []
        const groundHeight = 32

        // Ground platform
        for (let x = 0; x < 2000; x += 64) {
          platforms.push({
            x: x,
            y: canvas.height - groundHeight,
            width: 64,
            height: groundHeight,
            type: "ground",
          })
        }

        // Add some gaps in the ground
        const gapPositions = [500, 900, 1400]
        gapPositions.forEach((pos) => {
          // Make the first gap smaller
          const gapWidth = pos === 500 ? 64 : 128
          // Remove a few ground blocks to create a gap
          platforms.forEach((platform, index) => {
            if (platform.type === "ground" && platform.x >= pos && platform.x < pos + gapWidth) {
              platforms[index] = { ...platform, type: "removed" }
            }
          })
        })

        // Add floating platforms
        const platformPositions = [
          { x: 300, y: canvas.height - 100, width: 128 },
          { x: 450, y: canvas.height - 150, width: 64 },
          { x: 600, y: canvas.height - 100, width: 64 },
          { x: 750, y: canvas.height - 150, width: 128 },
          { x: 1000, y: canvas.height - 120, width: 128 },
          { x: 1200, y: canvas.height - 180, width: 96 },
          { x: 1350, y: canvas.height - 120, width: 64 },
          { x: 1500, y: canvas.height - 150, width: 128 },
        ]

        platformPositions.forEach((pos) => {
          platforms.push({
            x: pos.x,
            y: pos.y,
            width: pos.width,
            height: 16,
            type: "platform",
          })
        })

        // Add blocks with items
        const itemBlockPositions = [
          { x: 200, y: canvas.height - 150, item: "coin" },
          { x: 350, y: canvas.height - 150, item: "mushroom" },
          { x: 550, y: canvas.height - 200, item: "coin" },
          { x: 700, y: canvas.height - 200, item: "flower" },
          { x: 850, y: canvas.height - 150, item: "coin" },
          { x: 1000, y: canvas.height - 200, item: "coin" },
          { x: 1150, y: canvas.height - 150, item: "mushroom" },
          { x: 1300, y: canvas.height - 200, item: "coin" },
          { x: 1400, y: canvas.height - 150, item: "star" },
        ]

        itemBlockPositions.forEach((pos) => {
          platforms.push({
            x: pos.x,
            y: pos.y,
            width: 32,
            height: 32,
            type: "itemBlock",
            item: pos.item,
          })
        })

        // Filter out removed platforms
        platformsRef.current = platforms.filter((p) => p.type !== "removed")

        // Create enemies
        const enemies = []

        // Add Goombos
        const goomboPositions = [250, 400, 650, 850, 1050, 1250, 1450, 1650]
        goomboPositions.forEach((x) => {
          enemies.push({
            x: x,
            y: canvas.height - groundHeight - 24,
            width: 16,
            height: 16,
            type: "goombo",
            direction: Math.random() > 0.5 ? "left" : "right",
            speed: 0.8 + Math.random() * 0.3,
            alive: true,
            frame: 0,
            frameCount: 0,
          })
        })

        // Add Piranha Plants
        const piranhaPositions = [500, 900, 1400]
        piranhaPositions.forEach((x) => {
          enemies.push({
            x: x,
            y: canvas.height - groundHeight - 32,
            width: 16,
            height: 32,
            type: "piranha",
            direction: "up",
            speed: 0.5 + Math.random() * 0.3,
            alive: true,
          })
        })

        // Add Tamao (rolling boulders)
        const tamaoPositions = [800, 1200, 1600]
        tamaoPositions.forEach((x) => {
          enemies.push({
            x: x,
            y: canvas.height - groundHeight - 24,
            width: 24,
            height: 24,
            type: "tamao",
            direction: Math.random() > 0.5 ? "left" : "right",
            speed: 1.2 + Math.random() * 0.3,
            alive: true,
          })
        })

        enemiesRef.current = enemies

        // Create items (end doors)
        itemsRef.current = []

        // Add end doors
        itemsRef.current.push({
          x: 1900,
          y: canvas.height - groundHeight - 64,
          width: 32,
          height: 64,
          type: "doorHigh",
          collected: false,
        })

        itemsRef.current.push({
          x: 1850,
          y: canvas.height - groundHeight - 64,
          width: 32,
          height: 64,
          type: "doorLow",
          collected: false,
        })

        // Reset player position
        playerRef.current.x = 50
        playerRef.current.y = 0
        playerRef.current.velocityX = 0
        playerRef.current.velocityY = 0
        playerRef.current.state = "small"
        playerRef.current.height = 24
        playerRef.current.invincible = false

        // Reset projectiles
        projectilesRef.current = []

        // Set world width
        worldWidthRef.current = 2000

        // Reset camera
        cameraXRef.current = 0

        // Start background music
        if (musicEnabledRef.current && backgroundMusicRef.current) {
          try {
            backgroundMusicRef.current.play().catch((e) => console.log("Error playing music: " + e.message))
          } catch (e) {
            console.log("Error playing music")
          }
        }
      }
    }
  }

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = true
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = true
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") keysRef.current.up = true
      if (e.code === "KeyZ" || e.code === "KeyX") keysRef.current.action = true
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") keysRef.current.sprint = true

      // Start game with any key
      if (showHomeScreenRef.current) {
        showHomeScreenRef.current = false
        setShowHomeScreen(false)
        return
      }

      // Exit settings with Escape
      if (showSettings && e.code === "Escape") {
        setShowSettings(false)
        return
      }

      // Start game with any key
      if (!gameStartedRef.current) {
        handleCanvasClick({} as React.MouseEvent<HTMLCanvasElement>)
      }

      // Toggle home screen with Escape
      if (e.code === "Escape" && !showSettings) {
        showHomeScreenRef.current = !showHomeScreenRef.current
        setShowHomeScreen(!showHomeScreen)

        // Pause background music when showing home screen
        if (showHomeScreenRef.current && backgroundMusicRef.current) {
          backgroundMusicRef.current.pause()
        } else if (musicEnabledRef.current && backgroundMusicRef.current) {
          try {
            backgroundMusicRef.current.play().catch((e) => console.log("Error playing music: " + e.message))
          } catch (e) {
            console.log("Error playing music")
          }
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft" || e.code === "KeyA") keysRef.current.left = false
      if (e.code === "ArrowRight" || e.code === "KeyD") keysRef.current.right = false
      if (e.code === "ArrowUp" || e.code === "KeyW" || e.code === "Space") keysRef.current.up = false
      if (e.code === "KeyZ" || e.code === "KeyX") keysRef.current.action = false
      if (e.code === "ShiftLeft" || e.code === "ShiftRight") keysRef.current.sprint = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [gameStarted, gameOver, showHomeScreen, showSettings])

  return (
    <div className="w-full h-full flex flex-col">
      <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full cursor-pointer" />
    </div>
  )
}

// Runner Game (Geometry Dash inspired)
function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Game state refs
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const scoreRef = useRef(0)

  // Game objects
  const playerRef = useRef({
    x: 50,
    y: 0,
    width: 30,
    height: 30,
    velocityY: 0,
    gravity: 0.8,
    jumpStrength: -12,
    isJumping: false,
  })

  const obstaclesRef = useRef<{ x: number; y: number; width: number; height: number }[]>([])
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const groundYRef = useRef(0)
  const speedRef = useRef(5)

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      groundYRef.current = canvas.height - 50
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Game loop
    const gameLoop = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw ground
      ctx.fillStyle = "#8abf64"
      ctx.fillRect(0, groundYRef.current, canvas.width, canvas.height - groundYRef.current)

      if (!gameStartedRef.current) {
        // Draw start screen
        ctx.fillStyle = "#000"
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Click or press Space to start", canvas.width / 2, canvas.height / 2)

        // Draw player
        const player = playerRef.current
        player.y = groundYRef.current - player.height
        ctx.fillStyle = "#5e81ac"
        ctx.fillRect(player.x, player.y, player.width, player.height)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      if (gameOverRef.current) {
        // Draw game over screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20)
        ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 20)
        ctx.font = "16px Arial"
        ctx.fillText("Click or press Space to restart", canvas.width / 2, canvas.height / 2 + 60)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      // Update player
      const player = playerRef.current

      // Apply gravity
      player.velocityY += player.gravity
      player.y += player.velocityY

      // Check ground collision
      if (player.y + player.height > groundYRef.current) {
        player.y = groundYRef.current - player.height
        player.velocityY = 0
        player.isJumping = false
      }

      // Draw player
      ctx.fillStyle = "#5e81ac"
      ctx.fillRect(player.x, player.y, player.width, player.height)

      // Update and draw obstacles
      const obstacles = obstaclesRef.current
      for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i]
        obstacle.x -= speedRef.current

        // Draw obstacle
        ctx.fillStyle = "#bf616a"
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)

        // Check collision
        if (
          player.x + player.width > obstacle.x &&
          player.x < obstacle.x + obstacle.width &&
          player.y + player.height > obstacle.y &&
          player.y < obstacle.y + obstacle.height
        ) {
          gameOverRef.current = true
          setGameOver(true)
          if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
        }

        // Increase score when passing obstacle
        if (obstacle.x + obstacle.width < player.x && !obstacle.passed) {
          obstacle.passed = true
          scoreRef.current += 1
          setScore(scoreRef.current)

          // Increase speed every 5 points
          if (scoreRef.current % 5 === 0) {
            speedRef.current += 0.5
          }
        }
      }

      // Remove off-screen obstacles
      obstaclesRef.current = obstacles.filter((obstacle) => obstacle.x > -obstacle.width)

      // Draw score
      ctx.fillStyle = "#000"
      ctx.font = "24px Arial"
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${scoreRef.current}`, 10, 30)

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // Start game loop
    gameLoop()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  // Handle game start/restart
  const handleCanvasClick = () => {
    if (!gameStarted || gameOver) {
      // Reset game state
      playerRef.current.y = 0
      playerRef.current.velocityY = 0
      obstaclesRef.current = []
      scoreRef.current = 0
      setScore(0)
      speedRef.current = 5
      gameOverRef.current = false
      setGameOver(false)
      gameStartedRef.current = true
      setGameStarted(true)

      // Start spawning obstacles
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current)
      spawnIntervalRef.current = setInterval(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Create obstacle
        const height = 30 + Math.random() * 50
        obstaclesRef.current.push({
          x: canvas.width,
          y: groundYRef.current - height,
          width: 30,
          height: height,
          passed: false,
        })

        // Sometimes add a floating obstacle
        if (Math.random() > 0.7) {
          const floatingHeight = 20 + Math.random() * 20
          obstaclesRef.current.push({
            x: canvas.width + 50,
            y: groundYRef.current - 100 - Math.random() * 50,
            width: 30,
            height: floatingHeight,
            passed: false,
          })
        }
      }, 1500)
    } else if (!playerRef.current.isJumping) {
      // Jump
      playerRef.current.velocityY = playerRef.current.jumpStrength
      playerRef.current.isJumping = true
    }
  }

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        handleCanvasClick()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameStarted, gameOver])

  return (
    <div className="w-full h-full flex flex-col">
      <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full cursor-pointer" />
    </div>
  )
}

// Snake Game
function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Game state refs
  const gameStartedRef = useRef(false)
  const gameOverRef = useRef(false)
  const scoreRef = useRef(0)

  // Game objects
  const snakeRef = useRef<{ x: number; y: number }[]>([])
  const foodRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const directionRef = useRef<string>("right")
  const gridSizeRef = useRef(20)
  const speedRef = useRef(150)
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Define updateGame outside of useEffect to avoid dependency issues
  function updateGame() {
    const canvas = canvasRef.current
    if (!canvas) return

    if (gameOverRef.current || !gameStartedRef.current) return

    const snake = snakeRef.current
    const food = foodRef.current

    // Move snake
    const head = { ...snake[0] }
    const direction = directionRef.current

    if (direction === "right") head.x += 1
    if (direction === "left") head.x -= 1
    if (direction === "up") head.y -= 1
    if (direction === "down") head.y += 1

    // Check boundaries
    const gridWidth = Math.floor(canvas.width / gridSizeRef.current)
    const gridHeight = Math.floor(canvas.height / gridSizeRef.current)

    if (head.x < 0 || head.y < 0 || head.x >= gridWidth || head.y >= gridHeight) {
      gameOverRef.current = true
      setGameOver(true)
      return
    }

    // Check self collision
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        gameOverRef.current = true
        setGameOver(true)
        return
      }
    }

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
      // Generate new food
      let newFood
      do {
        newFood = {
          x: Math.floor(Math.random() * gridWidth),
          y: Math.floor(Math.random() * gridHeight),
        }
        // Make sure food doesn't spawn on snake
        var foodOnSnake = false
        for (let i = 0; i < snake.length; i++) {
          if (snake[i].x === newFood.x && snake[i].y === newFood.y) {
            foodOnSnake = true
            break
          }
        }
      } while (foodOnSnake)

      foodRef.current = newFood

      // Increase score
      scoreRef.current += 1
      setScore(scoreRef.current)

      // Don't remove tail when eating food
    } else {
      // Remove tail
      snake.pop()
    }

    // Add new head
    snake.unshift(head)
  }

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      // Adjust grid size based on canvas dimensions
      const minDimension = Math.min(canvas.width, canvas.height)
      gridSizeRef.current = Math.floor(minDimension / 15)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initial draw
    drawGame()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current)
    }
  }, [])

  // Handle game start/restart
  const handleCanvasClick = () => {
    if (!gameStarted || gameOver) {
      // Reset game state
      const canvas = canvasRef.current
      if (!canvas) return

      const gridWidth = Math.floor(canvas.width / gridSizeRef.current)
      const gridHeight = Math.floor(canvas.height / gridSizeRef.current)

      // Initialize snake
      snakeRef.current = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 },
      ]

      // Initialize food
      foodRef.current = {
        x: Math.floor(Math.random() * gridWidth),
        y: Math.floor(Math.random() * gridHeight),
      }

      // Reset direction
      directionRef.current = "right"

      // Reset score
      scoreRef.current = 0
      setScore(0)

      // Reset game state
      gameOverRef.current = false
      setGameOver(false)
      gameStartedRef.current = true
      setGameStarted(true)

      // Start game interval
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current)
      gameIntervalRef.current = setInterval(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update and draw game
        updateGame()
        drawGame()
      }, speedRef.current) // Check every minute
    }
  }

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Start game with any arrow key
      if (
        !gameStartedRef.current &&
        (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight")
      ) {
        handleCanvasClick()
      }

      // Change direction
      const direction = directionRef.current

      if (e.code === "ArrowUp" && direction !== "down") {
        directionRef.current = "up"
      } else if (e.code === "ArrowDown" && direction !== "up") {
        directionRef.current = "down"
      } else if (e.code === "ArrowLeft" && direction !== "right") {
        directionRef.current = "left"
      } else if (e.code === "ArrowRight" && direction !== "left") {
        directionRef.current = "right"
      }

      // Restart game
      if (
        gameOverRef.current &&
        (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "ArrowLeft" || e.code === "ArrowRight")
      ) {
        handleCanvasClick()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameStarted, gameOver])

  function drawGame() {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!gameStartedRef.current) {
      // Draw start screen
      ctx.fillStyle = "#000"
      ctx.font = "20px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Click or press any arrow key to start", canvas.width / 2, canvas.height / 2)
      return
    }

    if (gameOverRef.current) {
      // Draw game over screen
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#fff"
      ctx.font = "24px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2 - 20)
      ctx.fillText(`Score: ${scoreRef.current}`, canvas.width / 2, canvas.height / 2 + 20)
      ctx.font = "16px Arial"
      ctx.fillText("Click or press any arrow key to restart", canvas.width / 2, canvas.height / 2 + 60)
      return
    }

    // Draw snake
    const snake = snakeRef.current
    ctx.fillStyle = "#5e81ac"
    snake.forEach((segment) => {
      ctx.fillRect(
        segment.x * gridSizeRef.current,
        segment.y * gridSizeRef.current,
        gridSizeRef.current - 2,
        gridSizeRef.current - 2,
      )
    })

    // Draw food
    const food = foodRef.current
    ctx.fillStyle = "#bf616a"
    ctx.beginPath()
    ctx.arc(
      food.x * gridSizeRef.current + gridSizeRef.current / 2,
      food.y * gridSizeRef.current + gridSizeRef.current / 2,
      gridSizeRef.current / 2 - 2,
      0,
      Math.PI * 2,
    )
    ctx.fill()

    // Draw score
    ctx.fillStyle = "#000"
    ctx.font = "24px Arial"
    ctx.textAlign = "left"
    ctx.fillText(`Score: ${scoreRef.current}`, 10, 30)
  }

  return (
    <div className="w-full h-full flex flex-col">
      <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full cursor-pointer" />
    </div>
  )
}

// Tic Tac Toe Game
function TicTacToeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  // Game state
  const boardRef = useRef<Array<string | null>>(Array(9).fill(null))
  const currentPlayerRef = useRef<string>("X")
  const animationFrameRef = useRef<number | null>(null)

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Game loop
    const gameLoop = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cellSize = Math.min(canvas.width, canvas.height) / 3

      if (!gameStarted) {
        // Draw start screen
        ctx.fillStyle = "#000"
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Click to start Tic Tac Toe", canvas.width / 2, canvas.height / 2)
        ctx.font = "16px Arial"
        ctx.fillText("You play as X against the computer (O)", canvas.width / 2, canvas.height / 2 + 30)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      // Draw grid
      ctx.strokeStyle = "#000"
      ctx.lineWidth = 2

      // Vertical lines
      ctx.beginPath()
      ctx.moveTo(cellSize, 0)
      ctx.lineTo(cellSize, canvas.height)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(cellSize * 2, 0)
      ctx.lineTo(cellSize * 2, canvas.height)
      ctx.stroke()

      // Horizontal lines
      ctx.beginPath()
      ctx.moveTo(0, cellSize)
      ctx.lineTo(canvas.width, cellSize)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, cellSize * 2)
      ctx.lineTo(canvas.width, cellSize * 2)
      ctx.stroke()

      // Draw X's and O's
      const board = boardRef.current
      ctx.font = `${cellSize * 0.6}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3)
        const col = i % 3
        const x = col * cellSize + cellSize / 2
        const y = row * cellSize + cellSize / 2

        if (board[i] === "X") {
          ctx.fillStyle = "#5e81ac"
          ctx.fillText("X", x, y)
        } else if (board[i] === "O") {
          ctx.fillStyle = "#bf616a"
          ctx.fillText("O", x, y)
        }
      }

      // Draw game over message
      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"

        if (winner) {
          ctx.fillText(`${winner} wins!`, canvas.width / 2, canvas.height / 2 - 20)
        } else {
          ctx.fillText("It's a draw!", canvas.width / 2, canvas.height / 2 - 20)
        }

        ctx.font = "16px Arial"
        ctx.fillText("Click to play again", canvas.width / 2, canvas.height / 2 + 20)
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // Start game loop
    gameLoop()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [gameStarted, gameOver, winner])

  // Check for winner
  const checkWinner = (board: Array<string | null>): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]
      }
    }

    return null
  }

  // Check if board is full
  const isBoardFull = (board: Array<string | null>): boolean => {
    return board.every((cell) => cell !== null)
  }

  // AI move (simple)
  const makeAIMove = () => {
    const board = [...boardRef.current]

    // Try to win
    const winMove = findWinningMove(board, "O")
    if (winMove !== -1) {
      board[winMove] = "O"
      boardRef.current = board
      return
    }

    // Try to block
    const blockMove = findWinningMove(board, "X")
    if (blockMove !== -1) {
      board[blockMove] = "O"
      boardRef.current = board
      return
    }

    // Take center if available
    if (board[4] === null) {
      board[4] = "O"
      boardRef.current = board
      return
    }

    // Take a random available cell
    const emptyCells = board.map((cell, index) => (cell === null ? index : -1)).filter((index) => index !== -1)
    if (emptyCells.length > 0) {
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      board[randomIndex] = "O"
      boardRef.current = board
    }
  }

  // Find winning move for a player
  const findWinningMove = (board: Array<string | null>, player: string): number => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ]

    for (const [a, b, c] of lines) {
      // Check if two cells have the player's mark and the third is empty
      if (board[a] === player && board[b] === player && board[c] === null) return c
      if (board[a] === player && board[c] === player && board[b] === null) return b
      if (board[b] === player && board[c] === player && board[a] === null) return a
    }

    return -1
  }

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!gameStarted) {
      // Start new game
      boardRef.current = Array(9).fill(null)
      currentPlayerRef.current = "X"
      setGameStarted(true)
      setGameOver(false)
      setWinner(null)
      return
    }

    if (gameOver) {
      // Restart game
      boardRef.current = Array(9).fill(null)
      currentPlayerRef.current = "X"
      setGameOver(false)
      setWinner(null)
      return
    }

    // Get click position
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const cellSize = Math.min(canvas.width, canvas.height) / 3
    const col = Math.floor(x / cellSize)
    const row = Math.floor(y / cellSize)
    const index = row * 3 + col

    // Make player move
    const board = [...boardRef.current]
    if (board[index] === null && currentPlayerRef.current === "X") {
      board[index] = "X"
      boardRef.current = board

      // Check for winner or draw
      const winner = checkWinner(board)
      if (winner) {
        setGameOver(true)
        setWinner(winner)
        return
      }

      if (isBoardFull(board)) {
        setGameOver(true)
        return
      }

      // AI's turn
      currentPlayerRef.current = "O"
      setTimeout(() => {
        makeAIMove()

        // Check for winner or draw after AI move
        const updatedBoard = boardRef.current
        const winner = checkWinner(updatedBoard)
        if (winner) {
          setGameOver(true)
          setWinner(winner)
          return
        }

        if (isBoardFull(updatedBoard)) {
          setGameOver(true)
          return
        }

        currentPlayerRef.current = "X"
      }, 500)
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <canvas ref={canvasRef} onClick={handleCanvasClick} className="w-full h-full cursor-pointer" />
    </div>
  )
}

// Minesweeper Game
function MinesweeperGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)

  // Game state
  const boardRef = useRef<
    Array<{
      isMine: boolean
      isRevealed: boolean
      isFlagged: boolean
      adjacentMines: number
    }>
  >([])

  const gridSizeRef = useRef({ rows: 10, cols: 10 })
  const mineCountRef = useRef(15)
  const cellSizeRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      // Adjust cell size based on canvas dimensions
      const minDimension = Math.min(canvas.width, canvas.height)
      const { rows, cols } = gridSizeRef.current
      cellSizeRef.current = Math.floor(minDimension / Math.max(rows, cols))
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize board if not already
    if (boardRef.current.length === 0) {
      initializeBoard()
    }

    // Game loop
    const gameLoop = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (!gameStarted) {
        // Draw start screen
        ctx.fillStyle = "#000"
        ctx.font = "20px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Click to start Minesweeper", canvas.width / 2, canvas.height / 2)
        ctx.font = "16px Arial"
        ctx.fillText("Left click to reveal, right click to flag", canvas.width / 2, canvas.height / 2 + 30)

        animationFrameRef.current = requestAnimationFrame(gameLoop)
        return
      }

      // Draw board
      const { rows, cols } = gridSizeRef.current
      const cellSize = cellSizeRef.current
      const board = boardRef.current

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = row * cols + col
          const cell = board[index]
          const x = col * cellSize
          const y = row * cellSize

          // Draw cell background
          if (cell.isRevealed) {
            ctx.fillStyle = "#e5e9f0"
          } else {
            ctx.fillStyle = "#d8dee9"
          }
          ctx.fillRect(x, y, cellSize, cellSize)

          // Draw cell border
          ctx.strokeStyle = "#4c566a"
          ctx.lineWidth = 1
          ctx.strokeRect(x, y, cellSize, cellSize)

          if (cell.isRevealed) {
            if (cell.isMine) {
              // Draw mine
              ctx.fillStyle = "#bf616a"
              ctx.beginPath()
              ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 3, 0, Math.PI * 2)
              ctx.fill()
            } else if (cell.adjacentMines > 0) {
              // Draw number
              ctx.font = `${cellSize * 0.6}px Arial`
              ctx.textAlign = "center"
              ctx.textBaseline = "middle"

              // Color based on number
              switch (cell.adjacentMines) {
                case 1:
                  ctx.fillStyle = "#5e81ac"
                  break
                case 2:
                  ctx.fillStyle = "#a3be8c"
                  break
                case 3:
                  ctx.fillStyle = "#bf616a"
                  break
                case 4:
                  ctx.fillStyle = "#b48ead"
                  break
                default:
                  ctx.fillStyle = "#d08770"
                  break
              }

              ctx.fillText(cell.adjacentMines.toString(), x + cellSize / 2, y + cellSize / 2)
            }
          } else if (cell.isFlagged) {
            // Draw flag
            ctx.fillStyle = "#bf616a"
            ctx.beginPath()
            ctx.moveTo(x + cellSize / 4, y + cellSize / 4)
            ctx.lineTo(x + (cellSize * 3) / 4, y + cellSize / 3)
            ctx.lineTo(x + cellSize / 4, y + cellSize / 2)
            ctx.closePath()
            ctx.fill()

            // Flag pole
            ctx.strokeStyle = "#2e3440"
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(x + cellSize / 4, y + cellSize / 4)
            ctx.lineTo(x + cellSize / 4, y + (cellSize * 3) / 4)
            ctx.stroke()
          }
        }
      }

      // Draw game over message
      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = "#fff"
        ctx.font = "24px Arial"
        ctx.textAlign = "center"

        if (win) {
          ctx.fillText("You Win!", canvas.width / 2, canvas.height / 2 - 20)
        } else {
          ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20)
        }

        ctx.font = "16px Arial"
        ctx.fillText("Click to play again", canvas.width / 2, canvas.height / 2 + 20)
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // Start game loop
    gameLoop()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [gameStarted, gameOver, win])

  // Initialize board
  const initializeBoard = () => {
    const { rows, cols } = gridSizeRef.current
    const mineCount = mineCountRef.current
    const totalCells = rows * cols

    // Create empty board
    const board = Array(totalCells)
      .fill(null)
      .map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      }))

    // Place mines randomly
    let minesPlaced = 0
    while (minesPlaced < mineCount) {
      const index = Math.floor(Math.random() * totalCells)
      if (!board[index].isMine) {
        board[index].isMine = true
        minesPlaced++
      }
    }

    // Calculate adjacent mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = row * cols + col
        if (board[index].isMine) continue

        let count = 0
        // Check all 8 adjacent cells
        for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
          for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
            if (r === row && c === col) continue
            const adjIndex = r * cols + c
            if (board[adjIndex].isMine) count++
          }
        }

        board[index].adjacentMines = count
      }
    }

    boardRef.current = board
  }

  // Reveal cell and adjacent cells if empty
  const revealCell = (row: number, col: number) => {
    const { rows, cols } = gridSizeRef.current
    const board = boardRef.current
    const index = row * cols + col

    // Skip if already revealed or flagged
    if (board[index].isRevealed || board[index].isFlagged) return

    // Reveal current cell
    board[index].isRevealed = true

    // If it's a mine, game over
    if (board[index].isMine) {
      // Reveal all mines
      board.forEach((cell) => {
        if (cell.isMine) cell.isRevealed = true
      })
      setGameOver(true)
      return
    }

    // Check if all non-mine cells are revealed (win condition)
    const nonMineCells = board.filter((cell) => !cell.isMine)
    const revealedNonMineCells = nonMineCells.filter((cell) => cell.isRevealed)

    if (revealedNonMineCells.length === nonMineCells.length) {
      setGameOver(true)
      setWin(true)
      return
    }

    // If it has adjacent mines, stop here
    if (board[index].adjacentMines > 0) return

    // Otherwise, reveal adjacent cells
    for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
        if (r === row && c === col) continue
        revealCell(r, c)
      }
    }
  }

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get click position
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const cellSize = cellSizeRef.current
    const col = Math.floor(x / cellSize)
    const row = Math.floor(y / cellSize)

    // Handle left click (reveal)
    if (e.button === 0) {
      if (!gameStarted) {
        // Start new game
        initializeBoard()
        setGameStarted(true)
        setGameOver(false)
        setWin(false)
      }

      revealCell(row, col)
    }
  }

  // Handle context menu (right click)
  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()

    const canvas = canvasRef.current
    if (!canvas) return

    // Get click position
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const cellSize = cellSizeRef.current
    const col = Math.floor(x / cellSize)
    const row = Math.floor(y / cellSize)

    const { rows, cols } = gridSizeRef.current
    const board = boardRef.current
    const index = row * cols + col

    // Toggle flag
    if (!board[index].isRevealed) {
      board[index].isFlagged = !board[index].isFlagged
    }
  }

  // Handle game restart
  const handleRestart = () => {
    setGameStarted(false)
    setGameOver(false)
    setWin(false)
    initializeBoard()
  }

  return (
    <div className="w-full h-full flex flex-col">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onContextMenu={handleContextMenu}
        className="w-full h-full cursor-pointer"
      />
      {gameOver && (
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRestart}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

// Super Mario 64 Game
function SuperMario64Game() {
  return (
    <div>
      <p>Super Mario 64 Game</p>
    </div>
  )
}
