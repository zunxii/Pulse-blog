'use client'

import { trpc } from '@/lib/trpc/client'
import { FileText, Eye, Heart, MessageCircle } from 'lucide-react'

export function DashboardStats() {
  const { data: posts, isLoading } = trpc.posts.getAll.useQuery({
    published: undefined,
    limit: 100,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    )
  }

  const stats = {
    totalPosts: posts?.length || 0,
    publishedPosts: posts?.filter(p => p.published).length || 0,
    draftPosts: posts?.filter(p => !p.published).length || 0,
    totalViews: posts?.reduce((sum, p) => sum + p.views, 0) || 0,
    totalLikes: posts?.reduce((sum, p) => sum + p.likes, 0) || 0,
    totalComments: posts?.reduce((sum, p) => sum + p.comments, 0) || 0,
  }

  const statCards = [
    {
      icon: FileText,
      label: 'Total Posts',
      value: stats.totalPosts,
      subtext: `${stats.publishedPosts} published, ${stats.draftPosts} drafts`,
      color: 'from-blue-500/20 to-cyan-500/20',
    },
    {
      icon: Eye,
      label: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      subtext: 'Across all posts',
      color: 'from-purple-500/20 to-pink-500/20',
    },
    {
      icon: Heart,
      label: 'Total Likes',
      value: stats.totalLikes.toLocaleString(),
      subtext: 'From readers',
      color: 'from-red-500/20 to-orange-500/20',
    },
    {
      icon: MessageCircle,
      label: 'Total Comments',
      value: stats.totalComments.toLocaleString(),
      subtext: 'Engagement',
      color: 'from-green-500/20 to-emerald-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, idx) => (
        <div
          key={idx}
          className="relative group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300 overflow-hidden"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-50 group-hover:opacity-70 transition-opacity`} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-white/80 mb-1">{stat.label}</p>
            <p className="text-xs text-white/50">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  )
}