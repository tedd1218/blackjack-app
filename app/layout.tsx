import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Blackjack Basic Strategy Trainer',
  description: 'Master basic strategy and play against the computer',
  generator: 'v0.dev',
  icons: {
    icon: '/Icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
