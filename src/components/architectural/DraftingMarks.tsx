import Image from "next/image";
import { getImageDimensions } from "@/lib/content/repository";
import { cn } from "@/lib/utils";

/**
 * Marcas vectoriales discretas de esquina (estilo lámina de dibujo arquitectónico).
 */
export function DraftingCornerTicks() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 820"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    >
      <g stroke="var(--text-tertiary)" strokeWidth="0.75" fill="none" opacity="0.38">
        <path d="M 28 52 L 28 24 L 56 24" />
        <path d="M 1412 52 L 1412 24 L 1384 24" />
        <path d="M 28 768 L 28 796 L 56 796" />
        <path d="M 1412 768 L 1412 796 L 1384 796" />
      </g>
    </svg>
  );
}

interface SheetSectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  headingId?: string;
  className?: string;
}

export function SheetSectionHeader({
  eyebrow,
  title,
  subtitle,
  headingId,
  className,
}: SheetSectionHeaderProps) {
  return (
    <div className={cn("pb-5 mb-6", className)}>
      {eyebrow && (
        <p
          data-arch="heading"
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)]"
        >
          {eyebrow}
        </p>
      )}

      <div
        data-arch="heading"
        className="mt-2.5 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end"
      >
        <h2
          id={headingId}
          className="lg:col-span-7 text-3xl sm:text-4xl xl:text-5xl font-bold tracking-[-0.03em] text-[var(--text-primary)] leading-[1.04]"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="lg:col-span-5 font-serif text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
            {subtitle}
          </p>
        )}
      </div>

      <div
        data-arch="rule"
        className="mt-5 h-px w-full bg-[var(--border-subtle)]"
      />
    </div>
  );
}

interface PhotoPlateProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
  aspectClass?: string;
  imageClassName?: string;
  className?: string;
}

export function PhotoPlate({
  src,
  alt,
  caption,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  aspectClass = "aspect-[4/3]",
  imageClassName,
  className,
}: PhotoPlateProps) {
  const dims = getImageDimensions(src);

  return (
    <figure className={cn("group w-full", className)}>
      <div
        data-arch="photo"
        className={cn("w-full overflow-hidden bg-[var(--surface-muted)]", aspectClass)}
      >
        <Image
          src={src}
          alt={alt}
          width={dims.width}
          height={dims.height}
          priority={priority}
          sizes={sizes}
          className={cn(
            "sketch-photo-editorial h-full w-full object-cover",
            imageClassName,
          )}
        />
      </div>

      {caption && (
        <figcaption className="mt-2.5 font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

interface SketchPlateProps {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * Placa de boceto técnico wireframe (.sketch-adaptive):
 * Se funde sobre el fondo obsidiana en modo oscuro y sobre papel cálido en modo claro.
 */
export function SketchPlate({
  src,
  alt,
  caption,
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 50vw",
  className,
}: SketchPlateProps) {
  const dims = getImageDimensions(src);

  return (
    <figure className={cn("w-full", className)}>
      <div data-arch="photo" className="w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          width={dims.width}
          height={dims.height}
          priority={priority}
          sizes={sizes}
          className="sketch-adaptive h-auto w-full object-contain [mask-image:radial-gradient(ellipse_92%_90%_at_50%_50%,black_72%,transparent_100%)]"
        />
      </div>
      {caption && (
        <figcaption className="mt-2 font-mono text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
