"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react"

export default function FocusTimer() {
  const [duration, setDuration] = useState(25 * 60) // 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isActive, setIsActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio only once
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/notification.mp3") // You would need to add this sound file
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Handle timer logic
  useEffect(() => {
    if (!isActive) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current!)
          setIsActive(false)
          if (!isMuted && audioRef.current) {
            audioRef.current.play().catch((e) => console.error("Error playing sound:", e))
          }
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive, isMuted])

  // Update timeLeft when duration changes, but only when timer is not active
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration)
    }
  }, [duration, isActive])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimeLeft(duration)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0] * 60 // Convert minutes to seconds
    setDuration(newDuration)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const calculateProgress = () => {
    return ((duration - timeLeft) / duration) * 100
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Focus Timer</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative pt-1">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-primary/20">
            <div
              style={{ width: `${calculateProgress()}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-500"
            ></div>
          </div>
        </div>

        <div className="text-center">
          <span className="text-5xl font-bold tabular-nums">{formatTime(timeLeft)}</span>
        </div>

        <div className="flex justify-center space-x-4">
          <Button onClick={toggleTimer} variant="outline" size="icon">
            {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button onClick={resetTimer} variant="outline" size="icon">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Duration: {Math.floor(duration / 60)} min</span>
          </div>
          <Slider
            defaultValue={[25]}
            min={1}
            max={60}
            step={1}
            value={[Math.floor(duration / 60)]}
            onValueChange={handleDurationChange}
            disabled={isActive}
          />
        </div>
      </CardContent>
    </Card>
  )
}
