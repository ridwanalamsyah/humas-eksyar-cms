/** Header halaman dalam: judul besar terpusat di atas kanvas putih. */
export function PageHeader({ title, description, crumb }: { title: string; description?: string; crumb: string }) {
  return (
    <section className="px-6 pb-16 pt-16 text-center sm:pb-24 sm:pt-24">
      <p className="font-script text-[clamp(2rem,1.6rem+1.2vw,2.75rem)] leading-none text-accent">{crumb}</p>
      <h1 className="mx-auto mt-3 max-w-4xl text-[clamp(2.4rem,1.6rem+3.4vw,4.5rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-label text-balance">
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
