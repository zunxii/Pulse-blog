'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { Comment } from './Comment'

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')
  const { data: comments, isLoading } = trpc.comments.getByPost.useQuery({ postId })
  const createCommentMutation = trpc.comments.create.useMutation()
  const utils = trpc.useUtils()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    await createCommentMutation.mutateAsync({
      postId,
      content: newComment,
      authorName: 'Guest User',
      authorUsername: 'guest',
    })

    setNewComment('')
    utils.comments.getByPost.invalidate({ postId })
  }

  if (isLoading) {
    return (
      <section className="py-12 border-t border-white/10">
        <h2 className="text-2xl font-bold text-white mb-8">Comments</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 border-t border-white/10">
      <h2 className="text-2xl font-bold text-white mb-8">
        Comments ({comments?.length || 0})
      </h2>

      {/* New Comment */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex-shrink-0" />
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
              rows={3}
            />
            <div className="flex justify-end mt-3">
              <Button type="submit" className="bg-white text-black hover:bg-white/90">
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Comment key={comment.id} {...comment} />
          ))
        ) : (
          <div className="text-center py-8 text-white/60">
            No comments yet. Be the first to comment!
          </div>
        )}
      </div>
    </section>
  )
}
