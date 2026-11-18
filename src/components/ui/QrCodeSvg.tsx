"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";
import { Icon } from "@/components/ui/Icon";
import { encodeQr } from "@/lib/qr";

/**
 * Renders a QR code from the module matrix produced by `encodeQr`.
 *
 * Drawn as SVG rather than fetched from an image service. The brief used
 * api.qrserver.com, which would send the link being shared to a server the
 * project does not control on every render, and would leave the code blank if
 * that service were slow or gone. A QR code is arithmetic, so it is drawn here.
 *
 * The quiet zone is part of the specification: a reader needs four clear modules
 * around the code, so the viewBox includes the margin and the background is
 * painted rather than left transparent.
 */
export function QrCodeSvg({
  value,
  size = 132,
  className,
  label,
}: {
  value: string;
  size?: number;
  className?: string;
  label?: string;
}) {
  const [failed, setFailed] = useState(false);

  let qr: ReturnType<typeof encodeQr> | null = null;
  try {
    qr = encodeQr(value);
  } catch {
    qr = null;
  }

  if (!qr) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg bg-ink-50 dark:bg-ink-950 border border-ink-100 dark:border-ink-800 text-ink-400 ${className ?? ""}`}
        style={{ width: size, height: size }}
      >
        <Icon icon={QrCode} size={24} />
        <span className="sr-only">QR code could not be generated for this link</span>
      </div>
    );
  }

  const quiet = 4;
  const extent = qr.size + quiet * 2;
  const path = qr.modules
    .flatMap((row, y) =>
      row.map((dark, x) => (dark ? `M${x + quiet} ${y + quiet}h1v1h-1z` : "")),
    )
    .join("");

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${extent} ${extent}`}
      role="img"
      aria-label={label ?? "QR code linking to this vehicle listing"}
      className={className}
      shapeRendering="crispEdges"
      onError={() => setFailed(true)}
      data-qr-version={qr.version}
      data-qr-level={qr.level}
      data-qr-failed={failed ? "true" : "false"}
    >
      <rect width={extent} height={extent} fill="#ffffff" />
      <path d={path} fill="#14161A" />
    </svg>
  );
}
