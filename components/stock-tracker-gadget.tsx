"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, Plus, Trash2, RefreshCw, ArrowUp, ArrowDown } from "lucide-react"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Stock {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
}

// Sample stock data (in a real app, this would come from an API)
const sampleStocks: Record<string, Stock> = {
  AAPL: {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 182.63,
    change: 1.25,
    changePercent: 0.69,
  },
  MSFT: {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 417.88,
    change: 2.45,
    changePercent: 0.59,
  },
  GOOGL: {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 152.06,
    change: -0.78,
    changePercent: -0.51,
  },
  AMZN: {
    symbol: "AMZN",
    name: "Amazon.com, Inc.",
    price: 178.75,
    change: 1.32,
    changePercent: 0.74,
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 175.34,
    change: -3.21,
    changePercent: -1.8,
  },
  META: {
    symbol: "META",
    name: "Meta Platforms, Inc.",
    price: 485.58,
    change: 5.67,
    changePercent: 1.18,
  },
  NFLX: {
    symbol: "NFLX",
    name: "Netflix, Inc.",
    price: 628.82,
    change: 3.45,
    changePercent: 0.55,
  },
}

export default function StockTrackerGadget() {
  const [watchlist, setWatchlist] = useLocalStorage<string[]>("stockWatchlist", ["AAPL", "MSFT", "GOOGL"])
  const [stocks, setStocks] = useState<Stock[]>([])
  const [newSymbol, setNewSymbol] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    refreshStocks()
  }, [watchlist])

  const refreshStocks = () => {
    setLoading(true)

    // In a real app, this would be an API call
    // For this demo, we'll use the sample data
    setTimeout(() => {
      const stockData = watchlist.map((symbol) => sampleStocks[symbol]).filter(Boolean)

      // Add some random variation to prices
      const updatedStocks = stockData.map((stock) => {
        const variation = (Math.random() * 2 - 1) * 2 // Random between -2 and 2
        const newPrice = Math.max(0, stock.price + variation)
        const change = newPrice - stock.price + stock.change
        const changePercent = (change / newPrice) * 100

        return {
          ...stock,
          price: Number.parseFloat(newPrice.toFixed(2)),
          change: Number.parseFloat(change.toFixed(2)),
          changePercent: Number.parseFloat(changePercent.toFixed(2)),
        }
      })

      setStocks(updatedStocks)
      setLoading(false)
    }, 1000)
  }

  const addStock = () => {
    if (!newSymbol.trim()) return

    const symbol = newSymbol.toUpperCase()
    if (watchlist.includes(symbol) || !sampleStocks[symbol]) {
      // In a real app, you would validate the symbol against an API
      setNewSymbol("")
      return
    }

    setWatchlist([...watchlist, symbol])
    setNewSymbol("")
  }

  const removeStock = (symbol: string) => {
    setWatchlist(watchlist.filter((s) => s !== symbol))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Stock Tracker
        </CardTitle>
        <Button variant="outline" size="icon" onClick={refreshStocks} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add symbol (e.g., AAPL)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStock()}
          />
          <Button onClick={addStock}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {stocks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            {loading ? "Loading stocks..." : "No stocks in watchlist. Add some to get started."}
          </div>
        ) : (
          <div className="space-y-2">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{stock.symbol}</h3>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeStock(stock.symbol)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${stock.price.toFixed(2)}</div>
                  <div
                    className={`text-xs flex items-center justify-end ${
                      stock.change >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {stock.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
