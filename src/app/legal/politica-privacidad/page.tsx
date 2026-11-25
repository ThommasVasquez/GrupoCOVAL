import Link from "next/link";
import { getGroupEntity } from "@/lib/content/repository";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { DraftingCornerTicks } from "@/components/architectural/DraftingMarks";

export const metadata = buildPageMetadata({
  title: "Política de Privacidad y Protección de Datos (Ley 1581) | Grupo Coval",
  description:
    "Política de tratamiento de datos personales de Grupo Coval conforme a la Ley Estatutaria 1581 de 2012 y el Decreto 1377 de 2013 de la República de Colombia.",
  path: "/legal/politica-privacidad",
});

export default function PoliticaPrivacidadPage() {
  const group = getGroupEntity();

  return (
    <div data-brand="grupo" className="w-full">
      <section className="relative min-h-[calc(100dvh-6.25rem)] w-full overflow-hidden bg-[var(--surface-page)] px-5 py-8 sm:px-10 lg:px-16 xl:px-20">
        <DraftingCornerTicks />

        <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-4">
          <Breadcrumbs
            items={[
              { name: "Coval Concretos", path: "/" },
              { name: "Política de Privacidad", path: "/legal/politica-privacidad" },
            ]}
          />
          <span className="font-mono text-xs text-[var(--text-secondary)]">
            Ley 1581 de 2012 · Colombia
          </span>
        </div>

        <div className="relative z-20 mx-auto mt-10 max-w-3xl space-y-6">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--brand-primary)] font-semibold">
            Marco Legal Colombiano
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)]">
            Política de Tratamiento de Datos Personales
          </h1>
          <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
            En cumplimiento de la Ley Estatutaria 1581 de 2012, el Decreto 1377 de 2013 y las normas concordantes de la República de Colombia, {group.groupName} informa las condiciones bajo las cuales recopila, almacena, usa y protege los datos suministrados a través de sus formularios de cotización y canales de contacto.
          </p>

          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-card)] p-5 text-sm space-y-2">
            <p className="font-semibold text-[var(--text-primary)]">Identificación del Responsable</p>
            <p className="text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Grupo empresarial:</strong> {group.groupName} (Coval Concretos, Icopores Modulado / IMT y VT Ingequipos S.A.S.)
            </p>
            <p className="text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Razón social / NIT:</strong> {group.legalName} — {group.taxId}
            </p>
            <p className="text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Sede principal:</strong> {group.headquarters.streetAddress}, {group.headquarters.addressLocality}
            </p>
            <p className="text-[var(--text-secondary)]">
              <strong className="text-[var(--text-primary)]">Teléfono oficial:</strong> {group.phoneDisplay} ·{" "}
              <strong className="text-[var(--text-primary)]">Correo comercial:</strong> {group.email} ·{" "}
              <strong className="text-[var(--text-primary)]">Contacto Habeas Data:</strong> {group.privacyEmail}
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">1. Finalidad del tratamiento</h2>
            <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
              Los datos recolectados (nombre, teléfono, correo electrónico, municipio/ciudad de obra y descripción de requerimiento) se utilizan exclusivamente para elaborar y remitir cotizaciones de concreto premezclado, productos EPS o alquiler/venta de maquinaria, coordinar visitas técnicas y despachos en Bogotá, Soacha y Sibaté, y atender solicitudes comerciales enviadas por el titular.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">2. Derechos de los titulares (Habeas Data)</h2>
            <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
              Como titular de los datos personales, usted tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de su información, así como a revocar la autorización otorgada, mediante comunicación escrita dirigida a nuestra línea oficial {group.phoneDisplay} o al correo {group.email}.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">3. Seguridad y no comercialización</h2>
            <p className="font-serif text-base leading-relaxed text-[var(--text-secondary)]">
              {group.groupName} no vende ni cede bases de datos personales a terceros ajenos a la operación logística, comercial o técnica requerida para atender la solicitud del cliente. Los envíos de formularios cuentan con verificación anti-abuso (Cloudflare Turnstile).
            </p>
          </section>

          <div className="border-t border-[var(--border-subtle)] pt-6 flex flex-wrap gap-4 text-xs">
            <Link href="/legal/politica-cookies" className="text-[var(--brand-primary)] hover:underline">
              Ver Política de Cookies
            </Link>
            <Link href="/contacto" className="text-[var(--text-primary)] hover:underline">
              Ir al formulario de contacto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
