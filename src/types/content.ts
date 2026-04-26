export interface PageFrontmatter {
  title: string;
  description?: string;
  author?: string;
  date?: string;
  tags?: string[];
  draft?: boolean;
}

export interface PageMetadata {
  slug: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  path: string;
}

export interface PageContent extends PageMetadata {
  content: string;
  frontmatter: PageFrontmatter;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ProjectItem {
  name: string;
  link: string;
  desc: string;
  icon?: string;
}

export interface ProjectCategory {
  category: string;
  projects: ProjectItem[];
}

export interface ProjectsData {
  projects: Record<string, ProjectItem[]>;
}

export interface TalkPresentation {
  date: string;
  lang: string;
  conference: string;
  pdf?: string;
  spa?: string;
}

export interface Talk {
  title: string;
  description?: string;
  presentations: TalkPresentation[];
}

export interface TalksData {
  talks: Talk[];
}
