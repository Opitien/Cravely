"use client";

import clsx from "clsx";
import { BikeIcon, CheckIcon, FlameIcon, HeartIcon, PinIcon, ReceiptIcon, SearchIcon, StarIcon } from "./icons";

/* ------------------------------------------------------------- PhoneFrame */

export function PhoneFrame({ children, className, tilt }: { children: React.ReactNode; className?: string; tilt?: boolean }) {
  return (
    <div className={clsx("phone-frame", tilt && "tilt", className)} data-phone>
      <span aria-hidden className="absolute top-[18px] left-1/2 z-10 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-navy" />
      <div className="phone-screen">{children}</div>
    </div>
  );
}

/* ------------------------------------------------- Home screen (hero mock) */

const CATEGORIES = [
  { label: "All", emoji: "🍽️", on: true },
  { label: "Burgers", emoji: "🍔" },
  { label: "Pizza", emoji: "🍕" },
  { label: "Chicken", emoji: "🍗" },
  { label: "African", emoji: "🥘" },
];

const CARDS = [
  { name: "Chicken Republic", cuisine: "Chicken • Fast Food", rating: "4.6", time: "25-35 min", fee: "Free delivery", from: "#FF8A8E", to: "#FF5A5F", emoji: "🍗" },
  { name: "Mega Chicken", cuisine: "African • Chicken", rating: "4.8", time: "20-30 min", fee: "₦1,000 delivery", from: "#FFD1A6", to: "#F5A524", emoji: "🥘" },
  { name: "Domino's Pizza", cuisine: "Pizza • Fast Food", rating: "4.4", time: "30-45 min", fee: "Free delivery", from: "#B9E6FF", to: "#2563EB", emoji: "🍕" },
];

/** A faithful miniature of the app's Home tab. Elements carry data-hero-* hooks for the GSAP intro. */
export function HomeScreen() {
  return (
    <div className="flex h-full flex-col font-ui text-ink">
      <div className="px-4 pt-14" data-hero-header>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-coral-soft text-coral">
              <PinIcon className="size-4" />
            </span>
            <div className="leading-tight">
              <p className="text-[9px] font-bold tracking-[0.08em] text-faint uppercase">Deliver to</p>
              <p className="text-[12px] font-bold">12 Admiralty Way, Lekki ▾</p>
            </div>
          </div>
          <span className="size-9 rounded-full bg-[linear-gradient(135deg,#FF5A5F,#FFB199)] ring-2 ring-white" />
        </div>
        <p className="mt-4 text-[22px] leading-[1.1] font-extrabold tracking-[-0.03em]">
          Good evening, Ada!
          <br />
          <span className="text-coral">What are you craving?</span>
        </p>
      </div>

      <div className="mx-4 mt-4 flex h-11 items-center gap-2 rounded-2xl bg-white px-3.5 shadow-[0_6px_18px_-10px_rgba(90,45,30,0.35)]" data-hero-search>
        <SearchIcon className="size-4 text-faint" />
        <span className="text-[12px] text-faint">Search restaurants or dishes</span>
      </div>

      <div className="mt-4 flex gap-3 overflow-hidden px-4" data-hero-chips>
        {CATEGORIES.map((c) => (
          <div key={c.label} className="flex w-[52px] shrink-0 flex-col items-center gap-1" data-hero-chip>
            <span className={clsx("grid size-[46px] place-items-center rounded-full bg-white text-[20px] shadow-[0_6px_14px_-10px_rgba(90,45,30,0.4)] ring-2", c.on ? "bg-coral-soft ring-coral" : "ring-transparent")}>{c.emoji}</span>
            <span className={clsx("text-[10px] font-bold", c.on ? "text-coral" : "text-mute")}>{c.label}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between px-4">
        <p className="text-[14px] font-extrabold tracking-[-0.02em]">Popular near you</p>
        <span className="text-[11px] font-bold text-coral">See all</span>
      </div>

      <div className="mt-2 flex flex-col gap-3 px-4 pb-6">
        {CARDS.map((r) => (
          <div key={r.name} className="rounded-[18px]" data-hero-card>
            <div className="relative h-[108px] overflow-hidden rounded-[18px]" style={{ background: `linear-gradient(135deg, ${r.from}, ${r.to})` }}>
              <span aria-hidden className="absolute right-3 bottom-2 text-[56px] leading-none drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)]">{r.emoji}</span>
              <span className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full bg-black/25 text-white">
                <HeartIcon className="size-3.5" />
              </span>
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-white px-2 py-1 text-[10px] font-bold">⏱ {r.time}</span>
            </div>
            <div className="px-0.5 pt-2">
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-extrabold">{r.name}</p>
                <span className="flex items-center gap-0.5 text-[11px] font-bold">
                  <StarIcon className="size-3 text-sun" /> {r.rating}
                </span>
              </div>
              <p className="text-[11px] font-medium text-mute">
                {r.cuisine} · <span className={clsx("font-bold", r.fee.startsWith("Free") && "text-mint")}>{r.fee}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* floating cart bar */}
      <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-[18px] bg-coral px-3.5 py-3 text-white shadow-[0_14px_30px_-12px_rgba(255,90,95,0.8)]" data-hero-cart>
        <span className="relative grid size-9 place-items-center rounded-full bg-white/20">
          🛍️
          <span className="absolute -top-1 -right-1 grid size-5 place-items-center rounded-full bg-white text-[10px] font-extrabold text-coral">2</span>
        </span>
        <div className="flex-1 leading-tight">
          <p className="text-[13px] font-extrabold">View cart</p>
          <p className="text-[10px] text-white/85">Chicken Republic</p>
        </div>
        <p className="text-[13px] font-extrabold">₦5,700</p>
      </div>
    </div>
  );
}

/* --------------------------------------------- Tracking screen (showcase) */

export const STEPS = [
  { key: "placed", label: "Order confirmed", sub: "The kitchen has it", Icon: ReceiptIcon, toast: "Order CRV-8F2A1C confirmed. The kitchen has it! 🧾" },
  { key: "preparing", label: "Preparing your food", sub: "Smoky jollof on the way", Icon: FlameIcon, toast: "Your food is being prepared 🔥" },
  { key: "on_the_way", label: "Rider on the way", sub: "About 12 min by bike", Icon: BikeIcon, toast: "Your rider is on the way 🛵" },
  { key: "delivered", label: "Delivered", sub: "Enjoy your meal!", Icon: CheckIcon, toast: "Delivered. Enjoy your meal! 🎉" },
] as const;

/** The order-tracking screen. `step` (0–3) is driven by the scroll-pinned section. */
export function TrackingScreen({ step }: { step: number }) {
  const current = STEPS[Math.min(step, STEPS.length - 1)];
  const pct = [8, 36, 72, 100][Math.min(step, 3)];
  return (
    <div className="flex h-full flex-col font-ui text-ink">
      <div className="px-4 pt-14">
        <p className="text-center text-[13px] font-bold">Order details</p>
      </div>

      {/* map */}
      <div className="relative mx-4 mt-3 h-[150px] overflow-hidden rounded-[18px] bg-[#EEF3F7]">
        <svg aria-hidden viewBox="0 0 268 150" className="absolute inset-0 h-full w-full">
          <g stroke="#fff" strokeWidth="6" strokeLinecap="round" fill="none">
            <path d="M-10 40 C60 30 90 70 150 60 S240 20 290 45" /><path d="M-10 110 C50 120 100 95 160 110 S230 140 290 120" /><path d="M70 -10 C60 50 90 90 80 170" /><path d="M190 -10 C200 60 170 100 200 170" />
          </g>
          <g fill="#DCE8D8"><rect x="20" y="60" width="38" height="28" rx="6" /><rect x="210" y="70" width="44" height="30" rx="8" /></g>
          <path d="M60 112 C100 95 150 95 206 44" fill="none" stroke="#FF5A5F" strokeWidth="3" strokeDasharray="1 7" strokeLinecap="round" />
        </svg>
        <span className="absolute left-[46px] top-[96px] grid size-7 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-coral text-white ring-2 ring-white">
          <FlameIcon className="size-3.5" />
        </span>
        <span className="absolute left-[206px] top-[44px] grid size-7 -translate-x-1/2 -translate-y-full place-items-center rounded-full bg-sky text-white ring-2 ring-white">
          <PinIcon className="size-3.5" />
        </span>
        <span
          className="absolute top-[-14px] grid size-8 place-items-center rounded-full bg-mint text-white ring-2 ring-white transition-[left,top] duration-700 ease-expo"
          style={{ left: `${46 + (206 - 46) * (pct / 100)}px`, top: `${112 - 68 * (pct / 100) - 14}px`, opacity: step >= 2 ? 1 : 0 }}
        >
          <BikeIcon className="size-4" />
        </span>
      </div>

      {/* timeline */}
      <div className="mx-4 mt-3 rounded-[18px] bg-white p-3.5 shadow-[0_8px_20px_-14px_rgba(90,45,30,0.4)]">
        {STEPS.map((s, i) => {
          const done = i <= step;
          const cur = i === step;
          return (
            <div key={s.key} className="flex gap-3">
              <div className="flex w-7 flex-col items-center">
                <span className={clsx("relative grid size-7 place-items-center rounded-full transition-colors duration-500", done ? "bg-mint text-white" : "bg-peach text-line-strong", cur && step < 3 && "bg-coral ring-4 ring-coral-soft")}>
                  {cur && step < 3 && <span aria-hidden className="absolute inset-0 rounded-full bg-coral/60 animate-ping-soft" />}
                  <s.Icon className={clsx("relative", done ? "size-3.5" : "size-2")} />
                </span>
                {i < STEPS.length - 1 && <span className={clsx("my-0.5 w-0.5 flex-1 rounded transition-colors duration-500", i < step ? "bg-mint" : "bg-line")} style={{ minHeight: 14 }} />}
              </div>
              <div className={clsx("pb-3 leading-tight", i === STEPS.length - 1 && "pb-0")}>
                <p className={clsx("text-[12px]", done ? "font-extrabold" : "font-semibold text-faint")}>{s.label}</p>
                {cur && <p className="text-[10px] font-bold text-coral">{step === 3 ? s.sub : "In progress"}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* toast from the notification bar */}
      <div className="absolute inset-x-3 top-11" data-toast key={current.key}>
        <div className="flex items-start gap-2.5 rounded-[16px] bg-navy/95 px-3 py-2.5 text-white shadow-[0_18px_40px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
          <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-[7px] bg-coral text-[11px]">🍽️</span>
          <div className="min-w-0 leading-tight">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-extrabold">Cravely</p>
              <p className="text-[9px] text-white/60">now</p>
            </div>
            <p className="truncate text-[11px] text-white/90">{current.toast}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
