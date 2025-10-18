'use client'

import { PostEditor } from '@/components/post/PostEditor'
import { useSmoothScroll } from '@/lib/hooks/useSmoothScroll'

export default function WritePage() {
  useSmoothScroll()

  return (
    <div className="min-h-screen bg-black">
      <PostEditor />
    </div>
  )
}