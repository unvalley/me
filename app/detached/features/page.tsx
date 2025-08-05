import { Header, Hero, FeatureCard, Footer } from '../components'

const features = [
  {
    title: "Focus Sessions",
    description: "Block distracting apps and websites during dedicated work periods. Create custom focus modes for different activities.",
    highlight: false,
  },
  {
    title: "Mindful Notifications",
    description: "Intelligent notification management that learns your patterns and only alerts you when it matters most.",
    highlight: true,
  },
  {
    title: "Usage Analytics",
    description: "Gain insights into your digital habits with beautiful, actionable reports that help you make informed changes.",
    highlight: false,
  },
  {
    title: "Digital Sunset",
    description: "Automatically wind down your devices in the evening to promote better sleep and relaxation.",
    highlight: false,
  },
  {
    title: "Intention Setting",
    description: "Start each day by setting clear intentions for how you want to use technology, with gentle reminders throughout the day.",
    highlight: false,
  },
  {
    title: "Offline Time",
    description: "Schedule regular periods of complete disconnection to reconnect with yourself and the world around you.",
    highlight: false,
  }
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16 md:pt-20">
        <Hero
          title="Features That Transform Habits"
          description="Powerful tools designed to help you build a healthier relationship with technology, one mindful choice at a time."
          minimal
        />

        <section className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={feature.title}
                  {...feature}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-bg-secondary">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-section mb-6">
                Start Your Digital Minimalism Journey
              </h2>
              <p className="text-body mb-8">
                Every feature is designed with intention—to help you use technology consciously rather than compulsively.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/detached/download" className="button-solid">
                  Download Free
                </a>
                <a href="/detached/about" className="button-minimal">
                  Learn Our Story
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