import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function signOut() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">管理者ページ</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
              <span className="font-medium">User ID:</span> {user.id}
            </p>
            {profile && (
              <p>
                <span className="font-medium">管理者:</span> {profile.is_admin ? "はい" : "いいえ"}
              </p>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">管理者機能</h2>
          <div className="space-y-4">
            <a
              href="/admin/pages"
              className="block px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-center"
            >
              ページ管理
            </a>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              サイトのページを作成、編集、削除できます。
            </p>
          </div>
        </div>

        <div className="mt-6">
          <form action={signOut}>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              ログアウト
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
