/** Header halaman dalam: judul besar terpusat di atas kanvas putih. */
export function PageHeader({ title, description, crumb }: { title: string; description?: string; crumb: string }) {
  return (
    <section className="px-6 pb-12 pt-16 text-center sm:pb-16 sm:pt-24">
      <p className="text-[17px] font-semibold text-accent">{crumb}</p>
      <h1 className="mx-auto mt-2 max-w-4xl text-[clamp(2.5rem,1.6rem+3.6vw,4.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-label text-balance">
        {title}
      </h1>
      {description && (
        <p className="mx-auto mt-5 max-w-2xl text-[clamp(1.1rem,1rem+0.4vw,1.4rem)] leading-[1.4] text-label-2 text-pretty">
          {description}
        </p>
      )}
    </section>
  );
}
