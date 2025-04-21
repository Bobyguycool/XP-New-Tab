"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Newspaper, ExternalLink, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NewsItem {
  title: string
  description: string
  url: string
  source: string
  category: string
}

// Sample news data
const sampleNews: Record<string, NewsItem[]> = {
  technology: [
    {
      title: "New AI Model Breaks Records in Image Recognition",
      description:
        "Researchers have developed a new AI model that achieves unprecedented accuracy in image recognition tasks.",
      url: "#",
      source: "Tech Daily",
      category: "technology",
    },
    {
      title: "Quantum Computing Breakthrough Announced",
      description:
        "Scientists have achieved a major breakthrough in quantum computing, potentially bringing practical quantum computers closer to reality.",
      url: "#",
      source: "Future Tech",
      category: "technology",
    },
    {
      title: "Major Tech Companies Announce Collaboration on AR Standards",
      description:
        "Leading technology companies have formed an alliance to develop unified standards for augmented reality applications.",
      url: "#",
      source: "Digital Trends",
      category: "technology",
    },
  ],
  business: [
    {
      title: "Global Markets Rally After Central Bank Announcement",
      description:
        "Stock markets worldwide saw significant gains following a major policy announcement from central banks.",
      url: "#",
      source: "Business Insider",
      category: "business",
    },
    {
      title: "New Startup Raises Record $500M in Funding Round",
      description:
        "A startup focused on sustainable energy solutions has secured the largest Series A funding round of the year.",
      url: "#",
      source: "Venture Beat",
      category: "business",
    },
    {
      title: "Major Retail Chain Announces Expansion Plans",
      description:
        "One of the country's largest retail chains has announced plans to open 200 new locations over the next two years.",
      url: "#",
      source: "Retail News",
      category: "business",
    },
  ],
  science: [
    {
      title: "Astronomers Discover Potentially Habitable Exoplanet",
      description:
        "A team of astronomers has identified a new exoplanet in the habitable zone of its star, raising hopes for finding extraterrestrial life.",
      url: "#",
      source: "Space Journal",
      category: "science",
    },
    {
      title: "New Species of Deep-Sea Creatures Discovered",
      description:
        "Marine biologists have documented several previously unknown species during an expedition to explore deep ocean trenches.",
      url: "#",
      source: "Nature World",
      category: "science",
    },
    {
      title: "Breakthrough in Renewable Energy Storage",
      description:
        "Scientists have developed a new type of battery that could solve one of the biggest challenges in renewable energy adoption.",
      url: "#",
      source: "Science Daily",
      category: "science",
    },
  ],
  health: [
    {
      title: "New Treatment Shows Promise for Alzheimer's Disease",
      description:
        "Clinical trials for a new drug have shown significant improvements in patients with early-stage Alzheimer's disease.",
      url: "#",
      source: "Health News",
      category: "health",
    },
    {
      title: "Study Links Regular Exercise to Improved Mental Health",
      description:
        "A comprehensive study has found strong correlations between regular physical activity and reduced symptoms of depression and anxiety.",
      url: "#",
      source: "Medical Journal",
      category: "health",
    },
    {
      title: "Breakthrough in Cancer Detection Technology",
      description:
        "Researchers have developed a blood test that can detect multiple types of cancer at early stages with high accuracy.",
      url: "#",
      source: "Health Today",
      category: "health",
    },
  ],
}

export default function NewsFeedGadget() {
  const [category, setCategory] = useState<string>("technology")
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    loadNews(category)
  }, [category])

  const loadNews = (category: string) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setNews(sampleNews[category] || [])
      setLoading(false)
    }, 500)
  }

  const refreshNews = () => {
    loadNews(category)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5" />
          News Feed
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="science">Science</SelectItem>
              <SelectItem value="health">Health</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" onClick={refreshNews} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item, index) => (
              <div key={index} className="border-b pb-3 last:border-0">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:underline flex items-center gap-1"
                >
                  {item.title}
                  <ExternalLink className="h-3 w-3" />
                </a>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>{item.source}</span>
                  <span className="capitalize">{item.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
