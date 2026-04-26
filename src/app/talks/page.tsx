import type { Metadata } from "next";
import Link from "next/link";
import { getTalks } from "@/lib/content/fs";
import type { Talk, TalkPresentation } from "@/types/content";

export const metadata: Metadata = {
  title: "Talks - hirotask.me",
  description: "Talks and presentations",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${month}/${day}`;
}

function getYear(dateStr: string): string {
  return new Date(dateStr).getFullYear().toString();
}

interface PresentationRow {
  presentation: TalkPresentation;
  talk: Talk;
}

export default async function TalksPage() {
  const talks = await getTalks();

  const rows: PresentationRow[] = talks.flatMap((talk) =>
    talk.presentations.map((presentation) => ({ presentation, talk }))
  );

  rows.sort(
    (a, b) => new Date(b.presentation.date).getTime() - new Date(a.presentation.date).getTime()
  );

  const byYear = rows.reduce<Record<string, PresentationRow[]>>((acc, row) => {
    const year = getYear(row.presentation.date);
    if (!acc[year]) acc[year] = [];
    acc[year].push(row);
    return acc;
  }, {});

  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="min-h-screen bg-black pt-16">
      <main className="max-w-3xl mx-auto px-6 py-12 slide-enter-content">
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-3 text-gray-100">Talks</h1>
          <p className="text-base text-gray-400">Presentations and talks</p>
        </header>

        <div className="space-y-12">
          {years.length === 0 ? (
            <p className="text-gray-500">No talks yet.</p>
          ) : (
            years.map((year) => (
              <section key={year}>
                <h2 className="text-xl font-semibold text-gray-500 mb-4 select-none">{year}</h2>
                <div className="space-y-0">
                  {byYear[year].map((row, i) => (
                    <TalkRow key={`${row.presentation.date}-${i}`} row={row} />
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

function TalkRow({ row }: { row: PresentationRow }) {
  const { presentation, talk } = row;
  const hasLinks = presentation.pdf || presentation.spa;

  return (
    <div className="flex items-baseline gap-4 py-3 border-b border-gray-800/50 group">
      <span className="text-sm text-gray-600 tabular-nums shrink-0 w-12">
        {formatDate(presentation.date)}
      </span>

      <div className="flex-1 min-w-0">
        <span className="text-gray-100 text-sm">{talk.title}</span>
        <span className="text-gray-500 text-sm ml-2">@ {presentation.conference}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {presentation.lang && (
          <span className="text-xs text-gray-600 uppercase tracking-wide">{presentation.lang}</span>
        )}
        {hasLinks && (
          <div className="flex items-center gap-2">
            {presentation.spa && (
              <Link
                href={presentation.spa}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 px-2 py-0.5"
              >
                Slides
              </Link>
            )}
            {presentation.pdf && (
              <Link
                href={presentation.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-400 px-2 py-0.5"
              >
                PDF
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
