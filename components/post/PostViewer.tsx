'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook,
  Link2,
  MoreHorizontal,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { trpc } from '@/lib/trpc/client'

interface PostViewerProps {
  postId: string
}

export function PostViewer({ postId }: PostViewerProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const { data: post, isLoading } = trpc.posts.getById.useQuery({ id: postId })
  const likeMutation = trpc.posts.like.useMutation()
  const utils = trpc.useUtils()

  const handleLike = async () => {
    if (!post) return
    setIsLiked(!isLiked)
    await likeMutation.mutateAsync({ id: post.id })
    utils.posts.getById.invalidate({ id: postId })
  }

  if (isLoading) {
    return (
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-white/5 rounded w-3/4"></div>
          <div className="h-64 bg-white/5 rounded"></div>
        </div>
      </article>
    )
  }

  if (!post) {
    return (
      <article className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <div className="text-center text-white/60">Post not found</div>
      </article>
    )
  }

  const likesCount = isLiked ? (post.likes || 0) + 1 : post.likes || 0

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* Cover Image */}
      {post.coverImage && (
        <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-white/10 to-white/5">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
        {post.title}
      </h1>

      {/* Author Info */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
        <Link href={`/profile/${post.author.username}`} className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-2 ring-white/10 group-hover:ring-white/20 transition-all" />
          <div>
            <p className="text-lg font-semibold text-white group-hover:text-white/80 transition-colors">
              {post.author.name}
            </p>
            <div className="flex items-center gap-3 text-sm text-white/50">
              <span>{post.publishedAt}</span>
              <span>•</span>
              <span>{post.readTime}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </Link>

        <Button className="bg-white text-black hover:bg-white/90">
          Follow
        </Button>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag, idx) => (
            <Link
              key={idx}
              href={`/topic/${tag.toLowerCase()}`}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/70 hover:text-white transition-all"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
          components={{
            div: ({node, ...props}) => <div className="text-white/80" {...props} />
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Engagement Bar */}
      <div className="sticky bottom-0 bg-black/95 backdrop-blur-xl border-t border-white/5 py-4 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <Heart
                className={cn(
                  "w-6 h-6 transition-all group-hover:scale-110",
                  isLiked && "fill-red-500 text-red-500"
                )}
              />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bookmark
                className={cn(
                  "w-5 h-5 transition-all",
                  isSaved ? "fill-white text-white" : "text-white/60"
                )}
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 text-white/60" />
              </button>

              {showShareMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 flex items-center gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Twitter className="w-5 h-5 text-white/80" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Linkedin className="w-5 h-5 text-white/80" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Facebook className="w-5 h-5 text-white/80" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Link2 className="w-5 h-5 text-white/80" />
                  </button>
                </div>
              )}
            </div>

            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
