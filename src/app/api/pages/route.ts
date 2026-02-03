import { NextResponse } from "next/server";
import { getAllPages } from "@/lib/content/fs";
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
