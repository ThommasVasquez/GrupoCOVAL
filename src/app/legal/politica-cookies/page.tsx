import Link from "next/link";
import { getGroupEntity } from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DraftingCornerTicks } from "@/components/architectural/DraftingMarks";

export const metadata = buildPageMetadata({
  title: "Política de Cookies y Almacenamiento Local | Grupo Coval",
  description:
    "Información sobre cookies técnicas, almacenamiento de tema claro/oscuro, cesta de cotización de equipos y consentimiento analítico en el portal de Grupo Coval.",
  path: "/legal/politica-cookies",
});

export default function PoliticaCookiesPage() {
  const group = getGroupEntity();

  return (
    <div data-brand="grupo" className="w-full">
      <section className="relative min-h-[calc(100dvh-6.25rem)] w-full overflow-hidden bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <DraftingCornerTicks />

        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <Breadcrumbs
            items={[
              { name: "Coval Concretos", path: "/" },
              { name: "Política de Cookies", path: "/legal/politica-cookies" },
            ]}
          />
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Transparencia Técnica
          </span>
        </div>

        <div className="relative z-20 mx-auto mt-10 max-w-3xl space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)] font-semibold">
            Uso de Cookies y Almacenamiento
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Política de Cookies y Preferencias del Navegador
          </h1>
          <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
            El portal web de {group.groupName} utiliza almacenamiento local técnico indispensable para recordar sus preferencias de interfaz y, únicamente cuando usted lo autoriza, medición estadística anónima de navegación.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-[var(--border-subtle)] font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                <tr>
                  <th className="py-2 pr-4">Clave / Tecnología</th>
                  <th className="py-2 pr-4">Finalidad</th>
                  <th className="py-2">Categoría</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr>
                  <td className="py-3 pr-4 font-mono text-[var(--text-primary)]">coval_theme_v1</td>
                  <td className="py-3 pr-4">Recordar su preferencia de modo claro o modo oscuro.</td>
                  <td className="py-3">Necesaria (interfaz)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-[var(--text-primary)]">coval_cookie_consent_v1</td>
                  <td className="py-3 pr-4">Guardar su decisión sobre aceptación de cookies analíticas.</td>
                  <td className="py-3">Necesaria (preferencia)</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-[var(--text-primary)]">Cloudflare Turnstile</td>
                  <td className="py-3 pr-4">Protección anti-spam en el formulario comercial de /contacto.</td>
                  <td className="py-3">Seguridad</td>
                </tr>
              </tbody>
            </table>
          </div>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Control y revocación</h2>
            <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
              Puede borrar o bloquear el almacenamiento local y las cookies en cualquier momento desde la configuración de su navegador. Para consultas relacionadas con su privacidad, revise nuestra Política de Privacidad o contáctenos al {group.phoneDisplay}.
            </p>
          </section>

          <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-wrap gap-4 text-xs">
            <Link href="/legal/politica-privacidad" className="text-[var(--brand-primary)] hover:underline">
              Ver Política de Privacidad (Ley 1581)
            </Link>
            <Link href="/contacto" className="text-[var(--text-primary)] hover:underline">
              Ir a Contacto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
