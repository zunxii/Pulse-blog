'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Search, 
  PenSquare, 
  LayoutDashboard,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { icon: Home, label: 'Feed', href: '/feed' },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Search, label: 'Search', href: '/search' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-20 lg:w-64 fixed left-0 top-0 h-screen border-r border-white/5 flex-col z-50 bg-black">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-white/60 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <span className="hidden lg:block text-2xl font-bold">Pulse</span>
          </Link>
        </div>

        {/* Write Button */}
        <div className="px-3 mb-4">
          <Button 
            className="w-full bg-white text-black hover:bg-white/90 font-medium justify-start gap-3"
            asChild
          >
            <Link href="/write">
              <PenSquare className="w-5 h-5" />
              <span className="hidden lg:block">Write</span>
            </Link>
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "scale-110")} />
                <span className="hidden lg:block font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-black/95 border-t border-white/5 z-50 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-3">
          {[
            { icon: Home, href: '/feed' },
            { icon: LayoutDashboard, href: '/dashboard' },
            { icon: Search, href: '/search' },
            { icon: PenSquare, href: '/write' },
          ].map((item, idx) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={idx}
                href={item.href}
                className={cn(
                  "p-3 rounded-xl transition-all duration-200",
                  isActive ? "text-white bg-white/10" : "text-white/60"
                )}
              >
                <item.icon className="w-6 h-6" />
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}