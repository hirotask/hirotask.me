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
    <div className="min-h-screen bg-black pt-16">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <article className="slide-enter-content">
          <header className="mb-12">
            <h1 className="text-3xl font-bold mb-3 text-gray-100">
              {page.title}
            </h1>
            {page.description && (
              <p className="text-base text-gray-400 mb-2">{page.description}</p>
            )}
            {page.frontmatter.date && (
              <time className="text-sm text-gray-500 opacity-60">
                {new Date(page.frontmatter.date).toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
            )}
          </header>
          <MarkdownRenderer content={page.content} />
        </article>
      </main>
    </div>
  );
}
