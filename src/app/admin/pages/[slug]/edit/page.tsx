import { redirect } from "next/navigation";
import { getPage } from "@/lib/content/fs";
import { createClient } from "@/lib/supabase/server";
import { EditPageForm } from "./EditPageForm";

interface EditPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditPage({ params }: EditPageProps) {
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

  const { slug } = await params;
  const page = await getPage(slug === "home" ? "" : slug);

  if (!page) {
    redirect("/admin/pages");
  }

  return <EditPageForm page={page} />;
}
