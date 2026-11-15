import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const SearchIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const PinIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const BikeIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="6" cy="17" r="3.5" /><circle cx="18" cy="17" r="3.5" /><path d="M6 17 9.5 9h4l3 8M9.5 9h5l1-3h3" /></svg>
);
export const BellIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15L6 16Z" /><path d="M10 21a2 2 0 0 0 4 0" /></svg>
);
export const CardIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h4" /></svg>
);
export const HeartIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" /></svg>
);
export const RepeatIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M17 2l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
);
export const MoonIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" /></svg>
);
export const CheckIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={3} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const FlameIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 22c4.4 0 7-2.9 7-6.6 0-3.3-2-5.3-3.4-7.4-.3 1.8-1.2 2.9-2.3 3.6.2-3.4-1.3-6.5-4.3-8.6.3 3.1-1.4 4.6-2.8 6.5C5 11.1 5 13.3 5 15.4 5 19.1 7.6 22 12 22Z" /></svg>
);
export const ReceiptIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6" /></svg>
);
export const StarIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8L12 2.5Z" /></svg>
);
export const ClockIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
);
export const ArrowRightIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} strokeWidth={2.4} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const AndroidIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M17.5 9.5 19 7l-.9-.5-1.5 2.6A7.6 7.6 0 0 0 12 8a7.6 7.6 0 0 0-4.6 1.1L5.9 6.5 5 7l1.5 2.5A7.4 7.4 0 0 0 3 15.5h18a7.4 7.4 0 0 0-3.5-6ZM8.3 13.3a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Zm7.4 0a.9.9 0 1 1 0-1.8.9.9 0 0 1 0 1.8Z" /></svg>
);
export const AppleIcon = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M16.4 12.6c0-2.4 2-3.5 2-3.6a4.4 4.4 0 0 0-3.4-1.8c-1.5-.2-2.9.9-3.6.9-.8 0-1.9-.8-3.1-.8A4.6 4.6 0 0 0 4.4 9.7c-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 3 2.4 1.2 0 1.6-.8 3.1-.8 1.4 0 1.8.8 3.1.8 1.3 0 2.1-1.2 2.9-2.3a10 10 0 0 0 1.3-2.7 4 4 0 0 1-2.6-4ZM14 5.6A4 4 0 0 0 15 2.7a4.1 4.1 0 0 0-2.7 1.4 3.8 3.8 0 0 0-1 2.8 3.4 3.4 0 0 0 2.7-1.3Z" /></svg>
);
export const ShieldIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6L12 3Z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const QrIcon = (p: P) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><path d="M14 14h3v3h-3zM20 14v2M17 20h4M20 18h1" /></svg>
);
