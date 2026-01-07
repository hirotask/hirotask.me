"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import { LinkCard } from "./LinkCard";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// URL単独の行を検出する正規表現
const URL_ONLY_REGEX = /^https?:\/\/[^\s]+$/;

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // URL単独の行をカード表示に変換
  const processedContent = content
    .split("\n")
    .map((line) => {
      const trimmedLine = line.trim();
      if (URL_ONLY_REGEX.test(trimmedLine)) {
        return `<link-card url="${trimmedLine}"></link-card>`;
      }
      return line;
    })
    .join("\n");

  const components: Components = {
    a: ({ href, children }) => {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 font-medium hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200"
        >
          {children}
        </a>
      );
    },
    // カスタム要素としてlink-cardを処理
    "link-card": ({ url }: { url?: string }) => {
      if (!url) return null;
      return <LinkCard url={url} />;
    },
  };

  return (
    <div className={`prose prose-lg dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
