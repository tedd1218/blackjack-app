"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import { PlayingCard } from "@/components/playing-card"
import { createDeck, dealCard, calculateHandValue, calculateHandValues, getBasicStrategyDecision } from "@/lib/blackjack"
import type { Card as CardType } from "@/lib/types"

export default function TrainingPage() {
  const [deck, setDeck] = useState<CardType[]>([])
  const [playerHand, setPlayerHand] = useState<CardType[]>([])
  const [dealerUpCard, setDealerUpCard] = useState<CardType | null>(null)
  const [correctAnswer, setCorrectAnswer] = useState<string>("")
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
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
    setDeck(createDeck())
    generateNewScenario()
    
    // Trigger fade-in animations
    setTimeout(() => setIsPageLoaded(true), 100)
  }, [])

  const generateNewScenario = () => {
    const newDeck = createDeck()
    const newPlayerHand: CardType[] = []

    // Generate initial 2-card hand (standard Blackjack starting hand)
    newPlayerHand.push(dealCard(newDeck))
    newPlayerHand.push(dealCard(newDeck))

    const newDealerUpCard = dealCard(newDeck)
    const optimalDecision = getBasicStrategyDecision(newPlayerHand, newDealerUpCard)

    setDeck(newDeck)
    setPlayerHand(newPlayerHand)
    setDealerUpCard(newDealerUpCard)
    setCorrectAnswer(optimalDecision)
    setUserAnswer("")
    setShowResult(false)
  }

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer)
    setShowResult(true)

    const isCorrect = answer.toLowerCase() === correctAnswer.toLowerCase()
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }))
  }

  const getExplanation = () => {
    const playerValue = calculateHandValue(playerHand)
    const dealerValue = dealerUpCard ? dealerUpCard.value : 0
    const dealerDisplay = dealerUpCard?.value === 1 ? "A" : dealerUpCard?.value.toString()

    // Simplified explanations for common scenarios
    if (correctAnswer.toLowerCase() === "hit") {
      if (playerValue <= 11) {
        return "With a hand value of 11 or less, you can't bust, so always hit."
      } else if (playerValue <= 16 && dealerValue >= 7) {
        return `With ${playerValue} against dealer ${dealerDisplay}, the dealer has a strong upcard, so you need to improve your hand.`
      }
    } else if (correctAnswer.toLowerCase() === "stand") {
      if (playerValue >= 17) {
        return "With 17 or higher, you have a strong hand and should stand."
      } else if (playerValue >= 12 && dealerValue <= 6) {
        return `With ${playerValue} against dealer ${dealerDisplay}, the dealer is likely to bust, so stand.`
      }
    }

    return "This follows basic strategy charts used by professional players."
  }

  const nextScenario = () => {
    generateNewScenario()
  }

  const resetScore = () => {
    setScore({ correct: 0, total: 0 })
  }

  const getScorePercentage = () => {
    return score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Gradient background */}
      <div
        className="fixed inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, #d16ba5, #86a8e7, #5ffbf1)' }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto p-2 sm:p-4">
        <div className={`flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6 transition-all duration-700 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Link href="/">
            <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Strategy Training</h1>
        </div>

        {/* Score */}
        <div className={`grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 transition-all duration-700 ease-out delay-200 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card style={cardStyle}>
            <CardContent className="pt-2 sm:pt-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{score.correct}</div>
                <div className="text-xs sm:text-sm text-white">Correct</div>
              </div>
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent className="pt-2 sm:pt-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{score.total}</div>
                <div className="text-xs sm:text-sm text-white">Total</div>
              </div>
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent className="pt-2 sm:pt-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">{getScorePercentage()}%</div>
                <div className="text-xs sm:text-sm text-white">Accuracy</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Training Scenario */}
        <Card style={cardStyle} className={`mb-4 sm:mb-6 transition-all duration-700 ease-out delay-400 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-white text-center text-sm sm:text-xl">What's the optimal decision?</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Dealer */}
              <div className="text-center">
                <h3 className="text-white font-semibold mb-2 sm:mb-4 text-sm sm:text-xl">Dealer Up Card</h3>
                <div className="flex justify-center">{dealerUpCard && <PlayingCard card={dealerUpCard} />}</div>
              </div>

              {/* Player */}
              <div className="text-center">
                <h3 className="text-white font-semibold mb-2 sm:mb-4 text-sm sm:text-xl flex items-center justify-center">
                  Your Hand
                  <Badge variant="secondary" className="ml-2 bg-blue-600 text-white text-xs sm:text-sm">
                    {calculateHandValues(playerHand).display}
                  </Badge>
                </h3>
                <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                  {playerHand.map((card, index) => (
                    <PlayingCard key={index} card={card} />
                  ))}
                </div>
              </div>
            </div>

            {/* Answer Buttons */}
            {!showResult && (
              <div className="flex gap-1 sm:gap-2 justify-center flex-wrap">
                <Button onClick={() => handleAnswer("Hit")} className="bg-red-600 hover:bg-red-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
                  Hit
                </Button>
                <Button onClick={() => handleAnswer("Stand")} className="bg-yellow-600 hover:bg-yellow-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
                  Stand
                </Button>
                <Button onClick={() => handleAnswer("Double")} className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
                  Double
                </Button>
                {playerHand.length === 2 && playerHand[0].value === playerHand[1].value && (
                  <Button onClick={() => handleAnswer("Split")} className="bg-orange-600 hover:bg-orange-700 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
                    Split
                  </Button>
                )}
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center gap-2">
                  {userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? (
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
                  ) : (
                    <XCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
                  )}
                  <span className="text-lg sm:text-xl font-semibold text-white">
                    {userAnswer.toLowerCase() === correctAnswer.toLowerCase() ? "Correct!" : "Incorrect"}
                  </span>
                </div>

                <div className="bg-white/5 rounded-lg p-3 sm:p-4">
                  <p className="text-white text-xs sm:text-sm mb-2">
                    <strong>Your answer:</strong> {userAnswer}
                  </p>
                  <p className="text-green-200 text-xs sm:text-sm mb-2">
                    <strong>Correct answer:</strong> {correctAnswer}
                  </p>
                </div>

                <div className="flex gap-1 sm:gap-2 justify-center">
                  <Button onClick={nextScenario} className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2">
                    Next Scenario
                  </Button>
                  <Button
                    onClick={resetScore}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm px-3 sm:px-4 py-1 sm:py-2"
                  >
                    Reset Score
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Strategy Tips */}
        <Card style={cardStyle} className={`transition-all duration-700 ease-out delay-600 hidden sm:block ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-white text-xs sm:text-xl">Basic Strategy Tips</CardTitle>
          </CardHeader>
          <CardContent className="px-2 sm:px-6 pt-0 pb-2 sm:pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-green-100">
              <div>
                <h4 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Hard Hands (No Ace or Ace = 1)</h4>
                <ul className="space-y-0.5 sm:space-y-1 text-xs">
                  <li>• Always hit on 8 or less</li>
                  <li>• Always stand on 17 or more</li>
                  <li>• Hit 12-16 vs dealer 7-A</li>
                  <li>• Stand 12-16 vs dealer 2-6</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">Soft Hands (Ace = 11)</h4>
                <ul className="space-y-0.5 sm:space-y-1 text-xs">
                  <li>• Always stand on soft 19-21</li>
                  <li>• Double soft 13-18 vs dealer 5-6</li>
                  <li>• Hit soft 13-17 vs dealer 2-4, 7-A</li>
                  <li>• Stand soft 18 vs dealer 2-8</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
