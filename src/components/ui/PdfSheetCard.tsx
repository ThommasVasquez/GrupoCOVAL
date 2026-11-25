"use client";

import { ArrowDownToLine } from "lucide-react";
import type { TechnicalSheet } from "@/lib/content/schemas";
import { trackEvent } from "@/lib/analytics";

interface PdfSheetCardProps {
  sheet: TechnicalSheet;
}

export function PdfSheetCard({ sheet }: PdfSheetCardProps) {
  return (
    <a
      href={sheet.fileUrl}
      download
      onClick={() =>
        trackEvent("pdf_sheet_download", {
          sheet_id: sheet.id,
          company: sheet.company,
        })
      }
      className="group flex flex-col justify-between gap-4 border-t border-[var(--border-strong)] pt-4 pb-2 hover:border-[var(--text-primary)] transition-colors"
    >
      <div>
        <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
          <span>{sheet.category}</span>
          <span className="font-mono">{sheet.fileSizeLabel}</span>
        </div>
        <h3 className="mt-2 text-base font-semibold text-[var(--text-primary)] leading-snug group-hover:underline underline-offset-4">
          {sheet.title}
        </h3>
      </div>

      <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
        <ArrowDownToLine aria-hidden="true" className="h-3.5 w-3.5" />
        <span>Descargar ficha PDF</span>
      </span>
    </a>
  );
}
