'use client'

import { useState } from 'react'
import { FileText, Heart, Bookmark, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'liked', label: 'Liked', icon: Heart },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'following', label: 'Following', icon: Users },
]

export function ProfileTabs() {
  const [activeTab, setActiveTab] = useState('articles')

  return (
    <div className="border-b border-white/5 mb-8 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex items-center gap-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 py-4 border-b-2 transition-all duration-200 whitespace-nowrap",
              activeTab === tab.id
                ? "border-white text-white"
                : "border-transparent text-white/40 hover:text-white/60"
            )}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
