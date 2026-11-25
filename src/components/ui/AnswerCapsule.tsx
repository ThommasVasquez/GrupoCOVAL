import { cn } from "@/lib/utils";

interface AnswerCapsuleProps {
  question: string;
  answer: string;
  className?: string;
}

/**
 * Síntesis editorial directa (GEO): integrada al flujo tipográfico sin ruido visual.
 */
export function AnswerCapsule({
  question,
  answer,
  className,
}: AnswerCapsuleProps) {
  return (
    <aside
      aria-label={question}
      className={cn(
        "border-l border-[var(--border-strong)] pl-5 sm:pl-6",
        className,
      )}
    >
      <p className="text-xs font-medium tracking-wide text-[var(--text-secondary)]">
        {question}
      </p>
      <p className="mt-2.5 font-serif text-lg sm:text-xl leading-relaxed text-[var(--text-primary)] max-w-[66ch]">
        {answer}
      </p>
    </aside>
  );
}
