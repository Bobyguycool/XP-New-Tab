"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Cloud, CloudRain, Sun, Bookmark, PenLine, ListTodo } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import CalculatorGadget from "./calculator-gadget"
import CurrencyConverterGadget from "./currency-converter-gadget"
import MinigameGadget from "./minigame-gadget"
// Add imports for all the new gadgets
import UselessFactsGadget from "./useless-facts-gadget"
import MusicPlayerGadget from "./music-player-gadget"
import EventsGadget from "./events-gadget"
import HistoryGadget from "./history-gadget"
import NewsFeedGadget from "./news-feed-gadget"
import MotivationalMessagesGadget from "./motivational-messages-gadget"
import MusicRecommendationGadget from "./music-recommendation-gadget"
import VirtualPetGadget from "./virtual-pet-gadget"
// Add imports for the new gadgets
import CountdownTimerGadget from "./countdown-timer-gadget"
import WorldClockGadget from "./world-clock-gadget"
import StockTrackerGadget from "./stock-tracker-gadget"
// Add import for the new ASCII art gadget
import AsciiArtGadget from "./ascii-art-gadget"
// Add import for the new Emulator gadget
import EmulatorGadget from "./emulator-gadget"

// Update the Gadgets component to include new gadgets and accept layout prop
interface GadgetsProps {
  activeGadgets: string[]
  layout: string
}

// Update the Gadgets component to include the new emulator gadget
export default function Gadgets({ activeGadgets, layout }: GadgetsProps) {
  return (
    <>
      {activeGadgets.includes("weather") && <WeatherGadget />}
      {activeGadgets.includes("notes") && <NotesGadget />}
      {activeGadgets.includes("todo") && <TodoGadget />}
      {activeGadgets.includes("bookmarks") && <BookmarksGadget />}
      {activeGadgets.includes("calculator") && <CalculatorGadget />}
      {activeGadgets.includes("currency") && <CurrencyConverterGadget />}
      {activeGadgets.includes("minigames") && <MinigameGadget />}
      {activeGadgets.includes("uselessfacts") && <UselessFactsGadget />}
      {activeGadgets.includes("musicplayer") && <MusicPlayerGadget />}
      {activeGadgets.includes("events") && <EventsGadget />}
      {activeGadgets.includes("history") && <HistoryGadget />}
      {activeGadgets.includes("newsfeed") && <NewsFeedGadget />}
      {activeGadgets.includes("motivation") && <MotivationalMessagesGadget />}
      {activeGadgets.includes("musicrecommendation") && <MusicRecommendationGadget />}
      {activeGadgets.includes("virtualpet") && <VirtualPetGadget />}
      {activeGadgets.includes("countdown") && <CountdownTimerGadget />}
      {activeGadgets.includes("worldclock") && <WorldClockGadget />}
      {activeGadgets.includes("stocks") && <StockTrackerGadget />}
      {activeGadgets.includes("asciiart") && <AsciiArtGadget />}
      {activeGadgets.includes("emulator") && <EmulatorGadget />}
    </>
  )
}

function WeatherGadget() {
  // In a real app, you would fetch weather data from an API
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-yellow-500" />
          Weather
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">72°F</p>
            <p className="text-muted-foreground">Sunny</p>
          </div>
          <Sun className="h-10 w-10 text-yellow-500" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div>
            <Cloud className="h-5 w-5 mx-auto text-blue-400" />
            <p>Tomorrow</p>
            <p className="font-medium">68°F</p>
          </div>
          <div>
            <CloudRain className="h-5 w-5 mx-auto text-blue-400" />
            <p>Tuesday</p>
            <p className="font-medium">65°F</p>
          </div>
          <div>
            <Sun className="h-5 w-5 mx-auto text-yellow-500" />
            <p>Wednesday</p>
            <p className="font-medium">70°F</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function NotesGadget() {
  const [notes, setNotes] = useLocalStorage("quickNotes", "")

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5" />
          Quick Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          className="w-full h-32 p-2 border rounded-md resize-none"
          placeholder="Type your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </CardContent>
    </Card>
  )
}

function TodoGadget() {
  const [todos, setTodos] = useLocalStorage<{ id: number; text: string; completed: boolean }[]>("todos", [])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
    setNewTodo("")
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="h-5 w-5" />
          Todo List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2">
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} id={`todo-${todo.id}`} />
              <Label
                htmlFor={`todo-${todo.id}`}
                className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {todo.text}
              </Label>
              <Button variant="ghost" size="sm" onClick={() => removeTodo(todo.id)}>
                ×
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

function BookmarksGadget() {
  const [bookmarks, setBookmarks] = useLocalStorage<{ id: number; title: string; url: string }[]>("bookmarks", [
    { id: 1, title: "Google", url: "https://google.com" },
    { id: 2, title: "GitHub", url: "https://github.com" },
    { id: 3, title: "YouTube", url: "https://youtube.com" },
  ])
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [showForm, setShowForm] = useState(false)

  const addBookmark = () => {
    if (!newTitle.trim() || !newUrl.trim()) return

    // Add http:// if missing
    let formattedUrl = newUrl
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl
    }

    setBookmarks([...bookmarks, { id: Date.now(), title: newTitle, url: formattedUrl }])
    setNewTitle("")
    setNewUrl("")
    setShowForm(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Bookmarks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {bookmarks.map((bookmark) => (
            <a
              key={bookmark.id}
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded">{bookmark.title[0]}</div>
              <span className="truncate">{bookmark.title}</span>
            </a>
          ))}
        </div>

        {showForm ? (
          <div className="space-y-2">
            <Input placeholder="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <Input placeholder="URL" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={addBookmark}>Save</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>
            Add Bookmark
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
