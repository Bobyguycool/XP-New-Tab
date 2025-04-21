"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface TimeDisplayProps {
  format?: "12h" | "24h"
}

export default function TimeDisplay({ format = "24h" }: TimeDisplayProps) {
  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Function to update time without causing infinite loops
  const updateTime = () => {
    const now = new Date()

    // Format time based on preference
    let timeString: string
    if (format === "12h") {
      timeString = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
    } else {
      timeString = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    }

    // Format date
    const dateString = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })

    setTime(timeString)
    setDate(dateString)
  }

  // Set up the timer only once when the component mounts or when format changes
  useEffect(() => {
    // Initial update
    updateTime()

    // Set up interval
    timerRef.current = setInterval(updateTime, 1000)

    // Clean up interval on unmount or format change
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [format]) // Only re-run if format changes

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center justify-center p-6">
        <div className="text-4xl font-bold">{time}</div>
        <div className="text-muted-foreground">{date}</div>
      </CardContent>
    </Card>
  )
}
