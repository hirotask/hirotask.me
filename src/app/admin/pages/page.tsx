import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllPages } from "@/lib/content/fs";
import { createClient } from "@/lib/supabase/server";
import { DeleteButton } from "./DeleteButton";

export default async function PagesListPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/login");
  }

  const pages = await getAllPages();

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Link
              href="/admin"
              className="text-blue-600 dark:text-blue-400 hover:underline mb-2 block"
            >
              ← 管理者ページに戻る
            </Link>
            <h1 className="text-3xl font-bold text-black dark:text-white">ページ管理</h1>
          </div>
          <Link
            href="/admin/pages/new"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            新規ページ作成
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  更新日
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pages.map((page) => (
                <tr key={page.slug}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {page.title}
                    </div>
                    {page.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {page.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/${page.slug}`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                    >
                      /{page.slug || ""}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(page.updatedAt).toLocaleDateString("ja-JP")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/pages/${page.slug || "home"}/edit`}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      編集
                    </Link>
                    {page.slug !== "" && (
                      <DeleteButton slug={page.slug} title={page.title} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pages.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              ページがありません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
