/**
 * Header halaman dalam: judul dan satu kalimat. `crumb` tidak lagi ditampilkan
 * sebagai label kapital di atas judul (biasanya hanya mengulang judulnya).
 */
export function PageHeader({
  title,
  description,
  crumb,
}: {
  title: string;
  description?: string;
  crumb: string;
}) {
  return (
    <section aria-label={crumb} className="px-6 pb-10 pt-14 text-center sm:pb-14 sm:pt-20">
      <h1 className="mx-auto max-w-4xl text-[clamp(2.25rem,1.6rem+2.6vw,4rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-label text-balance">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-4 line-clamp-2 max-w-2xl text-[16px] leading-[1.5] text-label-2 text-pretty sm:text-[18px]">
          {description}
        </p>
      )}
    </section>
  );
}
