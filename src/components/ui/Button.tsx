import Link from "next/link";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "inverse" | "whatsapp";
type ButtonSize = "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand-primary)] text-[var(--brand-on-primary)] hover:bg-[var(--brand-primary-hover)] border border-[var(--brand-primary)]",
  secondary:
    "bg-[var(--surface-button-dark)] text-[var(--surface-button-dark-text)] hover:opacity-90 border border-[var(--surface-button-dark)]",
  outline:
    "bg-transparent text-[var(--text-primary)] border border-[var(--border-ink)] hover:bg-[var(--surface-button-dark)] hover:text-[var(--surface-button-dark-text)]",
  inverse:
    "bg-[var(--surface-card)] text-[var(--text-primary)] border border-[var(--border-ink)] hover:bg-[var(--surface-muted)]",
  whatsapp:
    "bg-[var(--brand-primary)] text-[var(--brand-on-primary)] hover:bg-[var(--brand-primary-hover)] border border-[var(--brand-primary)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 py-2.5 text-sm font-semibold tracking-tight",
  lg: "min-h-[52px] px-6 py-3 text-sm sm:text-base font-semibold tracking-tight",
};

const baseStyles =
  "inline-flex items-center justify-center gap-2.5 rounded-[2px] transition-colors duration-150 cursor-pointer select-none disabled:opacity-55 disabled:pointer-events-none";

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

type ActionButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type LinkButtonProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
    external?: boolean;
  };

export type ButtonProps = ActionButtonProps | LinkButtonProps;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
    ...rest
  } = props;

  const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if ("href" in props && typeof props.href === "string") {
    const { href, external, ...anchorRest } = rest as Omit<
      LinkButtonProps,
      keyof CommonProps
    >;
    const isExternal =
      external ?? (href.startsWith("http://") || href.startsWith("https://"));

    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...anchorRest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorRest}>
        {children}
      </Link>
    );
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={buttonRest.type ?? "button"}
      className={classes}
      {...buttonRest}
    >
      {children}
    </button>
  );
}
