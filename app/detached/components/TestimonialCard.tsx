interface TestimonialCardProps {
  quote: string
  author: string
  role?: string
  company?: string
}

export default function TestimonialCard({
  quote,
  author,
  role,
  company,
}: TestimonialCardProps) {
  return (
    <blockquote className="p-8 bg-gray-50 border border-gray-200 h-full flex flex-col">
      <p className="text-lg leading-relaxed text-gray-600 mb-6 flex-grow">
        "{quote}"
      </p>
      
      <footer>
        <p className="text-sm font-medium text-black">
          {author}
        </p>
        {(role || company) && (
          <p className="text-xs text-gray-400 mt-1">
            {role && <span>{role}</span>}
            {role && company && <span> · </span>}
            {company && <span>{company}</span>}
          </p>
        )}
      </footer>
    </blockquote>
  )
}