"use client"

import { Card } from "@/components/ui/card"
import { Heart, Diamond, Club, Spade } from "lucide-react"
import type { Card as CardType } from "@/lib/types"
import { useState, useEffect } from "react"

interface PlayingCardProps {
  card: CardType
  hidden?: boolean
  isDealing?: boolean
  dealDelay?: number
}

export function PlayingCard({ card, hidden = false, isDealing = false, dealDelay = 0 }: PlayingCardProps) {
  const [isVisible, setIsVisible] = useState(!isDealing)
  const [isFlipping, setIsFlipping] = useState(false)
  const [showFront, setShowFront] = useState(!hidden)

  useEffect(() => {
    if (isDealing) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, dealDelay)
      return () => clearTimeout(timer)
    }
  }, [isDealing, dealDelay])

  useEffect(() => {
    if (hidden !== !showFront && isVisible) {
      setIsFlipping(true)
      setTimeout(() => {
        setShowFront(!hidden)
        setTimeout(() => setIsFlipping(false), 150)
      }, 150)
    }
  }, [hidden, showFront, isVisible])

  const getSuitIcon = () => {
    switch (card.suit) {
      case "hearts":
        return <Heart className="w-4 h-4 text-red-500 fill-current" />
      case "diamonds":
        return <Diamond className="w-4 h-4 text-red-500 fill-current" />
      case "clubs":
        return <Club className="w-4 h-4 text-black fill-current" />
      case "spades":
        return <Spade className="w-4 h-4 text-black fill-current" />
    }
  }

  const getDisplayValue = () => {
    if (card.value === 1) return "A"
    if (card.value === 11) return "J"
    if (card.value === 12) return "Q"
    if (card.value === 13) return "K"
    return card.value.toString()
  }

  const isRed = card.suit === "hearts" || card.suit === "diamonds"

  if (!isVisible) {
    return <div className="w-16 h-24" /> // Placeholder space
  }

  return (
    <div
      className={`
        w-16 h-24 transition-all duration-300 ease-in-out transform
        ${isDealing ? "animate-slide-in" : ""}
        ${isFlipping ? "scale-x-0" : "scale-x-100"}
      `}
      style={{
        perspective: "1000px",
      }}
    >
      <Card
        className={`
          w-full h-full border-2 border-gray-300 flex flex-col items-center justify-between p-1 relative
          transition-all duration-300 ease-in-out
          ${showFront ? "bg-white" : "bg-blue-900 border-blue-700"}
          ${isFlipping ? "transform rotateY-180" : ""}
        `}
      >
        {showFront ? (
          <>
            <div className={`text-xs font-bold ${isRed ? "text-red-500" : "text-black"}`}>{getDisplayValue()}</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{getSuitIcon()}</div>
            <div className={`text-xs font-bold transform rotate-180 ${isRed ? "text-red-500" : "text-black"}`}>
              {getDisplayValue()}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-white text-xs font-bold">?</div>
          </div>
        )}
      </Card>
    </div>
  )
}
