"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Cloud, CloudRain } from "lucide-react"

export default function WeatherGadget() {
  const [weather, setWeather] = useState({
    temp: 72,
    condition: "Sunny",
    icon: <Sun className="h-10 w-10 text-yellow-500" />,
    forecast: [
      { day: "Tomorrow", temp: 68, icon: <Cloud className="h-5 w-5 mx-auto text-blue-400" /> },
      { day: "Tuesday", temp: 65, icon: <CloudRain className="h-5 w-5 mx-auto text-blue-400" /> },
      { day: "Wednesday", temp: 70, icon: <Sun className="h-5 w-5 mx-auto text-yellow-500" /> },
    ],
  })

  // In a real app, you would fetch weather data from an API
  useEffect(() => {
    // Simulate weather changes
    const interval = setInterval(() => {
      const tempChange = Math.floor(Math.random() * 5) - 2 // -2 to +2
      setWeather((prev) => ({
        ...prev,
        temp: prev.temp + tempChange,
      }))
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-yellow-500" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{weather.temp}°F</p>
            <p className="text-muted-foreground">{weather.condition}</p>
          </div>
          {weather.icon}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          {weather.forecast.map((day, index) => (
            <div key={index}>
              {day.icon}
              <p>{day.day}</p>
              <p className="font-medium">{day.temp}°F</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
