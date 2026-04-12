import { ExternalLink } from "lucide-react";
import type { ProjectItem } from "@/types/content";

interface ProjectCardProps {
  project: ProjectItem;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-100 group-hover:text-gray-300 transition-colors">
            {project.name}
          </h3>
          <p className="mt-1 text-sm text-gray-400 line-clamp-2">
            {project.desc}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-1" />
      </div>
    </a>
  );
}
