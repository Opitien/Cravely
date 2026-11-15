"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

let current: Lenis | null = null;
/** The page's Lenis instance (null with reduced motion). */
export const getLenis = () => current;

/** Lenis drives scrolling and GSAP's ticker drives Lenis, so ScrollTrigger scrubs stay locked to the smoothed scroll. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -80 },
    });
    lenis.on("scroll", ScrollTrigger.update);
    current = lenis;

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      current = null;
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
