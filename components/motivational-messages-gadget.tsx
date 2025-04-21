"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart } from "lucide-react"

// Sample motivational quotes
const motivationalQuotes = [
  {
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
  },
  {
    quote: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
  },
  {
    quote: "Everything you've ever wanted is on the other side of fear.",
    author: "George Addair",
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    quote: "Hardships often prepare ordinary people for an extraordinary destiny.",
    author: "C.S. Lewis",
  },
  {
    quote: "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    quote: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
  },
  {
    quote: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis",
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
  },
  {
    quote: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt",
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
  {
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  {
    quote: "If you want to achieve greatness stop asking for permission.",
    author: "Anonymous",
  },
]

export default function MotivationalMessagesGadget() {
  const [quote, setQuote] = useState<{ quote: string; author: string } | null>(null)

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length)
    setQuote(motivationalQuotes[randomIndex])
  }

  useEffect(() => {
    getRandomQuote()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Daily Motivation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {quote && (
          <div className="bg-muted/30 p-4 rounded-md">
            <p className="text-lg italic">"{quote.quote}"</p>
            <p className="text-right text-sm text-muted-foreground mt-2">— {quote.author}</p>
          </div>
        )}
        <Button onClick={getRandomQuote} variant="outline" className="w-full flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          New Quote
        </Button>
      </CardContent>
    </Card>
  )
}
