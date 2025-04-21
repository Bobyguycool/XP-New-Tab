"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Terminal, Copy, Download, RefreshCw } from "lucide-react"

// Sample ASCII art patterns
const asciiPatterns = {
  standard: " .:-=+*#%@",
  detailed: " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$",
  blocks: " ░▒▓█",
  minimal: " .:;",
  retro: " .:-=+*#%@$",
  modern: " ▁▂▃▄▅▆▇█",
}

// Sample ASCII art templates
const asciiTemplates = {
  cat: `
  /\\_/\\
 ( o.o )
  > ^ <
  `,
  dog: `
   / \\__
  (    @\\___
  /         O
 /   (_____/
/_____/   U
  `,
  computer: `
   ______________
  /             /|
 /             / |
/____________ /  |
|  _________  |  |
| |         | |  |
| |         | |  |
| |_________| | /
|_____________|/
  `,
  heart: `
  .:::.   .:::.
 :::::::.:::::::
 :::::::::::::::
 ':::::::::::::'
   ':::::::::'
     ':::::'
       ':'
  `,
  smiley: `
   _____
  /     \\
 |  o o  |
 |   ∧   |
  \\_____/
  `,
}

export default function AsciiArtGadget() {
  const [text, setText] = useState("")
  const [asciiArt, setAsciiArt] = useState("")
  const [pattern, setPattern] = useState("standard")
  const [template, setTemplate] = useState("")
  const [width, setWidth] = useState(40)
  const [height, setHeight] = useState(20)
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate ASCII art from text
  const generateAsciiArt = () => {
    if (!text && !template) return

    setIsGenerating(true)

    // If a template is selected, use that
    if (template) {
      setAsciiArt(asciiTemplates[template as keyof typeof asciiTemplates])
      setIsGenerating(false)
      return
    }

    // Otherwise generate from text
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) {
      setIsGenerating(false)
      return
    }

    // Set canvas dimensions
    canvas.width = width * 2
    canvas.height = height * 2

    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw text
    ctx.fillStyle = "black"
    ctx.font = "20px monospace"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(text, canvas.width / 2, canvas.height / 2)

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    // Get ASCII pattern
    const chars = asciiPatterns[pattern as keyof typeof asciiPatterns]

    // Generate ASCII art
    let result = ""
    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 1) {
        const index = (y * canvas.width + x) * 4
        const brightness = (data[index] + data[index + 1] + data[index + 2]) / 3
        const charIndex = Math.floor((brightness / 255) * (chars.length - 1))
        result += chars[chars.length - 1 - charIndex]
      }
      result += "\n"
    }

    setAsciiArt(result)
    setIsGenerating(false)
  }

  // Copy ASCII art to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(asciiArt)
  }

  // Download ASCII art as a text file
  const downloadAsciiArt = () => {
    const element = document.createElement("a")
    const file = new Blob([asciiArt], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = "ascii-art.txt"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  // Generate ASCII art when template changes
  useEffect(() => {
    if (template) {
      setAsciiArt(asciiTemplates[template as keyof typeof asciiTemplates])
    }
  }, [template])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          ASCII Art Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium">Text</label>
              <Input
                placeholder="Enter text to convert"
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={!!template}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Width</label>
              <Input
                type="number"
                min="10"
                max="100"
                value={width}
                onChange={(e) => setWidth(Number.parseInt(e.target.value))}
                disabled={!!template}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Height</label>
              <Input
                type="number"
                min="10"
                max="100"
                value={height}
                onChange={(e) => setHeight(Number.parseInt(e.target.value))}
                disabled={!!template}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">ASCII Style</label>
              <Select value={pattern} onValueChange={setPattern} disabled={!!template}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard ASCII</SelectItem>
                  <SelectItem value="detailed">Detailed ASCII</SelectItem>
                  <SelectItem value="blocks">Block Characters</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="retro">Retro ASCII</SelectItem>
                  <SelectItem value="modern">Modern ASCII</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Template</label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Text</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="computer">Computer</SelectItem>
                  <SelectItem value="heart">Heart</SelectItem>
                  <SelectItem value="smiley">Smiley Face</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={generateAsciiArt} disabled={(!text && !template) || isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>

        <div className="border rounded-md p-2 bg-black text-green-400 font-mono text-xs overflow-auto h-[200px] whitespace-pre">
          {asciiArt || "ASCII art will appear here..."}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!asciiArt}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAsciiArt} disabled={!asciiArt}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
