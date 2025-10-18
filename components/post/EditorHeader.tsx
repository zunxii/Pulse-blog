import { ArrowLeft, Eye, Link, Save, Send } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'

const EditorHeader = () => {
    const [isPreview, setIsPreview] = useState(false)
  return (
          <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/feed"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsPreview(!isPreview)}
                className="text-white/80 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
              <Button
                variant="outline"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="bg-white text-black hover:bg-white/90">
                <Send className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </div>
      </header>
  )
}

export default EditorHeader
