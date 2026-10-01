/* Kartu gambar bergaya Eksyar untuk next/og (OG berita & template Instagram). */
export function OgCard({
  title,
  kategori,
  tanggal,
  width,
  height,
  logo,
}: {
  title: string;
  kategori: string;
  tanggal?: string;
  width: number;
  height: number;
  logo: string;
}) {
  const scale = width / 1200;
  const size = title.length > 90 ? 56 : title.length > 60 ? 66 : 78;
  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#237a74",
        color: "#ffffff",
        padding: 72 * scale,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 * scale }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          width={84 * scale}
          height={84 * scale}
          alt=""
          style={{ borderRadius: 999, background: "#fff" }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 30 * scale, fontWeight: 700 }}>
            Ekonomi Syariah
          </span>
          <span style={{ fontSize: 22 * scale, opacity: 0.8 }}>
            FEBI UIN Sunan Gunung Djati Bandung
          </span>
        </div>
      </div>
      <div
        style={{ display: "flex", flexDirection: "column", gap: 24 * scale }}
      >
        <span
          style={{
            alignSelf: "flex-start",
            background: "#f6e3bd",
            color: "#1d3d55",
            fontSize: 24 * scale,
            fontWeight: 700,
            padding: `${8 * scale}px ${22 * scale}px`,
            borderRadius: 999,
          }}
        >
          {kategori}
        </span>
        <span
          style={{
            fontSize: size * scale * (height > width ? 1.25 : 1),
            fontWeight: 800,
            lineHeight: 1.12,
            letterSpacing: -1,
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 22 * scale,
          opacity: 0.85,
        }}
      >
        <span>{tanggal ?? ""}</span>
        <span>@eksyaruinsgd</span>
      </div>
    </div>
  );
}
