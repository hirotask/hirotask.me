import { type NextRequest, NextResponse } from "next/server";
import { createPage, getAllPages } from "@/lib/content/fs";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, PageMetadata } from "@/types/content";

export async function GET() {
  try {
    const pages = await getAllPages();
    return NextResponse.json<ApiResponse<PageMetadata[]>>({
      success: true,
      data: pages,
    });
  } catch (error) {
    console.error("Error getting pages:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: "Failed to get pages",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { slug, title, content, description } = body;

    if (!slug || !title || !content) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await createPage(slug, { title, content, description });

    return NextResponse.json<ApiResponse<{ slug: string }>>({
      success: true,
      data: { slug },
    });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create page",
      },
      { status: 500 }
    );
  }
}
