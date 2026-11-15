import clsx from "clsx";
import { restaurants } from "@/lib/site";
import { Reveal } from "../motion-primitives";

function Row({ reverse }: { reverse?: boolean }) {
  const items = [...restaurants, ...restaurants];
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <ul className={clsx("flex w-max shrink-0 gap-3 pr-3", reverse ? "animate-marquee-rev" : "animate-marquee")} aria-hidden={reverse || undefined}>
        {items.map((r, i) => (
          <li key={`${r.name}-${i}`} className="flex items-center gap-2.5 rounded-full bg-white py-2.5 pr-5 pl-2.5 text-[15px] font-bold whitespace-nowrap ring-1 ring-line transition duration-500 ease-expo hover:-translate-y-0.5 hover:bg-coral hover:text-white hover:ring-coral">
            <span className="grid size-8 place-items-center rounded-full bg-peach text-[16px]">{r.emoji}</span>
            {r.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Two counter-scrolling rows of the launch restaurants (seed data), pills only, no logos. */
export function RestaurantsMarquee() {
  return (
    <section id="restaurants" className="scroll-mt-24 pt-24 md:pt-36">
      <div className="container-page flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <p className="text-[13px] font-extrabold tracking-[0.12em] text-coral uppercase">Restaurants</p>
          <h2 className="display mt-3 text-[30px] sm:text-[38px] lg:text-[44px]">Kitchens you already love.</h2>
        </Reveal>
        <Reveal delay={0.15} className="text-[15px] font-medium text-mute">8 at launch · Lekki, Victoria Island, Ikoyi · more every week</Reveal>
      </div>
      <div className="mt-10 flex flex-col gap-3">
        <Row />
        <Row reverse />
      </div>
    </section>
  );
}
