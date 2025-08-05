import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { detachedTheme } from './theme.config'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Detached - Digital Minimalism & Digital Detox',
  description: 'Reclaim your focus. Transform your relationship with technology through mindful digital habits.',
  keywords: ['digital minimalism', 'digital detox', 'focus', 'productivity', 'mindfulness', 'technology wellness'],
  authors: [{ name: 'Detached' }],
  openGraph: {
    title: 'Detached - Digital Minimalism & Digital Detox',
    description: 'Reclaim your focus. Transform your relationship with technology.',
    url: 'https://detached.unvalley.me',
    siteName: 'Detached',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Detached - Digital Minimalism & Digital Detox',
    description: 'Reclaim your focus. Transform your relationship with technology.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function DetachedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Reset body styles for detached */
          body {
            background-color: white !important;
            color: black !important;
          }
        `
      }} />
      <div className={`fixed inset-0 z-[9999] min-h-screen bg-white text-black antialiased ${inter.className} overflow-auto`}>
        {children}
      </div>
    </>
  )
}