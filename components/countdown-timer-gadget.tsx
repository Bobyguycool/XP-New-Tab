"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Timer, Play, Pause, RotateCcw } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function CountdownTimerGadget() {
  const [savedTimers, setSavedTimers] = useLocalStorage<{ name: string; seconds: number }[]>("countdownTimers", [
    { name: "Coffee Break", seconds: 300 },
    { name: "Meeting", seconds: 1800 },
  ])

  const [activeTimer, setActiveTimer] = useState<{ name: string; seconds: number } | null>(null)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [newTimerName, setNewTimerName] = useState<string>("")
  const [newTimerMinutes, setNewTimerMinutes] = useState<string>("5")
  const [showAddTimer, setShowAddTimer] = useState<boolean>(false)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      // Play notification sound or show alert
      if (typeof window !== "undefined") {
        try {
          new Audio("/notification.mp3").play()
        } catch (e) {
          console.error("Could not play notification sound", e)
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft])

  const startTimer = (timer: { name: string; seconds: number }) => {
    setActiveTimer(timer)
    setTimeLeft(timer.seconds)
    setIsRunning(true)
  }

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    if (activeTimer) {
      setTimeLeft(activeTimer.seconds)
      setIsRunning(false)
    }
  }

  const addNewTimer = () => {
    if (!newTimerName.trim() || isNaN(Number(newTimerMinutes)) || Number(newTimerMinutes) <= 0) return

    const newTimer = {
      name: newTimerName,
      seconds: Math.floor(Number(newTimerMinutes) * 60),
    }

    setSavedTimers([...savedTimers, newTimer])
    setNewTimerName("")
    setNewTimerMinutes("5")
    setShowAddTimer(false)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Countdown Timer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeTimer ? (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-medium">{activeTimer.name}</h3>
              <div className="text-4xl font-bold tabular-nums mt-2">{formatTime(timeLeft)}</div>
            </div>

            <div className="flex justify-center gap-2">
              <Button onClick={toggleTimer} variant="outline">
                {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isRunning ? "Pause" : "Start"}
              </Button>
              <Button onClick={resetTimer} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => {
                setActiveTimer(null)
                setIsRunning(false)
              }}
            >
              Back to timers
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {savedTimers.map((timer, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => startTimer(timer)}
                >
                  <span>{timer.name}</span>
                  <span className="text-muted-foreground">{formatTime(timer.seconds)}</span>
                </Button>
              ))}
            </div>

            {showAddTimer ? (
              <div className="space-y-2 border rounded-md p-3">
                <Input
                  placeholder="Timer name"
                  value={newTimerName}
                  onChange={(e) => setNewTimerName(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Minutes"
                    value={newTimerMinutes}
                    onChange={(e) => setNewTimerMinutes(e.target.value)}
                    min="1"
                  />
                  <Button onClick={addNewTimer}>Add</Button>
                </div>
                <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => setShowAddTimer(false)}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => setShowAddTimer(true)}>
                Add New Timer
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
