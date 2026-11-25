"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { resolveBrandFromPathname } from "@/lib/content/repository";

export function BrandThemeScope({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/";
  const activeBrand = resolveBrandFromPathname(pathname);

  useEffect(() => {
    document.documentElement.setAttribute("data-brand", activeBrand);
  }, [activeBrand]);

  return (
    <div data-brand={activeBrand} className="flex min-h-dvh flex-col">
      {children}
    </div>
  );
}
