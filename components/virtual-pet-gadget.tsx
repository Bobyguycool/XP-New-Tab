"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { PawPrintIcon as Paw, Heart, Pizza, Droplets, Moon } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Pet {
  name: string
  type: string
  hunger: number
  happiness: number
  energy: number
  lastInteraction: number
}

const PET_TYPES = ["cat", "dog", "rabbit", "hamster", "bird"]

export default function VirtualPetGadget() {
  const [pet, setPet] = useLocalStorage<Pet | null>("virtualPet", null)
  const [showNameInput, setShowNameInput] = useState(false)
  const [newPetName, setNewPetName] = useState("")
  const [newPetType, setNewPetType] = useState("cat")

  // Update pet stats over time
  useEffect(() => {
    if (!pet) return

    const now = Date.now()
    const hoursSinceLastInteraction = (now - pet.lastInteraction) / (1000 * 60 * 60)

    // Decrease stats based on time passed (max 5 points per hour)
    if (hoursSinceLastInteraction > 0) {
      const decreaseAmount = Math.min(hoursSinceLastInteraction * 5, 100)

      setPet({
        ...pet,
        hunger: Math.max(0, pet.hunger - decreaseAmount),
        happiness: Math.max(0, pet.happiness - decreaseAmount / 2),
        energy: Math.max(0, pet.energy - decreaseAmount / 3),
        lastInteraction: now,
      })
    }

    // Check stats every minute
    const interval = setInterval(() => {
      setPet((currentPet) => {
        if (!currentPet) return null

        const now = Date.now()
        const minutesSinceLastInteraction = (now - currentPet.lastInteraction) / (1000 * 60)

        // Decrease stats based on time passed (max 1 point per minute)
        if (minutesSinceLastInteraction > 0) {
          const decreaseAmount = Math.min(minutesSinceLastInteraction, 100)

          return {
            ...currentPet,
            hunger: Math.max(0, currentPet.hunger - decreaseAmount / 10),
            happiness: Math.max(0, currentPet.happiness - decreaseAmount / 20),
            energy: Math.max(0, currentPet.energy - decreaseAmount / 30),
            lastInteraction: now,
          }
        }

        return currentPet
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [pet, setPet])

  const createNewPet = () => {
    if (!newPetName.trim()) return

    setPet({
      name: newPetName,
      type: newPetType,
      hunger: 100,
      happiness: 100,
      energy: 100,
      lastInteraction: Date.now(),
    })

    setShowNameInput(false)
    setNewPetName("")
  }

  const feedPet = () => {
    if (!pet) return

    setPet({
      ...pet,
      hunger: Math.min(100, pet.hunger + 20),
      lastInteraction: Date.now(),
    })
  }

  const playWithPet = () => {
    if (!pet) return

    setPet({
      ...pet,
      happiness: Math.min(100, pet.happiness + 20),
      hunger: Math.max(0, pet.hunger - 5),
      energy: Math.max(0, pet.energy - 10),
      lastInteraction: Date.now(),
    })
  }

  const restPet = () => {
    if (!pet) return

    setPet({
      ...pet,
      energy: Math.min(100, pet.energy + 30),
      lastInteraction: Date.now(),
    })
  }

  const getPetStatus = () => {
    if (!pet) return ""

    const lowestStat = Math.min(pet.hunger, pet.happiness, pet.energy)

    if (lowestStat < 20) return "Your pet is not feeling well!"
    if (lowestStat < 50) return "Your pet needs attention."
    return "Your pet is happy and healthy!"
  }

  const getPetEmoji = () => {
    if (!pet) return "🐾"

    switch (pet.type) {
      case "cat":
        return "🐱"
      case "dog":
        return "🐶"
      case "rabbit":
        return "🐰"
      case "hamster":
        return "🐹"
      case "bird":
        return "🐦"
      default:
        return "🐾"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Paw className="h-5 w-5" />
          Virtual Pet
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!pet && !showNameInput && (
          <div className="text-center py-6">
            <p className="mb-4">You don't have a virtual pet yet!</p>
            <Button onClick={() => setShowNameInput(true)}>Adopt a Pet</Button>
          </div>
        )}

        {showNameInput && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Pet Name</label>
              <input
                type="text"
                value={newPetName}
                onChange={(e) => setNewPetName(e.target.value)}
                className="w-full p-2 mt-1 border rounded-md"
                placeholder="Enter a name for your pet"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Pet Type</label>
              <div className="grid grid-cols-5 gap-2 mt-1">
                {PET_TYPES.map((type) => (
                  <Button
                    key={type}
                    variant={newPetType === type ? "default" : "outline"}
                    className="p-2 h-auto"
                    onClick={() => setNewPetType(type)}
                  >
                    {type === "cat"
                      ? "🐱"
                      : type === "dog"
                        ? "🐶"
                        : type === "rabbit"
                          ? "🐰"
                          : type === "hamster"
                            ? "🐹"
                            : "🐦"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={createNewPet} className="flex-1">
                Create Pet
              </Button>
              <Button variant="outline" onClick={() => setShowNameInput(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {pet && (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-6xl py-4">{getPetEmoji()}</div>

            <div className="text-center">
              <h3 className="text-xl font-bold">{pet.name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{pet.type}</p>
              <p className="mt-2">{getPetStatus()}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Pizza className="h-4 w-4 text-orange-500" />
                <span className="text-sm w-20">Hunger</span>
                <Progress value={pet.hunger} className="h-2" />
              </div>

              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                <span className="text-sm w-20">Happiness</span>
                <Progress value={pet.happiness} className="h-2" />
              </div>

              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm w-20">Energy</span>
                <Progress value={pet.energy} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button onClick={feedPet} variant="outline" className="flex flex-col items-center p-2 h-auto">
                <Pizza className="h-5 w-5 mb-1" />
                <span className="text-xs">Feed</span>
              </Button>

              <Button onClick={playWithPet} variant="outline" className="flex flex-col items-center p-2 h-auto">
                <Heart className="h-5 w-5 mb-1" />
                <span className="text-xs">Play</span>
              </Button>

              <Button onClick={restPet} variant="outline" className="flex flex-col items-center p-2 h-auto">
                <Moon className="h-5 w-5 mb-1" />
                <span className="text-xs">Rest</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
