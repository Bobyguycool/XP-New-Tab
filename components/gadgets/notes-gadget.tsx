"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PenLine } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function NotesGadget() {
  const [notes, setNotes] = useLocalStorage("quickNotes", "")

  return (
    <Card className="dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PenLine className="h-5 w-5" />
          Quick Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          className="w-full h-32 p-2 border rounded-md resize-none dark:bg-slate-800 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Type your notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </CardContent>
    </Card>
  )
}
