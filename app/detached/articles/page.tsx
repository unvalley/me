import { Header, Footer } from '../components'
import Link from 'next/link'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface Article {
  title: string
  date: string
  category?: string
  slug: string
}

function getArticles(): Article[] {
  const articlesDirectory = path.join(process.cwd(), 'app/detached/content/articles')
  const filenames = fs.readdirSync(articlesDirectory)
  
  const articles = filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => {
      const filePath = path.join(articlesDirectory, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        title: data.title,
        date: data.date,
        category: data.category,
        slug: filename.replace('.mdx', ''),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return articles
}

export default function ArticlesPage() {
  const articles = getArticles()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Blog archive</h1>
          
          <ol className="list-decimal list-inside space-y-3 text-gray-800">
            {articles.map((article, index) => (
              <li key={article.slug} className="pl-2">
                <Link 
                  href={`/detached/articles/${article.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {article.title}
                </Link>
                <span className="text-gray-600 ml-2">
                  {article.date}
                </span>
                {article.category && (
                  <span className="text-gray-500 ml-2">
                    [{article.category}]
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </main>

      <Footer />
    </div>
  )
}