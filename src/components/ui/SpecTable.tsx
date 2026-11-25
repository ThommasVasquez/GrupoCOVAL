import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SpecColumn<Row> {
  key: string;
  header: string;
  mono?: boolean;
  render: (row: Row) => ReactNode;
}

interface SpecTableProps<Row> {
  caption: string;
  columns: Array<SpecColumn<Row>>;
  rows: Row[];
  getRowKey: (row: Row, index: number) => string;
  className?: string;
}

export function SpecTable<Row>({
  caption,
  columns,
  rows,
  getRowKey,
  className,
}: SpecTableProps<Row>) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left text-sm border-y border-[var(--border-ink)]">
        <caption className="pb-4 text-left text-xs font-medium tracking-wide text-[var(--text-secondary)]">
          {caption}
        </caption>
        <thead>
          <tr className="border-b border-[var(--border-strong)]">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="py-3.5 pr-6 text-xs font-semibold tracking-wide text-[var(--text-secondary)] whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-subtle)]">
          {rows.map((row, index) => (
            <tr
              key={getRowKey(row, index)}
              className="hover:bg-[var(--surface-card)] transition-colors"
            >
              {columns.map((col, colIdx) => {
                const cellContent = col.render(row);
                if (colIdx === 0) {
                  return (
                    <th
                      key={col.key}
                      scope="row"
                      className={cn(
                        "py-4 pr-6 font-semibold text-[var(--text-primary)] align-top",
                        col.mono && "font-mono text-xs sm:text-sm",
                      )}
                    >
                      {cellContent}
                    </th>
                  );
                }
                return (
                  <td
                    key={col.key}
                    className={cn(
                      "py-4 pr-6 text-[var(--text-secondary)] align-top",
                      col.mono && "font-mono text-xs text-[var(--text-primary)]",
                    )}
                  >
                    {cellContent}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
