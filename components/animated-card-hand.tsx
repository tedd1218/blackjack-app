import { PlayingCard } from "./playing-card"
import type { Card } from "@/lib/types"

interface AnimatedCardHandProps {
  cards: Card[]
  isDealer?: boolean
  showAllCards?: boolean
  isDealing?: boolean
}

export function AnimatedCardHand({
  cards,
  isDealer = false,
  showAllCards = true,
  isDealing = false,
}: AnimatedCardHandProps) {
  return (
    <div className="flex gap-1 sm:gap-2 flex-wrap justify-center">
      {cards.map((card, index) => (
        <PlayingCard
          key={`${card.suit}-${card.value}-${index}`}
          card={card}
          hidden={isDealer && index === 1 && !showAllCards}
          isDealing={isDealing}
          dealDelay={index * 100}
        />
      ))}
    </div>
  )
}
