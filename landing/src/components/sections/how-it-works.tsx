"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import clsx from "clsx";
import { ELASTIC, gsap, useGSAP } from "@/lib/gsap";
import { BikeIcon, CardIcon, CheckIcon, PinIcon, SearchIcon, StarIcon } from "../icons";
import { Reveal, SplitHeading } from "../motion-primitives";

const inView = { once: true, margin: "0px 0px -18% 0px" } as const;

/* ---------------------------------------------------------------- Visuals */

function PickVisual() {
  return (
    <div className="w-[240px] rounded-[18px] bg-white p-3.5 font-ui shadow-[0_20px_40px_-24px_rgba(90,45,30,0.5)]">
      <div className="flex h-9 items-center gap-2 rounded-xl bg-peach px-3 text-[12px] text-faint">
        <SearchIcon className="size-3.5" /> jollof…
      </div>
      {["Chicken Republic", "The Place", "Mega Chicken"].map((n, i) => (
        <motion.div
          key={n}
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={inView}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
          className={clsx("mt-2.5 flex items-center gap-2.5 rounded-xl p-2", i === 0 && "bg-coral-soft ring-1 ring-coral/40")}
        >
          <span className="grid size-9 place-items-center rounded-lg bg-[linear-gradient(135deg,#FF8A8E,#FF5A5F)] text-[16px]">{["🍗", "🍛", "🥘"][i]}</span>
          <div className="flex-1 leading-tight">
            <p className="text-[12px] font-extrabold">{n}</p>
            <p className="text-[10px] font-semibold text-mute">{["25-35 min · Free", "30-40 min · ₦1,500", "20-30 min · ₦1,000"][i]}</p>
          </div>
          <span className="flex items-center gap-0.5 text-[11px] font-bold"><StarIcon className="size-3 text-sun" /> {["4.6", "4.5", "4.8"][i]}</span>
        </motion.div>
      ))}
    </div>
  );
}

function PayVisual() {
  return (
    <div className="w-[240px] rounded-[18px] bg-white p-3.5 font-ui shadow-[0_20px_40px_-24px_rgba(90,45,30,0.5)]">
      <p className="text-[11px] font-extrabold tracking-[0.06em] text-faint uppercase">Payment</p>
      {[
        { t: "Pay online", s: "Card, transfer or USSD · Paystack", on: true, Icon: CardIcon },
        { t: "Cash on delivery", s: "Pay your rider at the door", on: false, Icon: null },
      ].map((m) => (
        <div key={m.t} className={clsx("mt-2.5 flex items-center gap-2.5 rounded-xl border p-2.5", m.on ? "border-coral bg-coral-soft" : "border-line")}>
          <span className={clsx("grid size-8 place-items-center rounded-full", m.on ? "bg-coral text-white" : "bg-coral-soft text-coral")}>
            {m.Icon ? <m.Icon className="size-4" /> : <span className="text-[13px] font-extrabold">₦</span>}
          </span>
          <div className="flex-1 leading-tight">
            <p className="text-[12px] font-extrabold">{m.t}</p>
            <p className="text-[10px] font-semibold text-mute">{m.s}</p>
          </div>
          <span className={clsx("size-4 rounded-full", m.on ? "bg-coral ring-4 ring-coral-soft" : "ring-1 ring-line-strong")} />
        </div>
      ))}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={inView}
        transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.5 }}
        className="relative mt-3 flex h-10 items-center justify-between overflow-hidden rounded-xl bg-coral px-3.5 text-[12px] font-extrabold text-white"
      >
        <span aria-hidden className="absolute inset-y-0 left-0 w-1/3 -skew-x-12 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <span>🔒 Pay now</span>
        <span>₦6,700</span>
      </motion.div>
    </div>
  );
}

function TrackVisual() {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const rider = scope.current?.querySelector("[data-rider]");
      if (!rider || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.to(rider, {
        motionPath: undefined,
        keyframes: [
          { x: 0, y: 0 },
          { x: 46, y: -18 },
          { x: 96, y: -22 },
          { x: 150, y: -58 },
        ],
        duration: 4,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        scrollTrigger: { trigger: scope.current, start: "top 85%", toggleActions: "play pause resume pause" },
      });
    },
    { scope },
  );
  return (
    <div ref={scope} className="w-[240px] overflow-hidden rounded-[18px] bg-white p-2 font-ui shadow-[0_20px_40px_-24px_rgba(90,45,30,0.5)]">
      <div className="relative h-[150px] overflow-hidden rounded-[14px] bg-[#EEF3F7]">
        <svg aria-hidden viewBox="0 0 224 150" className="absolute inset-0 h-full w-full">
          <g stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M-10 40 C50 30 80 70 130 60 S200 20 240 45" /><path d="M-10 110 C40 120 90 95 140 110 S200 140 240 120" /><path d="M60 -10 C50 50 80 90 70 170" /><path d="M160 -10 C170 60 140 100 170 170" />
          </g>
          <path d="M34 112 C70 96 120 100 184 54" fill="none" stroke="#FF5A5F" strokeWidth="3" strokeDasharray="1 7" strokeLinecap="round" />
        </svg>
        <span className="absolute top-[112px] left-[34px] grid size-7 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-coral text-white ring-2 ring-white">🍳</span>
        <span className="absolute top-[54px] left-[184px] grid size-7 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-sky text-white ring-2 ring-white"><PinIcon className="size-3.5" /></span>
        <span data-rider className="absolute top-[98px] left-[20px] grid size-8 place-items-center rounded-full bg-mint text-white ring-2 ring-white shadow-lg"><BikeIcon className="size-4" /></span>
      </div>
      <div className="flex items-center gap-2.5 p-2.5">
        <span className="grid size-8 place-items-center rounded-full bg-sky-soft text-sky"><BikeIcon className="size-4" /></span>
        <div className="leading-tight">
          <p className="text-[12px] font-extrabold">2.4 km from Chicken Republic</p>
          <p className="text-[10px] font-semibold text-mute">About 12 min by bike</p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Section */

const STEPS = [
  { n: "01", title: "Pick a restaurant", body: "Browse Lagos' favourite kitchens by category, search a dish, save the spots you love.", Visual: PickVisual, tone: "bg-coral-soft" },
  { n: "02", title: "Pay your way", body: "Paystack for cards, transfers and USSD, or cash when the rider arrives. Prices are confirmed server-side so what you see is what you pay.", Visual: PayVisual, tone: "bg-peach" },
  { n: "03", title: "Track the rider live", body: "Watch your order move from kitchen to door on a live map, with the distance and a rider ETA.", Visual: TrackVisual, tone: "bg-sky-soft" },
];

export function HowItWorks() {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 60, opacity: 0, rotate: i % 2 ? 1.5 : -1.5 },
          { y: 0, opacity: 1, rotate: 0, duration: 1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 85%", once: true } },
        );
        const num = el.querySelector("[data-num]");
        if (num) gsap.fromTo(num, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: ELASTIC, scrollTrigger: { trigger: el, start: "top 80%", once: true } });
      });
    },
    { scope },
  );

  return (
    <section id="how" ref={scope} className="container-page scroll-mt-24 pt-24 md:pt-36">
      <div className="max-w-[720px]">
        <Reveal>
          <p className="text-[13px] font-extrabold tracking-[0.12em] text-coral uppercase">How it works</p>
        </Reveal>
        <SplitHeading className="mt-3 text-[34px] sm:text-[44px] lg:text-[56px]" lines={[{ text: "Three taps between" }, { text: "you and dinner.", muted: true }]} />
      </div>

      <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
        {STEPS.map((s) => (
          <article key={s.n} data-step className={clsx("group relative overflow-hidden rounded-[28px] p-6 pb-0 md:p-7 md:pb-0", s.tone)}>
            <span data-num className="inline-grid size-11 place-items-center rounded-2xl bg-white text-[14px] font-extrabold text-ink shadow-[0_10px_24px_-14px_rgba(90,45,30,0.5)]">
              {s.n}
            </span>
            <h3 className="mt-5 text-[22px] leading-[1.15] font-extrabold tracking-[-0.02em] md:text-[24px]">{s.title}</h3>
            <p className="mt-2.5 text-[15px] leading-[1.5] font-medium text-mute">{s.body}</p>
            <div className="relative mt-7 flex justify-center">
              <div className="translate-y-3 transition-transform duration-700 ease-expo group-hover:translate-y-0">
                <s.Visual />
              </div>
            </div>
          </article>
        ))}
      </div>

      <Reveal className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[14px] font-semibold text-mute" delay={0.1}>
        <span className="flex items-center gap-2"><CheckIcon className="size-4 text-mint" /> Prices recomputed on the server</span>
        <span className="flex items-center gap-2"><CheckIcon className="size-4 text-mint" /> Payments verified with Paystack before the kitchen starts</span>
        <span className="flex items-center gap-2"><CheckIcon className="size-4 text-mint" /> Cancel free until the kitchen begins</span>
      </Reveal>
    </section>
  );
}
