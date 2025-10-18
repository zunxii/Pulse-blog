'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MobileNav } from './MobileNav'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-white/60 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight">Pulse</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                Features
              </Link>
              <Link href="#showcase" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                Showcase
              </Link>
              <Link href="/feed" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                Explore
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/5">
                Sign In
              </Button>
              <Button className="bg-white text-black hover:bg-white/90 font-medium">
                Get Started
              </Button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/80 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
