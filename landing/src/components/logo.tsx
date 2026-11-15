import clsx from "clsx";

/** Coral app tile + "Cravely" wordmark. Colour comes from `currentColor` for the word. */
export function Logo({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5 font-extrabold tracking-[-0.03em]", className)}>
      {mark && (
        <span aria-hidden className="grid size-[1.5em] place-items-center rounded-[0.45em] bg-coral text-white shadow-[0_6px_14px_-6px_rgba(255,90,95,0.8)]">
          <svg viewBox="0 0 24 24" className="size-[0.95em]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 8.5a5.5 5.5 0 1 0 0 7" />
          </svg>
        </span>
      )}
      <span>Cravely</span>
    </span>
  );
}
