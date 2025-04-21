"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Song {
  title: string
  artist: string
  url: string
  cover: string
}

export default function MusicPlayerGadget() {
  const [songs, setSongs] = useLocalStorage<Song[]>("musicPlayerSongs", [
    {
      title: "Lofi Study",
      artist: "Chillhop Music",
      url: "https://stream.chillhop.com/stream/30.mp3",
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Jazz Vibes",
      artist: "Smooth Jazz",
      url: "https://stream.chillhop.com/stream/27.mp3",
      cover: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Nature Sounds",
      artist: "Ambient",
      url: "https://stream.chillhop.com/stream/9.mp3",
      cover: "/placeholder.svg?height=80&width=80",
    },
  ])

  const [currentSongIndex, setCurrentSongIndex] = useLocalStorage<number>("musicPlayerCurrentSong", 0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useLocalStorage<number>("musicPlayerVolume", 50)
  const [isMuted, setIsMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(songs[currentSongIndex]?.url)
      audioRef.current.volume = volume / 100

      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration)
        }
      }

      audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata)

      return () => {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata)
        }
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [songs, currentSongIndex])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    } else {
      audioRef.current?.play().catch((e) => console.error("Error playing audio:", e))
      animationRef.current = requestAnimationFrame(updateProgress)
    }
    setIsPlaying(!isPlaying)
  }

  const updateProgress = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime)
      animationRef.current = requestAnimationFrame(updateProgress)

      // Check if song ended
      if (audioRef.current.ended) {
        nextSong()
      }
    }
  }

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setProgress(value[0])
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

  const prevSong = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setCurrentSongIndex((prevIndex) => (prevIndex === 0 ? songs.length - 1 : prevIndex - 1))
    setIsPlaying(false)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
        setIsPlaying(true)
      }
    }, 100)
  }

  const nextSong = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setCurrentSongIndex((prevIndex) => (prevIndex === songs.length - 1 ? 0 : prevIndex + 1))
    setIsPlaying(false)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch((e) => console.error("Error playing audio:", e))
        setIsPlaying(true)
      }
    }, 100)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const currentSong = songs[currentSongIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Music Player
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src={currentSong?.cover || "/placeholder.svg?height=80&width=80"}
            alt={currentSong?.title}
            className="w-20 h-20 rounded-md object-cover"
          />
          <div>
            <h3 className="font-medium">{currentSong?.title || "No song selected"}</h3>
            <p className="text-sm text-muted-foreground">{currentSong?.artist || "Unknown artist"}</p>
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
          <Button variant="outline" size="icon" onClick={prevSong}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={nextSong}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleMute}>
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Slider value={[volume]} max={100} onValueChange={handleVolumeChange} />
        </div>
      </CardContent>
    </Card>
  )
}
