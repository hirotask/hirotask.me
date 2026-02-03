import { type NextRequest, NextResponse } from "next/server";
import { getPage } from "@/lib/content/fs";
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
