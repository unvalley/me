import { Header, Hero, Footer } from '../components'

const resourceCategories = [
  {
    title: "Digital Detox Guides",
    description: "Step-by-step guides for reducing screen time and creating healthier tech habits.",
    resources: [
      { name: "30-Day Digital Detox Challenge", href: "/detached/guides/30-day-detox" },
      { name: "Setting Up Your Phone for Minimalism", href: "/detached/guides/phone-setup" },
      { name: "Creating Tech-Free Zones at Home", href: "/detached/guides/tech-free-zones" },
      { name: "Building Morning Routines Without Screens", href: "/detached/guides/morning-routines" },
    ]
  },
  {
    title: "Research & Studies",
    description: "Scientific research on technology's impact on mental health, productivity, and well-being.",
    resources: [
      { name: "The Attention Economy: Research Summary", href: "/detached/research/attention-economy" },
      { name: "Screen Time and Sleep Quality Studies", href: "/detached/research/sleep-quality" },
      { name: "Social Media and Mental Health", href: "/detached/research/social-media-mental-health" },
      { name: "Productivity in the Digital Age", href: "/detached/research/digital-productivity" },
    ]
  },
  {
    title: "Tools & Templates",
    description: "Practical tools to help you assess and improve your digital habits.",
    resources: [
      { name: "Digital Habits Assessment", href: "/detached/tools/habits-assessment" },
      { name: "Intention Setting Worksheet", href: "/detached/tools/intention-worksheet" },
      { name: "Weekly Digital Review Template", href: "/detached/tools/weekly-review" },
      { name: "App Audit Checklist", href: "/detached/tools/app-audit" },
    ]
  },
  {
    title: "Recommended Reading",
    description: "Books, articles, and resources that have shaped our understanding of digital minimalism.",
    resources: [
      { name: "Digital Minimalism by Cal Newport", href: "/detached/reading/digital-minimalism" },
      { name: "The Tech-Wise Family by Andy Crouch", href: "/detached/reading/tech-wise-family" },
      { name: "How to Break Up with Your Phone by Catherine Price", href: "/detached/reading/break-up-phone" },
      { name: "Irresistible by Adam Alter", href: "/detached/reading/irresistible" },
    ]
  }
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16 md:pt-20">
        <Hero
          title="Resources for Digital Wellness"
          description="Curated guides, research, and tools to support your journey toward more intentional technology use."
          minimal
        />

        <section className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="space-y-16">
              {resourceCategories.map((category, index) => (
                <div key={category.title} className="space-y-6">
                  <div>
                    <h2 className="heading-section mb-3">{category.title}</h2>
                    <p className="text-body max-w-3xl">{category.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.resources.map((resource) => (
                      <a
                        key={resource.name}
                        href={resource.href}
                        className="block p-6 border border-border-light bg-white hover:border-border-medium transition-all duration-200 hover:-translate-y-1"
                      >
                        <h3 className="text-lg font-light mb-2 text-text-primary">
                          {resource.name}
                        </h3>
                        <span className="text-sm text-text-secondary">
                          Read more →
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-bg-secondary">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-section mb-6">
                Can't Find What You're Looking For?
              </h2>
              <p className="text-body mb-8">
                We're constantly adding new resources. If there's something specific you'd like to see, let us know.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/detached/contact" className="button-solid">
                  Request a Resource
                </a>
                <a href="/detached/newsletter" className="button-minimal">
                  Get Updates
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