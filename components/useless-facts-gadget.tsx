"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, RefreshCw } from "lucide-react"

// Sample useless facts
const uselessFacts = [
  "A crocodile cannot stick its tongue out.",
  "A shrimp's heart is in its head.",
  "It is physically impossible for pigs to look up into the sky.",
  "The 'sixth sick sheik's sixth sheep's sick' is believed to be the toughest tongue twister in English.",
  "If you sneeze too hard, you could fracture a rib.",
  "Wearing headphones for just an hour increases the bacteria in your ear by 700 times.",
  "Some lipsticks contain fish scales.",
  "Like fingerprints, everyone's tongue print is different.",
  "Rubber bands last longer when refrigerated.",
  "There are 293 ways to make change for a dollar.",
  "The average person falls asleep in seven minutes.",
  "A bear has 42 teeth.",
  "An ostrich's eye is bigger than its brain.",
  "Lemons contain more sugar than strawberries.",
  "8% of people have an extra rib.",
  "85% of plant life is found in the ocean.",
  "Ralph Lauren's original name was Ralph Lifshitz.",
  "Rabbits and parrots can see behind themselves without turning their heads.",
  "The Hawaiian alphabet has 13 letters.",
  "A cat has 32 muscles in each ear.",
  "A goldfish has a memory span of three seconds.",
  "A shark is the only known fish that can blink with both eyes.",
  "The longest word typed with only the left hand is 'stewardesses'.",
  "The longest word typed with only the right hand is 'lollipop'.",
  "A group of frogs is called an army.",
  "A group of rhinos is called a crash.",
  "A group of kangaroos is called a mob.",
  "A group of whales is called a pod.",
  "A group of geese is called a gaggle.",
  "A group of crows is called a murder.",
]

export default function UselessFactsGadget() {
  const [fact, setFact] = useState<string>("")

  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * uselessFacts.length)
    setFact(uselessFacts[randomIndex])
  }

  useEffect(() => {
    getRandomFact()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Useless Facts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="min-h-[80px] p-4 bg-muted/30 rounded-md">
          <p className="italic">{fact}</p>
        </div>
        <Button onClick={getRandomFact} variant="outline" className="w-full flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          New Fact
        </Button>
      </CardContent>
    </Card>
  )
}
