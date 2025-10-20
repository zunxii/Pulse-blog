'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentPosts } from '@/components/dashboard/RecentPosts'
import { useSmoothScroll } from '@/lib/hooks/useSmoothScroll'
import Link from 'next/link'
import { PenSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  useSmoothScroll()

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-20 lg:ml-64 px-4 md:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-white/60">Manage your posts and track performance</p>
              </div>
              <Button asChild className="bg-white text-black hover:bg-white/90">
                <Link href="/write">
                  <PenSquare className="w-4 h-4 mr-2" />
                  New Post
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <DashboardStats />

            {/* Recent Posts */}
            <RecentPosts />
          </div>
        </main>
      </div>
    </div>
  )
}