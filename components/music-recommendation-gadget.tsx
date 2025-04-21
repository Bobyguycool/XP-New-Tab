"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Music, RefreshCw, ExternalLink } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MusicRecommendation {
  title: string
  artist: string
  album: string
  year: string
  genre: string
  link: string
  image: string
}

// Sample music recommendations by genre
const musicRecommendations: Record<string, MusicRecommendation[]> = {
  rock: [
    {
      title: "Bohemian Rhapsody",
      artist: "Queen",
      album: "A Night at the Opera",
      year: "1975",
      genre: "Rock",
      link: "https://open.spotify.com/track/6l8GvAyoUZwWDgF1e4822w",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Stairway to Heaven",
      artist: "Led Zeppelin",
      album: "Led Zeppelin IV",
      year: "1971",
      genre: "Rock",
      link: "https://open.spotify.com/track/5CQ30WqJwcep0pYcV4AMNc",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Sweet Child O' Mine",
      artist: "Guns N' Roses",
      album: "Appetite for Destruction",
      year: "1987",
      genre: "Rock",
      link: "https://open.spotify.com/track/7o2CTH4ctstm8TNelqjb51",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  pop: [
    {
      title: "Billie Jean",
      artist: "Michael Jackson",
      album: "Thriller",
      year: "1982",
      genre: "Pop",
      link: "https://open.spotify.com/track/5ChkMS8OtdzJeqyybCc9R5",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Shape of You",
      artist: "Ed Sheeran",
      album: "÷ (Divide)",
      year: "2017",
      genre: "Pop",
      link: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Bad Guy",
      artist: "Billie Eilish",
      album: "When We All Fall Asleep, Where Do We Go?",
      year: "2019",
      genre: "Pop",
      link: "https://open.spotify.com/track/2Fxmhks0bxGSBdJ92vM42m",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  hiphop: [
    {
      title: "Lose Yourself",
      artist: "Eminem",
      album: "8 Mile Soundtrack",
      year: "2002",
      genre: "Hip Hop",
      link: "https://open.spotify.com/track/7w9bgPAmPTtrkt2v16QWvQ",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Sicko Mode",
      artist: "Travis Scott",
      album: "Astroworld",
      year: "2018",
      genre: "Hip Hop",
      link: "https://open.spotify.com/track/2xLMifQCjDGFmkHkpNLD9h",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Alright",
      artist: "Kendrick Lamar",
      album: "To Pimp a Butterfly",
      year: "2015",
      genre: "Hip Hop",
      link: "https://open.spotify.com/track/3iVcZ5G6tvkXZkZKlMpIUs",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  electronic: [
    {
      title: "Strobe",
      artist: "deadmau5",
      album: "For Lack of a Better Name",
      year: "2009",
      genre: "Electronic",
      link: "https://open.spotify.com/track/1uY4O332HuqLIcSSJlg4NX",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Scary Monsters and Nice Sprites",
      artist: "Skrillex",
      album: "Scary Monsters and Nice Sprites",
      year: "2010",
      genre: "Electronic",
      link: "https://open.spotify.com/track/4rwpZEcnalkuhPyGkEdhu0",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Around the World",
      artist: "Daft Punk",
      album: "Homework",
      year: "1997",
      genre: "Electronic",
      link: "https://open.spotify.com/track/1pKYYY0dkg23sQQXi0Q5zN",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
}

export default function MusicRecommendationGadget() {
  const [genre, setGenre] = useState<string>("rock")
  const [recommendation, setRecommendation] = useState<MusicRecommendation | null>(null)

  const getRandomRecommendation = () => {
    const recommendations = musicRecommendations[genre] || []
    if (recommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * recommendations.length)
      setRecommendation(recommendations[randomIndex])
    }
  }

  // Initialize with a recommendation when genre changes
  const handleGenreChange = (value: string) => {
    setGenre(value)
    const recommendations = musicRecommendations[value] || []
    if (recommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * recommendations.length)
      setRecommendation(recommendations[randomIndex])
    } else {
      setRecommendation(null)
    }
  }

  // Get initial recommendation
  useState(() => {
    getRandomRecommendation()
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Music Recommendations
        </CardTitle>
        <Select value={genre} onValueChange={handleGenreChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rock">Rock</SelectItem>
            <SelectItem value="pop">Pop</SelectItem>
            <SelectItem value="hiphop">Hip Hop</SelectItem>
            <SelectItem value="electronic">Electronic</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendation ? (
          <div className="flex gap-4">
            <img
              src={recommendation.image || "/placeholder.svg"}
              alt={`${recommendation.album} cover`}
              className="w-20 h-20 rounded-md object-cover"
            />
            <div>
              <h3 className="font-medium">{recommendation.title}</h3>
              <p className="text-sm">{recommendation.artist}</p>
              <p className="text-xs text-muted-foreground">
                {recommendation.album} ({recommendation.year})
              </p>
              <a
                href={recommendation.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary flex items-center gap-1 mt-2 hover:underline"
              >
                Listen on Spotify
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">No recommendations available for this genre.</div>
        )}
        <Button onClick={getRandomRecommendation} variant="outline" className="w-full flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          New Recommendation
        </Button>
      </CardContent>
    </Card>
  )
}
