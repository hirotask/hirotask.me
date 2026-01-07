import { type NextRequest, NextResponse } from "next/server";
import { deletePage, getPage, updatePage } from "@/lib/content/fs";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PageContent } from "@/types/content";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const page = await getPage(slug);

    if (!page) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<PageContent>>({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Error getting page:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to get page",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { slug } = await params;
    const body = await request.json();
    const { title, content, description } = body;

    await updatePage(slug, { title, content, description });

    return NextResponse.json<ApiResponse>({
      success: true,
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update page",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    const { slug } = await params;
    await deletePage(slug);

    return NextResponse.json<ApiResponse>({
      success: true,
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete page",
      },
      { status: 500 }
    );
  }
}
