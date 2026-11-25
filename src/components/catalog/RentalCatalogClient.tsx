"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ArrowUpRight,
  Plus,
  Check,
  Minus,
  PhoneCall,
  Copy,
  Trash2,
} from "lucide-react";
import type { EquipmentItem, RentalCategory } from "@/lib/content/schemas";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface RentalCatalogClientProps {
  categories: RentalCategory[];
  equipment: EquipmentItem[];
  phoneDisplay?: string;
}

interface QuoteCartItem {
  key: string;
  item: EquipmentItem;
  qty: number;
}

export function RentalCatalogClient({
  categories,
  equipment,
  phoneDisplay = "+57 316 2948000",
}: RentalCatalogClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<Record<string, QuoteCartItem>>({});
  const [copied, setCopied] = useState(false);

  const categoryNameBySlug = useMemo(
    () => new Map(categories.map((c) => [c.slug, c.name])),
    [categories],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return equipment.filter((item) => {
      const matchesCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesQuery =
        q.length === 0 || item.name.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [equipment, selectedCategory, query]);

  const cartEntries = useMemo(() => Object.values(cart), [cart]);
  const totalUnits = useMemo(
    () => cartEntries.reduce((sum, entry) => sum + entry.qty, 0),
    [cartEntries],
  );

  const toggleCartItem = (item: EquipmentItem) => {
    const key = `${item.category}-${item.slug}`;
    setCart((prev) => {
      if (prev[key]) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return {
        ...prev,
        [key]: { key, item, qty: 1 },
      };
    });
  };

  const updateCartQty = (key: string, delta: number) => {
    setCart((prev) => {
      const current = prev[key];
      if (!current) return prev;
      const nextQty = current.qty + delta;
      if (nextQty <= 0) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return {
        ...prev,
        [key]: { ...current, qty: Math.min(nextQty, 99) },
      };
    });
  };

  const quoteSummaryText = useMemo(() => {
    if (cartEntries.length === 0) return "";
    const lines = cartEntries.map(({ item, qty }) => {
      const catName = categoryNameBySlug.get(item.category) ?? item.category;
      return `- ${qty} × ${item.name} (${catName})`;
    });
    return [
      "Hola VT Ingequipos S.A.S., solicito cotización y disponibilidad de los siguientes equipos:",
      ...lines,
    ].join("\n");
  }, [cartEntries, categoryNameBySlug]);

  const cartWhatsappHref = buildWhatsAppUrl({
    pathname: "/alquiler",
    customMessage: quoteSummaryText || undefined,
  });

  const handleCopyList = async () => {
    if (!quoteSummaryText) return;
    try {
      await navigator.clipboard.writeText(quoteSummaryText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Barra de lista de cotización múltiple */}
      {cartEntries.length > 0 && (
        <aside
          aria-label="Lista de equipos seleccionados para cotizar"
          className="border border-[var(--brand-primary)] bg-[var(--surface-card)] p-5 space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-3">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--brand-primary)]">
                Lista de cotización VT Ingequipos
              </p>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {cartEntries.length}{" "}
                {cartEntries.length === 1 ? "referencia" : "referencias"} ({totalUnits}{" "}
                {totalUnits === 1 ? "unidad" : "unidades"})
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyList}
                className="inline-flex h-10 items-center gap-1.5 border border-[var(--border-strong)] px-3 text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--brand-primary)] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Lista copiada</span>
                  </>
                ) : (
                  <>
                    <Copy aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Copiar lista</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setCart({})}
                aria-label="Vaciar lista de cotización"
                className="inline-flex h-10 items-center gap-1.5 border border-[var(--border-subtle)] px-3 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Limpiar</span>
              </button>

              <a
                href={cartWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 bg-[var(--brand-primary)] px-4 text-xs font-semibold text-[var(--brand-on-primary)] hover:bg-[var(--brand-primary-hover)] transition-colors"
              >
                <PhoneCall aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Cotizar por WhatsApp ({phoneDisplay})</span>
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {cartEntries.map(({ key, item, qty }) => (
              <div
                key={key}
                className="inline-flex items-center gap-2 border border-[var(--border-subtle)] bg-[var(--surface-page)] px-3 py-1.5 text-xs"
              >
                <span className="font-semibold text-[var(--text-primary)]">
                  {item.name}
                </span>
                <div className="flex items-center gap-1 border-l border-[var(--border-subtle)] pl-2">
                  <button
                    type="button"
                    onClick={() => updateCartQty(key, -1)}
                    aria-label={`Disminuir cantidad de ${item.name}`}
                    className="inline-flex h-5 w-5 items-center justify-center border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] cursor-pointer"
                  >
                    <Minus aria-hidden="true" className="h-3 w-3" />
                  </button>
                  <span className="font-mono w-5 text-center font-semibold">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCartQty(key, 1)}
                    aria-label={`Aumentar cantidad de ${item.name}`}
                    className="inline-flex h-5 w-5 items-center justify-center border border-[var(--border-subtle)] hover:border-[var(--brand-primary)] cursor-pointer"
                  >
                    <Plus aria-hidden="true" className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* Controles de filtrado minimalistas con foco rojo #e30613 */}
      <div className="flex flex-col gap-5 border-y border-[var(--border-subtle)] py-6 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Filtrar por línea de equipo"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
            className={cn(
              "min-h-11 rounded-full px-4 text-xs font-medium transition-colors cursor-pointer border",
              selectedCategory === "all"
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-on-primary)] font-semibold"
                : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            )}
          >
            Todas ({equipment.length})
          </button>

          {categories.map((cat) => {
            const count = equipment.filter((e) => e.category === cat.slug).length;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat.slug)}
                className={cn(
                  "min-h-11 rounded-full px-4 text-xs font-medium transition-colors cursor-pointer border",
                  isSelected
                    ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-on-primary)] font-semibold"
                    : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        <label className="relative flex w-full items-center lg:max-w-xs">
          <span className="sr-only">Buscar equipo por nombre</span>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 h-4 w-4 text-[var(--text-tertiary)]"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar equipo (ej. rotomartillo, rana)"
            className="min-h-11 w-full border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-10 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]"
          />
        </label>
      </div>

      {/* Grilla de equipos */}
      {filtered.length === 0 ? (
        <p className="py-12 font-serif text-lg text-[var(--text-secondary)]">
          No se encontraron equipos para &ldquo;{query}&rdquo; en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((item) => {
            const catName =
              categoryNameBySlug.get(item.category) ?? item.category;
            const itemKey = `${item.category}-${item.slug}`;
            const inCart = cart[itemKey];
            return (
              <article
                key={itemKey}
                className="group flex flex-col justify-between border-t border-[var(--border-subtle)] pt-5"
              >
                <Link
                  href={`/alquiler/${item.category}/${item.slug}`}
                  className="block"
                >
                  {item.image && (
                    <div className="aspect-square w-full overflow-hidden bg-[var(--surface-muted)]">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={604}
                        height={604}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </div>
                  )}

                  <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--brand-primary)]">
                    {catName}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-[var(--text-primary)] leading-snug group-hover:underline underline-offset-4">
                    {item.name}
                  </h2>
                </Link>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-[var(--border-subtle)] pt-3 text-xs">
                  <Link
                    href={`/alquiler/${item.category}/${item.slug}`}
                    className="inline-flex min-h-10 items-center gap-1 font-semibold text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors"
                  >
                    <span>Ver ficha técnica</span>
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleCartItem(item)}
                    className={cn(
                      "inline-flex min-h-9 items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer border",
                      inCart
                        ? "border-[var(--brand-primary)] bg-[var(--brand-primary)] text-[var(--brand-on-primary)]"
                        : "border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]",
                    )}
                  >
                    {inCart ? (
                      <>
                        <Check aria-hidden="true" className="h-3.5 w-3.5" />
                        <span>En lista ({inCart.qty})</span>
                      </>
                    ) : (
                      <>
                        <Plus aria-hidden="true" className="h-3.5 w-3.5" />
                        <span>Cotizar</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
