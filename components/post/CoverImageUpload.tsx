'use client'

import { useState, useRef } from 'react'
import { ImageIcon, X, Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CoverImageUploadProps {
  image: string | null
  onImageChange: (url: string | null) => void
}

export function CoverImageUpload({ image, onImageChange }: CoverImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('Image must be less than 5MB')
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      // For now, create a local preview URL
      // In production, you would upload to a service like Uploadthing or Cloudinary
      const reader = new FileReader()
      reader.onloadend = () => {
        onImageChange(reader.result as string)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)

      // TODO: Implement actual upload
      // const formData = new FormData()
      // formData.append('file', file)
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // })
      // const data = await response.json()
      // onImageChange(data.url)
    } catch (err) {
      setError('Failed to upload image')
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleRemove = () => {
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="relative group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileSelect(file)
        }}
        className="hidden"
      />

      {image ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/10">
          <img
            src={image}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-4 right-4 p-2 bg-black/80 hover:bg-black rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          disabled={isUploading}
          className={cn(
            "w-full aspect-video rounded-2xl border-2 border-dashed border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center gap-3 group",
            isUploading && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
            ) : (
              <ImageIcon className="w-8 h-8 text-white/60" />
            )}
          </div>
          <div className="text-center">
            <p className="text-white/80 font-medium mb-1">
              {isUploading ? 'Uploading...' : 'Add a cover image'}
            </p>
            <p className="text-sm text-white/40">
              Drag and drop or click to upload (Max 5MB)
            </p>
            <p className="text-xs text-white/30 mt-1">
              Recommended: 1600 x 900
            </p>
          </div>
        </button>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}