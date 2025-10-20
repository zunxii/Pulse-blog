import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-white/10 mb-4">404</h1>
        
        <h2 className="text-3xl font-bold text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-white/60 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            className="bg-white text-black hover:bg-white/90"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Link href="/feed">
              <Search className="w-4 h-4 mr-2" />
              Explore Posts
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}