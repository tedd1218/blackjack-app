"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createDeck, dealCard, calculateHandValue, calculateHandValues, getBasicStrategyDecision } from "@/lib/blackjack"
import type { Card as CardType, GameState } from "@/lib/types"
import { AnimatedCardHand } from "@/components/animated-card-hand"

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    playerHand: [],
    dealerHand: [],
    playerScore: 0,
    dealerScore: 0,
    gameStatus: "betting",
    message: "Place your bet to start!",
    playerMoney: 1000,
    currentBet: 0,
    wins: 0,
    losses: 0,
    pushes: 0,
  })

  const [showDealerCard, setShowDealerCard] = useState(false)
  const [playerStood, setPlayerStood] = useState(false)
  const [isActionInProgress, setIsActionInProgress] = useState(false)
  const [dealerVisibleScore, setDealerVisibleScore] = useState<string>("0")
  const [isInitialDeal, setIsInitialDeal] = useState(false)
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  useEffect(() => {
    // Initialize deck
    setGameState((prev) => ({ ...prev, deck: createDeck() }))
    
    // Trigger fade-in animations
    setTimeout(() => setIsPageLoaded(true), 100)
  }, [])

  const placeBet = (amount: number) => {
    if (gameState.playerMoney < amount) return

    const newDeck = [...gameState.deck]
    const playerHand: CardType[] = []
    const dealerHand: CardType[] = []

    // Deal initial cards
    playerHand.push(dealCard(newDeck))
    dealerHand.push(dealCard(newDeck))
    playerHand.push(dealCard(newDeck))
    dealerHand.push(dealCard(newDeck))

    const playerScore = calculateHandValue(playerHand)
    const dealerScore = calculateHandValue([dealerHand[0]]) // Only show first card

    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      playerHand,
      dealerHand,
      playerScore,
      dealerScore,
      currentBet: amount,
      playerMoney: prev.playerMoney - amount,
      gameStatus: "playing",
      message: playerScore === 21 ? "Blackjack!" : "Make your move!",
    }))

    setShowDealerCard(false)
    setDealerVisibleScore(calculateHandValues([dealerHand[0]]).display)
    setIsInitialDeal(true)

    // Clear initial deal state after animation completes
    setTimeout(() => {
      setIsInitialDeal(false)
    }, 1200) // Allow time for all cards to animate

    // Check for blackjack
    if (playerScore === 21) {
      setTimeout(() => checkForWinner(playerHand, dealerHand, newDeck, amount), 1000)
    }
  }

  const hit = async () => {
    if (gameState.gameStatus !== "playing" || isActionInProgress) return

    setIsActionInProgress(true)

    const newDeck = [...gameState.deck]
    const newPlayerHand = [...gameState.playerHand]
    const newCard = dealCard(newDeck)
    newPlayerHand.push(newCard)

    const newPlayerScore = calculateHandValue(newPlayerHand)

    // Update state immediately to trigger card animation
    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      playerHand: [...newPlayerHand],
      playerScore: newPlayerScore,
      message: newPlayerScore > 21 ? "Bust! You lose!" : "Make your move!",
    }))

    // Wait for card animation to complete before checking for bust
    if (newPlayerScore > 21) {
      setTimeout(() => {
        endGame("lose")
        setIsActionInProgress(false)
      }, 600)
    } else {
      // Re-enable buttons after animation completes
      setTimeout(() => {
        setIsActionInProgress(false)
      }, 600) // Match the card animation duration
    }
  }

  const stand = async () => {
    if (gameState.gameStatus !== "playing" || isActionInProgress) return

    setIsActionInProgress(true)
    
    // Disable buttons by setting player stood state
    setPlayerStood(true)
    
    // Trigger dealer card flip animation
    setShowDealerCard(true)
    
    // Update dealer visible score after flip animation starts
    setTimeout(() => {
      setDealerVisibleScore(calculateHandValues(gameState.dealerHand).display)
    }, 400) // Delay to allow flip to start
    
    // Add delay to allow dealer card flip animation to complete
    await new Promise((resolve) => setTimeout(resolve, 800))
    await dealerPlay()
  }

  const double = async () => {
    if (gameState.gameStatus !== "playing" || isActionInProgress) return
    if (gameState.playerMoney < gameState.currentBet) return // Can't double if not enough money

    setIsActionInProgress(true)

    const newDeck = [...gameState.deck]
    const newPlayerHand = [...gameState.playerHand]
    const newCard = dealCard(newDeck)
    newPlayerHand.push(newCard)

    const newPlayerScore = calculateHandValue(newPlayerHand)

    // Double the bet
    const doubledBet = gameState.currentBet * 2

    // Update state immediately to trigger card animation
    setGameState((prev) => ({
      ...prev,
      deck: newDeck,
      playerHand: [...newPlayerHand],
      playerScore: newPlayerScore,
      currentBet: doubledBet,
      playerMoney: prev.playerMoney - prev.currentBet, // Deduct the additional bet
      message: newPlayerScore > 21 ? "Bust! You lose!" : "Double down complete!",
    }))

    // Wait for card animation to complete, then automatically stand
    setTimeout(async () => {
      if (newPlayerScore > 21) {
        endGame("lose")
        setIsActionInProgress(false)
      } else {
        // Automatically stand after double
        setPlayerStood(true)
        setShowDealerCard(true)
        
        setTimeout(() => {
          setDealerVisibleScore(calculateHandValues(gameState.dealerHand).display)
        }, 400)
        
        await new Promise((resolve) => setTimeout(resolve, 800))
        await dealerPlay()
      }
    }, 600)
  }

  const dealerPlay = async () => {
    const newDeck = [...gameState.deck]
    const newDealerHand = [...gameState.dealerHand]

    // Dealer hits on soft 17 with animation
    while (calculateHandValue(newDealerHand) < 17) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      newDealerHand.push(dealCard(newDeck))

      setGameState((prev) => ({
        ...prev,
        deck: newDeck,
        dealerHand: [...newDealerHand],
        dealerScore: calculateHandValue(newDealerHand),
      }))
      
      setDealerVisibleScore(calculateHandValues(newDealerHand).display)
    }

    const finalDealerScore = calculateHandValue(newDealerHand)

    setTimeout(() => {
      checkForWinner(gameState.playerHand, newDealerHand, newDeck, gameState.currentBet)
    }, 600)
  }

  const checkForWinner = (playerHand: CardType[], dealerHand: CardType[], deck: CardType[], bet: number) => {
    const playerScore = calculateHandValue(playerHand)
    const dealerScore = calculateHandValue(dealerHand)

    let result: "win" | "lose" | "push"
    let winnings = 0

    if (playerScore > 21) {
      result = "lose"
    } else if (dealerScore > 21) {
      result = "win"
      winnings = bet * 2
    } else if (playerScore === 21 && playerHand.length === 2 && dealerScore !== 21) {
      result = "win"
      winnings = bet * 2.5 // Blackjack pays 3:2
    } else if (playerScore > dealerScore) {
      result = "win"
      winnings = bet * 2
    } else if (playerScore < dealerScore) {
      result = "lose"
    } else {
      result = "push"
      winnings = bet // Return bet
    }

    endGame(result, winnings)
  }

  const endGame = (result: "win" | "lose" | "push", winnings = 0) => {
    setGameState((prev) => ({
      ...prev,
      playerMoney: prev.playerMoney + winnings,
      gameStatus: "finished",
      message: result === "win" ? `You win $${winnings}!` : result === "lose" ? "You lose!" : `Push! Bet returned.`,
      wins: result === "win" ? prev.wins + 1 : prev.wins,
      losses: result === "lose" ? prev.losses + 1 : prev.losses,
      pushes: result === "push" ? prev.pushes + 1 : prev.pushes,
    }))
    setShowDealerCard(true)
  }

  const newGame = () => {
    if (gameState.playerMoney <= 0) {
      setGameState((prev) => ({
        ...prev,
        playerMoney: 1000,
        wins: 0,
        losses: 0,
        pushes: 0,
      }))
    }

    setGameState((prev) => ({
      ...prev,
      deck: createDeck(),
      playerHand: [],
      dealerHand: [],
      playerScore: 0,
      dealerScore: 0,
      gameStatus: "betting",
      message: "Place your bet to start!",
      currentBet: 0,
    }))
    setShowDealerCard(false)
    setPlayerStood(false)
    setIsActionInProgress(false)
    setDealerVisibleScore("0")
  }

  const getOptimalMove = () => {
    if (gameState.gameStatus !== "playing" || gameState.dealerHand.length === 0) return null
    return getBasicStrategyDecision(gameState.playerHand, gameState.dealerHand[0])
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Gradient background */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: 'linear-gradient(320deg, #f27121, #e94057, #8a2387)' }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto p-2 sm:p-4">
        <div className={`flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 transition-all duration-700 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Blackjack Game</h1>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6 transition-all duration-700 ease-out delay-200 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card style={cardStyle}>
            <CardContent className="pt-2 sm:pt-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">${gameState.playerMoney}</div>
                <div className="text-xs sm:text-sm text-white">Money</div>
              </div>
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent className="pt-2 sm:pt-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">{gameState.wins}</div>
                <div className="text-xs sm:text-sm text-white">Wins</div>
              </div>
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent className="pt-2 sm:pt-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-400">{gameState.losses}</div>
                <div className="text-xs sm:text-sm text-white">Losses</div>
              </div>
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent className="pt-2 sm:pt-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">{gameState.pushes}</div>
                <div className="text-xs sm:text-sm text-white">Pushes</div>
              </div>
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent className="pt-2 sm:pt-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">${gameState.currentBet}</div>
                <div className="text-xs sm:text-sm text-white">Current Bet</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Area */}
        <div className={`grid gap-4 sm:gap-6 mb-4 sm:mb-6 transition-all duration-700 ease-out delay-400 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Dealer */}
          <Card style={cardStyle} className="w-full max-w-4xl lg:max-w-6xl mx-auto">
            <CardHeader className="pb-1 sm:pb-2">
              <CardTitle className="text-white flex justify-between text-base sm:text-lg md:text-xl lg:text-2xl">
                <span>Dealer</span>
                <Badge variant="secondary" className="bg-red-600 text-white text-xs sm:text-sm">
                  {gameState.dealerHand.length === 0 ? "0" : showDealerCard
                    ? calculateHandValues(gameState.dealerHand).display
                    : calculateHandValues([gameState.dealerHand[0]]).display}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-1 sm:p-3">
              <AnimatedCardHand
                cards={gameState.dealerHand}
                isDealer={true}
                showAllCards={showDealerCard}
                isDealing={isInitialDeal || (gameState.gameStatus === "playing" && gameState.dealerHand.length > 2)}
              />
            </CardContent>
          </Card>

          {/* Player */}
          <Card style={cardStyle} className="w-full max-w-4xl lg:max-w-6xl mx-auto">
            <CardHeader className="pb-1 sm:pb-2">
              <CardTitle className="text-white flex justify-between text-base sm:text-lg md:text-xl lg:text-2xl">
                <span>Your Hand</span>
                <Badge variant="secondary" className="bg-blue-600 text-white text-xs sm:text-sm">
                  {calculateHandValues(gameState.playerHand).display}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center p-1 sm:p-3">
              <AnimatedCardHand
                cards={gameState.playerHand}
                isDealing={gameState.gameStatus === "playing" && gameState.playerHand.length > 0}
              />
            </CardContent>
          </Card>
        </div>

        {/* Game Status */}
        <Card style={cardStyle} className={`mb-4 sm:mb-6 max-w-xs sm:max-w-sm md:max-w-md mx-auto transition-all duration-700 ease-out delay-600 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-center">
              <p className="text-base sm:text-lg md:text-xl text-white mb-3 sm:mb-4">{gameState.message}</p>

              {/* Betting Phase */}
              {gameState.gameStatus === "betting" && (
                <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                  <Button
                    onClick={() => placeBet(25)}
                    disabled={gameState.playerMoney < 25}
                    className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                  >
                    Bet $25
                  </Button>
                  <Button
                    onClick={() => placeBet(50)}
                    disabled={gameState.playerMoney < 50}
                    className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                  >
                    Bet $50
                  </Button>
                  <Button
                    onClick={() => placeBet(100)}
                    disabled={gameState.playerMoney < 100}
                    className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2"
                  >
                    Bet $100
                  </Button>
                </div>
              )}

              {/* Playing Phase */}
              {gameState.gameStatus === "playing" && (
                <div className="space-y-2 sm:space-y-4">
                  <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                    <Button 
                      onClick={hit} 
                      disabled={playerStood || isActionInProgress}
                      className={`text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 ${playerStood || isActionInProgress ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
                    >
                      Hit
                    </Button>
                    <Button 
                      onClick={stand} 
                      disabled={playerStood || isActionInProgress}
                      className={`text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 ${playerStood || isActionInProgress ? 'bg-gray-500 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700'}`}
                    >
                      Stand
                    </Button>
                    <Button 
                      onClick={double} 
                      disabled={playerStood || isActionInProgress || gameState.playerMoney < gameState.currentBet || gameState.playerHand.length !== 2}
                      className={`text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 ${playerStood || isActionInProgress || gameState.playerMoney < gameState.currentBet || gameState.playerHand.length !== 2 ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                      Double
                    </Button>
                  </div>
                </div>
              )}

              {/* Game Finished */}
              {gameState.gameStatus === "finished" && (
                <Button onClick={newGame} className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3">
                  New Game
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
