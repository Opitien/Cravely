"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/gsap";
import { site } from "@/lib/site";
import { AndroidIcon, AppleIcon, QrIcon, ShieldIcon } from "../icons";
import { MagneticLink, Reveal, SplitHeading } from "../motion-primitives";

/** Download block. The APK link comes from NEXT_PUBLIC_ANDROID_APK_URL at build time; until then it shows "coming today". */
export function Download() {
  const apk = site.androidApk;
  return (
    <section id="download" className="container-page scroll-mt-24 pt-24 pb-8 md:pt-36">
      <div className="relative overflow-hidden rounded-[32px] bg-navy px-6 py-12 text-white md:px-14 md:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-40%] right-[-10%] size-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(255,90,95,0.45),transparent)]" />
          <div className="absolute bottom-[-50%] left-[-10%] size-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(245,165,36,0.25),transparent)]" />
          {["🍔", "🍕", "🍗", "🥘", "🍦", "🌯"].map((e, i) => (
            <motion.span
              key={e}
              aria-hidden
              className="absolute text-[34px] opacity-70 select-none md:text-[44px]"
              style={{ left: `${8 + i * 16}%`, top: i % 2 ? "12%" : "72%" }}
              animate={{ y: [0, i % 2 ? -12 : 12, 0], rotate: [0, i % 2 ? 8 : -8, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
            >
              {e}
            </motion.span>
          ))}
        </div>

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <SplitHeading className="text-[36px] sm:text-[48px] lg:text-[60px]" lines={[{ text: "Get Cravely on" }, { text: "your phone.", accent: true }]} />
            <Reveal delay={0.2} className="mt-5 max-w-[520px] text-[17px] leading-[1.55] font-medium text-white/75">
              Android first, straight from us as an APK while we finish the Play Store listing. iOS follows once the App Store review is through.
            </Reveal>
            <Reveal delay={0.3} className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticLink href={apk || "#download"} size="lg" disabled={!apk} external={!!apk}>
                <AndroidIcon className="size-5" /> {apk ? "Download the Android APK" : "Android APK coming today"}
              </MagneticLink>
              <MagneticLink href="#" variant="outline" size="lg" disabled className="!bg-white/10 !text-white !ring-white/20">
                <AppleIcon className="size-5" /> iOS coming soon
              </MagneticLink>
            </Reveal>
            <Reveal delay={0.4} className="mt-6 flex items-start gap-2.5 text-[13px] leading-[1.5] font-medium text-white/60">
              <ShieldIcon className="mt-0.5 size-4 shrink-0 text-mint" />
              <span>
                Installing an APK asks Android to allow this source once. Package name <span className="font-mono text-white/80">{site.androidPackage}</span>. Only install Cravely from this page.
              </span>
            </Reveal>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, margin: "0px 0px -15% 0px" }}
            transition={{ duration: 1, ease: EASE, delay: 0.2 }}
            className="mx-auto w-full max-w-[300px] rounded-[28px] bg-white p-5 text-ink shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]"
          >
            <div className="grid aspect-square place-items-center rounded-2xl bg-peach text-faint" aria-label="QR code placeholder">
              <div className="flex flex-col items-center gap-2 text-center">
                <QrIcon className="size-14 text-coral" />
                <p className="px-6 text-[12px] font-semibold">QR code appears here once the APK is live</p>
              </div>
            </div>
            <p className="mt-4 text-center text-[14px] font-extrabold">Scan with your phone</p>
            <p className="mt-1 text-center text-[12px] font-medium text-mute">Opens the download directly on Android</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
