import Link from 'next/link'

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  primaryAction?: {
    label: string
    href: string
  }
  secondaryAction?: {
    label: string
    href: string
  }
  minimal?: boolean
}

export default function Hero({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  minimal = false,
}: HeroProps) {
  return (
    <section className={`relative ${minimal ? 'py-20 md:py-24' : 'py-24 md:py-32 lg:py-40'}`}>
      <div className="container-narrow">
        <div className="max-w-4xl mx-auto text-center">
          {subtitle && (
            <p className="text-small uppercase tracking-widest text-text-muted mb-4 animate-fade-in">
              {subtitle}
            </p>
          )}
          
          <h1 className="heading-hero mb-6 animate-fade-up animation-delay-100">
            {title}
          </h1>
          
          {description && (
            <p className="text-body max-w-2xl mx-auto mb-10 animate-fade-up animation-delay-200">
              {description}
            </p>
          )}
          
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up animation-delay-300">
              {primaryAction && (
                <Link
                  href={primaryAction.href}
                  className="button-solid w-full sm:w-auto"
                >
                  {primaryAction.label}
                </Link>
              )}
              {secondaryAction && (
                <Link
                  href={secondaryAction.href}
                  className="button-minimal w-full sm:w-auto"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}