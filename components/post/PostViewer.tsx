'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  Twitter, 
  Linkedin, 
  Facebook,
  Link2,
  MoreHorizontal,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface PostViewerProps {
  postId: string
}

const mockPost = {
  id: '1',
  title: 'Building Scalable React Applications: A Complete Guide',
  content: `React has become the de facto library for building modern web applications. But as your application grows, you'll face challenges around state management, code organization, and performance optimization.

In this comprehensive guide, we'll explore the architectural patterns and best practices that will help you build React applications that can scale from thousands to millions of users.

## The Foundation: Project Structure

A well-organized project structure is crucial for maintainability. Here's the structure I recommend for large-scale React apps:

\`\`\`
src/
├── components/     # Reusable UI components
├── features/       # Feature-based modules
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── services/       # API and external services
└── types/          # TypeScript type definitions
\`\`\`

## State Management at Scale

When your app grows beyond a few components, you'll need a robust state management solution. Here are the main options:

**1. Context API + useReducer** - Perfect for small to medium apps with straightforward state needs.

**2. Zustand** - My personal favorite for most applications. It's lightweight, has minimal boilerplate, and works great with TypeScript.

**3. Redux Toolkit** - Still the best choice for extremely complex state logic with time-travel debugging needs.

## Performance Optimization

Performance optimization should be part of your development process, not an afterthought. Here are key strategies:

### Code Splitting
Use React.lazy() and Suspense to split your code into smaller chunks:

\`\`\`jsx
const Dashboard = lazy(() => import('./features/Dashboard'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Dashboard />
    </Suspense>
  )
}
\`\`\`

### Memoization
Use React.memo, useMemo, and useCallback strategically to prevent unnecessary re-renders.

## Testing Strategy

A comprehensive testing strategy is essential:

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test how components work together
- **E2E Tests**: Test critical user flows

Use Jest and React Testing Library for unit/integration tests, and Playwright or Cypress for E2E tests.

## Conclusion

Building scalable React applications requires thoughtful architecture, performance optimization, and comprehensive testing. Start with these patterns and adjust based on your specific needs.

Remember: premature optimization is the root of all evil. Start simple, measure performance, and optimize where it matters.`,
  author: {
    name: 'Sarah Chen',
    username: 'sarahchen',
    bio: 'Tech writer & software engineer',
    avatar: null,
    followers: 12500,
  },
  publishedAt: '2 days ago',
  readTime: '12 min read',
  tags: ['React', 'JavaScript', 'Web Development', 'Architecture'],
  likes: 1247,
  comments: 89,
  views: 5432,
  coverImage: null,
}

export function PostViewer({ postId }: PostViewerProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(mockPost.likes)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      {/* Cover Image */}
      {mockPost.coverImage && (
        <div className="aspect-video rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-white/10 to-white/5" />
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
        {mockPost.title}
      </h1>

      {/* Author Info */}
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/10">
        <Link href={`/profile/${mockPost.author.username}`} className="flex items-center gap-4 group">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-white/20 to-white/5 ring-2 ring-white/10 group-hover:ring-white/20 transition-all" />
          <div>
            <p className="text-lg font-semibold text-white group-hover:text-white/80 transition-colors">
              {mockPost.author.name}
            </p>
            <div className="flex items-center gap-3 text-sm text-white/50">
              <span>{mockPost.publishedAt}</span>
              <span>•</span>
              <span>{mockPost.readTime}</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{mockPost.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </Link>

        <Button className="bg-white text-black hover:bg-white/90">
          Follow
        </Button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {mockPost.tags.map((tag, idx) => (
          <Link
            key={idx}
            href={`/topic/${tag.toLowerCase()}`}
            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-sm text-white/70 hover:text-white transition-all"
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="prose prose-invert prose-lg max-w-none mb-12">
        {mockPost.content.split('\n\n').map((block, idx) => {
          if (block.startsWith('##')) {
            return (
              <h2 key={idx} className="text-3xl font-bold text-white mt-12 mb-6">
                {block.replace('##', '').trim()}
              </h2>
            )
          }
          if (block.startsWith('```')) {
            const code = block.replace(/```\w*/g, '').trim()
            return (
              <pre key={idx} className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-x-auto my-6">
                <code className="text-sm text-white/90 font-mono">{code}</code>
              </pre>
            )
          }
          if (block.startsWith('**')) {
            return (
              <p key={idx} className="text-white/80 leading-relaxed mb-6 font-semibold">
                {block.replace(/\*\*/g, '')}
              </p>
            )
          }
          return (
            <p key={idx} className="text-white/80 leading-relaxed mb-6">
              {block}
            </p>
          )
        })}
      </div>

      {/* Engagement Bar */}
      <div className="sticky bottom-0 bg-black/95 backdrop-blur-xl border-t border-white/5 py-4 -mx-4 px-4 md:-mx-8 md:px-8">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex items-center gap-6">
            <button
              onClick={handleLike}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <Heart
                className={cn(
                  "w-6 h-6 transition-all group-hover:scale-110",
                  isLiked && "fill-red-500 text-red-500"
                )}
              />
              <span className="text-sm font-medium">{likesCount}</span>
            </button>

            <button className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-medium">{mockPost.comments}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bookmark
                className={cn(
                  "w-5 h-5 transition-all",
                  isSaved ? "fill-white text-white" : "text-white/60"
                )}
              />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Share2 className="w-5 h-5 text-white/60" />
              </button>

              {showShareMenu && (
                <div className="absolute bottom-full right-0 mb-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-2 flex items-center gap-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Twitter className="w-5 h-5 text-white/80" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Linkedin className="w-5 h-5 text-white/80" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Facebook className="w-5 h-5 text-white/80" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Link2 className="w-5 h-5 text-white/80" />
                  </button>
                </div>
              )}
            </div>

            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
