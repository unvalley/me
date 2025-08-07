import { Header, Footer } from '../../components'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { MDXRemote } from 'next-mdx-remote/rsc'

interface ArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

function getArticle(slug: string) {
  const articlesDirectory = path.join(process.cwd(), 'app/detached/content/articles')
  const filePath = path.join(articlesDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return {
    frontmatter: data,
    content
  }
}

export function generateStaticParams() {
  const articlesDirectory = path.join(process.cwd(), 'app/detached/content/articles')
  const filenames = fs.readdirSync(articlesDirectory)
  
  return filenames
    .filter(filename => filename.endsWith('.mdx'))
    .map(filename => ({
      slug: filename.replace('.mdx', '')
    }))
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = getArticle(slug)
  
  if (!article) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-20 pb-16">
        <article className="max-w-4xl mx-auto px-4">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.frontmatter.title}</h1>
            <div className="text-gray-600">
              <span>{article.frontmatter.date}</span>
              {article.frontmatter.category && (
                <span className="ml-4">[{article.frontmatter.category}]</span>
              )}
              {article.frontmatter.readTime && (
                <span className="ml-4">{article.frontmatter.readTime}</span>
              )}
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={article.content} />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}