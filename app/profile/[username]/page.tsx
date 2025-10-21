'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileTabs } from '@/components/profile/ProfileTabs'
import { ArticlesList } from '@/components/profile/ArticlesList'

export default function ProfilePage({ params }: { params: { username: string } }) {


  return (
    <div className="min-h-screen bg-black">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-20 lg:ml-64">
          <ProfileHeader username={params.username} />
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <ProfileTabs />
            <ArticlesList />
          </div>
        </main>
      </div>
    </div>
  )
}