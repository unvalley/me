'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const navigation = [
  { name: 'Articles', href: '/detached' },
  { name: 'Features', href: '/detached/features' },
  { name: 'Resources', href: '/detached/resources' },
  { name: 'About', href: '/detached/about' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/detached"
            className="text-xl md:text-2xl font-light tracking-tight hover:opacity-70 transition-opacity"
          >
            Detached
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-light text-gray-600 hover:text-black transition-colors link-underline"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/detached/download"
              className="button-minimal text-xs px-4 py-2"
            >
              Get the App
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open menu</span>
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className={`block h-px bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-px bg-black transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-black transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200">
            <div className="px-6 py-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-sm font-light text-gray-600 hover:text-black transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/detached/download"
                className="block button-minimal text-xs text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get the App
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}