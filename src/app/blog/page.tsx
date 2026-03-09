import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/content/fs";

export const metadata: Metadata = {
  title: "Blog - hirotask.me",
  description: "Blog posts and articles",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen bg-black pt-16">
      <main className="max-w-3xl mx-auto px-6 py-12 slide-enter-content">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-3 text-gray-100">Blog</h1>
          <p className="text-base text-gray-400">
            Thoughts, ideas, and experiences
          </p>
        </header>

        <div className="space-y-10">
          {posts.length === 0 ? (
            <p className="text-gray-500">No blog posts yet.</p>
          ) : (
            posts.map((post) => (
              <article key={post.slug} className="group border-b border-gray-900 last:border-0">
                <Link href={`/${post.slug}`} className="block">
                  <div className="space-y-2">
                    {post.frontmatter.date && (
                      <time className="text-sm text-gray-500 opacity-60">
                        {new Date(post.frontmatter.date).toLocaleDateString("ja-JP", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    )}
                    <h2 className="text-xl font-semibold text-gray-100 group-hover:opacity-70 transition-opacity">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="text-gray-400 leading-relaxed opacity-90">
                        {post.description}
                      </p>
                    )}
                  </div>
                </Link>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
