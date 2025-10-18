'use client'

import { BlogPostCard } from './BlogPostCard'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

const mockBlogs = [
  {
    id: '1',
    title: 'Building Scalable React Applications: A Complete Guide',
    excerpt: 'Learn how to architect large-scale React applications with proper state management, code splitting, and performance optimization techniques that actually work in production.',
    author: {
      name: 'Sarah Chen',
      username: 'sarahchen',
      avatar: null,
    },
    coverImage: null,
    readTime: '12 min read',
    publishedAt: '2 days ago',
    tags: ['React', 'JavaScript', 'Web Development'],
    likes: 1247,
    comments: 89,
    views: 5432,
  },
  {
    id: '2',
    title: 'The Art of API Design: Principles for Building Intuitive Interfaces',
    excerpt: 'Explore the fundamental principles behind great API design. From RESTful conventions to GraphQL patterns, discover how to create APIs that developers love to use.',
    author: {
      name: 'Michael Ross',
      username: 'mross',
      avatar: null,
    },
    coverImage: null,
    readTime: '8 min read',
    publishedAt: '3 days ago',
    tags: ['API', 'Backend', 'Design'],
    likes: 892,
    comments: 45,
    views: 3210,
  },
  {
    id: '3',
    title: 'Modern CSS Techniques You Should Know in 2024',
    excerpt: 'Container queries, CSS nesting, cascade layers, and more. Dive into the latest CSS features that are changing how we build responsive, maintainable stylesheets.',
    author: {
      name: 'Emma Wilson',
      username: 'emmawrites',
      avatar: null,
    },
    coverImage: null,
    readTime: '10 min read',
    publishedAt: '5 days ago',
    tags: ['CSS', 'Frontend', 'Web Design'],
    likes: 2156,
    comments: 124,
    views: 8901,
  },
]

export function FeedContainer() {
  const [selected, setSelected] = useState("Latest")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Latest Stories</h1>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-white/20">
            {selected}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-950 border-white/10">
            <DropdownMenuItem 
              onClick={() => setSelected("Latest")}
              className="text-white/80 focus:text-white focus:bg-white/10"
            >
              Latest
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelected("Trending")}
              className="text-white/80 focus:text-white focus:bg-white/10"
            >
              Trending
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setSelected("Following")}
              className="text-white/80 focus:text-white focus:bg-white/10"
            >
              Following
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {mockBlogs.map((blog) => (
        <BlogPostCard key={blog.id} {...blog} />
      ))}
    </div>
  )
}