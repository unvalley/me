import { Header, Hero, Footer } from '../components'

export default function DownloadPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-16 md:pt-20">
        <Hero
          subtitle="Download Detached"
          title="Start Your Digital Minimalism Journey"
          description="Available for iOS and Android. Free to download, with optional premium features for advanced users."
        />

        <section className="py-16 md:py-24">
          <div className="container-narrow">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                <div className="space-y-8">
                  <div>
                    <h2 className="heading-section mb-6">Get the App</h2>
                    <p className="text-body mb-8">
                      Download Detached and start building healthier digital habits today. 
                      The app is free to use with core features, and premium features are available for those who want advanced functionality.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <a
                      href="#"
                      className="flex items-center p-4 border border-border-light bg-white hover:border-border-medium transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 bg-black flex items-center justify-center text-white text-xl mr-4">
                        📱
                      </div>
                      <div>
                        <p className="font-medium">Download for iOS</p>
                        <p className="text-sm text-text-secondary">Requires iOS 14.0 or later</p>
                      </div>
                    </a>

                    <a
                      href="#"
                      className="flex items-center p-4 border border-border-light bg-white hover:border-border-medium transition-all duration-200 hover:-translate-y-1"
                    >
                      <div className="w-12 h-12 bg-black flex items-center justify-center text-white text-xl mr-4">
                        🤖
                      </div>
                      <div>
                        <p className="font-medium">Download for Android</p>
                        <p className="text-sm text-text-secondary">Requires Android 8.0 or later</p>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-bg-secondary p-8 border border-border-light">
                    <h3 className="text-xl font-light mb-6">What's Included</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Free Features</h4>
                        <ul className="text-sm text-text-secondary space-y-1">
                          <li>• Basic app blocking during focus sessions</li>
                          <li>• Daily usage tracking and insights</li>
                          <li>• Simple notification management</li>
                          <li>• Morning intention setting</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Premium Features</h4>
                        <ul className="text-sm text-text-secondary space-y-1">
                          <li>• Advanced focus modes with custom schedules</li>
                          <li>• Detailed analytics and progress tracking</li>
                          <li>• Smart notification intelligence</li>
                          <li>• Digital sunset automation</li>
                          <li>• Offline time scheduling</li>
                          <li>• Family sharing and accountability</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-text-muted mb-4">
                      Premium features available for $4.99/month or $39.99/year
                    </p>
                    <p className="text-xs text-text-muted">
                      Start with a 14-day free trial of premium features
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-bg-secondary">
          <div className="container-narrow">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-section mb-6">
                Questions About the App?
              </h2>
              <p className="text-body mb-8">
                Check out our comprehensive guides and support resources, or get in touch with our team.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="/detached/resources" className="button-solid">
                  View Resources
                </a>
                <a href="/detached/contact" className="button-minimal">
                  Contact Support
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