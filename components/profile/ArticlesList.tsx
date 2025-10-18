'use client'

import Link from 'next/link'
import { Eye, Heart, MessageCircle, Clock } from 'lucide-react'
import { ArticleCard } from './ArticleCard'

const mockArticles = [
  {
    id: '1',
    title: 'Building Scalable React Applications',
    excerpt: 'Learn how to architect large-scale React applications with proper state management...',
    publishedAt: '2 days ago',
    readTime: '12 min',
    views: 5432,
    likes: 234,
    comments: 45,
    tags: ['React', 'JavaScript'],
  },
  {
    id: '2',
    title: 'The Art of API Design',
    excerpt: 'Explore the fundamental principles behind great API design. From RESTful...',
    publishedAt: '5 days ago',
    readTime: '8 min',
    views: 3210,
    likes: 187,
    comments: 32,
    tags: ['API', 'Backend'],
  },
  {
    id: '3',
    title: 'Modern CSS Techniques',
    excerpt: 'Container queries, CSS nesting, cascade layers, and more. Dive into the latest...',
    publishedAt: '1 week ago',
    readTime: '10 min',
    views: 8901,
    likes: 421,
    comments: 67,
    tags: ['CSS', 'Frontend'],
  },
]

export function ArticlesList() {
  return (
    <div className="space-y-6 pb-12">
      {mockArticles.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
    </div>
  )
}

