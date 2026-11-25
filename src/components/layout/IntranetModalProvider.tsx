"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  ExternalLink,
  Lock,
  PhoneCall,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { AdaptiveLogo } from "@/components/ui/AdaptiveLogo";

interface IntranetModalContextValue {
  isOpen: boolean;
  openIntranetModal: () => void;
  closeIntranetModal: () => void;
}

const IntranetModalContext = createContext<IntranetModalContextValue | null>(
  null,
);

export function useIntranetModal(): IntranetModalContextValue {
  const ctx = useContext(IntranetModalContext);
  if (!ctx) {
    throw new Error(
      "useIntranetModal debe usarse dentro de IntranetModalProvider",
    );
  }
  return ctx;
}

interface IntranetModalProviderProps {
  intranetHref: string;
  isIntranetExternal: boolean;
  phoneDisplay: string;
  phoneE164: string;
  children: ReactNode;
}

/**
 * Proveedor global del modal de inicio de sesión para Intranet / PowerMail®.
 * Se abre desde la cabecera superior, menú móvil y pie de página sin salir de la página actual.
 */
export function IntranetModalProvider({
  intranetHref,
  isIntranetExternal,
  phoneDisplay,
  phoneE164,
  children,
}: IntranetModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const openIntranetModal = useCallback(() => {
    setSubmittedNotice(false);
    setIsOpen(true);
  }, []);

  const closeIntranetModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isIntranetExternal && intranetHref.startsWith("http")) {
      window.open(intranetHref, "_blank", "noopener,noreferrer");
      setIsOpen(false);
      return;
    }
    setSubmittedNotice(true);
  };

  return (
    <IntranetModalContext.Provider
      value={{ isOpen, openIntranetModal, closeIntranetModal }}
    >
      {children}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="intranet-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeIntranetModal();
            }
          }}
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-[var(--surface-page)] p-6 sm:p-7 shadow-2xl">
            <div className="relative flex flex-col items-center border-b border-[var(--border-subtle)] pb-5 pt-1 text-center">
              <button
                type="button"
                onClick={closeIntranetModal}
                aria-label="Cerrar ventana de inicio de sesión"
                className="absolute right-0 top-0 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
              <AdaptiveLogo
                darkSrc="/images/brand/Grupo-Coval-Logo.webp"
                lightSrc="/images/brand/Grupo-Coval-Logo-light.webp"
                alt="Grupo Coval"
                className="h-10 sm:h-11 w-auto object-contain"
              />
              <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.08em] text-[var(--brand-primary)] font-semibold">
                <Lock aria-hidden="true" className="h-3.5 w-3.5" />
                <span>intranet/PowerMail®</span>
              </p>
            </div>

            <h2
              id="intranet-modal-title"
              className="mt-5 text-xl font-bold tracking-tight text-[var(--text-primary)]"
            >
              Iniciar sesión corporativa
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              Acceso exclusivo para colaboradores operativos y administrativos de Coval Concretos, VT Ingequipos e Icopores Modulado.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="intranet-user"
                  className="block text-xs font-medium text-[var(--text-primary)]"
                >
                  Usuario o correo corporativo
                </label>
                <div className="relative mt-1.5">
                  <User
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
                  />
                  <input
                    id="intranet-user"
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="usuario@grupocoval.com.co"
                    className="h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="intranet-password"
                  className="block text-xs font-medium text-[var(--text-primary)]"
                >
                  Contraseña
                </label>
                <div className="relative mt-1.5">
                  <Lock
                    aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
                  />
                  <input
                    id="intranet-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-card)] pl-9 pr-10 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--brand-primary)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden="true" className="h-4 w-4" />
                    ) : (
                      <Eye aria-hidden="true" className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {submittedNotice && (
                <div
                  role="status"
                  className="rounded-xl border border-[var(--brand-primary)] bg-[var(--surface-card)] p-3.5 text-xs leading-relaxed text-[var(--text-primary)]"
                >
                  <p className="flex items-center gap-1.5 font-semibold">
                    <ShieldCheck aria-hidden="true" className="h-4 w-4 text-[var(--brand-primary)] shrink-0" />
                    <span>Pasarela intranet/PowerMail® en conexión</span>
                  </p>
                  <p className="mt-1 text-[var(--text-secondary)]">
                    El servidor de autenticación interno se habilitará en este acceso al activar el subdominio oficial de Intranet. Para asistencia de acceso comuníquese al {phoneDisplay}.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[var(--surface-button-dark)] px-5 text-sm font-semibold text-[var(--surface-button-dark-text)] hover:opacity-85 transition-opacity cursor-pointer"
              >
                <span>Ingresar a intranet/PowerMail®</span>
                {isIntranetExternal && (
                  <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                )}
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-secondary)]">
              <Link
                href="/acceso-empleados"
                onClick={closeIntranetModal}
                className="font-medium underline underline-offset-4 hover:text-[var(--text-primary)]"
              >
                Ver módulos de empleados
              </Link>
              <a
                href="https://www.energysoftmedia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[var(--text-primary)] hover:opacity-80 transition-opacity"
              >
                <span>SoporteEnergy! ⚡️</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </IntranetModalContext.Provider>
  );
}
