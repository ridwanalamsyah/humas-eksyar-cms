import { prodi } from "@/lib/site/prodi";
import { cn } from "@/lib/utils";

/**
 * Logo resmi Program Studi S1 Ekonomi Syariah FEBI UIN Sunan Gunung Djati Bandung.
 * Menggunakan vektor SVG presisi tinggi (tanpa teks mikro di dalam lingkaran)
 * agar selalu tajam, simetris, dan proporsional baik di ukuran 30px (navbar)
 * maupun 80px (hero).
 */
export function ProdiLogo({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span
      role="img"
      aria-label={`Logo ${prodi.fullName} ${prodi.university}`}
      style={{ width: size, height: size }}
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-accent/20 bg-gradient-to-b from-white to-[#f2f7f4] shadow-[0_1px_3px_rgba(12,35,64,0.08)]",
        className,
      )}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-[86%]"
      >
        <defs>
          <linearGradient id="eksyar-teal" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id="eksyar-blue" x1="15" y1="20" x2="85" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="eksyar-gold" x1="30" y1="25" x2="70" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#ca8a04" />
          </linearGradient>
          <linearGradient id="eksyar-lime" x1="25" y1="15" x2="75" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="100%" stopColor="#4d7c0f" />
          </linearGradient>
        </defs>

        {/* Lingkaran ornamen dalam */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#0f766e"
          strokeOpacity="0.16"
          strokeWidth="1.5"
        />

        {/* Kelopak teratai atas (Hijau Toska UIN SGD) */}
        <path
          d="M50 8C57 18 60 29 50 42C40 29 43 18 50 8Z"
          fill="url(#eksyar-teal)"
        />
        {/* Kelopak diagonal kanan-atas & kiri-atas (Hijau Muda / Lime) */}
        <path
          d="M77 20C75 32 67 40 53 44C57 31 65 22 77 20Z"
          fill="url(#eksyar-lime)"
        />
        <path
          d="M23 20C35 22 43 31 47 44C33 40 25 32 23 20Z"
          fill="url(#eksyar-lime)"
        />

        {/* Sayap kubah / kelopak samping (Biru Akademik) */}
        <path
          d="M89 44C79 53 67 55 54 49C64 39 77 38 89 44Z"
          fill="url(#eksyar-blue)"
        />
        <path
          d="M11 44C23 38 36 39 46 49C33 55 21 53 11 44Z"
          fill="url(#eksyar-blue)"
        />

        {/* Pita gelombang bawah (Emas & Toska) */}
        <path
          d="M18 66C30 60 41 62 50 72C59 62 70 60 82 66C72 78 61 84 50 89C39 84 28 78 18 66Z"
          fill="url(#eksyar-gold)"
        />
        <path
          d="M28 56C38 52 45 55 50 63C55 55 62 52 72 56C65 65 58 70 50 75C42 70 35 65 28 56Z"
          fill="url(#eksyar-teal)"
        />

        {/* Bintang & Mushaf / Inti Wahyu Memandu Ilmu di tengah */}
        <circle cx="50" cy="48" r="8.5" fill="#ffffff" stroke="#0f766e" strokeWidth="2" />
        <path
          d="M50 42L51.9 46.1L56.3 46.6L53 49.6L53.9 54L50 51.8L46.1 54L47 49.6L43.7 46.6L48.1 46.1L50 42Z"
          fill="url(#eksyar-gold)"
        />
      </svg>
    </span>
  );
}
