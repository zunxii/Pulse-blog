'use client'

import { useState } from 'react'
import { trpc } from '@/server/trpc/client'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/toast'
import Link from 'next/link'
import { Eye, Heart, MessageCircle, Edit, Trash2, MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function RecentPosts() {
  const { toasts, toast, removeToast } = useToast()
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
  
  const { data: posts, isLoading, refetch } = trpc.post.getAll.useQuery({
    published: filter === 'all' ? undefined : filter === 'published',
    limit: 50,
  })

  const deletePostMutation = trpc.post.delete.useMutation({
    onSuccess: () => {
      toast.success('Post deleted successfully')
      refetch()
    },
    onError: () => {
      toast.error('Failed to delete post')
    },
  })

  const togglePublishMutation = trpc.post.togglePublish.useMutation({
    onSuccess: () => {
      toast.success('Post status updated')
      refetch()
    },
    onError: () => {
      toast.error('Failed to update post')
    },
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await deletePostMutation.mutateAsync({ id })
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    await togglePublishMutation.mutateAsync({ 
      id, 
      published: !currentStatus 
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Posts</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 h-32 animate-pulse" />
        ))}
      </div>
    )
  }

  const filteredPosts = posts || []

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Your Posts</h2>
          
          <div className="flex items-center gap-2">
            {(['all', 'published', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  filter === f
                    ? "bg-white text-black"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                )}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-white/60 mb-4">No posts found</p>
            <Link
              href="/write"
              className="text-white hover:text-white/80 underline"
            >
              Create your first post
            </Link>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Link
                      href={`/post/${post.slug}`}
                      className="text-xl font-bold text-white hover:text-white/80 transition-colors"
                    >
                      {post.title}
                    </Link>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        post.published
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      )}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <p className="text-white/60 mb-4 line-clamp-2">{post.excerpt}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
                    <span>{post.publishedAt}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                    <span>•</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-white/60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-950 border-white/10">
                    <DropdownMenuItem asChild>
                      <Link
                        href={`/write?id=${post.id}`}
                        className="flex items-center gap-2 cursor-pointer text-white/80 focus:text-white focus:bg-white/10"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleTogglePublish(post.id, post.published!)}
                      className="text-white/80 focus:text-white focus:bg-white/10 cursor-pointer"
                    >
                      {post.published ? 'Unpublish' : 'Publish'}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(post.id)}
                      className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}