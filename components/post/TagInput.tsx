'use client'

import { useState, KeyboardEvent } from 'react'
import { X, Plus } from 'lucide-react'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
  maxTags?: number
}

export function TagInput({ tags, onChange, maxTags = 5 }: TagInputProps) {
  const [input, setInput] = useState('')

  const handleAddTag = () => {
    const trimmedInput = input.trim()
    
    if (!trimmedInput) return
    if (tags.length >= maxTags) return
    if (tags.includes(trimmedInput)) {
      setInput('')
      return
    }

    onChange([...tags, trimmedInput])
    setInput('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <div>
      <label className="block text-sm text-white/60 mb-2">
        Tags {tags.length > 0 && `(${tags.length}/${maxTags})`}
      </label>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm text-white/80"
          >
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}
        
        {tags.length < maxTags && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add tag..."
              className="bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 w-32"
              maxLength={20}
            />
            <button
              type="button"
              onClick={handleAddTag}
              disabled={!input.trim()}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 text-white/60" />
            </button>
          </div>
        )}
      </div>
      
      <p className="text-xs text-white/40">
        Add up to {maxTags} tags to help readers discover your article
      </p>
    </div>
  )
}