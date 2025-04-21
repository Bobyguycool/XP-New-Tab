"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Quote } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface QuoteData {
  text: string
  author: string
  date: string
}

// Sample quotes
const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  {
    text: "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
]

export default function QuoteOfDay() {
  // Initialize with a default quote to prevent unnecessary updates
  const [quoteData, setQuoteData] = useLocalStorage<QuoteData>("quoteOfDay", {
    text: quotes[0].text,
    author: quotes[0].author,
    date: "",
  })

  // Run this effect only once on component mount
  useEffect(() => {
    const today = new Date().toDateString()

    // If we don't have a quote for today, get a new one
    if (quoteData.date !== today) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setQuoteData({
        text: randomQuote.text,
        author: randomQuote.author,
        date: today,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array to run only once

  if (!quoteData.text) return null

  return (
    <Card className="w-full max-w-3xl my-4">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Quote className="h-8 w-8 text-primary/60 mt-1 flex-shrink-0" />
          <div>
            <p className="text-lg italic">{quoteData.text}</p>
            <p className="text-right text-sm text-muted-foreground mt-2">— {quoteData.author}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
