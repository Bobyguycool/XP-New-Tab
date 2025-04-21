"use client"

import { useState, type FormEvent } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/use-local-storage"

type SearchEngine = {
  name: string
  url: string
}

const searchEngines: SearchEngine[] = [
  {
    name: "Google",
    url: "https://www.google.com/search?q=",
  },
  {
    name: "Bing",
    url: "https://www.bing.com/search?q=",
  },
  {
    name: "DuckDuckGo",
    url: "https://duckduckgo.com/?q=",
  },
  {
    name: "Yahoo",
    url: "https://search.yahoo.com/search?p=",
  },
  {
    name: "Startpage",
    url: "https://www.startpage.com/do/search?q=",
  },
]

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [defaultEngine, setDefaultEngine] = useLocalStorage("defaultEngine", "Google")

  const handleSearch = (e: FormEvent, engineName?: string) => {
    e.preventDefault()
    if (!query.trim()) return

    const engine = searchEngines.find((e) => e.name === (engineName || defaultEngine)) || searchEngines[0]
    window.open(`${engine.url}${encodeURIComponent(query)}`, "_blank")
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search the web... (Press / to focus)"
            className="pl-9 h-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={defaultEngine} onValueChange={setDefaultEngine}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Search with..." />
          </SelectTrigger>
          <SelectContent>
            {searchEngines.map((engine) => (
              <SelectItem key={engine.name} value={engine.name}>
                {engine.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit">Search</Button>
      </form>
      <div className="text-xs text-muted-foreground mt-1 text-center">
        Press <kbd className="px-1 py-0.5 bg-muted rounded">Tab</kbd> +{" "}
        <kbd className="px-1 py-0.5 bg-muted rounded">Enter</kbd> to search with default engine
      </div>
    </div>
  )
}
