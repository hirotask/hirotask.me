"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MarkdownEditor } from "@/components/MarkdownEditor";
import type { PageContent } from "@/types/content";

interface EditPageFormProps {
  page: PageContent;
}

export function EditPageForm({ page }: EditPageFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(page.title);
  const [description, setDescription] = useState(page.description || "");
  const [content, setContent] = useState(page.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/pages/${page.slug || "home"}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update page");
      }

      router.push("/admin/pages");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/admin/pages"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 block"
        >
          ← ページ一覧に戻る
        </Link>

        <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">ページ編集</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Slug: /{page.slug || ""}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="ページタイトル"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                説明 (任意)
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="ページの説明"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                コンテンツ <span className="text-red-500">*</span>
              </div>
              <MarkdownEditor initialContent={content} onChange={setContent} />
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {isSubmitting ? "保存中..." : "保存"}
            </button>
            <Link
              href="/admin/pages"
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-block text-center"
            >
              キャンセル
            </Link>
            <Link
              href={`/${page.slug || ""}`}
              target="_blank"
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors inline-block text-center"
            >
              プレビュー
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
