'use client'

import Link from 'next/link'
import { ArrowRight, PenSquare, BookOpen, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { CTA } from '@/components/landing/CTA'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-white/60 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <PenSquare className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight">Pulse</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" className="text-white/80 hover:text-white hover:bg-white/5">
                <Link href="/feed">Explore</Link>
              </Button>
              <Button asChild className="bg-white text-black hover:bg-white/90 font-medium">
                <Link href="/write">Start Writing</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <Hero/>
      <Features/>
      <CTA/>

    </main>
  )
}