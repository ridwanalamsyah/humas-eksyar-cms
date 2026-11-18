import { ArrowUpRight } from "lucide-react";

const UIN_SYSTEMS = [
  {
    name: "SALAM UIN SGD",
    url: "https://salam.uinsgd.ac.id",
    desc: "KRS, KHS, presensi & jadwal kuliah",
    badge: "Akademik",
  },
  {
    name: "e-Knows UIN SGD",
    url: "https://eknows.uinsgd.ac.id",
    desc: "LMS kuliah daring & ruang tugas",
    badge: "E-Learning",
  },
  {
    name: "Digilib UIN SGD",
    url: "https://digilib.uinsgd.ac.id",
    desc: "Repositori skripsi & karya ilmiah",
    badge: "Perpustakaan",
  },
  {
    name: "SKPI Online",
    url: "https://skpi.uinsgd.ac.id",
    desc: "Sertifikat pendamping ijazah",
    badge: "Kelulusan",
  },
];

export function FastHubUin() {
  return (
    <section className="border-t border-hairline/80 px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-[1040px]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4">
          <div>
            <p className="text-[14px] sm:text-[14px] font-bold uppercase tracking-[0.14em] text-accent dark:text-[#6AB5AD]">
              Layanan Akademik
            </p>
            <h2 className="mt-1 text-[18px] sm:text-[24px] font-extrabold tracking-tight text-label">
              Portal Mahasiswa UIN Sunan Gunung Djati
            </h2>
          </div>
          <p className="text-[14px] sm:text-[14px] text-label-2">
            Tautan resmi perkuliahan, nilai, dan repositori kampus.
          </p>
        </div>

        <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {UIN_SYSTEMS.map((sys) => (
            <a
              key={sys.name}
              href={sys.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between border-t border-hairline pt-4 sm:pt-5 transition-colors duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[14px] font-semibold uppercase tracking-wider text-label-3">
                    {sys.badge}
                  </span>
                  <ArrowUpRight className="size-3.5 text-label-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </div>

                <h3 className="mt-2 text-[14px] sm:text-[16px] font-bold text-label leading-snug group-hover:text-accent dark:group-hover:text-[#6AB5AD]">
                  {sys.name}
                </h3>
                <p className="mt-1 hidden sm:block text-[14px] text-label-2 leading-relaxed">
                  {sys.desc}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
