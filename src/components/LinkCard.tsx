"use client";

interface LinkCardProps {
  url: string;
}

export function LinkCard({ url }: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block my-2 p-3 border border-gray-700 rounded-lg hover:border-gray-600 hover:shadow-lg transition-all duration-200 no-underline group"
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0 gap-0">
          <p className="text-sm text-gray-100 font-medium truncate group-hover:opacity-70 transition-opacity">
            {url}
          </p>
          <p className="text-xs text-gray-500 truncate">{new URL(url).hostname}</p>
        </div>
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </div>
      </div>
    </a>
  );
}
