import matter from "gray-matter";
import type { PageFrontmatter } from "@/types/content";

export interface ParsedMarkdown {
  frontmatter: PageFrontmatter;
  content: string;
}

export function parseMarkdown(raw: string): ParsedMarkdown {
  const { data, content } = matter(raw);

  const frontmatter: PageFrontmatter = {
    title: data.title || "Untitled",
    description: data.description,
    author: data.author,
    date: data.date,
    tags: data.tags,
    draft: data.draft,
  };

  return {
    frontmatter,
    content: content.trim(),
  };
}

export function serializeMarkdown(frontmatter: PageFrontmatter, content: string): string {
  return matter.stringify(content, frontmatter);
}
