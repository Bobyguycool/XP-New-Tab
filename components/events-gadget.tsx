"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock, Plus, Trash2 } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Event {
  id: string
  title: string
  date: string
  time: string
}

export default function EventsGadget() {
  const [events, setEvents] = useLocalStorage<Event[]>("events", [])
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({ title: "", date: "", time: "" })
  const [open, setOpen] = useState(false)

  const addEvent = () => {
    if (!newEvent.title || !newEvent.date) return

    const event: Event = {
      id: Date.now().toString(),
      ...newEvent,
    }

    setEvents([...events, event])
    setNewEvent({ title: "", date: "", time: "" })
    setOpen(false)
  }

  const removeEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))
  }

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time || "00:00"}`)
    const dateB = new Date(`${b.date}T${b.time || "00:00"}`)
    return dateA.getTime() - dateB.getTime()
  })

  // Filter upcoming events
  const upcomingEvents = sortedEvents.filter((event) => {
    const eventDate = new Date(`${event.date}T${event.time || "00:00"}`)
    return eventDate >= new Date()
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Events
        </CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Event Title
                </label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Birthday Party"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="time" className="text-sm font-medium">
                  Time (optional)
                </label>
                <Input
                  id="time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addEvent}>Add Event</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">No upcoming events. Add one to get started!</div>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => {
              const eventDate = new Date(`${event.date}T${event.time || "00:00"}`)
              const isToday = new Date().toDateString() === eventDate.toDateString()

              return (
                <div
                  key={event.id}
                  className={`p-3 rounded-md flex justify-between items-start ${
                    isToday ? "bg-primary/10" : "bg-muted/30"
                  }`}
                >
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {eventDate.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {event.time && (
                        <>
                          <Clock className="h-3 w-3" />
                          <span>
                            {eventDate.toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeEvent(event.id)} className="h-8 w-8">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
