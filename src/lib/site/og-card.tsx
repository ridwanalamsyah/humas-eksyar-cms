/* Kartu gambar bergaya Eksyar untuk next/og (OG berita & template Instagram 1080x1350). */
export function OgCard({
  title,
  kategori,
  tanggal,
  width,
  height,
}: {
  title: string;
  kategori: string;
  tanggal?: string;
  width: number;
  height: number;
  logo?: string;
}) {
  const scale = width / 1200;
  const size = title.length > 90 ? 54 : title.length > 60 ? 64 : 76;
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(145deg, #0f3d33 0%, #165b4c 52%, #0c2340 100%)",
        color: "#ffffff",
        padding: 76 * scale,
        fontFamily: "sans-serif",
      }}
    >
      {/* Header Identitas Resmi Prodi */}
      <div style={{ display: "flex", alignItems: "center", gap: 22 * scale }}>
        <div
          style={{
            width: 84 * scale,
            height: 84 * scale,
            borderRadius: 999,
            background: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
          }}
        >
          <svg
            width={70 * scale}
            height={70 * scale}
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#0f766e"
              strokeOpacity="0.22"
              strokeWidth="2"
            />
            <path
              d="M50 8C57 18 60 29 50 42C40 29 43 18 50 8Z"
              fill="#0d9488"
            />
            <path
              d="M77 20C75 32 67 40 53 44C57 31 65 22 77 20Z"
              fill="#65a30d"
            />
            <path
              d="M23 20C35 22 43 31 47 44C33 40 25 32 23 20Z"
              fill="#65a30d"
            />
            <path
              d="M89 44C79 53 67 55 54 49C64 39 77 38 89 44Z"
              fill="#1d4ed8"
            />
            <path
              d="M11 44C23 38 36 39 46 49C33 55 21 53 11 44Z"
              fill="#1d4ed8"
            />
            <path
              d="M18 66C30 60 41 62 50 72C59 62 70 60 82 66C72 78 61 84 50 89C39 84 28 78 18 66Z"
              fill="#eab308"
            />
            <path
              d="M28 56C38 52 45 55 50 63C55 55 62 52 72 56C65 65 58 70 50 75C42 70 35 65 28 56Z"
              fill="#0f766e"
            />
            <circle
              cx="50"
              cy="48"
              r="8.5"
              fill="#ffffff"
              stroke="#0f766e"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 31 * scale,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            Program Studi S1 Ekonomi Syariah
          </span>
          <span style={{ fontSize: 22 * scale, opacity: 0.85 }}>
            Fakultas Ekonomi dan Bisnis Islam · UIN Sunan Gunung Djati Bandung
          </span>
        </div>
      </div>

      {/* Konten Utama */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 26 * scale,
          paddingTop: 24 * scale,
          paddingBottom: 24 * scale,
        }}
      >
        <span
          style={{
            alignSelf: "flex-start",
            background: "#f6e3bd",
            color: "#0c2340",
            fontSize: 24 * scale,
            fontWeight: 800,
            padding: `${10 * scale}px ${26 * scale}px`,
            borderRadius: 999,
          }}
        >
          {kategori}
        </span>
        <span
          style={{
            fontSize: size * scale * (height > width ? 1.18 : 1),
            fontWeight: 800,
            lineHeight: 1.14,
            letterSpacing: -1,
          }}
        >
          {title}
        </span>
      </div>

      {/* Footer Resmi */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "2px solid rgba(255,255,255,0.18)",
          paddingTop: 28 * scale,
          fontSize: 22 * scale,
          opacity: 0.9,
        }}
      >
        <span>{tanggal || "Wahyu Memandu Ilmu dalam Bingkai Akhlak Karimah"}</span>
        <span style={{ fontWeight: 700, color: "#f6e3bd" }}>
          @eksyaruinsgd · es.uinsgd.ac.id
        </span>
      </div>
    </div>
  );
}
