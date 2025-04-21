"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Plus, Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TimeZone {
  id: string
  name: string
  timezone: string
}

// Sample time zones
const popularTimeZones = [
  { value: "America/New_York", label: "New York (EST/EDT)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST/PDT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Paris (CET/CEST)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Shanghai", label: "Shanghai (CST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST/AEDT)" },
  { value: "Pacific/Auckland", label: "Auckland (NZST/NZDT)" },
]

export default function WorldClockGadget() {
  const [timeZones, setTimeZones] = useLocalStorage<TimeZone[]>("worldClockTimeZones", [
    { id: "1", name: "New York", timezone: "America/New_York" },
    { id: "2", name: "London", timezone: "Europe/London" },
    { id: "3", name: "Tokyo", timezone: "Asia/Tokyo" },
  ])

  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newTimeZoneName, setNewTimeZoneName] = useState("")
  const [newTimeZoneValue, setNewTimeZoneValue] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const addTimeZone = () => {
    if (!newTimeZoneName.trim() || !newTimeZoneValue) return

    const newTimeZone: TimeZone = {
      id: Date.now().toString(),
      name: newTimeZoneName,
      timezone: newTimeZoneValue,
    }

    setTimeZones([...timeZones, newTimeZone])
    setNewTimeZoneName("")
    setNewTimeZoneValue("")
    setDialogOpen(false)
  }

  const removeTimeZone = (id: string) => {
    setTimeZones(timeZones.filter((tz) => tz.id !== id))
  }

  const formatTimeForTimeZone = (date: Date, timeZone: string) => {
    try {
      return date.toLocaleTimeString("en-US", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
    } catch (error) {
      return "Invalid time zone"
    }
  }

  const getDateForTimeZone = (date: Date, timeZone: string) => {
    try {
      return date.toLocaleDateString("en-US", {
        timeZone,
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return "Invalid time zone"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          World Clock
        </CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Time Zone</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Location Name
                </label>
                <Input
                  id="name"
                  value={newTimeZoneName}
                  onChange={(e) => setNewTimeZoneName(e.target.value)}
                  placeholder="e.g., Paris"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="timezone" className="text-sm font-medium">
                  Time Zone
                </label>
                <Select value={newTimeZoneValue} onValueChange={setNewTimeZoneValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {popularTimeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addTimeZone}>Add Time Zone</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timeZones.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No time zones added. Click "Add" to get started.
            </div>
          ) : (
            timeZones.map((tz) => (
              <div key={tz.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                <div>
                  <h3 className="font-medium">{tz.name}</h3>
                  <div className="text-sm text-muted-foreground">{getDateForTimeZone(currentTime, tz.timezone)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-xl font-mono tabular-nums">
                    {formatTimeForTimeZone(currentTime, tz.timezone)}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTimeZone(tz.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
