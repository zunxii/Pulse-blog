'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { FeedContainer } from '@/components/feed/FeedContainer'
import { TrendingTopics } from '@/components/feed/TrendingTopics'
import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { RecommendedAuthors } from '@/components/feed/RecommendedAuthors'

export default function FeedPage() {
  useSmoothScroll()

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <Sidebar />

        {/* Main Feed */}
        <main className="flex-1 ml-0 md:ml-20 lg:ml-64 px-4 md:px-8 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Blog Feed */}
              <div className="lg:col-span-2">
                <FeedContainer />
              </div>

              {/* Sidebar */}
              <div className="hidden lg:block space-y-8 sticky top-8 h-fit">
                <TrendingTopics />
                <RecommendedAuthors />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

