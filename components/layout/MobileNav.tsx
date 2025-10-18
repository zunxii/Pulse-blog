'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <div className="fixed inset-0 bg-black/95 backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center h-full gap-8">
          <Link
            href="#features"
            onClick={onClose}
            className="text-2xl text-white/60 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="#showcase"
            onClick={onClose}
            className="text-2xl text-white/60 hover:text-white transition-colors"
          >
            Showcase
          </Link>
          <Link
            href="/feed"
            onClick={onClose}
            className="text-2xl text-white/60 hover:text-white transition-colors"
          >
            Explore
          </Link>
          <div className="flex flex-col gap-4 mt-8 w-64">
            <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5">
              Sign In
            </Button>
            <Button className="w-full bg-white text-black hover:bg-white/90">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
