"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { ELASTIC, gsap, useGSAP } from "@/lib/gsap";
import { EASE } from "@/lib/gsap";
import { AndroidIcon, AppleIcon, BikeIcon, StarIcon } from "../icons";
import { MagneticLink, SplitHeading } from "../motion-primitives";
import { HomeScreen, PhoneFrame } from "../phone";

/**
 * Hero: word-mask headline, copy and CTAs rising in, and the phone mockup building itself piece by piece with GSAP
 * (header → search → chips pop → cards slide → cart bar springs up), then a slow float and a cursor tilt on desktop.
 */
export function Hero() {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const phone = root.querySelector<HTMLElement>("[data-phone]");
      if (!phone) return;
      if (reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(phone, { y: 80, rotate: 6, opacity: 0 }, { y: 0, rotate: 0, opacity: 1, duration: 1.2 }, 0.2)
        .fromTo("[data-hero-header]", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.7)
        .fromTo("[data-hero-search]", { y: 24, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.7 }, 0.9)
        .fromTo("[data-hero-chip]", { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: ELASTIC, stagger: 0.07 }, 1.0)
        .fromTo("[data-hero-card]", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 1.2)
        .fromTo("[data-hero-cart]", { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: ELASTIC }, 1.8)
        .fromTo("[data-hero-badge]", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: ELASTIC, stagger: 0.15 }, 1.6)
        .add(() => phone.classList.add("floating"));

      // desktop tilt towards the pointer, like the Payce hero cards
      const onMove = (e: MouseEvent) => {
        if (innerWidth < 992) return;
        const r = phone.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / innerHeight;
        gsap.to(phone, { rotateY: dx * 14, rotateX: -dy * 10, duration: 0.8, ease: "power3.out", transformPerspective: 1200 });
      };
      const onLeave = () => gsap.to(phone, { rotateY: 0, rotateX: 0, duration: 1, ease: "power3.out" });
      root.addEventListener("mousemove", onMove);
      root.addEventListener("mouseleave", onLeave);
      return () => {
        root.removeEventListener("mousemove", onMove);
        root.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope },
  );

  return (
    <section id="top" ref={scope} className="relative overflow-hidden pt-[104px] md:pt-[128px]">
      {/* warm glow + grain-free gradient blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-20%] right-[-10%] size-[60vw] max-w-[760px] rounded-full bg-[radial-gradient(closest-side,rgba(255,90,95,0.22),transparent)]" />
        <div className="absolute bottom-[-30%] left-[-15%] size-[55vw] max-w-[680px] rounded-full bg-[radial-gradient(closest-side,rgba(245,165,36,0.18),transparent)]" />
      </div>

      <div className="container-page grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="relative z-10 max-w-[640px]">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold text-coral-deep ring-1 ring-line"
          >
            <span className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-coral animate-ping-soft" />
              <span className="relative size-2 rounded-full bg-coral" />
            </span>
            Now delivering across Lagos
          </motion.p>

          <SplitHeading
            as="h1"
            className="mt-6 text-[44px] sm:text-[60px] lg:text-[72px]"
            lines={[{ text: "Your cravings," }, { text: "delivered.", accent: true }]}
            delay={0.25}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            className="mt-6 max-w-[520px] text-[17px] leading-[1.55] font-medium text-mute md:text-[19px]"
          >
            Lagos&apos; favourite kitchens in one app. Pick a restaurant, pay with Paystack or cash, and watch your rider on a live map until the food is at your door.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <MagneticLink href="#download" size="lg">
              <AndroidIcon className="size-5" /> Download for Android
            </MagneticLink>
            <MagneticLink href="#" variant="outline" size="lg" disabled>
              <AppleIcon className="size-5" /> iOS coming soon
            </MagneticLink>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.2 }}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-[14px] font-semibold text-mute"
          >
            <li className="flex items-center gap-2"><StarIcon className="size-4 text-sun" /> 8 kitchens at launch</li>
            <li className="flex items-center gap-2"><BikeIcon className="size-4 text-coral" /> Live rider tracking</li>
            <li className="flex items-center gap-2"><span className="grid size-4 place-items-center rounded-full bg-mint text-[9px] text-white">₦</span> Paystack or cash</li>
          </motion.ul>
        </div>

        <div className="relative mx-auto flex w-full max-w-[420px] items-center justify-center py-6 lg:py-10 [perspective:1400px]">
          <PhoneFrame className="[&.floating]:animate-float">
            <HomeScreen />
          </PhoneFrame>

          {/* floating proof badges */}
          <div data-hero-badge className="absolute top-[14%] -left-2 flex items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-20px_rgba(90,45,30,0.5)] ring-1 ring-line sm:-left-6">
            <span className="grid size-9 place-items-center rounded-xl bg-mint-soft text-mint"><BikeIcon className="size-5" /></span>
            <div className="leading-tight">
              <p className="text-[13px] font-extrabold">Rider on the way</p>
              <p className="text-[11px] font-semibold text-mute">12 min · 2.4 km</p>
            </div>
          </div>
          <div data-hero-badge className="absolute right-0 bottom-[18%] flex items-center gap-2 rounded-2xl bg-navy px-3.5 py-2.5 text-white shadow-[0_18px_40px_-20px_rgba(19,25,41,0.7)] sm:-right-6">
            <span className="grid size-9 place-items-center rounded-xl bg-coral text-[16px]">🔔</span>
            <div className="leading-tight">
              <p className="text-[13px] font-extrabold">Your food is being prepared</p>
              <p className="text-[11px] font-semibold text-white/70">Cravely · now</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
