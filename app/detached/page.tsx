import { Header, Hero, ArticleCard, Footer } from './components'

const featuredArticles = [
  {
    title: "The Hidden Cost of Constant Connectivity",
    excerpt: "How our always-on digital lifestyle is affecting our ability to think deeply, form meaningful connections, and find genuine satisfaction in our daily lives.",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    href: "/detached/articles/hidden-cost-connectivity",
    category: "Digital Wellness",
    featured: true,
  },
  {
    title: "Designing Technology That Serves You",
    excerpt: "Practical strategies for configuring your devices and apps to support your goals rather than distract from them.",
    date: "Jan 12, 2025", 
    readTime: "6 min read",
    href: "/detached/articles/technology-that-serves",
    category: "Productivity",
  },
  {
    title: "The Science of Digital Dopamine",
    excerpt: "Understanding how apps are designed to capture attention and what you can do to regain control.",
    date: "Jan 10, 2025",
    readTime: "10 min read", 
    href: "/detached/articles/digital-dopamine",
    category: "Research",
  },
  {
    title: "Building Intentional Morning Routines",
    excerpt: "Start your day with purpose by creating tech-free spaces for reflection and planning.",
    date: "Jan 8, 2025",
    readTime: "5 min read",
    href: "/detached/articles/intentional-mornings",
    category: "Lifestyle",
  }
]

export default function DetachedHome() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero
          subtitle="Digital Minimalism"
          title="Reclaim Your Focus"
          description="Transform your relationship with technology. Discover articles, resources, and tools designed to help you live more intentionally in our connected world."
          primaryAction={{
            label: "Get the App",
            href: "/detached/download"
          }}
          secondaryAction={{
            label: "Read Articles",
            href: "/detached/articles"
          }}
        />

        <section className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="heading-section mb-4">Latest Articles</h2>
              <p className="text-body max-w-2xl mx-auto">
                Insights and practical guidance for building a healthier relationship with technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {featuredArticles.map((article, index) => (
                <ArticleCard
                  key={article.href}
                  {...article}
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="/detached/articles"
                className="button-minimal"
              >
                View All Articles
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-section mb-6">
                Ready to Detach?
              </h2>
              <p className="text-body mb-8">
                Join thousands of people who have transformed their digital habits with our app.
                Start your journey toward more intentional technology use today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/detached/download" className="button-solid">
                  Download Now
                </a>
                <a href="/detached/features" className="button-minimal">
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}