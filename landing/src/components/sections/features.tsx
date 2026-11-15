"use client";

import { motion } from "motion/react";
import clsx from "clsx";
import { EASE } from "@/lib/gsap";
import { BellIcon, CardIcon, HeartIcon, MoonIcon, PinIcon, RepeatIcon } from "../icons";
import { Reveal, SplitHeading } from "../motion-primitives";

const FEATURES = [
  { Icon: PinIcon, title: "Live order tracking", body: "Restaurant, rider and your door on one map, with distance and a bike ETA.", tone: "bg-coral-soft text-coral", wide: true },
  { Icon: BellIcon, title: "Notification-bar updates", body: "Confirmed, preparing, on the way, delivered. Each step lands in your phone's notification bar, even with the app closed.", tone: "bg-navy text-white", dark: true, wide: true },
  { Icon: CardIcon, title: "Paystack secure payments", body: "Cards, bank transfer and USSD. Every payment is verified server-side before the kitchen starts.", tone: "bg-mint-soft text-mint" },
  { Icon: HeartIcon, title: "Saved favourites", body: "Heart the kitchens you love and find them in a tap.", tone: "bg-peach text-coral-deep" },
  { Icon: RepeatIcon, title: "Reorder in one tap", body: "Last Friday's order, today's prices, straight into your cart.", tone: "bg-sky-soft text-sky" },
  { Icon: MoonIcon, title: "Dark mode", body: "Follows your phone. Easy on the eyes for late-night cravings.", tone: "bg-peach-2 text-ink" },
];

export function Features() {
  return (
    <section id="features" className="container-page scroll-mt-24 pt-24 md:pt-36">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-[640px]">
          <Reveal>
            <p className="text-[13px] font-extrabold tracking-[0.12em] text-coral uppercase">Features</p>
          </Reveal>
          <SplitHeading className="mt-3 text-[34px] sm:text-[44px] lg:text-[56px]" lines={[{ text: "Built for the way" }, { text: "Lagos eats.", accent: true }]} />
        </div>
        <Reveal delay={0.2} className="max-w-[380px] text-[16px] leading-[1.55] font-medium text-mute">
          Everything from the first tap to the last bite was designed around one question: where is my food, and when does it get here?
        </Reveal>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
        {FEATURES.map((f, i) => (
          <motion.li
            key={f.title}
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.9, ease: EASE, delay: (i % 4) * 0.08 }}
            whileHover={{ y: -6 }}
            className={clsx(
              "group relative overflow-hidden rounded-[26px] p-6 md:p-7",
              f.dark ? "bg-navy text-white" : "bg-white ring-1 ring-line",
              f.wide && "lg:col-span-2",
            )}
          >
            <span aria-hidden className={clsx("pointer-events-none absolute -top-16 -right-16 size-48 rounded-full opacity-0 blur-2xl transition duration-700 ease-expo group-hover:opacity-100", f.dark ? "bg-coral/40" : "bg-coral-soft")} />
            <span className={clsx("relative grid size-12 place-items-center rounded-2xl transition-transform duration-700 ease-expo group-hover:-rotate-6 group-hover:scale-110", f.dark ? "bg-coral text-white" : f.tone)}>
              <f.Icon className="size-6" />
            </span>
            <h3 className="relative mt-5 text-[20px] leading-[1.2] font-extrabold tracking-[-0.02em]">{f.title}</h3>
            <p className={clsx("relative mt-2 text-[15px] leading-[1.5] font-medium", f.dark ? "text-white/70" : "text-mute")}>{f.body}</p>
            {f.dark && (
              <motion.div
                initial={{ x: 40, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 220, damping: 20, delay: 0.5 }}
                className="relative mt-6 flex items-start gap-2.5 rounded-2xl bg-white/10 p-3 ring-1 ring-white/10"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-coral text-[12px]">🍽️</span>
                <div className="min-w-0 leading-tight">
                  <div className="flex items-center justify-between gap-2"><p className="text-[12px] font-extrabold">Cravely</p><p className="text-[10px] text-white/50">now</p></div>
                  <p className="truncate text-[12px] text-white/90">Your rider is on the way 🛵</p>
                </div>
              </motion.div>
            )}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
