import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScrollText } from "lucide-react";
import { LEGAL_DOCS, LEGAL_DOC_SLUGS, getLegalDoc } from "@/lib/legal/legal-content";

interface LegalPageProps {
  params: { doc: string };
}

export function generateStaticParams() {
  return LEGAL_DOC_SLUGS.map((doc) => ({ doc }));
}

export function generateMetadata({ params }: LegalPageProps): Metadata {
  const doc = getLegalDoc(params.doc);
  if (!doc) return { title: "Not found" };
  return { title: `${doc.title} | TrueWheels`, description: `TrueWheels ${doc.title}` };
}

export default function LegalPage({ params }: LegalPageProps) {
  const doc = LEGAL_DOCS[params.doc];
  if (!doc) notFound();

  return (
    <div className="min-h-screen bg-surface-grey">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* Header */}
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-red/10">
            <ScrollText size={22} className="text-brand-red" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-graphite">{doc.title}</h1>
            <p className="text-xs text-neutral-subtle">Last updated: {doc.lastUpdated}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Sticky table of contents */}
          <aside className="hidden md:block">
            <div className="sticky top-24 rounded-xl border border-brand-silver bg-surface-white p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-neutral-subtle">
                On this page
              </p>
              <nav aria-label="Table of contents" className="space-y-1">
                {doc.sections.map((section, i) => (
                  <a
                    key={section.heading}
                    href={`#section-${i}`}
                    className="block py-1 text-xs text-neutral-muted transition-colors hover:text-brand-red"
                  >
                    {section.heading}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main id="main-content" tabIndex={-1} className="md:col-span-3">
            <div className="rounded-xl border border-brand-silver bg-surface-white p-6 md:p-8">
              {doc.sections.map((section, i) => (
                <section
                  key={section.heading}
                  id={`section-${i}`}
                  // Keeps anchored headings clear of the sticky site header.
                  className={i > 0 ? "mt-8 scroll-mt-24" : "scroll-mt-24"}
                >
                  <h2 className="mb-3 text-lg font-bold text-brand-graphite">{section.heading}</h2>
                  {section.body.map((para, j) => (
                    <p key={j} className="mb-3 text-sm leading-relaxed text-neutral-muted">
                      {para}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
