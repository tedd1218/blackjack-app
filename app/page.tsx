"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spade, Heart, Diamond, Club } from "lucide-react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose
} from "@/components/ui/dialog"

export default function HomePage() {
  const [isPageLoaded, setIsPageLoaded] = useState(false)

  useEffect(() => {
    // Trigger fade-in animations
    setTimeout(() => setIsPageLoaded(true), 100)
  }, [])

  return (
    <div className="relative min-h-screen w-full">
      {/* Background image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/background.jpg)' }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>
      {/* Main content */}
      <div className="relative z-10 max-w-4xl w-full mx-auto mt-10 sm:mt-20 px-2 sm:px-4">
        <div className={`text-center mb-6 sm:mb-8 transition-all duration-700 ease-out ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">Blackjack Basic Strategy Trainer</h1>
          <p className="text-green-100 text-base sm:text-lg mt-2">Master basic strategy and play against the computer</p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 transition-all duration-700 ease-out delay-200 ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card
            className="glass-card text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-2xl">
                <div className="flex gap-1">
                  <Spade className="w-4 h-4 sm:w-5 sm:h-5" />
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                </div>
                Play Blackjack
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pt-0 pb-2 sm:px-6 sm:pt-0 sm:pb-4">
              <p className="text-green-100 -mt-2 mb-2 sm:mb-4 text-xs sm:text-sm">
                Play a full game of Blackjack against the computer dealer. Test your skills and see how well you can do!
              </p>
              <Link href="/game">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-2 sm:py-3">Start Playing</Button>
              </Link>
            </CardContent>
          </Card>

          <Card
            className="glass-card text-white"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <CardHeader className="pb-2 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg md:text-2xl">
                <div className="flex gap-1">
                  <Diamond className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
                  <Club className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                Strategy Training
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pt-0 pb-2 sm:px-6 sm:pt-0 sm:pb-4">
              <p className="text-green-100 -mt-2 mb-2 sm:mb-4 text-xs sm:text-sm">
                Learn optimal Blackjack basic strategy. Practice making the right decisions in different scenarios.
              </p>
              <Link href="/training">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm py-2 sm:py-3">Start Training</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className={`mt-6 sm:mt-8 text-center transition-all duration-700 ease-out delay-400 hidden sm:block ${isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Card
            className="glass-card"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <h3 className="text-white font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Basic Strategy Cheat Sheets</h3>
              <div className="flex flex-col md:flex-row gap-3 sm:gap-4 justify-center items-center mt-3 sm:mt-4">
                {/* Mini Blackjack Chart */}
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src="/mini-blackjack-chart.png"
                      alt="Mini Blackjack Basic Strategy Chart"
                      className="w-48 sm:w-56 md:w-64 h-auto rounded cursor-pointer border border-white/20 hover:shadow-lg transition-shadow"
                    />
                  </DialogTrigger>
                  <DialogContent className="flex items-center justify-center bg-transparent border-none p-0 max-w-4xl w-full max-h-[90vh]">
                    <div className="relative">
                      <img
                        src="/mini-blackjack-chart.png"
                        alt="Mini Blackjack Basic Strategy Chart Full"
                        className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded shadow-lg"
                      />
                      <DialogClose asChild>
                        <button
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 z-10 hover:bg-black/80 transition"
                          aria-label="Close"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </DialogClose>
                    </div>
                    <style jsx global>{`
                      [data-state='open'] > .absolute.right-4.top-4 {
                        display: none;
                      }
                    `}</style>
                  </DialogContent>
                </Dialog>
                {/* Tedd's Blackjack Sheet */}
                <Dialog>
                  <DialogTrigger asChild>
                    <img
                      src="/tedd-blackjack-sheet.png"
                      alt="Tedd's Blackjack Strategy Sheet"
                      className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[395px] h-auto rounded cursor-pointer border border-white/20 hover:shadow-lg transition-shadow"
                    />
                  </DialogTrigger>
                  <DialogContent className="flex items-center justify-center bg-transparent border-none p-0 max-w-4xl w-full max-h-[90vh]">
                    <div className="relative">
                      <img
                        src="/tedd-blackjack-sheet.png"
                        alt="Tedd's Blackjack Strategy Sheet Full"
                        className="max-w-full max-h-[80vh] w-auto h-auto object-contain rounded shadow-lg"
                      />
                      <DialogClose asChild>
                        <button
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-2 z-10 hover:bg-black/80 transition"
                          aria-label="Close"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </DialogClose>
                    </div>
                    <style jsx global>{`
                      [data-state='open'] > .absolute.right-4.top-4 {
                        display: none;
                      }
                    `}</style>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
