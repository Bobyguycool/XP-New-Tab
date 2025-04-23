"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Grid, List, Gamepad2, Star } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Game {
  id: string
  title: string
  system: string
  releaseYear: string
  genre: string
  rating: number
  coverImage: string
  favorite: boolean
  completed: boolean
}

export default function RetroGameCollection() {
  const [games, setGames] = useLocalStorage<Game[]>("retro-game-collection", [
    {
      id: "1",
      title: "Super Mario Bros.",
      system: "NES",
      releaseYear: "1985",
      genre: "Platformer",
      rating: 5,
      coverImage: "/placeholder.svg?height=150&width=100",
      favorite: true,
      completed: true,
    },
    {
      id: "2",
      title: "The Legend of Zelda",
      system: "NES",
      releaseYear: "1986",
      genre: "Action-Adventure",
      rating: 5,
      coverImage: "/placeholder.svg?height=150&width=100",
      favorite: true,
      completed: false,
    },
    {
      id: "3",
      title: "Sonic the Hedgehog",
      system: "Genesis",
      releaseYear: "1991",
      genre: "Platformer",
      rating: 4,
      coverImage: "/placeholder.svg?height=150&width=100",
      favorite: false,
      completed: true,
    },
    {
      id: "4",
      title: "Final Fantasy VII",
      system: "PlayStation",
      releaseYear: "1997",
      genre: "RPG",
      rating: 5,
      coverImage: "/placeholder.svg?height=150&width=100",
      favorite: true,
      completed: false,
    },
    {
      id: "5",
      title: "Super Mario 64",
      system: "Nintendo 64",
      releaseYear: "1996",
      genre: "Platformer",
      rating: 5,
      coverImage: "/placeholder.svg?height=150&width=100",
      favorite: false,
      completed: true,
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterSystem, setFilterSystem] = useState<string | null>(null)
  const [filterGenre, setFilterGenre] = useState<string | null>(null)
  const [showAddGame, setShowAddGame] = useState(false)
  const [newGame, setNewGame] = useState<Omit<Game, "id">>({
    title: "",
    system: "",
    releaseYear: "",
    genre: "",
    rating: 3,
    coverImage: "/placeholder.svg?height=150&width=100",
    favorite: false,
    completed: false,
  })

  // Get unique systems and genres for filters
  const systems = Array.from(new Set(games.map((game) => game.system))).sort()
  const genres = Array.from(new Set(games.map((game) => game.genre))).sort()

  // Filter games based on search query and filters
  const filteredGames = games.filter((game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSystem = filterSystem ? game.system === filterSystem : true
    const matchesGenre = filterGenre ? game.genre === filterGenre : true
    return matchesSearch && matchesSystem && matchesGenre
  })

  // Add a new game
  const handleAddGame = () => {
    if (!newGame.title || !newGame.system) return

    const gameToAdd: Game = {
      ...newGame,
      id: Date.now().toString(),
    }

    setGames([...games, gameToAdd])
    setNewGame({
      title: "",
      system: "",
      releaseYear: "",
      genre: "",
      rating: 3,
      coverImage: "/placeholder.svg?height=150&width=100",
      favorite: false,
      completed: false,
    })
    setShowAddGame(false)
  }

  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setGames(games.map((game) => (game.id === id ? { ...game, favorite: !game.favorite } : game)))
  }

  // Toggle completed status
  const toggleCompleted = (id: string) => {
    setGames(games.map((game) => (game.id === id ? { ...game, completed: !game.completed } : game)))
  }

  // Delete a game
  const deleteGame = (id: string) => {
    setGames(games.filter((game) => game.id !== id))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-5 w-5" />
            Retro Game Collection
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-muted" : ""}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-muted" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 rounded-md border bg-background"
            value={filterSystem || ""}
            onChange={(e) => setFilterSystem(e.target.value || null)}
          >
            <option value="">All Systems</option>
            {systems.map((system) => (
              <option key={system} value={system}>
                {system}
              </option>
            ))}
          </select>
          <select
            className="px-3 py-2 rounded-md border bg-background"
            value={filterGenre || ""}
            onChange={(e) => setFilterGenre(e.target.value || null)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <Button onClick={() => setShowAddGame(true)}>Add Game</Button>
        </div>

        {showAddGame && (
          <div className="p-4 border rounded-md space-y-3">
            <h3 className="font-medium">Add New Game</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Title"
                value={newGame.title}
                onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
              />
              <Input
                placeholder="System"
                value={newGame.system}
                onChange={(e) => setNewGame({ ...newGame, system: e.target.value })}
              />
              <Input
                placeholder="Release Year"
                value={newGame.releaseYear}
                onChange={(e) => setNewGame({ ...newGame, releaseYear: e.target.value })}
              />
              <Input
                placeholder="Genre"
                value={newGame.genre}
                onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <label className="text-sm">Rating:</label>
                <select
                  className="px-2 py-1 rounded-md border bg-background"
                  value={newGame.rating}
                  onChange={(e) => setNewGame({ ...newGame, rating: Number(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} Star{rating !== 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newGame.favorite}
                    onChange={(e) => setNewGame({ ...newGame, favorite: e.target.checked })}
                  />
                  <span className="text-sm">Favorite</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newGame.completed}
                    onChange={(e) => setNewGame({ ...newGame, completed: e.target.checked })}
                  />
                  <span className="text-sm">Completed</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowAddGame(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddGame}>Add Game</Button>
            </div>
          </div>
        )}

        {filteredGames.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No games found matching your criteria.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredGames.map((game) => (
              <div key={game.id} className="border rounded-md overflow-hidden">
                <div className="relative">
                  <img
                    src={game.coverImage || "/placeholder.svg"}
                    alt={game.title}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 p-1 bg-background/80 rounded-full"
                    onClick={() => toggleFavorite(game.id)}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        game.favorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                  {game.completed && (
                    <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Completed
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-medium truncate" title={game.title}>
                    {game.title}
                  </h3>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{game.system}</span>
                    <span>{game.releaseYear}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < game.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredGames.map((game) => (
              <div key={game.id} className="flex items-center border rounded-md p-3">
                <img
                  src={game.coverImage || "/placeholder.svg"}
                  alt={game.title}
                  className="w-16 h-20 object-cover rounded-sm mr-4"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{game.title}</h3>
                    {game.favorite && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                    {game.completed && (
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Completed</span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {game.system} • {game.releaseYear} • {game.genre}
                  </div>
                  <div className="flex items-center mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < game.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(game.id)}
                    title={game.favorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        game.favorite ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCompleted(game.id)}
                    title={game.completed ? "Mark as not completed" : "Mark as completed"}
                  >
                    {game.completed ? "✓" : "○"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteGame(game.id)} title="Delete game">
                    ×
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between text-sm text-muted-foreground pt-2">
          <span>
            Showing {filteredGames.length} of {games.length} games
          </span>
          <span>
            {games.filter((g) => g.favorite).length} favorites • {games.filter((g) => g.completed).length} completed
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
