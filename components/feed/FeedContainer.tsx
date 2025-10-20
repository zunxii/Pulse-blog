'use client'

import { BlogPostCard } from './BlogPostCard'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { trpc } from "@/server/trpc/client"

export function FeedContainer() {
  const [selected, setSelected] = useState("Latest")
  
  const { data: posts, isLoading } = trpc.post.getAll.useQuery({
    published: true,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Latest Stories</h1>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-64 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Latest Stories</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20">
            {selected}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-950 border-white/10">
            <DropdownMenuItem 
              onClick={() => setSelected("Latest")}
              className="text-white/80 focus:text-white focus:bg-white/10"
            >
              Latest
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelected("Trending")}
              className="text-white/80 focus:text-white focus:bg-white/10"
            >
              Trending
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelected("Following")}
              className="text-white/80 focus:text-white focus:bg-white/10"
            >
              Following
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <BlogPostCard key={post.id} {...post} />
        ))
      ) : (
        <div className="text-center py-12 text-white/60">
          <p>No posts found. Be the first to create one!</p>
        </div>
      )}
    </div>
  )
}