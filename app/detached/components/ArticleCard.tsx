import Link from 'next/link'

interface ArticleCardProps {
  title: string
  excerpt: string
  date: string
  readTime: string
  href: string
  category?: string
  featured?: boolean
}

export default function ArticleCard({
  title,
  excerpt,
  date,
  readTime,
  href,
  category,
  featured = false,
}: ArticleCardProps) {
  return (
    <article className={`group ${featured ? 'md:col-span-2' : ''}`}>
      <Link href={href} className="block h-full">
        <div className={`
          h-full p-6 md:p-8 border border-gray-200
          transition-all duration-300
          hover:border-gray-300 hover:-translate-y-1 hover:shadow-lg
          ${featured ? 'bg-gray-50' : 'bg-white'}
        `}>
          {category && (
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              {category}
            </p>
          )}
          
          <h3 className={`
            font-light mb-3
            ${featured ? 'heading-section' : 'text-xl md:text-2xl'}
          `}>
            {title}
          </h3>
          
          <p className={`
            text-gray-600 mb-4
            ${featured ? 'text-base md:text-lg leading-relaxed line-clamp-3' : 'text-sm line-clamp-2'}
          `}>
            {excerpt}
          </p>
          
          <div className="flex items-center text-xs text-gray-400">
            <time dateTime={date}>{date}</time>
            <span className="mx-2">·</span>
            <span>{readTime}</span>
          </div>
        </div>
      </Link>
    </article>
  )
}