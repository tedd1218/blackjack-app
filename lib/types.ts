export interface Card {
  suit: "hearts" | "diamonds" | "clubs" | "spades"
  value: number // 1-13 (1=Ace, 11=Jack, 12=Queen, 13=King)
}

export interface GameState {
  deck: Card[]
  playerHand: Card[]
  dealerHand: Card[]
  playerScore: number
  dealerScore: number
  gameStatus: "betting" | "playing" | "finished"
  message: string
  playerMoney: number
  currentBet: number
  wins: number
  losses: number
  pushes: number
}
