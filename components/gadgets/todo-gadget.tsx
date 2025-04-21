"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ListTodo } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

export default function TodoGadget() {
  const [todos, setTodos] = useLocalStorage<{ id: number; text: string; completed: boolean }[]>("todos", [])
  const [newTodo, setNewTodo] = useState("")

  const addTodo = () => {
    if (!newTodo.trim()) return
    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }])
    setNewTodo("")
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const removeTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  return (
    <Card className="dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="h-5 w-5" />
          Todo List
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a task..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            className="dark:bg-slate-800 dark:border-slate-700"
          />
          <Button onClick={addTodo}>Add</Button>
        </div>
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center gap-2 group">
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} id={`todo-${todo.id}`} />
              <Label
                htmlFor={`todo-${todo.id}`}
                className={`flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {todo.text}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
