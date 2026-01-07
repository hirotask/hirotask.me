import path from "node:path";

export function validateSlug(slug: string): boolean {
  // 空文字列はhomeページを表すため許可
  if (slug === "") return true;

  if (!slug) return false;

  if (slug.includes("..")) return false;

  if (slug.startsWith("/")) return false;

  if (slug.startsWith(".")) return false;

  if (!/^[a-z0-9\-_/]+$/.test(slug)) return false;

  return true;
}

export function sanitizePath(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\-_/]/g, "")
    .replace(/\.+/g, "")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/");
}

export function isPathSafe(absolutePath: string, contentDir: string): boolean {
  const normalizedPath = path.normalize(absolutePath);
  const normalizedContentDir = path.normalize(contentDir);

  return normalizedPath.startsWith(normalizedContentDir);
}

export function slugToFilePath(slug: string): string {
  const normalizedSlug = slug || "home";

  return path.join(process.cwd(), "content", `${normalizedSlug}.md`);
}

export function validateAndGetPath(slug: string): string {
  const sanitized = sanitizePath(slug);

  if (!validateSlug(sanitized)) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  const absolutePath = slugToFilePath(sanitized);
  const contentDir = path.join(process.cwd(), "content");

  if (!isPathSafe(absolutePath, contentDir)) {
    throw new Error(`Path is outside content directory: ${slug}`);
  }

  return absolutePath;
}
