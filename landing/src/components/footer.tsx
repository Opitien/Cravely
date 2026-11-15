import { footerLinks, site } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="container-page pt-10 pb-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <a href="#top" className="focus-ring self-start rounded-md text-ink" aria-label="Cravely home">
          <Logo className="text-[22px]" />
        </a>
        <nav aria-label="Footer">
          <ul className="flex flex-col gap-4 text-[14px] font-medium text-mute lg:flex-row lg:gap-6">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                  className="focus-ring rounded bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size,color] duration-500 ease-expo hover:bg-[length:100%_1px] hover:text-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-[13px] text-faint">
          Android package <span className="font-mono text-mute">{site.androidPackage}</span>
        </p>
      </div>
      <p className="mt-8 border-t border-line pt-8 text-[13px] text-faint">© 2026 Cravely · Lagos, Nigeria · {site.tagline}</p>
    </footer>
  );
}
