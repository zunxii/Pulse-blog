'use client'

import { TrendingUp } from 'lucide-react'

const topics = [
  { name: 'Web Development', posts: 1234 },
  { name: 'AI & Machine Learning', posts: 892 },
  { name: 'Design Systems', posts: 567 },
  { name: 'DevOps', posts: 423 },
  { name: 'Career Growth', posts: 789 },
]

export function TrendingTopics() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-white" />
        <h3 className="text-lg font-semibold text-white">Trending Topics</h3>
      </div>
      <div className="space-y-4">
        {topics.map((topic, idx) => (
          <button 
            key={idx}
            className="w-full text-left hover:bg-white/5 p-3 rounded-lg transition-colors group"
          >
            <p className="text-sm font-semibold text-white group-hover:text-white/80 transition-colors">
              {topic.name}
            </p>
            <p className="text-xs text-white/40 mt-1">{topic.posts} posts</p>
          </button>
        ))}
      </div>
    </div>
  )
}
    