'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Bookmark, Share2, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlogPostCardProps {
  id: string
  title: string
  excerpt: string
  author: {
    name: string
    username: string
    avatar: string | null
  }
  coverImage: string | null
  readTime: string
  publishedAt: string
  tags: string[]
  likes: number
  comments: number
  views: number
}

export function BlogPostCard({ 
  id, 
  title, 
  excerpt, 
  author, 
  coverImage,
  readTime, 
  publishedAt,
  tags,
  likes, 
  comments,
  views
}: BlogPostCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(likes)

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsSaved(!isSaved)
  }

  return (
    <Link href={`/post/${id}`}>
      <article className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer my-8">
        {/* Author Info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-2 ring-white/10" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{author.name}</p>
            <div className="flex items-center gap-2 text-xs text-white/50">
              <span>{publishedAt}</span>
              <span>•</span>
              <span>{readTime}</span>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            <Bookmark 
              className={cn(
                "w-5 h-5 transition-all",
                isSaved ? "fill-white text-white" : "text-white/60"
              )}
            />
          </button>
        </div>

        {/* Title & Excerpt */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors leading-tight">
            {title}
          </h2>
          <p className="text-white/60 leading-relaxed line-clamp-2">
            {excerpt}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, idx) => (
            <span 
              key={idx}
              className="px-3 py-1 bg-white/5 rounded-full text-xs text-white/70 hover:bg-white/10 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group/like"
            >
              <Heart 
                className={cn(
                  "w-5 h-5 transition-all group-hover/like:scale-110",
                  isLiked && "fill-red-500 text-red-500"
                )}
              />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <div className="flex items-center gap-2 text-white/60">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">{comments}</span>
            </div>

            <div className="flex items-center gap-2 text-white/60">
              <Eye className="w-5 h-5" />
              <span className="text-sm font-medium">{views}</span>
            </div>
          </div>

          <button className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </article>
    </Link>
  )
}