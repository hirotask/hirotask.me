"use client";

import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import { LinkCard } from "./LinkCard";
import { IconLink } from "./IconLink";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// URL単独の行を検出する正規表現（<URL>形式も含む）
const URL_ONLY_REGEX = /^<?https?:\/\/[^\s>]+>?$/;

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // URL単独の行をカード表示に変換
  const processedContent = content
    .split("\n")
    .map((line) => {
      const trimmedLine = line.trim();
      if (URL_ONLY_REGEX.test(trimmedLine)) {
        // <URL> 形式の場合は <>を除去
        const url = trimmedLine.replace(/^<|>$/g, "");
        return `<link-card url="${url}"></link-card>`;
      }
      return line;
    })
    .join("\n");

  const components: Components = {
    a: ({ href, children }) => {
      if (!href) return <span>{children}</span>;

      // Check if link should have an icon
      const shouldHaveIcon =
        href.includes("github.com") ||
        href.includes("youtube.com") ||
        href.includes("youtu.be") ||
        href.includes("twitter.com") ||
        href.includes("x.com") ||
        href.includes("linkedin.com") ||
        href.startsWith("mailto:");

      if (shouldHaveIcon) {
        return <IconLink url={href}>{children}</IconLink>;
      }

      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
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
    <div className={`prose prose-lg max-w-none ${className}`}>
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
