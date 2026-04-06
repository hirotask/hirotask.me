import fs from "node:fs/promises";
import path from "node:path";
import type { PageContent, PageFrontmatter, PageMetadata } from "@/types/content";
import { parseMarkdown, serializeMarkdown } from "./parser";
import { validateAndGetPath } from "./validator";

async function getFileStats(filePath: string) {
  try {
    return await fs.stat(filePath);
  } catch {
    return null;
  }
}

function pathToSlug(filePath: string): string {
  const contentDir = path.join(process.cwd(), "content");
  const relativePath = path.relative(contentDir, filePath);
  const slug = relativePath.replace(/\.md$/, "").replace(/\\/g, "/");

  if (slug === "home") return "";
  return slug;
}

async function* walkDir(dir: string): AsyncGenerator<string> {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);

    if (file.isDirectory()) {
      yield* walkDir(filePath);
    } else if (file.isFile() && file.name.endsWith(".md")) {
      yield filePath;
    }
  }
}

export async function getAllPages(): Promise<PageMetadata[]> {
  const contentDir = path.join(process.cwd(), "content");
  const pages: PageMetadata[] = [];

  try {
    for await (const filePath of walkDir(contentDir)) {
      const slug = pathToSlug(filePath);
      const stats = await getFileStats(filePath);

      if (!stats) continue;

      const raw = await fs.readFile(filePath, "utf-8");
      const { frontmatter } = parseMarkdown(raw);

      pages.push({
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        createdAt: stats.birthtime.toISOString(),
        updatedAt: stats.mtime.toISOString(),
        path: filePath,
      });
    }
  } catch (error) {
    console.error("Error reading pages:", error);
    return [];
  }

  return pages.sort((a, b) => a.slug.localeCompare(b.slug));
}

export async function getBlogPosts(): Promise<PageContent[]> {
  const contentDir = path.join(process.cwd(), "content", "blog");
  const posts: PageContent[] = [];

  try {
    for await (const filePath of walkDir(contentDir)) {
      const slug = pathToSlug(filePath);
      const stats = await getFileStats(filePath);

      if (!stats) continue;

      const raw = await fs.readFile(filePath, "utf-8");
      const { frontmatter, content } = parseMarkdown(raw);

      posts.push({
        slug,
        title: frontmatter.title,
        description: frontmatter.description,
        createdAt: stats.birthtime.toISOString(),
        updatedAt: stats.mtime.toISOString(),
        path: filePath,
        content,
        frontmatter,
      });
    }
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }

  return posts.sort((a, b) => {
    const dateA = a.frontmatter.date ? new Date(a.frontmatter.date).getTime() : 0;
    const dateB = b.frontmatter.date ? new Date(b.frontmatter.date).getTime() : 0;
    return dateB - dateA;
  });
}

export async function getPage(slug: string): Promise<PageContent | null> {
  try {
    const filePath = validateAndGetPath(slug);
    const stats = await getFileStats(filePath);

    if (!stats) return null;

    const raw = await fs.readFile(filePath, "utf-8");
    const { frontmatter, content } = parseMarkdown(raw);

    return {
      slug: slug || "",
      title: frontmatter.title,
      description: frontmatter.description,
      createdAt: stats.birthtime.toISOString(),
      updatedAt: stats.mtime.toISOString(),
      path: filePath,
      content,
      frontmatter,
    };
  } catch (error) {
    console.error(`Error reading page ${slug}:`, error);
    return null;
  }
}

export async function createPage(
  slug: string,
  data: { title: string; content: string; description?: string }
): Promise<void> {
  const filePath = validateAndGetPath(slug);
  const existing = await getFileStats(filePath);
  if (existing) {
    throw new Error(`Page already exists: ${slug}`);
  }

  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });

  const frontmatter: PageFrontmatter = {
    title: data.title,
    description: data.description,
    date: new Date().toISOString().split("T")[0],
  };

  const markdown = serializeMarkdown(frontmatter, data.content);
  await fs.writeFile(filePath, markdown, "utf-8");
}

export async function updatePage(
  slug: string,
  data: Partial<{ title: string; content: string; description?: string }>
): Promise<void> {
  const filePath = validateAndGetPath(slug);

  const existing = await getPage(slug);
  if (!existing) {
    throw new Error(`Page not found: ${slug}`);
  }

  const frontmatter: PageFrontmatter = {
    ...existing.frontmatter,
    title: data.title ?? existing.frontmatter.title,
    description: data.description ?? existing.frontmatter.description,
  };

  const content = data.content ?? existing.content;
  const markdown = serializeMarkdown(frontmatter, content);

  await fs.writeFile(filePath, markdown, "utf-8");
}

export async function deletePage(slug: string): Promise<void> {
  if (!slug || slug === "home") {
    throw new Error("Cannot delete home page");
  }

  const filePath = validateAndGetPath(slug);

  const existing = await getFileStats(filePath);
  if (!existing) {
    throw new Error(`Page not found: ${slug}`);
  }

  await fs.unlink(filePath);

  const dir = path.dirname(filePath);
  try {
    const files = await fs.readdir(dir);
    if (files.length === 0) {
      await fs.rmdir(dir);
    }
  } catch {
    // Ignore errors when cleaning up empty directories
  }
}
