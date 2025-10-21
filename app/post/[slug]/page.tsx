'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { PostViewer } from '@/components/post/PostViewer'
import { CommentSection } from '@/components/post/CommentSection'

export default function PostDetailPage({ params }: { params: { slug: string } }) {


  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 ml-0 md:ml-20 lg:ml-64">
          <PostViewer postId={params.slug} />
          <div className="max-w-4xl mx-auto px-4 md:px-8">
            <CommentSection postId={params.slug} />
          </div>
        </main>
      </div>
    </div>
  )
}