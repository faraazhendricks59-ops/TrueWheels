import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { H1, H2, Body, BodySmall } from "@/components/typography/Typography";
import { getLegalDocument, LEGAL_DOCUMENTS } from "@/lib/legal/content";

interface LegalPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return LEGAL_DOCUMENTS.map((doc) => ({ slug: doc.slug }));
}

export function generateMetadata({ params }: LegalPageProps): Metadata {
  const doc = getLegalDocument(params.slug);
  if (!doc) return { title: "Not found | TrueWheels" };
  return { title: `${doc.title} | TrueWheels`, description: doc.summary };
}

export default function LegalPage({ params }: LegalPageProps) {
  const doc = getLegalDocument(params.slug);
  if (!doc) notFound();

  return (
    <article className="max-w-4xl mx-auto py-12">
      <header className="mb-8">
        <H1 className="mb-2">{doc.title}</H1>
        <BodySmall>Last updated {doc.updated}</BodySmall>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <nav className="hidden md:block" aria-label="On this page">
          <div className="sticky top-[calc(var(--header-height)+var(--sat)+1.5rem)] space-y-2">
            <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-4">On this page</p>
            {doc.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block text-sm text-ink-500 hover:text-brand transition-colors py-1"
              >
                {section.title}
              </a>
            ))}
          </div>
        </nav>

        <div className="md:col-span-3 space-y-12">
          {doc.sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-[calc(var(--header-height)+2rem)]">
              <H2 className="mb-4">{section.title}</H2>
              <div className="space-y-3">
                {section.body.map((paragraph, i) => (
                  <Body key={i}>{paragraph}</Body>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
