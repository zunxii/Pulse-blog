'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { trpc } from '@/server/trpc/client'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useToast } from '@/hooks/useToast'
import { EditorToolbar } from './EditorToolbar'
import { EditorHeader } from './EditorHeader'
import { EditorPreview } from './EditorPreview'
import { CategorySelector } from './CategorySelector'
import { TagInput } from './TagInput'
import { CoverImageUpload } from './CoverImageUpload'
import { ToastContainer } from '../ui/toast'

interface PostEditorProps {
  postId?: string;
}

export function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter()
  const { toasts, toast, removeToast } = useToast()
  const utils = trpc.useUtils()
  
  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isPreview, setIsPreview] = useState(false)
  const [wordCount, setWordCount] = useState(0)
  const [readingTime, setReadingTime] = useState('0 min read')
  
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Fetch existing post if editing
  const { data: existingPost, isLoading: isLoadingPost } = trpc.post.getById.useQuery(
    { id: postId! },
    { enabled: !!postId }
  )

  // Load existing post data
  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title)
      setContent(existingPost.content)
      setExcerpt(existingPost.excerpt || '')
      setTags(existingPost.tags || [])
      setCoverImage(existingPost.coverImage || null)
      // Load categories if available
    }
  }, [existingPost])

  // Calculate word count and reading time
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length
    setWordCount(words)
    const minutes = Math.ceil(words / 200)
    setReadingTime(`${minutes} min read`)
  }, [content])

  // Mutations
  const saveDraftMutation = trpc.post.saveDraft.useMutation({
    onSuccess: (data) => {
      if (!postId && data.id) {
        router.replace(`/write?id=${data.id}`)
      }
      utils.post.getById.invalidate()
    },
    onError: (error) => {
      console.error('Failed to save draft:', error)
    },
  })

  const createPostMutation = trpc.post.create.useMutation({
    onSuccess: (data) => {
      toast.success('Post published successfully!')
      router.push(`/post/${data.post.slug}`)
    },
    onError: (error) => {
      toast.error('Failed to publish post')
      console.error('Publish error:', error)
    },
  })

  const updatePostMutation = trpc.post.update.useMutation({
    onSuccess: (data) => {
      toast.success('Post updated successfully!')
      router.push(`/post/${data.post.slug}`)
    },
    onError: (error) => {
      toast.error('Failed to update post')
      console.error('Update error:', error)
    },
  })

  // Auto-save functionality
  const { status: saveStatus } = useAutoSave({
    data: { title, content, excerpt, tags, coverImage, categoryIds: selectedCategories },
    onSave: async (data) => {
      if (!data.title && !data.content) return
      
      await saveDraftMutation.mutateAsync({
        id: postId,
        ...data,
        coverImage: data.coverImage || undefined,
      })
    },
    delay: 30000, // 30 seconds
    enabled: !!(title || content),
  })

  // Handle publish
  const handlePublish = async () => {
    if (!title || !content) {
      toast.error('Title and content are required')
      return
    }

    if (postId) {
      await updatePostMutation.mutateAsync({
        id: postId,
        title,
        content,
        excerpt,
        coverImage: coverImage || undefined,
        published: true,
        categoryIds: selectedCategories,
      })
    } else {
      await createPostMutation.mutateAsync({
        title,
        content,
        excerpt,
        coverImage: coverImage || undefined,
        published: true,
        categoryIds: selectedCategories,
      })
    }
  }

  // Handle save draft
  const handleSaveDraft = async () => {
    if (!title && !content) {
      toast.error('Please add some content first')
      return
    }

    try {
      await saveDraftMutation.mutateAsync({
        id: postId,
        title,
        content,
        excerpt,
        coverImage: coverImage || undefined,
        categoryIds: selectedCategories,
      })
      toast.success('Draft saved successfully!')
    } catch (error) {
      toast.error('Failed to save draft')
    }
  }

  // Toolbar actions
  const insertFormatting = (before: string, after: string = before) => {
    const textarea = contentRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end)
    
    setContent(newText)
    
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, end + before.length)
    }, 0)
  }

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <EditorHeader
        isPreview={isPreview}
        onTogglePreview={() => setIsPreview(!isPreview)}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        saveStatus={saveStatus}
        isPublishing={createPostMutation.isPending || updatePostMutation.isPending}
        isSaving={saveDraftMutation.isPending}
      />

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {!isPreview ? (
            <div className="space-y-6">
              {/* Cover Image */}
              <CoverImageUpload
                image={coverImage}
                onImageChange={setCoverImage}
              />

              {/* Title */}
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title..."
                className="w-full bg-transparent border-none text-5xl font-bold text-white placeholder:text-white/20 focus:outline-none resize-none"
                rows={2}
                style={{ lineHeight: '1.2' }}
              />

              {/* Categories */}
              <CategorySelector
                selected={selectedCategories}
                onChange={setSelectedCategories}
              />

              {/* Tags */}
              <TagInput
                tags={tags}
                onChange={setTags}
              />

              {/* Toolbar */}
              <EditorToolbar onInsert={insertFormatting} />

              {/* Content */}
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your story... (Markdown supported)"
                className="w-full min-h-[500px] bg-transparent border border-white/10 rounded-2xl p-6 text-lg text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 leading-relaxed resize-none font-mono"
              />

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-white/40">
                <div className="flex items-center gap-4">
                  <p>{wordCount} words</p>
                  <p>•</p>
                  <p>{readingTime}</p>
                  <p>•</p>
                  <p>{content.length} characters</p>
                </div>
                <p>Markdown supported</p>
              </div>

              {/* Excerpt (Optional) */}
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Excerpt (optional - used for previews)
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary of your post..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none"
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <EditorPreview
              title={title}
              content={content}
              tags={tags}
              coverImage={coverImage}
              readTime={readingTime}
            />
          )}
        </div>
      </main>

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}