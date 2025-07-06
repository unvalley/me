"use client";

import { codeToHtml } from "shiki";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    async function highlightCode() {
      try {
        const highlighted = await codeToHtml(code, {
          lang: language,
          theme: currentTheme === "dark" ? "github-dark" : "github-light",
        });
        setHtml(highlighted);
      } catch (error) {
        console.error("Failed to highlight code:", error);
        setHtml(`<pre><code>${code}</code></pre>`);
      }
    }

    highlightCode();
  }, [code, language, currentTheme]);

  if (!html) {
    return (
      <pre className="mt-7 overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-800 p-4">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="mt-7 overflow-x-auto rounded-lg"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
