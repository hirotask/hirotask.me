import fs from "node:fs/promises";
import path from "node:path";
import YAML from "yaml";
import type { PageContent, PageMetadata, ProjectCategory, ProjectsData, Talk, TalksData } from "@/types/content";
import { parseMarkdown } from "./parser";
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

export async function getTalks(): Promise<Talk[]> {
  try {
    const talksPath = path.join(process.cwd(), "content", "talks.yaml");
    const raw = await fs.readFile(talksPath, "utf-8");
    const data = YAML.parse(raw) as TalksData;
    return data.talks ?? [];
  } catch (error) {
    console.error("Error reading talks:", error);
    return [];
  }
}

export async function getProjects(): Promise<ProjectCategory[]> {
  try {
    const projectsPath = path.join(process.cwd(), "content", "project.yaml");
    const raw = await fs.readFile(projectsPath, "utf-8");
    const data = YAML.parse(raw) as ProjectsData;

    const categories: ProjectCategory[] = [];

    for (const [category, projects] of Object.entries(data.projects)) {
      categories.push({
        category,
        projects,
      });
    }

    return categories;
  } catch (error) {
    console.error("Error reading projects:", error);
    return [];
  }
}

