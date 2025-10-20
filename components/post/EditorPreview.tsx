import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

interface EditorPreviewProps {
  title: string
  content: string
  tags: string[]
  coverImage: string | null
  readTime: string
}

export function EditorPreview({ title, content, tags, coverImage, readTime }: EditorPreviewProps) {
  return (
    <div className="space-y-8">
      {coverImage && (
        <div className="aspect-video rounded-2xl overflow-hidden bg-white/5">
          <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
        </div>
      )}
      
      <div>
        <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
          {title || 'Untitled Article'}
        </h1>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, idx) => (
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
            <p className="text-xs text-white/50">Just now • {readTime}</p>
          </div>
        </div>
      </div>

      <div className="prose prose-invert prose-lg max-w-none">
        {content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-4xl font-bold text-white mb-4 mt-8" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-white mb-3 mt-6" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-2xl font-bold text-white mb-2 mt-4" {...props} />,
              p: ({ node, ...props }) => <p className="text-white/80 leading-relaxed mb-4" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc list-inside text-white/80 mb-4 space-y-2" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal list-inside text-white/80 mb-4 space-y-2" {...props} />,
              li: ({ node, ...props }) => <li className="text-white/80" {...props} />,
              code: ({ node, inline, ...props }: any) => 
                inline ? (
                  <code className="bg-white/10 px-1.5 py-0.5 rounded text-sm text-white/90" {...props} />
                ) : (
                  <code className="block bg-white/5 p-4 rounded-lg overflow-x-auto text-sm" {...props} />
                ),
              pre: ({ node, ...props }) => <pre className="bg-white/5 p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-white/20 pl-4 italic text-white/70 mb-4" {...props} />
              ),
              a: ({ node, ...props }) => (
                <a className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer" {...props} />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <p className="text-white/40 italic">Start writing to see preview...</p>
        )}
      </div>
    </div>
  )
}