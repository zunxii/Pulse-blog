'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertCircle className="w-10 h-10 text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h1>
        
        <p className="text-white/60 mb-8">
          We're sorry, but something unexpected happened. Don't worry, we've logged this error and will look into it.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
            <p className="text-sm font-mono text-red-400 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-white text-black hover:bg-white/90"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
          >
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}