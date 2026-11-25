import type { ConcreteShapeId } from "@/lib/calculators/concrete";

/**
 * Iconos y esquemas vectoriales arquitectónicos por forma estructural.
 * Adaptativos a Modo Claro/Oscuro usando tokens CSS.
 */
export function ShapeIconSvg({
  shape,
  className = "h-7 w-7",
}: {
  shape: ConcreteShapeId;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={className}
    >
      {shape === "cubo-losa" && (
        <>
          <polygon points="8,18 28,10 40,16 20,24" />
          <polygon points="8,18 20,24 20,38 8,32" />
          <polygon points="20,24 40,16 40,30 20,38" />
        </>
      )}
      {shape === "columna" && (
        <>
          <ellipse cx="24" cy="11" rx="10" ry="4" />
          <path d="M14,11 L14,37 A10,4 0 0,0 34,37 L34,11" />
        </>
      )}
      {shape === "tubo" && (
        <>
          <ellipse cx="24" cy="11" rx="12" ry="4.5" />
          <ellipse cx="24" cy="11" rx="6" ry="2.2" />
          <path d="M12,11 L12,37 A12,4.5 0 0,0 36,37 L36,11" />
          <line x1="18" y1="11" x2="18" y2="30" strokeDasharray="2 2" />
          <line x1="30" y1="11" x2="30" y2="30" strokeDasharray="2 2" />
        </>
      )}
      {shape === "pared" && (
        <>
          <polygon points="10,12 32,8 38,11 16,15" />
          <polygon points="10,12 16,15 16,39 10,36" />
          <polygon points="16,15 38,11 38,35 16,39" />
        </>
      )}
      {shape === "cimientos-corridos" && (
        <>
          <polygon points="6,18 24,10 42,18 24,26" />
          <polygon points="15,18 24,14 33,18 24,22" strokeDasharray="2 2" />
          <path d="M6,18 L6,30 L24,38 L42,30 L42,18" />
          <line x1="24" y1="26" x2="24" y2="38" />
        </>
      )}
      {shape === "escaleras" && (
        <path d="M8,38 L40,38 L40,12 L30,12 L30,20 L20,20 L20,29 L8,29 Z" />
      )}
    </svg>
  );
}

/**
 * Plano acotado ampliado dentro del constructor de cada forma
 * para visualizar exactamente cada dimensión (L, A, H, Ø, r, t, g).
 */
export function ShapeSchematicDiagram({
  shape,
}: {
  shape: ConcreteShapeId;
}) {
  return (
    <div className="border border-[var(--border-subtle)] bg-[var(--surface-page)] p-3">
      <svg
        viewBox="0 0 320 140"
        aria-hidden="true"
        className="h-32 w-full"
        fill="none"
      >
        <g stroke="var(--border-subtle)" strokeDasharray="3 4" strokeWidth="0.7">
          <line x1="12" y1="70" x2="308" y2="70" />
          <line x1="160" y1="10" x2="160" y2="130" />
        </g>

        {shape === "cubo-losa" && (
          <g stroke="var(--text-primary)" strokeWidth="1.3">
            <polygon points="75,54 195,28 245,50 125,76" fill="var(--surface-card)" />
            <polygon points="75,54 125,76 125,104 75,82" />
            <polygon points="125,76 245,50 245,78 125,104" />
            <g fill="var(--blueprint)" stroke="none" fontFamily="monospace" fontSize="10">
              <text x="184" y="102">L</text>
              <text x="88" y="102">A</text>
              <text x="252" y="68">H</text>
            </g>
          </g>
        )}

        {shape === "columna" && (
          <g stroke="var(--text-primary)" strokeWidth="1.3">
            <ellipse cx="160" cy="34" rx="34" ry="12" fill="var(--surface-card)" />
            <path d="M126,34 L126,108 A34,12 0 0,0 194,108 L194,34" />
            <line x1="126" y1="20" x2="194" y2="20" stroke="var(--blueprint)" />
            <line x1="210" y1="34" x2="210" y2="108" stroke="var(--blueprint)" />
            <g fill="var(--blueprint)" stroke="none" fontFamily="monospace" fontSize="10">
              <text x="155" y="16">Ø</text>
              <text x="218" y="74">H</text>
            </g>
          </g>
        )}

        {shape === "tubo" && (
          <g stroke="var(--text-primary)" strokeWidth="1.3">
            <ellipse cx="160" cy="34" rx="44" ry="14" fill="var(--surface-card)" />
            <ellipse cx="160" cy="34" rx="22" ry="7" />
            <path d="M116,34 L116,108 A44,14 0 0,0 204,108 L204,34" />
            <line x1="138" y1="34" x2="138" y2="86" strokeDasharray="3 3" />
            <line x1="182" y1="34" x2="182" y2="86" strokeDasharray="3 3" />
            <g fill="var(--blueprint)" stroke="none" fontFamily="monospace" fontSize="10">
              <text x="100" y="24">Øe</text>
              <text x="154" y="22">Øi</text>
              <text x="216" y="74">H</text>
            </g>
          </g>
        )}

        {shape === "pared" && (
          <g stroke="var(--text-primary)" strokeWidth="1.3">
            <polygon points="86,34 218,22 234,28 102,40" fill="var(--surface-card)" />
            <polygon points="86,34 102,40 102,114 86,108" />
            <polygon points="102,40 234,28 234,102 102,114" />
            <g fill="var(--blueprint)" stroke="none" fontFamily="monospace" fontSize="10">
              <text x="86" y="26">A</text>
              <text x="168" y="122">L</text>
              <text x="242" y="70">H</text>
            </g>
          </g>
        )}

        {shape === "cimientos-corridos" && (
          <g stroke="var(--text-primary)" strokeWidth="1.3">
            <rect x="74" y="26" width="172" height="88" fill="var(--surface-card)" />
            <rect x="98" y="46" width="124" height="48" strokeDasharray="3 2" />
            <g fill="var(--blueprint)" stroke="none" fontFamily="monospace" fontSize="10">
              <text x="150" y="20">Le</text>
              <text x="52" y="74">Ae</text>
              <text x="150" y="60">Li / Ai</text>
              <text x="254" y="74">P</text>
            </g>
          </g>
        )}

        {shape === "escaleras" && (
          <g stroke="var(--text-primary)" strokeWidth="1.3">
            <path d="M68,112 L94,112 L226,34 L256,34 L256,22 L212,22 L212,44 L176,44 L176,66 L140,66 L140,88 L104,88 L104,102 L68,102 Z" />
            <g fill="var(--blueprint)" stroke="none" fontFamily="monospace" fontSize="10">
              <text x="152" y="59">t</text>
              <text x="180" y="60">r</text>
              <text x="190" y="92">g</text>
              <text x="262" y="34">A</text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
}
