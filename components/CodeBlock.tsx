'use client'

import { codeToHtml, createCssVariablesTheme } from 'shiki'
import { useEffect, useState } from 'react'

const cssVariablesTheme = createCssVariablesTheme({})

interface CodeBlockProps {
  language: string
  code: string
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [html, setHtml] = useState<string>('')

  useEffect(() => {
    async function highlightCode() {
      try {
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: cssVariablesTheme,
        })
        setHtml(highlighted)
      } catch (error) {
        console.error('Failed to highlight code:', error)
        setHtml(`<pre><code>${code}</code></pre>`)
      }
    }

    highlightCode()
  }, [code, language])

  if (!html) {
    return (
      <pre className="mt-7 overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
        <code>{code}</code>
      </pre>
    )
  }

  return (
    <div 
      className="mt-7 overflow-x-auto rounded-lg shiki css-variables"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}