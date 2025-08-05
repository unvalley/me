import Link from 'next/link'
import { Header, Footer } from './index'

interface ArticleLayoutProps {
  title: string
  category: string
  date: string
  readTime: string
  author?: string
  children: React.ReactNode
}

export default function ArticleLayout({
  title,
  category,
  date,
  readTime,
  author = 'Detached Team',
  children
}: ArticleLayoutProps) {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20 md:pt-24">
        <article className="container-narrow pb-16 md:pb-24">
          <header className="mb-8 md:mb-12">
            <div className="mb-4">
              <Link
                href="/detached/articles"
                className="text-sm text-gray-600 hover:text-black transition-colors"
              >
                ← Back to Articles
              </Link>
            </div>
            
            <div className="mb-6">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-2">
                {category}
              </p>
              <h1 className="heading-hero mb-4">{title}</h1>
              
              <div className="flex items-center text-sm text-gray-600">
                <span>{author}</span>
                <span className="mx-2">·</span>
                <time dateTime={date}>{date}</time>
                <span className="mx-2">·</span>
                <span>{readTime}</span>
              </div>
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none">
            {children}
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-medium mb-2">Share this article</h3>
                <div className="flex space-x-4">
                  <button className="text-sm text-gray-600 hover:text-black transition-colors">
                    Twitter
                  </button>
                  <button className="text-sm text-gray-600 hover:text-black transition-colors">
                    LinkedIn
                  </button>
                  <button className="text-sm text-gray-600 hover:text-black transition-colors">
                    Copy Link
                  </button>
                </div>
              </div>
              
              <div>
                <Link
                  href="/detached/newsletter"
                  className="button-minimal text-sm"
                >
                  Subscribe for Updates
                </Link>
              </div>
            </div>
          </div>
        </article>
        
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="heading-section mb-4">More Articles</h2>
              <p className="text-body max-w-2xl mx-auto">
                Continue exploring insights on digital minimalism and intentional living.
              </p>
            </div>
            <div className="text-center">
              <Link
                href="/detached/articles"
                className="button-solid"
              >
                View All Articles
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}