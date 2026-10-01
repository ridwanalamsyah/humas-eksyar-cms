"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

/** Kode QR dari teks/URL (dibuat di peramban), bisa diunduh sebagai PNG. */
export function QrImage({
  value,
  size = 200,
  download,
}: {
  value: string;
  size?: number;
  download?: string;
}) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      color: { dark: "#163a45", light: "#ffffff" },
    })
      .then(setSrc)
      .catch(() => setSrc(""));
  }, [value, size]);
  if (!src)
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-xl bg-mist"
      />
    );
  return (
    <div className="inline-flex flex-col items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Kode QR: ${value}`}
        width={size}
        height={size}
        className="rounded-xl bg-white"
      />
      {download && (
        <a
          href={src}
          download={`${download}.png`}
          className="text-[13px] font-semibold text-accent hover:underline"
        >
          Unduh QR
        </a>
      )}
    </div>
  );
}
