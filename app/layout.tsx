import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TRPCProvider } from '@/server/trpc/Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pulse - Modern Blogging Platform',
  description: 'A billion-dollar blogging experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black antialiased`}>
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  )
}