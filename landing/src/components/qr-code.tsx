"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/**
 * Renders a QR code for `value` as inline SVG (crisp at any size, no image request).
 * Dark modules use the brand navy so it stays scannable on the white card.
 */
export function QrCode({ value, className, label }: { value: string; className?: string; label?: string }) {
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toString(value, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
      color: { dark: "#131929", light: "#00000000" },
    })
      .then((s) => {
        if (cancelled) return;
        // let the SVG scale to its container
        setSvg(s.replace(/<svg([^>]*?)\swidth="[^"]*"\sheight="[^"]*"/, "<svg$1").replace("<svg", '<svg width="100%" height="100%"'));
      })
      .catch(() => setSvg(""));
    return () => {
      cancelled = true;
    };
  }, [value]);

  if (!svg) return <div className={className} aria-hidden />;
  return <div className={className} role="img" aria-label={label ?? `QR code for ${value}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}
