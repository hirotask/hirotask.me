"use client";

import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core";
import { listener, listenerCtx } from "@milkdown/plugin-listener";
import { commonmark } from "@milkdown/preset-commonmark";
import { gfm } from "@milkdown/preset-gfm";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { nord } from "@milkdown/theme-nord";
import { useEffect, useRef } from "react";
import "@milkdown/theme-nord/style.css";

interface MarkdownEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
}

function EditorComponent({ initialContent, onChange }: MarkdownEditorProps) {
  const isInitialized = useRef(false);

  const { get } = useEditor((root) =>
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, initialContent);
        ctx.get(listenerCtx).markdownUpdated((_ctx, markdown, prevMarkdown) => {
          if (markdown !== prevMarkdown) {
            onChange(markdown);
          }
        });
      })
      .config(nord)
      .use(commonmark)
      .use(gfm)
      .use(listener)
  );

  useEffect(() => {
    if (!isInitialized.current && initialContent && get()) {
      isInitialized.current = true;
    }
  }, [initialContent, get]);

  return <Milkdown />;
}

export function MarkdownEditor({ initialContent, onChange }: MarkdownEditorProps) {
  return (
    <MilkdownProvider>
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
        <EditorComponent initialContent={initialContent} onChange={onChange} />
      </div>
    </MilkdownProvider>
  );
}
