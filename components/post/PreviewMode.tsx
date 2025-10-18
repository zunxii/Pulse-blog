import { Key } from "react";

export function PreviewMode({ title, content, tags, coverImage }: any) {
  return (
    <div className="space-y-8">
      {coverImage && (
        <div className="aspect-video rounded-2xl overflow-hidden bg-white/5">
          <div className="w-full h-full bg-gradient-to-br from-white/10 to-white/5" />
        </div>
      )}
      
      <div>
        <h1 className="text-5xl font-bold text-white mb-6">{title || 'Untitled Article'}</h1>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag: string, idx: number) => (
              <span key={idx} className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-white/80">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-3 pb-6 border-b border-white/10">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-white/5" />
          <div>
            <p className="text-sm font-semibold text-white">Your Name</p>
            <p className="text-xs text-white/50">Just now • {Math.ceil(content.split(' ').length / 200)} min read</p>
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-lg max-w-none">
        {content.split('\n').map((para: any, idx: Key | null | undefined) => (
          <p key={idx} className="text-white/80 leading-relaxed mb-4">
            {para || <br />}
          </p>
        ))}
      </div>
    </div>
  )
}