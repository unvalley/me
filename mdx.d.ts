declare module '*.mdx' {
  export const metadata: Record<string, any>
  const MDXComponent: () => JSX.Element
  export default MDXComponent
}