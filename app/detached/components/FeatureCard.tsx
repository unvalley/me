interface FeatureCardProps {
  icon?: React.ReactNode
  title: string
  description: string
  highlight?: boolean
}

export default function FeatureCard({
  icon,
  title,
  description,
  highlight = false,
}: FeatureCardProps) {
  return (
    <div className={`
      p-8 h-full
      ${highlight 
        ? 'bg-black text-white' 
        : 'bg-gray-50 border border-gray-200'
      }
      transition-all duration-300
      hover:scale-[1.02]
    `}>
      {icon && (
        <div className={`mb-6 ${highlight ? 'text-white' : 'text-black'}`}>
          {icon}
        </div>
      )}
      
      <h3 className={`
        text-xl md:text-2xl font-light mb-4
        ${highlight ? 'text-white' : 'text-black'}
      `}>
        {title}
      </h3>
      
      <p className={`
        text-sm leading-relaxed
        ${highlight ? 'text-gray-200' : 'text-gray-600'}
      `}>
        {description}
      </p>
    </div>
  )
}