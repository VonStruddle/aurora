import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Polar Analytics',
  description: 'The all-in-one data stack for ecommerce brands.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body className="min-h-screen bg-[#0A0F1E] text-white antialiased">
        {children}
      </body>
    </html>
  )
}
