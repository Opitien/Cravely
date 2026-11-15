"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import clsx from "clsx";
import { EASE } from "@/lib/gsap";
import { navLinks } from "@/lib/site";
import { Logo } from "./logo";
import { MagneticLink } from "./motion-primitives";

/** Fixed header: transparent over the hero, frosted once scrolled, slides away on scroll-down and back on scroll-up. */
export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > 320 && y > prev);
  });

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: hidden ? "-110%" : 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={clsx(
          "absolute inset-0 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled ? "border-ink/5 bg-cream/80 backdrop-blur-xl backdrop-saturate-150" : "border-transparent bg-transparent",
        )}
      />
      <div className="container-page relative flex h-[72px] items-center justify-between md:h-[84px]">
        <a href="#top" className="focus-ring rounded-md text-ink" aria-label="Cravely home">
          <Logo className="text-[22px] md:text-[24px]" />
        </a>

        <nav aria-label="Primary" className="absolute left-1/2 hidden -translate-x-1/2 lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="focus-ring group relative block rounded-full px-4 py-2 text-[14px] font-semibold text-mute transition-colors duration-300 hover:text-ink">
                  <span className="absolute inset-0 scale-90 rounded-full bg-peach opacity-0 transition duration-300 ease-expo group-hover:scale-100 group-hover:opacity-100" />
                  <span className="relative">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <MagneticLink href="#download" size="sm">
          <span className="md:hidden">Get the app</span>
          <span className="hidden md:inline">Get the app</span>
        </MagneticLink>
      </div>
    </motion.header>
  );
}
