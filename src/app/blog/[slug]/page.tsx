import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/content/blog";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/utils";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AnswerCapsule } from "@/components/ui/AnswerCapsule";
import { OpenCalculatorButton } from "@/components/calculators/OpenCalculatorButton";
import { DraftingCornerTicks } from "@/components/architectural/DraftingMarks";

export function generateStaticParams(): Array<{ slug: string }> {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) {
    return buildPageMetadata({
      title: "Artículo no encontrado",
      description: "Bitácora técnica de Grupo Coval.",
      path: "/blog",
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: `${post.title} | Bitácora Técnica`,
    description: post.summary,
    path: `/blog/${post.slug}`,
    ogType: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    inLanguage: "es-CO",
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    author: {
      "@type": "Organization",
      name: "Grupo Coval",
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: "Grupo Coval",
      url: absoluteUrl("/"),
    },
  };

  return (
    <div data-brand="grupo" className="w-full">
      <JsonLd data={articleSchema} />

      <article className="relative min-h-[calc(100dvh-6.25rem)] w-full overflow-hidden bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <DraftingCornerTicks />

        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <Breadcrumbs
            items={[
              { name: "Coval Concretos", path: "/" },
              { name: "Bitácora Técnica", path: "/blog" },
              { name: post.category, path: `/blog/${post.slug}` },
            ]}
          />
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Volver a Bitácora
          </Link>
        </div>

        <div className="relative z-20 mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[var(--text-secondary)]">
            <span className="font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
              {post.category}
            </span>
            <span>·</span>
            <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            <span>·</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            {post.title}
          </h1>

          <p className="mt-4 font-serif text-lg leading-relaxed text-[var(--text-secondary)]">
            {post.summary}
          </p>

          <AnswerCapsule
            className="my-8"
            question={post.keyQuestion}
            answer={post.keyAnswer}
          />

          <div className="space-y-8 border-t border-[var(--border-subtle)] pt-8">
            {post.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p) => (
                  <p
                    key={p}
                    className="font-serif text-base leading-relaxed text-[var(--text-secondary)]"
                  >
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="mt-3 space-y-2 border-l-2 border-[var(--brand-primary)] pl-4 text-sm text-[var(--text-primary)]">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-6">
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                ¿Necesita respaldo técnico para su obra?
              </p>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Consulte fichas técnicas, volúmenes orientativos o cotización directa con nuestra línea comercial.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={post.brandHref}
                className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[var(--border-strong)] px-4 text-xs font-medium text-[var(--text-primary)] hover:border-[var(--text-primary)]"
              >
                Ir a {post.category}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <OpenCalculatorButton className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--brand-primary)] px-5 text-xs font-semibold text-white hover:bg-[var(--brand-primary-hover)]">
                Calcular m³
              </OpenCalculatorButton>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
