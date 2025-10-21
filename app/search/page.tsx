'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Search, Loader2 } from 'lucide-react'
import { trpc } from '@/server/trpc/client'
import Link from 'next/link'
import { useDebounce } from '@/hooks/useDebounce'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  const { data: results, isLoading } = trpc.post.search.useQuery(
    { query: debouncedQuery, limit: 20 },
    { enabled: debouncedQuery.length > 0 }
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-20 lg:ml-64 px-4 md:px-8 py-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8">Search</h1>

            {/* Search Input */}
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 text-lg"
              />
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
              </div>
            ) : query && results && results.length > 0 ? (
              <div className="space-y-4">
                <p className="text-white/60 mb-4">
                  Found {results.length} result{results.length !== 1 ? 's' : ''}
                </p>
                {results.map((post) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className="block p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                  >
                    {post.coverImage && (
                      <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-white/5">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-white mb-2 hover:text-white/80 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-white/60 line-clamp-2 mb-2">
                      {post.excerpt}
                    </p>
                    <p className="text-sm text-white/40">{post.publishedAt}</p>
                  </Link>
                ))}
              </div>
            ) : query && !isLoading ? (
              <div className="text-center py-12 text-white/60">
                No results found for "{query}"
              </div>
            ) : (
              <div className="text-center py-12 text-white/40">
                Start typing to search posts...
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}