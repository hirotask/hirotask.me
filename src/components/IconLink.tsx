"use client";

import { Github, Youtube, Mail, ExternalLink, Twitter, Linkedin, Globe } from "lucide-react";

interface IconLinkProps {
  url: string;
  icon?: string;
  children?: React.ReactNode;
}

export function IconLink({ url, icon, children }: IconLinkProps) {
  const getIcon = () => {
    if (icon) {
      switch (icon.toLowerCase()) {
        case "github":
          return <Github className="w-4 h-4" />;
        case "youtube":
          return <Youtube className="w-4 h-4" />;
        case "mail":
        case "email":
          return <Mail className="w-4 h-4" />;
        case "twitter":
          return <Twitter className="w-4 h-4" />;
        case "linkedin":
          return <Linkedin className="w-4 h-4" />;
        case "globe":
        case "website":
          return <Globe className="w-4 h-4" />;
        default:
          return <ExternalLink className="w-4 h-4" />;
      }
    }

    // URLから自動検出
    if (url.includes("github.com")) {
      return <Github className="w-4 h-4" />;
    }
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return <Youtube className="w-4 h-4" />;
    }
    if (url.includes("twitter.com") || url.includes("x.com")) {
      return <Twitter className="w-4 h-4" />;
    }
    if (url.includes("linkedin.com")) {
      return <Linkedin className="w-4 h-4" />;
    }
    if (url.startsWith("mailto:")) {
      return <Mail className="w-4 h-4" />;
    }

    return <ExternalLink className="w-4 h-4" />;
  };

  return (
    <a
      href={url}
      target={url.startsWith("mailto:") ? undefined : "_blank"}
      rel={url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
      style={{ color: "var(--accent)" }}
    >
      {getIcon()}
      {children && <span>{children}</span>}
    </a>
  );
}
