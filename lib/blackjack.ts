import type { Card } from "./types"

export function createDeck(): Card[] {
  const suits: Card["suit"][] = ["hearts", "diamonds", "clubs", "spades"]
  const deck: Card[] = []

  for (const suit of suits) {
    for (let value = 1; value <= 13; value++) {
      deck.push({ suit, value })
    }
  }

  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }

  return deck
}

export function dealCard(deck: Card[]): Card {
  const card = deck.pop()
  if (!card) throw new Error("Deck is empty")
  return card
}

export function calculateHandValue(hand: Card[]): number {
  let value = 0
  let aces = 0

  for (const card of hand) {
    if (card.value === 1) {
      aces++
      value += 11
    } else if (card.value > 10) {
      value += 10
    } else {
      value += card.value
    }
  }

  // Convert Aces from 11 to 1 if needed
  while (value > 21 && aces > 0) {
    value -= 10
    aces--
  }

  return value
}

export function getBasicStrategyDecision(playerHand: Card[], dealerUpCard: Card): string {
  const playerValue = calculateHandValue(playerHand)
  const dealerValue = dealerUpCard.value === 1 ? 11 : Math.min(dealerUpCard.value, 10)
  const hasAce = playerHand.some((card) => card.value === 1) && playerValue <= 21
  const canSplit = playerHand.length === 2 && playerHand[0].value === playerHand[1].value

  // Pairs
  if (canSplit) {
    const pairValue = playerHand[0].value
    if (pairValue === 1 || pairValue === 8) return "Split" // Always split Aces and 8s
    if (pairValue === 10 || pairValue === 5) return "Stand" // Never split 10s or 5s
    if (pairValue === 9) {
      if (dealerValue === 7 || dealerValue === 10 || dealerValue === 11) return "Stand"
      return "Split"
    }
    if (pairValue === 7 || pairValue === 6 || pairValue === 3 || pairValue === 2) {
      if (dealerValue <= 7) return "Split"
      return "Hit"
    }
    if (pairValue === 4) return "Hit"
  }

  // Soft hands (with Ace counted as 11)
  if (hasAce && playerValue !== 21) {
    if (playerValue >= 19) return "Stand"
    if (playerValue === 18) {
      if (dealerValue <= 8) return "Stand"
      return "Hit"
    }
    if (playerValue >= 13 && playerValue <= 17) {
      if (dealerValue === 5 || dealerValue === 6) return "Double"
      return "Hit"
    }
  }

  // Hard hands
  if (playerValue >= 17) return "Stand"
  if (playerValue >= 13 && playerValue <= 16) {
    if (dealerValue <= 6) return "Stand"
    return "Hit"
  }
  if (playerValue === 12) {
    if (dealerValue >= 4 && dealerValue <= 6) return "Stand"
    return "Hit"
  }
  if (playerValue === 11) {
    if (dealerValue <= 10) return "Double"
    return "Hit"
  }
  if (playerValue === 10) {
    if (dealerValue <= 9) return "Double"
    return "Hit"
  }
  if (playerValue === 9) {
    if (dealerValue >= 3 && dealerValue <= 6) return "Double"
    return "Hit"
  }

  return "Hit"
}
