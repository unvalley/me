import Link from 'next/link'

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { name: 'Features', href: '/detached/features' },
      { name: 'Download', href: '/detached/download' },
      { name: 'Pricing', href: '/detached/pricing' },
      { name: 'Roadmap', href: '/detached/roadmap' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { name: 'Articles', href: '/detached' },
      { name: 'Guides', href: '/detached/guides' },
      { name: 'Research', href: '/detached/research' },
      { name: 'Community', href: '/detached/community' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About', href: '/detached/about' },
      { name: 'Contact', href: '/detached/contact' },
      { name: 'Privacy', href: '/detached/privacy' },
      { name: 'Terms', href: '/detached/terms' },
    ],
  },
}

export default function Footer() {
  return (
    <footer className="border-t border-border-light bg-bg-secondary">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="md:col-span-1">
            <Link
              href="/detached"
              className="text-xl font-light tracking-tight hover:opacity-70 transition-opacity inline-block mb-4"
            >
              Detached
            </Link>
            <p className="text-sm text-text-secondary">
              Reclaim your focus. Transform your relationship with technology.
            </p>
          </div>
          
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-sm font-medium text-text-primary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-border-light">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} Detached. All rights reserved.
            </p>
            <div className="flex items-center space-x-6">
              <Link
                href="https://twitter.com/detached"
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </Link>
              <Link
                href="https://github.com/detached"
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
              <Link
                href="/detached/newsletter"
                className="text-xs text-text-muted hover:text-text-primary transition-colors"
              >
                Newsletter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}