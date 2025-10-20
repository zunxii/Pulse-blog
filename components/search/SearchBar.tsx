'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import Link from 'next/link'
import { useDebounce } from '@/lib/hooks/useDebounce'

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const searchRef = useRef<HTMLDivElement>(null)

  const { data: results, isLoading } = trpc.posts.search.useQuery(
    { query: debouncedQuery, limit: 5 },
    { enabled: debouncedQuery.length > 0 }
  )

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClear = () => {
    setQuery('')
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search posts..."
          className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && query && (
        <div className="absolute z-50 w-full mt-2 bg-gray-950 border border-white/10 rounded-lg shadow-xl max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-white/60 animate-spin" />
            </div>
          ) : results && results.length > 0 ? (
            <div>
              {results.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  onClick={() => {
                    setIsOpen(false)
                    setQuery('')
                  }}
                  className="block p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                >
                  {post.coverImage && (
                    <div className="w-full aspect-video rounded-lg overflow-hidden mb-3 bg-white/5">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-white mb-1 line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-white/60 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-white/40 mt-2">
                    {post.publishedAt}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-white/60">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}