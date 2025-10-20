import Link from 'next/link'
import { ArrowLeft, Eye, Save, Send, Loader2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EditorHeaderProps {
  isPreview: boolean
  onTogglePreview: () => void
  onSaveDraft: () => void
  onPublish: () => void
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
  isPublishing: boolean
  isSaving: boolean
}

export function EditorHeader({
  isPreview,
  onTogglePreview,
  onSaveDraft,
  onPublish,
  saveStatus,
  isPublishing,
  isSaving,
}: EditorHeaderProps) {
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
            {/* Auto-save status */}
            <div className="hidden md:flex items-center gap-2 text-sm text-white/60">
              {saveStatus === 'saving' && (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>Save failed</span>
                </>
              )}
            </div>

            {/* Preview toggle */}
            <Button
              variant="ghost"
              onClick={onTogglePreview}
              className="text-white/80 hover:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>

            {/* Save draft */}
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSaving}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Draft
            </Button>

            {/* Publish */}
            <Button 
              onClick={onPublish}
              disabled={isPublishing}
              className="bg-white text-black hover:bg-white/90"
            >
              {isPublishing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Publish
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}