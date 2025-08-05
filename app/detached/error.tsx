'use client'

import { useEffect } from 'react'
import { Header, Footer } from './components'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16 md:pt-20">
        <div className="container-narrow py-24 md:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-title mb-6">Something went wrong</h1>
            <p className="text-body mb-8">
              We're sorry, but something unexpected happened. Please try again.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={reset}
                className="button-solid"
              >
                Try Again
              </button>
              <a href="/detached" className="button-minimal">
                Go Home
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}