import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - hirotask.me",
  description: "Projects and works",
};

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-black pt-16">
      <main className="max-w-3xl mx-auto px-6 py-12 slide-enter-content">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-3 text-gray-100">Projects</h1>
          <p className="text-base text-gray-400">
            Things I've built and worked on
          </p>
        </header>

        <div className="space-y-8">
          <p className="text-gray-500">Coming soon...</p>
        </div>
      </main>
    </div>
  );
}
