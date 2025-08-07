import { Header, Hero, ArticleCard, Footer } from "./components";

const featuredArticles = [
  {
    title: "The Hidden Cost of Constant Connectivity",
    excerpt:
      "How our always-on digital lifestyle is affecting our ability to think deeply, form meaningful connections, and find genuine satisfaction in our daily lives.",
    date: "Jan 15, 2025",
    readTime: "8 min read",
    href: "/detached/articles/hidden-cost-connectivity",
    category: "Digital Wellness",
    featured: true,
  },
  {
    title: "Designing Technology That Serves You",
    excerpt:
      "Practical strategies for configuring your devices and apps to support your goals rather than distract from them.",
    date: "Jan 12, 2025",
    readTime: "6 min read",
    href: "/detached/articles/technology-that-serves",
    category: "Productivity",
  },
  {
    title: "The Science of Digital Dopamine",
    excerpt:
      "Understanding how apps are designed to capture attention and what you can do to regain control.",
    date: "Jan 10, 2025",
    readTime: "10 min read",
    href: "/detached/articles/digital-dopamine",
    category: "Research",
  },
  {
    title: "Building Intentional Morning Routines",
    excerpt:
      "Start your day with purpose by creating tech-free spaces for reflection and planning.",
    date: "Jan 8, 2025",
    readTime: "5 min read",
    href: "/detached/articles/intentional-mornings",
    category: "Lifestyle",
  },
];

export default function DetachedHome() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <Hero
          subtitle="Digital Minimalism"
          title="Reclaim Your Focus"
          description="Your life instead of others."
          //   primaryAction={{
          //     label: "Get the App",
          //     href: "/detached/download",
          //   }}
          secondaryAction={{
            label: "Read Articles",
            href: "/detached/articles",
          }}
        />
      </main>

      <Footer />
    </div>
  );
}
