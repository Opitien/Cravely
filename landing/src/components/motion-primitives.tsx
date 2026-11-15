"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useSpring, type HTMLMotionProps } from "motion/react";
import clsx from "clsx";
import { EASE } from "@/lib/gsap";

/* ---------------------------------------------------------------- Reveal */

export function Reveal({ children, delay = 0, y = 28, className, ...rest }: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------- SplitHeading */

type Line = { text: string; muted?: boolean; accent?: boolean };

/** Section heading where every word rises out of its own mask (the Payce-style title reveal). */
export function SplitHeading({ lines, className, as: Tag = "h2", delay = 0 }: { lines: Line[]; className?: string; as?: "h1" | "h2"; delay?: number }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  let i = 0;

  return (
    <Tag ref={ref} className={clsx("display", className)}>
      {lines.map((line) => (
        <span key={line.text} className={clsx("block", line.muted && "text-faint", line.accent && "text-coral")}>
          {line.text.split(" ").map((word, w, words) => {
            const index = i++;
            return (
              <span key={w}>
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <motion.span
                    className="inline-block will-change-transform"
                    initial={{ y: "115%" }}
                    animate={inView ? { y: 0 } : undefined}
                    transition={{ duration: 0.95, ease: EASE, delay: delay + index * 0.045 }}
                  >
                    {word}
                  </motion.span>
                </span>
                {w < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

/* ---------------------------------------------------------------- CountUp */

const fmt = new Intl.NumberFormat("en-NG");

export function CountUp({ to, from = 0, duration = 1.8, delay = 0, prefix = "", className }: { to: number; from?: number; duration?: number; delay?: number; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  useEffect(() => {
    const node = ref.current;
    if (!inView || !node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const controls = animate(from, to, {
      duration,
      delay,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = prefix + fmt.format(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, from, to, duration, delay, prefix]);

  return (
    <span ref={ref} className={clsx("tabular-nums", className)}>
      {prefix}
      {fmt.format(to)}
    </span>
  );
}

/* ---------------------------------------------------------------- Buttons */

const variants = {
  primary: "bg-coral text-white shadow-[0_12px_30px_-12px_rgba(255,90,95,0.7)]",
  dark: "bg-navy text-white",
  soft: "bg-coral-soft text-coral-deep",
  outline: "bg-white text-ink ring-1 ring-inset ring-line-strong",
};

const sizes = {
  sm: "h-[44px] px-5 text-[14px] rounded-[14px]",
  md: "h-[52px] px-6 text-[15px] rounded-[16px]",
  lg: "h-[56px] px-7 text-[16px] rounded-[18px]",
};

/** Anchor styled as a button that leans toward the cursor and swaps its label on hover. */
export function MagneticLink({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  disabled?: boolean;
  external?: boolean;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 });

  return (
    <motion.a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      {...(external && !disabled ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || disabled) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * 0.22);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={clsx(
        "focus-ring group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden font-bold tracking-[-0.01em] select-none",
        variants[variant],
        sizes[size],
        disabled && "cursor-not-allowed opacity-60",
        className,
      )}
    >
      {variant === "primary" && !disabled && (
        <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:animate-shimmer group-hover:opacity-100" />
      )}
      <span className="relative block overflow-hidden">
        <span className={clsx("flex items-center gap-2 transition-transform duration-500 ease-expo", !disabled && "group-hover:-translate-y-full")}>{children}</span>
        {!disabled && (
          <span aria-hidden className="absolute inset-0 flex translate-y-full items-center gap-2 transition-transform duration-500 ease-expo group-hover:translate-y-0">
            {children}
          </span>
        )}
      </span>
    </motion.a>
  );
}
