import { Header, Hero, ArticleCard, Footer } from '../components'

const articles = [
  {
    title: "The Hidden Cost of Constant Connectivity",
    excerpt: "How our always-on digital lifestyle is affecting our ability to think deeply, form meaningful connections, and find genuine satisfaction in our daily lives.",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    href: "/detached/articles/hidden-cost-connectivity",
    category: "Digital Wellness",
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
  },
  {
    title: "The Power of Digital Boundaries",
    excerpt: "How to set and maintain healthy limits with technology to protect your time and attention.",
    date: "Jan 5, 2025",
    readTime: "7 min read",
    href: "/detached/articles/digital-boundaries",
    category: "Productivity",
  },
  {
    title: "Mindful Social Media: A Practical Guide",
    excerpt: "Transform your relationship with social platforms through intentional usage patterns.",
    date: "Jan 3, 2025",
    readTime: "6 min read",
    href: "/detached/articles/mindful-social-media",
    category: "Digital Wellness",
  }
]

export default function ArticlesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16 md:pt-20">
        <Hero
          title="Articles on Digital Minimalism"
          description="Explore insights, research, and practical strategies for living more intentionally in our connected world."
          minimal
        />

        <section className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {articles.map((article) => (
                <ArticleCard
                  key={article.href}
                  {...article}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-section mb-6">
                Stay Updated
              </h2>
              <p className="text-body mb-8">
                Get weekly insights on digital minimalism delivered to your inbox.
              </p>
              <a href="/detached/newsletter" className="button-solid">
                Subscribe to Newsletter
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}