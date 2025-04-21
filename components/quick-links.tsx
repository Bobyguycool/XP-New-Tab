"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, X, Edit, Globe } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface QuickLink {
  id: string
  title: string
  url: string
  icon?: string
}

export default function QuickLinks() {
  const [links, setLinks] = useLocalStorage<QuickLink[]>("quickLinks", [
    { id: "1", title: "Google", url: "https://google.com", icon: "G" },
    { id: "2", title: "YouTube", url: "https://youtube.com", icon: "Y" },
    { id: "3", title: "GitHub", url: "https://github.com", icon: "G" },
    { id: "4", title: "Gmail", url: "https://mail.google.com", icon: "M" },
    { id: "5", title: "Twitter", url: "https://twitter.com", icon: "T" },
    { id: "6", title: "Reddit", url: "https://reddit.com", icon: "R" },
    { id: "7", title: "Windows XP", url: "https://windowsxpbest.on.websim.ai/", icon: "W" },
    { id: "8", title: "Windows 3.1", url: "https://windows-3-1--yappering.on.websim.ai/", icon: "3" },
    { id: "9", title: "Windows 95", url: "https://windows-95--yappering.on.websim.ai/", icon: "9" },
    { id: "10", title: "Windows 7", url: "https://windows-7-simulation--yappering.on.websim.ai/", icon: "7" },
    { id: "11", title: "RetroScape", url: "https://retro-netscape-xp-home--yappering.on.websim.ai/", icon: "R" },
  ])
  const [newLink, setNewLink] = useState<QuickLink>({ id: "", title: "", url: "", icon: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [open, setOpen] = useState(false)

  // Add useEffect for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Add new link with 'a' key
      if (e.key === "a" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault()
        setNewLink({ id: "", title: "", url: "", icon: "" })
        setIsEditing(false)
        setOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const addOrUpdateLink = () => {
    if (!newLink.title || !newLink.url) return

    // Format URL if needed
    let formattedUrl = newLink.url
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl
    }

    if (isEditing) {
      setLinks(links.map((link) => (link.id === newLink.id ? { ...newLink, url: formattedUrl } : link)))
    } else {
      const icon = newLink.icon || newLink.title.charAt(0).toUpperCase()
      setLinks([...links, { ...newLink, id: Date.now().toString(), url: formattedUrl, icon }])
    }

    setNewLink({ id: "", title: "", url: "", icon: "" })
    setIsEditing(false)
    setOpen(false)
  }

  const editLink = (link: QuickLink) => {
    setNewLink(link)
    setIsEditing(true)
    setOpen(true)
  }

  const deleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
    } catch {
      return null
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="flex flex-wrap justify-center gap-4 my-6">
        {links.map((link) => (
          <div key={link.id} className="relative group">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center w-20 h-20 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 mb-2 overflow-hidden">
                {getFaviconUrl(link.url) ? (
                  <img
                    src={getFaviconUrl(link.url) || ""}
                    alt={link.title}
                    className="w-6 h-6"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                      e.currentTarget.nextSibling!.style.display = "block"
                    }}
                  />
                ) : null}
                <span className={getFaviconUrl(link.url) ? "hidden" : ""}>{link.icon}</span>
              </div>
              <span className="text-xs text-center truncate w-full">{link.title}</span>
            </a>
            <div className="absolute top-0 right-0 hidden group-hover:flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-background/80 hover:bg-background"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  editLink(link)
                }}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-background/80 hover:bg-background"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  deleteLink(link.id)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center w-20 h-20 p-2 rounded-lg"
              onClick={() => {
                setNewLink({ id: "", title: "", url: "", icon: "" })
                setIsEditing(false)
              }}
            >
              <Plus className="h-6 w-6 mb-2" />
              <span className="text-xs">Add Link</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Edit Link" : "Add New Link"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={newLink.title}
                  onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                  placeholder="Google"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="url" className="text-sm font-medium">
                  URL
                </label>
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="url"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://google.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="icon" className="text-sm font-medium">
                  Icon (optional)
                </label>
                <Input
                  id="icon"
                  value={newLink.icon || ""}
                  onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })}
                  placeholder="G"
                  maxLength={1}
                />
                <p className="text-xs text-muted-foreground">Leave empty to use first letter of title</p>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addOrUpdateLink}>{isEditing ? "Update" : "Add"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
