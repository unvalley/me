import { Header, Footer } from "./components";

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="pt-16 md:pt-20">
        <div className="container-narrow py-24 md:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="heading-title mb-6">Page Not Found</h1>
            <p className="text-body mb-8">
              The page you're looking for doesn't exist. Perhaps you'd like to
              explore our resources instead?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/detached" className="button-solid">
                Go Home
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
