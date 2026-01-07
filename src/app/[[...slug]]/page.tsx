import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { getAllPages, getPage } from "@/lib/content/fs";

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  const pages = await getAllPages();

  return pages.map((page) => ({
    slug: page.slug === "" ? undefined : page.slug.split("/"),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: slugArray } = await params;
  const slug = slugArray?.join("/") || "";

  const page = await getPage(slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug: slugArray } = await params;
  const slug = slugArray?.join("/") || "";

  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="max-w-4xl mx-auto px-6 py-16">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-black dark:text-white">{page.title}</h1>
            {page.description && (
              <p className="text-lg text-gray-600 dark:text-gray-400">{page.description}</p>
            )}
            {page.frontmatter.date && (
              <time className="text-sm text-gray-500 dark:text-gray-500">
                {new Date(page.frontmatter.date).toLocaleDateString("ja-JP")}
              </time>
            )}
          </header>
          <MarkdownRenderer content={page.content} />
        </article>
      </main>
    </div>
  );
}
