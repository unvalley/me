declare module "*.mdx" {
  export const metadata: Record<string, unknown>;
  const MDXComponent: () => JSX.Element;
  export default MDXComponent;
}
