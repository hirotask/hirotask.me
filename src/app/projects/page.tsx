import type { Metadata } from "next";
import { getProjects } from "@/lib/content/fs";
import { ProjectCard } from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projects - hirotask.me",
  description: "Projects and works",
};

export default async function ProjectsPage() {
  const categories = await getProjects();

  return (
    <div className="min-h-screen bg-black pt-16">
      <main className="max-w-3xl mx-auto px-6 py-12 slide-enter-content">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-3 text-gray-100">Projects</h1>
          <p className="text-base text-gray-400">
            Things I've built and worked on
          </p>
        </header>

        <div className="space-y-12">
          {categories.length === 0 ? (
            <p className="text-gray-500">No projects yet.</p>
          ) : (
            categories.map((category) => (
              <section key={category.category}>
                <h2 className="text-xl font-semibold text-gray-200 mb-4">
                  {category.category}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {category.projects.map((project) => (
                    <ProjectCard key={project.name} project={project} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
