import { cn } from "@/lib/utils"
import { Heart, MoreHorizontal, Reply } from "lucide-react"
import { useState } from "react"
import { Button } from "../ui/button"

export 
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
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
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