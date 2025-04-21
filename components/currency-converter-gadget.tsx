"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign } from "lucide-react"

// Sample exchange rates (in a real app, you would fetch these from an API)
const exchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.82,
  CAD: 1.36,
  AUD: 1.52,
  CNY: 7.24,
  INR: 83.12,
}

export default function CurrencyConverterGadget() {
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EUR")
  const [convertedAmount, setConvertedAmount] = useState("")

  // Calculate the converted amount when inputs change
  useEffect(() => {
    const numAmount = Number.parseFloat(amount)
    if (isNaN(numAmount)) {
      setConvertedAmount("")
      return
    }

    const rate =
      exchangeRates[toCurrency as keyof typeof exchangeRates] /
      exchangeRates[fromCurrency as keyof typeof exchangeRates]
    const result = numAmount * rate
    setConvertedAmount(result.toFixed(2))
  }, [amount, fromCurrency, toCurrency]) // Only run when these values change

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" />
        </div>

        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
          <Select value={fromCurrency} onValueChange={setFromCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(exchangeRates).map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={handleSwapCurrencies}
            className="p-2 rounded-full hover:bg-muted"
            aria-label="Swap currencies"
          >
            ⇄
          </button>

          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(exchangeRates).map((currency) => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="pt-2 border-t">
          <div className="text-sm text-muted-foreground">Converted Amount</div>
          <div className="text-2xl font-bold">{convertedAmount ? `${convertedAmount} ${toCurrency}` : "-"}</div>
          {amount && convertedAmount && (
            <div className="text-xs text-muted-foreground mt-1">
              1 {fromCurrency} ={" "}
              {(
                exchangeRates[toCurrency as keyof typeof exchangeRates] /
                exchangeRates[fromCurrency as keyof typeof exchangeRates]
              ).toFixed(4)}{" "}
              {toCurrency}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
