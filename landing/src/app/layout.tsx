import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/site";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const title = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: title, template: `${site.name} | %s` },
  description: site.description,
  applicationName: site.name,
  keywords: ["food delivery Lagos", "order food Lagos", "Cravely", "Paystack food app", "Lekki food delivery", "Victoria Island food delivery"],
  alternates: { canonical: "/" },
  openGraph: { title, description: site.description, url: "/", siteName: site.name, type: "website", locale: "en_NG", images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }] },
  twitter: { card: "summary_large_image", title, description: site.description, images: ["/og.png"] },
  icons: { icon: [{ url: "/favicon-32.png", sizes: "32x32", type: "image/png" }, { url: "/favicon.png", type: "image/png" }], apple: "/apple-touch-icon.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#FFF8F4",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG" className={`${jakarta.variable} antialiased`}>
      <body className="min-h-dvh overflow-x-clip bg-cream text-ink">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
