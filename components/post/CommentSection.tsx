'use client'

import { useState } from 'react'
import { Heart, MoreHorizontal, Reply } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CommentSectionProps {
  postId: string
}

const mockComments = [
  {
    id: '1',
    author: {
      name: 'Michael Ross',
      username: 'mross',
      avatar: null,
    },
    content: 'Great article! The section on state management really helped clarify some concepts I was struggling with. Would love to see a follow-up on advanced React patterns.',
    timestamp: '2 hours ago',
    likes: 24,
    replies: [],
  },
  {
    id: '2',
    author: {
      name: 'Emma Wilson',
      username: 'emmawrites',
      avatar: null,
    },
    content: 'I\'ve been using Zustand for a few months now and it\'s been fantastic. The DevTools integration is especially helpful for debugging.',
    timestamp: '5 hours ago',
    likes: 18,
    replies: [
      {
        id: '2-1',
        author: {
          name: 'Alex Kim',
          username: 'alexk',
          avatar: null,
        },
        content: 'Agreed! Zustand has been a game changer for our team.',
        timestamp: '4 hours ago',
        likes: 5,
      },
    ],
  },
]

export function CommentSection({ postId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('')

  return (
    <section className="py-12 border-t border-white/10">
      <h2 className="text-2xl font-bold text-white mb-8">
        Comments ({mockComments.length})
      </h2>

      {/* New Comment */}
      <div className="mb-8">
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
              <Button className="bg-white text-black hover:bg-white/90">
                Post Comment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {mockComments.map((comment) => (
          <Comment key={comment.id} {...comment} />
        ))}
      </div>
    </section>
  )
}

function Comment({ author, content, timestamp, likes, replies }: any) {
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(likes)
  const [showReply, setShowReply] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  return (
    <div>
      <div className="flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex-shrink-0" />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-white">{author.name}</span>
            <span className="text-xs text-white/40">{timestamp}</span>
          </div>
          
          <p className="text-white/80 leading-relaxed mb-3">{content}</p>
          
          <div className="flex items-center gap-4 text-sm">
            <button
              onClick={handleLike}
              className={cn(
                "flex items-center gap-1 transition-colors",
                isLiked ? "text-red-400" : "text-white/60 hover:text-white"
              )}
            >
              <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
              <span>{likesCount}</span>
            </button>
            
            <button
              onClick={() => setShowReply(!showReply)}
              className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
            >
              <Reply className="w-4 h-4" />
              <span>Reply</span>
            </button>
            
            <button className="p-1 text-white/60 hover:text-white transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {showReply && (
            <div className="mt-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/20 to-white/5 flex-shrink-0" />
              <div className="flex-1">
                <textarea
                  placeholder="Write a reply..."
                  className="w-full bg-white/5 border border-white/10 rounded-xlp-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  rows={2}
                />
                <div className="flex justify-end mt-2">
                  <Button
                    onClick={() => setShowReply(false)}
                    variant="ghost"
                    className="text-white/60 hover:text-white mr-2"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-white text-black hover:bg-white/90">
                    Reply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Nested Replies */}
          {replies && replies.length > 0 && (
            <div className="mt-4 ml-6 space-y-4">
              {replies.map((reply: any) => (
                <Comment key={reply.id} {...reply} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    )
}