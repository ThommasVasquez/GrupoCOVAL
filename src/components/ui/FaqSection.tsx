import { Plus, Minus } from "lucide-react";
import type { FaqItem } from "@/lib/content/schemas";
import { buildFaqPageJsonLd } from "@/lib/seo/schema-builders";
import { JsonLd } from "@/components/seo/JsonLd";

interface FaqSectionProps {
  title?: string;
  description?: string;
  faqs: FaqItem[];
  includeJsonLd?: boolean;
}

export function FaqSection({
  title = "Preguntas frecuentes",
  description,
  faqs,
  includeJsonLd = true,
}: FaqSectionProps) {
  if (faqs.length === 0) return null;

  return (
    <div aria-labelledby="faq-heading" className="py-4">
      {includeJsonLd && <JsonLd data={buildFaqPageJsonLd(faqs)} />}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        <div data-arch="heading" className="lg:col-span-4">
          <h2
            id="faq-heading"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-2.5 font-serif text-sm sm:text-base text-[var(--text-secondary)]">
              {description}
            </p>
          )}
        </div>

        <div
          data-arch="stagger"
          className="lg:col-span-8 divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]"
        >
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-3.5 sm:py-4">
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--text-primary)]">
                <span className="text-base sm:text-lg leading-snug">
                  {faq.question}
                </span>
                <span className="shrink-0 text-[var(--text-secondary)]">
                  <Plus aria-hidden="true" className="h-4 w-4 group-open:hidden" />
                  <Minus aria-hidden="true" className="hidden h-4 w-4 group-open:block" />
                </span>
              </summary>
              <p className="mt-3 max-w-[66ch] text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
