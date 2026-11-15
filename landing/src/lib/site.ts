// One place for the landing page's copy-independent facts.
export const site = {
  name: "Cravely",
  url: "https://getcravely.vercel.app",
  tagline: "Your cravings, delivered.",
  description:
    "Cravely brings Lagos' favourite kitchens to your door. Pick a restaurant, pay with Paystack or cash, and watch your rider on a live map.",
  // Mirrors src/constants/Links.ts in the app
  supportEmail: "support@cravely.app",
  privacyPolicy: "https://cravely.app/privacy",
  terms: "https://cravely.app/terms",
  // Set NEXT_PUBLIC_ANDROID_APK_URL on Vercel once the EAS build is ready.
  androidApk: process.env.NEXT_PUBLIC_ANDROID_APK_URL || "",
  androidPackage: "com.cravely.app",
};

export const navLinks = [
  { label: "How it works", href: "#how" },
  { label: "Features", href: "#features" },
  { label: "Restaurants", href: "#restaurants" },
  { label: "Tracking", href: "#tracking" },
];

export const footerLinks = [
  { label: "Privacy", href: site.privacyPolicy },
  { label: "Terms", href: site.terms },
  { label: "Support", href: `mailto:${site.supportEmail}` },
];

export const restaurants = [
  { name: "Chicken Republic", emoji: "🍗" },
  { name: "Domino's Pizza", emoji: "🍕" },
  { name: "Mega Chicken", emoji: "🥘" },
  { name: "Cold Stone Creamery", emoji: "🍦" },
  { name: "The Place", emoji: "🍛" },
  { name: "Burger King", emoji: "🍔" },
  { name: "Kilimanjaro", emoji: "🌯" },
  { name: "McDonald's", emoji: "🍟" },
];
