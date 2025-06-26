import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spade, Heart, Diamond, Club } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Blackjack Trainer</h1>
          <p className="text-green-100 text-lg">Master basic strategy and play against the computer</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Spade className="w-5 h-5" />
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                Play Blackjack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-4">
                Play a full game of Blackjack against the computer dealer. Test your skills and see how well you can do!
              </p>
              <Link href="/game">
                <Button className="w-full bg-green-600 hover:bg-green-700">Start Playing</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="flex gap-1">
                  <Diamond className="w-5 h-5 text-red-500" />
                  <Club className="w-5 h-5" />
                </div>
                Strategy Training
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-100 mb-4">
                Learn optimal Blackjack basic strategy. Practice making the right decisions in different scenarios.
              </p>
              <Link href="/training">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Start Training</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <h3 className="text-white font-semibold mb-2">How to Play</h3>
              <p className="text-green-100 text-sm">
                Get as close to 21 as possible without going over. Face cards are worth 10, Aces are worth 1 or 11. Beat
                the dealer by having a higher hand value without busting!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
