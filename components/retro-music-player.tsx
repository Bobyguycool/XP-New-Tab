"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Define the retro game music tracks
const retroTracks = [
  { id: "mario", title: "Super Mario Bros Theme", artist: "Nintendo", file: "/mario.mp3" },
  { id: "mario2", title: "Super Mario Bros Underground", artist: "Nintendo", file: "/mario2.mp3" },
  { id: "mario3", title: "Super Mario Bros Star", artist: "Nintendo", file: "/mario3.mp3" },
  { id: "mario4", title: "Super Mario Bros Castle", artist: "Nintendo", file: "/mario4.mp3" },
  { id: "doom", title: "Doom Theme", artist: "id Software", file: "/doom.mp3" },
  { id: "wii", title: "Wii Shop Channel", artist: "Nintendo", file: "/wii.mp3" },
  { id: "wii2", title: "Mii Channel", artist: "Nintendo", file: "/wii2.mp3" },
  { id: "greenhillzone", title: "Green Hill Zone", artist: "SEGA", file: "/greenhillzone.mp3" },
  { id: "oggreenhillzone", title: "Green Hill Zone (8-bit)", artist: "SEGA", file: "/oggreenhillzone.mp3" },
  { id: "sports", title: "Wii Sports Theme", artist: "Nintendo", file: "/sports.mp3" },
]

export default function RetroMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useLocalStorage("retro-music-current-track", 0)
  const [volume, setVolume] = useLocalStorage("retro-music-volume", 50)
  const [isMuted, setIsMuted] = useLocalStorage("retro-music-muted", false)
  const [autoplay, setAutoplay] = useLocalStorage("retro-music-autoplay", false)
  const [repeat, setRepeat] = useLocalStorage("retro-music-repeat", false)
  const [shuffle, setShuffle] = useLocalStorage("retro-music-shuffle", false)
  const [showPlayer, setShowPlayer] = useLocalStorage("retro-music-show-player", true)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)

  // Initialize audio
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Create audio element
        audioRef.current = new Audio()

        // Set initial source
        audioRef.current.src = retroTracks[currentTrackIndex].file
        audioRef.current.volume = isMuted ? 0 : volume / 100
        audioRef.current.load()

        const handleLoadedMetadata = () => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration)
            setError(null)
          }
        }

        const handleError = (e: Event) => {
          console.error("Audio error:", e)
          setError("Failed to load audio file. Please try another track.")
        }

        audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)
        audioRef.current.addEventListener("error", handleError)

        // Auto-play if enabled
        if (autoplay) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true)
              animationRef.current = requestAnimationFrame(updateProgress)
            })
            .catch((e) => {
              console.error("Auto-play prevented:", e)
              setError("Auto-play was prevented by your browser. Please click play to start.")
            })
        }

        return () => {
          if (audioRef.current) {
            audioRef.current.pause()
            audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata)
            audioRef.current.removeEventListener("error", handleError)
          }
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
          }
        }
      } catch (e) {
        console.error("Error initializing audio:", e)
        setError("Failed to initialize audio player.")
      }
    }
  }, [])

  // Update audio when track changes
  useEffect(() => {
    if (audioRef.current) {
      try {
        // Stop current playback
        const wasPlaying = !audioRef.current.paused
        audioRef.current.pause()

        // Update source
        audioRef.current.src = retroTracks[currentTrackIndex].file
        audioRef.current.load()

        // Resume playback if it was playing
        if (wasPlaying) {
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true)
              animationRef.current = requestAnimationFrame(updateProgress)
            })
            .catch((e) => {
              console.error("Play prevented:", e)
              setIsPlaying(false)
              setError("Playback was prevented. Please click play to start.")
            })
        }
      } catch (e) {
        console.error("Error changing track:", e)
        setError("Failed to change track.")
      }
    }
  }, [currentTrackIndex])

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  // Handle track ending
  useEffect(() => {
    const handleEnded = () => {
      if (repeat) {
        // Repeat the same track
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current
            .play()
            .then(() => {
              setIsPlaying(true)
            })
            .catch((e) => {
              console.error("Play prevented:", e)
              setIsPlaying(false)
            })
        }
      } else if (shuffle) {
        // Play a random track
        const randomIndex = Math.floor(Math.random() * retroTracks.length)
        setCurrentTrackIndex(randomIndex)
      } else {
        // Play next track
        nextTrack()
      }
    }

    if (audioRef.current) {
      audioRef.current.addEventListener("ended", handleEnded)
      return () => {
        audioRef.current?.removeEventListener("ended", handleEnded)
      }
    }
  }, [repeat, shuffle])

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime)
      animationRef.current = requestAnimationFrame(updateProgress)
    }
  }

  const togglePlayPause = () => {
    if (!audioRef.current) return

    try {
      if (isPlaying) {
        audioRef.current.pause()
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
        setIsPlaying(false)
      } else {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true)
            animationRef.current = requestAnimationFrame(updateProgress)
          })
          .catch((e) => {
            console.error("Play prevented:", e)
            setError("Playback was prevented. Please try again.")
          })
      }
    } catch (e) {
      console.error("Error toggling playback:", e)
      setError("Failed to control playback.")
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      try {
        audioRef.current.currentTime = value[0]
        setProgress(value[0])
      } catch (e) {
        console.error("Error seeking:", e)
      }
    }
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0])
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100
    }
    if (value[0] === 0) {
      setIsMuted(true)
    } else {
      setIsMuted(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (audioRef.current) {
      audioRef.current.volume = !isMuted ? 0 : volume / 100
    }
  }

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => {
      const newIndex = prev === 0 ? retroTracks.length - 1 : prev - 1
      return newIndex
    })
  }

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => {
      const newIndex = prev === retroTracks.length - 1 ? 0 : prev + 1
      return newIndex
    })
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const currentTrack = retroTracks[currentTrackIndex]

  if (!showPlayer) return null

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Music Player
        </CardTitle>
        <div className="flex items-center gap-2">
          <Label htmlFor="show-player" className="sr-only">
            Show Player
          </Label>
          <Switch id="show-player" checked={showPlayer} onCheckedChange={setShowPlayer} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 p-2 rounded-md text-sm mb-2">
            {error}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-md flex items-center justify-center text-2xl font-bold">
            {currentTrack.title.charAt(0)}
          </div>
          <div>
            <h3 className="font-medium">{currentTrack.title}</h3>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider value={[progress]} max={duration || 100} step={0.1} onValueChange={handleProgressChange} />
        </div>

        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShuffle(!shuffle)}
            className={shuffle ? "bg-primary/20" : ""}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={prevTrack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={nextTrack}>
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setRepeat(!repeat)}
            className={repeat ? "bg-primary/20" : ""}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider value={[volume]} max={100} onValueChange={handleVolumeChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="track-select">Select Track</Label>
          <Select
            value={currentTrackIndex.toString()}
            onValueChange={(value) => setCurrentTrackIndex(Number.parseInt(value))}
          >
            <SelectTrigger id="track-select">
              <SelectValue placeholder="Select a track" />
            </SelectTrigger>
            <SelectContent>
              {retroTracks.map((track, index) => (
                <SelectItem key={track.id} value={index.toString()}>
                  {track.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Switch id="autoplay" checked={autoplay} onCheckedChange={setAutoplay} />
            <Label htmlFor="autoplay">Autoplay</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
