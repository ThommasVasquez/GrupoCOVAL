import Image from "next/image";
import { getImageDimensions } from "@/lib/content/repository";
import { cn } from "@/lib/utils";

interface AdaptiveLogoProps {
  darkSrc: string;
  lightSrc: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

/**
 * Renderiza el logotipo oficial directamente sobre el fondo (sin marco ni recuadro),
 * alternando automáticamente entre su variante para Modo Oscuro y Modo Claro.
 */
export function AdaptiveLogo({
  darkSrc,
  lightSrc,
  alt,
  priority = false,
  className = "h-7 w-auto object-contain",
}: AdaptiveLogoProps) {
  const darkDims = getImageDimensions(darkSrc);
  const lightDims = getImageDimensions(lightSrc);

  return (
    <>
      <Image
        src={darkSrc}
        alt={alt}
        width={darkDims.width}
        height={darkDims.height}
        priority={priority}
        className={cn("logo-dark-only", className)}
      />
      <Image
        src={lightSrc}
        alt={alt}
        width={lightDims.width}
        height={lightDims.height}
        priority={priority}
        className={cn("logo-light-only", className)}
      />
    </>
  );
}
