"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bookmark } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function BookmarksGadget() {
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
    <Card className="dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900">
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
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-6 h-6 flex items-center justify-center bg-primary/10 rounded">{bookmark.title[0]}</div>
              <span className="truncate">{bookmark.title}</span>
            </a>
          ))}
        </div>

        {showForm ? (
          <div className="space-y-2">
            <Input
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="dark:bg-slate-800 dark:border-slate-700"
            />
            <Input
              placeholder="URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="dark:bg-slate-800 dark:border-slate-700"
            />
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
