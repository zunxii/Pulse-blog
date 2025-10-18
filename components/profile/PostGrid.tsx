'use client'

import Link from 'next/link'
import { Heart, MessageCircle } from 'lucide-react'

const mockPosts = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  likes: Math.floor(Math.random() * 5000) + 100,
  comments: Math.floor(Math.random() * 200) + 10,
}))

export function PostGrid() {
  return (
    <div className="mt-8 grid grid-cols-3 gap-1 md:gap-4">
      {mockPosts.map((post) => (
        <PostGridItem key={post.id} {...post} />
      ))}
    </div>
  )
}

function PostGridItem({ id, likes, comments }: { id: string; likes: number; comments: number }) {
  return (
    <Link 
      href={`/post/${id}`}
      className="group relative aspect-square bg-gradient-to-br from-white/10 to-white/5 rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
    >
      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-white">
          <Heart className="w-6 h-6 fill-white" />
          <span className="font-semibold">{likes.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-white">
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="font-semibold">{comments}</span>
        </div>
      </div>
    </Link>
  )
}
