import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { getAllBlogPosts } from "@/lib/content/blog";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import {
  DraftingCornerTicks,
  SheetSectionHeader,
} from "@/components/architectural/DraftingMarks";

export const metadata = buildPageMetadata({
  title: "Bitácora Técnica y Guías de Obra | Grupo Coval",
  description:
    "Guías técnicas sobre concreto premezclado (bombeable, MR, tremie), aligeramiento de losas con casetones EPS (IMT) y encofrados Steel-Ply / maquinaria VT Ingequipos.",
  path: "/blog",
});

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <div data-brand="grupo" className="w-full">
      <section className="relative min-h-[calc(100dvh-6.25rem)] w-full overflow-hidden bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <DraftingCornerTicks />

        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <Breadcrumbs
            items={[
              { name: "Coval Concretos", path: "/" },
              { name: "Bitácora Técnica", path: "/blog" },
            ]}
          />
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Especificación · EPS · Formaleta
          </span>
        </div>

        <div className="relative z-20 mt-10">
          <SheetSectionHeader
            eyebrow="Documentación de Ingeniería y Obra"
            title="Bitácora técnica Grupo Coval"
            subtitle="Artículos prácticos preparados con base en nuestras fichas de concreto premezclado, fabricación de poliestireno expandido (EPS) y sistemas de maquinaria VT Ingequipos."
          />

          <AnswerCapsule
            className="mb-10"
            question="¿Qué temas cubre la Bitácora Técnica de Grupo Coval?"
            answer="Reúne notas de aplicación sobre especificación de concretos bombeables, MR, industrializados y tremie; selección entre casetón modulado y perdido para losas unidireccionales o reticulares; y productividad en formaleta Steel-Ply e izaje en obra."
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {posts.map((post, idx) => (
              <article
                key={post.slug}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6 sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-primary)]">
                      0{idx + 1} · {post.category}
                    </span>
                    <span className="font-mono text-[11px] text-[var(--text-tertiary)]">
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-snug text-[var(--text-primary)]">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:underline underline-offset-4"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-3 font-serif text-sm leading-relaxed text-[var(--text-secondary)]">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-6 border-t border-[var(--border-subtle)] pt-4 flex items-center justify-between">
                  <time
                    dateTime={post.publishedAt}
                    className="font-mono text-xs text-[var(--text-tertiary)]"
                  >
                    {post.publishedAt}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-primary)] hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-[var(--brand-primary)]" />
                    Leer guía
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
