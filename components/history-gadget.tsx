"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HistoricalEvent {
  year: string
  text: string
}

// Sample historical events for each day of the year
const historicalEvents: Record<string, HistoricalEvent[]> = {
  "01-01": [
    { year: "1863", text: "Abraham Lincoln signs the Emancipation Proclamation" },
    { year: "1959", text: "Fidel Castro takes power in Cuba" },
    { year: "1995", text: "The World Trade Organization (WTO) is established" },
  ],
  "01-15": [
    { year: "1929", text: "Martin Luther King Jr. is born" },
    { year: "1967", text: "The first Super Bowl is played" },
    { year: "2001", text: "Wikipedia is launched" },
  ],
  "02-14": [
    { year: "1929", text: "The St. Valentine's Day Massacre occurs in Chicago" },
    { year: "1990", text: "Voyager 1 takes the famous 'Pale Blue Dot' photograph of Earth" },
    { year: "2005", text: "YouTube is founded" },
  ],
  "03-14": [
    { year: "1879", text: "Albert Einstein is born" },
    { year: "1994", text: "Linux kernel version 1.0.0 is released" },
    { year: "2018", text: "Stephen Hawking dies" },
  ],
  "04-15": [
    { year: "1912", text: "The Titanic sinks" },
    { year: "1947", text: "Jackie Robinson breaks baseball's color barrier" },
    { year: "1955", text: "The first McDonald's restaurant opens" },
  ],
  "05-01": [
    { year: "1931", text: "The Empire State Building is dedicated" },
    { year: "1961", text: "The first Freedom Ride begins" },
    { year: "2011", text: "Osama bin Laden is killed" },
  ],
  "06-06": [
    { year: "1944", text: "D-Day: Allied forces land on the beaches of Normandy" },
    { year: "1984", text: "Tetris is released" },
    { year: "2005", text: "Apple announces it will use Intel processors" },
  ],
  "07-04": [
    { year: "1776", text: "The United States Declaration of Independence is adopted" },
    { year: "1997", text: "NASA's Pathfinder space probe lands on Mars" },
    { year: "2012", text: "CERN announces the discovery of the Higgs boson" },
  ],
  "08-15": [
    { year: "1947", text: "India gains independence from British rule" },
    { year: "1969", text: "The Woodstock Music Festival begins" },
    { year: "1998", text: "Apple introduces the iMac" },
  ],
  "09-11": [
    { year: "1789", text: "Alexander Hamilton is appointed as the first U.S. Secretary of the Treasury" },
    { year: "1997", text: "Scotland votes to create its own Parliament" },
    { year: "2001", text: "Terrorist attacks destroy the World Trade Center" },
  ],
  "10-31": [
    { year: "1517", text: "Martin Luther posts his 95 Theses" },
    { year: "1941", text: "Mount Rushmore is completed" },
    { year: "2011", text: "The global population reaches 7 billion" },
  ],
  "11-09": [
    { year: "1989", text: "Fall of the Berlin Wall" },
    { year: "1967", text: "First issue of Rolling Stone magazine is published" },
    { year: "1906", text: "Theodore Roosevelt becomes the first U.S. President to travel abroad" },
  ],
  "12-25": [
    { year: "1776", text: "George Washington crosses the Delaware River" },
    { year: "1990", text: "The first successful trial of the World Wide Web" },
    { year: "1991", text: "Mikhail Gorbachev resigns as President of the Soviet Union" },
  ],
}

// Default events for any day not in the record
const defaultEvents: HistoricalEvent[] = [
  { year: "1903", text: "The Wright brothers make their first powered flight" },
  { year: "1969", text: "Apollo 11 lands on the moon" },
  { year: "1989", text: "Tim Berners-Lee invents the World Wide Web" },
  { year: "2007", text: "Apple introduces the iPhone" },
  { year: "1945", text: "World War II ends" },
  { year: "1963", text: "Martin Luther King Jr. delivers his 'I Have a Dream' speech" },
  { year: "1991", text: "The Soviet Union dissolves" },
  { year: "2001", text: "Wikipedia is launched" },
]

export default function HistoryGadget() {
  const [events, setEvents] = useState<HistoricalEvent[]>([])
  const [currentDate, setCurrentDate] = useState<string>("")

  const loadEventsForToday = () => {
    const today = new Date()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    const dateKey = `${month}-${day}`

    setCurrentDate(today.toLocaleDateString(undefined, { month: "long", day: "numeric" }))

    // Get events for today or use default
    const todayEvents = historicalEvents[dateKey] || defaultEvents.sort(() => 0.5 - Math.random()).slice(0, 3)

    setEvents(todayEvents)
  }

  useEffect(() => {
    loadEventsForToday()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          This Day in History
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={loadEventsForToday}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <h3 className="font-medium mb-3">{currentDate}</h3>
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={index} className="flex gap-3">
              <div className="font-bold text-primary min-w-[50px]">{event.year}</div>
              <div>{event.text}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
