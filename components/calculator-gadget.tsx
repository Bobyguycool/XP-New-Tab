"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"

export default function CalculatorGadget() {
  const [display, setDisplay] = useState("0")
  const [firstOperand, setFirstOperand] = useState<number | null>(null)
  const [operator, setOperator] = useState<string | null>(null)
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false)

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit)
      setWaitingForSecondOperand(false)
    } else {
      setDisplay(display === "0" ? digit : display + digit)
    }
  }

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay("0.")
      setWaitingForSecondOperand(false)
      return
    }

    if (!display.includes(".")) {
      setDisplay(display + ".")
    }
  }

  const clearDisplay = () => {
    setDisplay("0")
    setFirstOperand(null)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  const handleOperator = (nextOperator: string) => {
    const inputValue = Number.parseFloat(display)

    if (firstOperand === null) {
      setFirstOperand(inputValue)
    } else if (operator) {
      const result = performCalculation()
      setDisplay(String(result))
      setFirstOperand(result)
    }

    setWaitingForSecondOperand(true)
    setOperator(nextOperator)
  }

  const performCalculation = () => {
    const inputValue = Number.parseFloat(display)

    if (operator === "+") {
      return firstOperand! + inputValue
    } else if (operator === "-") {
      return firstOperand! - inputValue
    } else if (operator === "*") {
      return firstOperand! * inputValue
    } else if (operator === "/") {
      return firstOperand! / inputValue
    }

    return inputValue
  }

  const handleEquals = () => {
    if (!operator || firstOperand === null) return

    const result = performCalculation()
    setDisplay(String(result))
    setFirstOperand(result)
    setOperator(null)
    setWaitingForSecondOperand(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-2 rounded-md mb-2 text-right">
          <div className="text-2xl font-mono tabular-nums truncate">{display}</div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          <Button variant="outline" onClick={() => clearDisplay()}>
            C
          </Button>
          <Button
            variant="outline"
            onClick={() => setDisplay(display.charAt(0) === "-" ? display.substring(1) : "-" + display)}
          >
            +/-
          </Button>
          <Button variant="outline" onClick={() => handleOperator("%")}>
            %
          </Button>
          <Button variant="outline" onClick={() => handleOperator("/")}>
            /
          </Button>

          <Button variant="outline" onClick={() => inputDigit("7")}>
            7
          </Button>
          <Button variant="outline" onClick={() => inputDigit("8")}>
            8
          </Button>
          <Button variant="outline" onClick={() => inputDigit("9")}>
            9
          </Button>
          <Button variant="outline" onClick={() => handleOperator("*")}>
            ×
          </Button>

          <Button variant="outline" onClick={() => inputDigit("4")}>
            4
          </Button>
          <Button variant="outline" onClick={() => inputDigit("5")}>
            5
          </Button>
          <Button variant="outline" onClick={() => inputDigit("6")}>
            6
          </Button>
          <Button variant="outline" onClick={() => handleOperator("-")}>
            -
          </Button>

          <Button variant="outline" onClick={() => inputDigit("1")}>
            1
          </Button>
          <Button variant="outline" onClick={() => inputDigit("2")}>
            2
          </Button>
          <Button variant="outline" onClick={() => inputDigit("3")}>
            3
          </Button>
          <Button variant="outline" onClick={() => handleOperator("+")}>
            +
          </Button>

          <Button variant="outline" onClick={() => inputDigit("0")} className="col-span-2">
            0
          </Button>
          <Button variant="outline" onClick={() => inputDecimal()}>
            .
          </Button>
          <Button variant="default" onClick={() => handleEquals()}>
            =
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
