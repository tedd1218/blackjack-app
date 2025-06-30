"use client"

import type { Card as CardType } from "@/lib/types"
import { useState, useEffect } from "react"
import Image from "next/image"

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
      // Change the image at the middle of the flip (when card is sideways)
      setTimeout(() => {
        setShowFront(!hidden)
      }, 300) // This matches the 50% point of the 600ms flip animation
      // Stop flipping animation after it completes
      setTimeout(() => {
        setIsFlipping(false)
      }, 600)
    }
  }, [hidden, showFront, isVisible])

  const getCardFileName = () => {
    const suitMap = {
      hearts: "H",
      diamonds: "D", 
      clubs: "C",
      spades: "S"
    }
    
    const valueMap: Record<number, string> = {
      1: "A",
      11: "J",
      12: "Q", 
      13: "K"
    }
    
    const suit = suitMap[card.suit]
    const value = valueMap[card.value] || card.value.toString()
    
    return `${value}${suit}.svg`
  }

  if (!isVisible) {
    return <div className="w-32 h-48" /> // Placeholder space
  }

  return (
    <div
      className={`
        w-32 h-48 transition-all duration-500 ease-in-out transform
        ${isDealing ? "animate-slide-in" : ""}
        ${isFlipping ? "animate-flip" : ""}
      `}
    >
      <Image
        src={showFront ? `/cards/${getCardFileName()}` : "/cards/back.svg"}
        alt={showFront ? `${card.value} of ${card.suit}` : "Card back"}
        fill
        className="object-contain"
        sizes="64px"
      />
    </div>
  )
}
