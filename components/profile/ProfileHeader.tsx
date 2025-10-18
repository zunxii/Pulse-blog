'use client'

import { useState } from 'react'
import { Settings, Link as LinkIcon, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ProfileHeaderProps {
  username: string
}

const mockProfile = {
  name: 'Sarah Chen',
  username: 'sarahchen',
  bio: 'Tech writer & software engineer. I write about React, TypeScript, and building scalable web applications. Open source enthusiast.',
  website: 'sarahchen.dev',
  location: 'San Francisco, CA',
  joinedDate: 'Joined December 2022',
  articles: 87,
  followers: 12500,
  following: 456,
  totalViews: 245000,
  avatar: null,
  isOwner: true,
  isFollowing: false,
}

export function ProfileHeader({ username }: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(mockProfile.isFollowing)

  return (
    <div className="border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 ring-4 ring-white/10 flex-shrink-0" />

          {/* Info */}
          <div className="flex-1 space-y-6">
            {/* Name & Actions */}
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{mockProfile.name}</h1>
                <p className="text-white/50">@{mockProfile.username}</p>
              </div>
              
              {mockProfile.isOwner ? (
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white/80 hover:text-white hover:bg-white/5"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Button 
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={
                      isFollowing 
                        ? "bg-white/10 text-white hover:bg-white/5" 
                        : "bg-white text-black hover:bg-white/90"
                    }
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button 
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>
              )}
            </div>

            {/* Bio */}
            <p className="text-white/80 leading-relaxed max-w-2xl">
              {mockProfile.bio}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
              {mockProfile.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{mockProfile.location}</span>
                </div>
              )}
              {mockProfile.website && (
                <a 
                  href={`https://${mockProfile.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <LinkIcon className="w-4 h-4" />
                  <span>{mockProfile.website}</span>
                </a>
              )}
              <span>{mockProfile.joinedDate}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-2xl font-bold text-white">{mockProfile.articles}</p>
                <p className="text-sm text-white/60">Articles</p>
              </div>
              <button className="hover:opacity-80 transition-opacity">
                <p className="text-2xl font-bold text-white">
                  {(mockProfile.followers / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-white/60">Followers</p>
              </button>
              <button className="hover:opacity-80 transition-opacity">
                <p className="text-2xl font-bold text-white">{mockProfile.following}</p>
                <p className="text-sm text-white/60">Following</p>
              </button>
              <div>
                <p className="text-2xl font-bold text-white">
                  {(mockProfile.totalViews / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-white/60">Total Views</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
