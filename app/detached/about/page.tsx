import { Header, Hero, TestimonialCard, Footer } from '../components'

const testimonials = [
  {
    quote: "Detached helped me reclaim three hours of my day. I'm more focused, more present with my family, and genuinely happier.",
    author: "Sarah Chen",
    role: "Product Designer",
    company: "Stripe"
  },
  {
    quote: "The mindful notification system is a game-changer. I only get interrupted when it actually matters.",
    author: "Marcus Johnson",
    role: "Software Engineer"
  },
  {
    quote: "Finally, an app that helps me use technology intentionally instead of compulsively. It's changed how I think about my phone.",
    author: "Elena Rodriguez",
    role: "Writer"
  },
  {
    quote: "The focus sessions feature has transformed my productivity. I can do deep work without the constant pull of distractions.",
    author: "David Kim",
    role: "Researcher",
    company: "MIT"
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16 md:pt-20">
        <Hero
          title="Technology Should Serve You"
          description="We believe that technology should enhance your life, not control it. Detached was born from a simple idea: what if our devices helped us live more intentionally?"
          minimal
        />

        <section className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
                <div>
                  <h2 className="heading-section mb-6">Our Story</h2>
                  <div className="space-y-4 text-body">
                    <p>
                      In 2023, our founder realized they were spending more time looking at screens than at the people they loved. 
                      What started as a personal quest to regain control became a mission to help others do the same.
                    </p>
                    <p>
                      We studied the principles of digital minimalism, researched the science of attention, and talked to hundreds 
                      of people struggling with technology overuse. The result is Detached—an app designed not to keep you engaged, 
                      but to help you engage with what matters most.
                    </p>
                  </div>
                </div>
                <div className="bg-bg-secondary p-8 border border-border-light">
                  <blockquote className="text-lg leading-relaxed text-text-secondary">
                    "We don't measure success by time spent in our app. We measure it by time spent living intentionally."
                  </blockquote>
                  <p className="text-sm text-text-muted mt-4">— The Detached Team</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <div className="order-2 lg:order-1 bg-black text-white p-8">
                  <h3 className="text-xl font-light mb-4">Our Principles</h3>
                  <ul className="space-y-3 text-sm">
                    <li>• Technology should be a tool, not a master</li>
                    <li>• Attention is your most valuable resource</li>
                    <li>• Small, consistent changes create lasting transformation</li>
                    <li>• Mindfulness beats willpower every time</li>
                    <li>• Less screen time means more life time</li>
                  </ul>
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="heading-section mb-6">Why We're Different</h2>
                  <div className="space-y-4 text-body">
                    <p>
                      Unlike apps that profit from your attention, we succeed when you use technology less mindlessly. 
                      Our business model aligns with your wellbeing—we only win when you do.
                    </p>
                    <p>
                      Every feature is designed with intention, tested for effectiveness, and built on scientific research 
                      about how we can live better in our connected world.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-bg-secondary">
          <div className="container-narrow">
            <div className="text-center mb-12">
              <h2 className="heading-section mb-4">What People Are Saying</h2>
              <p className="text-body max-w-2xl mx-auto">
                Real stories from people who have transformed their relationship with technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  {...testimonial}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-section mb-6">
                Ready to Join Us?
              </h2>
              <p className="text-body mb-8">
                Start your journey toward more intentional technology use. Download Detached and discover 
                what life feels like when you're truly present.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/detached/download" className="button-solid">
                  Get Started
                </a>
                <a href="/detached/contact" className="button-minimal">
                  Get in Touch
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