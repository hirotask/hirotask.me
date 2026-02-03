"use client";

import Link from "next/link";
import { Github, Home } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/30 bg-black/80 backdrop-blur-lg">
      <div className="max-w-3xl mx-auto px-6 py-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-100 hover:opacity-60 transition-opacity"
              aria-label="Home"
            >
              <Home className="w-[18px] h-[18px]" />
            </Link>
            <div className="flex items-center gap-5">
              <Link
                href="/blog"
                className="text-[14px] text-gray-400 hover:text-gray-100 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/projects"
                className="text-[14px] text-gray-400 hover:text-gray-100 transition-colors"
              >
                Projects
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/hirotask"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-100 transition-colors p-1.5 rounded hover:bg-gray-900"
              aria-label="GitHub"
            >
              <Github className="w-[16px] h-[16px]" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
