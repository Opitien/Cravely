"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CheckIcon } from "../icons";
import { Reveal, SplitHeading } from "../motion-primitives";
import { PhoneFrame, STEPS, TrackingScreen } from "../phone";

const COPY = [
  "The moment Paystack confirms your payment (or you choose cash), the kitchen gets the order and your phone gets a notification.",
  "The restaurant marks your food as preparing. The timeline updates live through Supabase Realtime while the app is open, and the notification bar when it isn't.",
  "Your rider leaves. The map shows the kitchen, your pin and the route between them, with the distance and a bike ETA.",
  "Delivered. Rate the meal, reorder it next week in a tap, or save the kitchen to your favourites.",
];

/** How much scrolling each step takes while the section is held in place (in viewport heights). */
const STEP_SCROLL_VH = 0.75;

/**
 * Held showcase: once the section reaches the top of the viewport it stops (GSAP pin) and the user's scrolling only
 * advances the order — Placed → Preparing → On the way → Delivered — swapping the copy in place and sliding a
 * notification toast into the phone on every step. After the fourth step the page is released and scrolls on.
 * Reduced motion (or no JS): the four steps are simply listed.
 */
export function Tracking() {
  const scope = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(true); // false → static fallback layout
  const lastStep = useRef(0);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setHeld(false);
        setStep(STEPS.length - 1);
        return;
      }
      const panel = root.querySelector<HTMLElement>("[data-panel]");
      if (!panel) return;

      const st = ScrollTrigger.create({
        trigger: panel,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * STEP_SCROLL_VH * STEPS.length)}`,
        pin: true,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const next = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
          if (next !== lastStep.current) {
            lastStep.current = next;
            setStep(next);
          }
          // progress rail
          const bar = root.querySelector<HTMLElement>("[data-progress]");
          if (bar) bar.style.transform = `scaleX(${self.progress})`;
        },
      });
      return () => st.kill();
    },
    { scope },
  );

  // Swap the copy and slide the toast in whenever the step changes.
  useGSAP(
    () => {
      if (!held || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const root = scope.current;
      if (!root) return;
      const copy = root.querySelector(`[data-copy="${step}"]`);
      const toast = root.querySelector("[data-toast]");
      if (copy) {
        gsap.fromTo(copy.querySelectorAll("[data-line]"), { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.07, ease: "expo.out", overwrite: true });
      }
      if (toast) gsap.fromTo(toast, { y: -40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" });
    },
    { scope, dependencies: [step, held] },
  );

  return (
    <section id="tracking" ref={scope} className="scroll-mt-24 pt-24 md:pt-36">
      {/* The whole panel (heading + phone + copy) is what gets held in place. */}
      <div data-panel className={clsx("container-page flex flex-col justify-center", held && "min-h-[100svh] py-6 md:py-10")}>
        <div className="max-w-[720px]">
          <Reveal>
            <p className="text-[13px] font-extrabold tracking-[0.12em] text-coral uppercase">Tracking & notifications</p>
          </Reveal>
          <SplitHeading className="mt-3 text-[30px] sm:text-[40px] lg:text-[52px]" lines={[{ text: "Know where your food is," }, { text: "without opening the app.", muted: true }]} />
        </div>

        <div className="mt-8 grid items-center gap-8 md:mt-10 md:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="flex justify-center md:justify-start">
            <div className="relative origin-top scale-[0.72] sm:scale-[0.85] md:origin-center md:scale-100 [@media(max-height:760px)]:md:scale-[0.82]">
              <div aria-hidden className="absolute inset-0 -z-10 translate-y-6 scale-[0.85] rounded-full bg-[radial-gradient(closest-side,rgba(255,90,95,0.25),transparent)]" />
              <PhoneFrame>
                <TrackingScreen step={step} />
              </PhoneFrame>
            </div>
          </div>

          {held ? (
            <div className="relative">
              {/* step dots + progress rail */}
              <div className="mb-6 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {STEPS.map((s, i) => (
                    <span
                      key={s.key}
                      className={clsx(
                        "h-2 rounded-full transition-all duration-500",
                        i === step ? "w-8 bg-coral" : i < step ? "w-2 bg-coral/60" : "w-2 bg-ink/15",
                      )}
                    />
                  ))}
                </div>
                <span className="text-[13px] font-extrabold tracking-[0.1em] text-faint uppercase">Step {step + 1} of 4</span>
              </div>
              <div className="relative h-px w-full overflow-hidden rounded-full bg-ink/10">
                <div data-progress className="absolute inset-0 origin-left bg-coral" style={{ transform: "scaleX(0)" }} />
              </div>

              {/* copy blocks stacked in place; only the active one is visible */}
              <div className="relative mt-8 min-h-[260px] md:min-h-[300px]">
                {STEPS.map((s, i) => (
                  <div
                    key={s.key}
                    data-copy={i}
                    aria-hidden={i !== step}
                    className={clsx("absolute inset-0 max-w-[460px] transition-opacity duration-300", i === step ? "opacity-100" : "pointer-events-none opacity-0")}
                  >
                    <div data-line className="flex items-center gap-3">
                      <span className="grid size-11 place-items-center rounded-2xl bg-coral text-white">
                        <s.Icon className="size-5" />
                      </span>
                      <span className="text-[13px] font-extrabold tracking-[0.1em] text-coral uppercase">{s.label}</span>
                    </div>
                    <h3 data-line className="mt-4 text-[26px] leading-[1.15] font-extrabold tracking-[-0.02em] md:text-[32px]">
                      {s.label}
                    </h3>
                    <p data-line className="mt-3 text-[16px] leading-[1.55] font-medium text-mute">
                      {COPY[i]}
                    </p>
                    <div data-line className="mt-4 flex items-center gap-2 text-[13px] font-bold text-mint">
                      <CheckIcon className="size-4" /> Pushed to your notification bar
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[12px] font-semibold text-faint">{step < STEPS.length - 1 ? "Keep scrolling to follow the order" : "Order complete — scroll on"}</p>
            </div>
          ) : (
            <ol className="flex flex-col gap-10">
              {STEPS.map((s, i) => (
                <li key={s.key} className="max-w-[460px]">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 place-items-center rounded-2xl bg-coral text-white">
                      <s.Icon className="size-5" />
                    </span>
                    <span className="text-[13px] font-extrabold tracking-[0.1em] text-faint uppercase">Step {i + 1} of 4</span>
                  </div>
                  <h3 className="mt-4 text-[26px] leading-[1.15] font-extrabold tracking-[-0.02em] md:text-[30px]">{s.label}</h3>
                  <p className="mt-3 text-[16px] leading-[1.55] font-medium text-mute">{COPY[i]}</p>
                  <div className="mt-4 flex items-center gap-2 text-[13px] font-bold text-mint">
                    <CheckIcon className="size-4" /> Pushed to your notification bar
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
