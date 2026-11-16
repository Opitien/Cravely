import clsx from "clsx";

/** Coral app tile + "Cravely" wordmark. Colour comes from `currentColor` for the word. */
export function Logo({ className, mark = true }: { className?: string; mark?: boolean }) {
  return (
    <span className={clsx("inline-flex items-center gap-2.5 font-extrabold tracking-[-0.03em]", className)}>
      {mark && (
        // The real app icon (same file as the Android/iOS icon), not a stand-in glyph.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/icon.png"
          alt=""
          aria-hidden
          width={48}
          height={48}
          className="size-[1.5em] rounded-[0.45em] object-cover shadow-[0_6px_14px_-6px_rgba(19,25,41,0.6)]"
        />
      )}
      <span>Cravely</span>
    </span>
  );
}
