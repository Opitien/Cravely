"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CheckIcon } from "../icons";
import { Reveal, SplitHeading } from "../motion-primitives";
import { PhoneFrame, STEPS, TrackingScreen } from "../phone";

/**
 * Pinned showcase: the phone stays put while the copy scrolls past, and each quarter of the scroll advances the order
 * one step (Placed → Preparing → On the way → Delivered). A notification toast slides in from the top on every step.
 */
export function Tracking() {
  const scope = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const stage = root.querySelector<HTMLElement>("[data-stage]");
      const list = root.querySelector<HTMLElement>("[data-list]");
      const copy = root.querySelectorAll<HTMLElement>("[data-copy]");
      if (!stage || !list) return;

      // Desktop: pin the phone beside the copy for exactly as long as the copy column is taller than it, scrubbing
      // through the steps. Mobile / reduced motion: steps advance as copy blocks enter.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.create({
          trigger: stage,
          start: "top top+=96",
          end: () => `+=${Math.max(0, list.offsetHeight - stage.offsetHeight)}`,
          pin: true,
          pinSpacing: false,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setStep(Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length))),
        });
        copy.forEach((el) => {
          gsap.fromTo(el, { opacity: 0.25, y: 24 }, { opacity: 1, y: 0, duration: 0.6, scrollTrigger: { trigger: el, start: "top 70%", end: "bottom 45%", toggleActions: "play reverse play reverse" } });
        });
      });
      mm.add("(max-width: 1023px)", () => {
        copy.forEach((el, i) => ScrollTrigger.create({ trigger: el, start: "top 70%", onEnter: () => setStep(i), onEnterBack: () => setStep(i) }));
      });
      if (reduce) setStep(3);
      return () => mm.revert();
    },
    { scope },
  );

  // toast slide-in whenever the step changes
  useGSAP(
    () => {
      const toast = scope.current?.querySelector("[data-toast]");
      if (!toast || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(toast, { y: -40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "expo.out" });
    },
    { scope, dependencies: [step] },
  );

  return (
    <section id="tracking" ref={scope} className="scroll-mt-24 pt-24 md:pt-36">
      <div className="container-page">
        <div className="max-w-[720px]">
          <Reveal>
            <p className="text-[13px] font-extrabold tracking-[0.12em] text-coral uppercase">Tracking & notifications</p>
          </Reveal>
          <SplitHeading className="mt-3 text-[34px] sm:text-[44px] lg:text-[56px]" lines={[{ text: "Know where your food is," }, { text: "without opening the app.", muted: true }]} />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div data-stage className="flex justify-center lg:justify-start">
            <div className="relative">
              <div aria-hidden className="absolute inset-0 -z-10 translate-y-6 scale-[0.85] rounded-full bg-[radial-gradient(closest-side,rgba(255,90,95,0.25),transparent)]" />
              <PhoneFrame>
                <TrackingScreen step={step} />
              </PhoneFrame>
            </div>
          </div>

          <ol data-list className="flex flex-col gap-10 lg:gap-[36vh] lg:py-[14vh]">
            {STEPS.map((s, i) => (
              <li key={s.key} data-copy className="max-w-[460px]">
                <div className="flex items-center gap-3">
                  <span className={clsx("grid size-11 place-items-center rounded-2xl transition-colors duration-500", i <= step ? "bg-coral text-white" : "bg-peach text-coral")}>
                    <s.Icon className="size-5" />
                  </span>
                  <span className="text-[13px] font-extrabold tracking-[0.1em] text-faint uppercase">Step {i + 1} of 4</span>
                </div>
                <h3 className="mt-4 text-[26px] leading-[1.15] font-extrabold tracking-[-0.02em] md:text-[30px]">{s.label}</h3>
                <p className="mt-3 text-[16px] leading-[1.55] font-medium text-mute">
                  {[
                    "The moment Paystack confirms your payment (or you choose cash), the kitchen gets the order and your phone gets a notification.",
                    "The restaurant marks your food as preparing. The timeline updates live through Supabase Realtime while the app is open, and the notification bar when it isn't.",
                    "Your rider leaves. The map shows the kitchen, your pin and the route between them, with the distance and a bike ETA.",
                    "Delivered. Rate the meal, reorder it next week in a tap, or save the kitchen to your favourites.",
                  ][i]}
                </p>
                <div className="mt-4 flex items-center gap-2 text-[13px] font-bold text-mint">
                  <CheckIcon className="size-4" /> Pushed to your notification bar
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
