import Link from "next/link";
import {
  buildBreadcrumbJsonLd,
  type BreadcrumbEntry,
} from "@/lib/seo/schema-builders";
import { JsonLd } from "@/components/seo/JsonLd";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  items: BreadcrumbEntry[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <>
      <JsonLd data={buildBreadcrumbJsonLd(items)} />
      <nav aria-label="Ruta de navegación" className={cn("text-xs", className)}>
        <ol className="flex flex-wrap items-center gap-2 text-[var(--text-secondary)]">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.path} className="inline-flex items-center gap-2">
                {idx > 0 && (
                  <span aria-hidden="true" className="text-[var(--text-tertiary)]">
                    /
                  </span>
                )}
                {isLast ? (
                  <span aria-current="page" className="font-medium text-[var(--text-primary)]">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="py-1 underline-offset-4 hover:text-[var(--text-primary)] hover:underline"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
