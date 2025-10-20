'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { PostEditor } from '@/components/post/PostEditor'

function WritePageContent() {
  const searchParams = useSearchParams()
  const postId = searchParams.get('id')

  return <PostEditor postId={postId || undefined} />
}

export default function WritePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    }>
      <WritePageContent />
    </Suspense>
  )
}