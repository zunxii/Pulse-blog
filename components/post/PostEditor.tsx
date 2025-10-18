'use client'

import { useState, useRef, Key } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Eye, 
  Save, 
  Send,
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  Code,
  Quote,
  Heading2,
  X,
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PreviewMode } from './PreviewMode'
import EditorHeader from './EditorHeader'

export function PostEditor() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isPreview, setIsPreview] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  const handleAddTag = () => {
    if (tagInput.trim() && tags.length < 5) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

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

  const toolbarButtons = [
    { icon: Bold, action: () => insertFormatting('**'), label: 'Bold' },
    { icon: Italic, action: () => insertFormatting('*'), label: 'Italic' },
    { icon: Heading2, action: () => insertFormatting('## ', '\n'), label: 'Heading' },
    { icon: Quote, action: () => insertFormatting('> ', '\n'), label: 'Quote' },
    { icon: Code, action: () => insertFormatting('`'), label: 'Code' },
    { icon: Link2, action: () => insertFormatting('[', '](url)'), label: 'Link' },
    { icon: List, action: () => insertFormatting('- ', '\n'), label: 'List' },
    { icon: ListOrdered, action: () => insertFormatting('1. ', '\n'), label: 'Numbered List' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <EditorHeader/>
      {/* Editor */}
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          {!isPreview ? (
            <div className="space-y-6">
              {/* Cover Image */}
              <div className="relative group">
                {coverImage ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5" />
                    <button 
                      onClick={() => setCoverImage(null)}
                      className="absolute top-4 right-4 p-2 bg-black/80 hover:bg-black rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <button className="w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-3 group">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon className="w-8 h-8 text-white/60" />
                    </div>
                    <div className="text-center">
                      <p className="text-white/80 font-medium mb-1">Add a cover image</p>
                      <p className="text-sm text-white/40">Recommended: 1600 x 900</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Title */}
              <textarea
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title..."
                className="w-full bg-transparent border-none text-5xl font-bold text-white placeholder:text-white/20 focus:outline-none resize-none"
                rows={2}
                style={{ lineHeight: '1.2' }}
              />

              {/* Tags */}
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm text-white/80"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(idx)}
                        className="hover:text-white transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {tags.length < 5 && (
                    <div className="flex items-center gap-2">
                      <input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTag()
                          }
                        }}
                        placeholder="Add tag..."
                        className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 w-32"
                      />
                      <button
                        onClick={handleAddTag}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/40">Add up to 5 tags to help readers discover your article</p>
              </div>

              {/* Toolbar */}
              <div className="flex items-center gap-1 p-2 bg-white/5 border border-white/10 rounded-xl">
                {toolbarButtons.map((button, idx) => (
                  <button
                    key={idx}
                    onClick={button.action}
                    title={button.label}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white/60 hover:text-white"
                  >
                    <button.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Content */}
              <textarea
                ref={contentRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your story... (Markdown supported)"
                className="w-full min-h-[500px] bg-transparent border border-white/10 rounded-2xl p-6 text-lg text-white/90 placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 leading-relaxed resize-none font-mono"
              />

              <div className="flex items-center justify-between text-sm text-white/40">
                <p>{content.length} characters • {Math.ceil(content.split(' ').length / 200)} min read</p>
                <p>Supports Markdown formatting</p>
              </div>
            </div>
          ) : (
            <PreviewMode title={title} content={content} tags={tags} coverImage={coverImage} />
          )}
        </div>
      </main>
    </div>
  )
}

