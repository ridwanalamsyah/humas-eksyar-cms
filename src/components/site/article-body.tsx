import { Fragment, type ReactNode } from "react";

/**
 * Renderer markdown ringan untuk isi artikel dari CMS — tanpa dependency.
 * Blok: `##`/`###` heading, daftar `-`/`*`/`1.`, kutipan `>`, gambar
 * `![alt](url)`, paragraf. Inline: **tebal**, *miring*, [tautan](url).
 */
export function ArticleBody({ text }: { text: string }) {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <>
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        if (/^#{3,}\s/.test(block)) return <h3 key={i}>{inline(block.replace(/^#+\s/, ""))}</h3>;
        if (/^#{1,2}\s/.test(block)) return <h2 key={i}>{inline(block.replace(/^#+\s/, ""))}</h2>;

        const img = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)$/);
        if (img && isSafeUrl(img[2])) {
          return (
            <figure key={i} className="my-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img[2]} alt={img[1]} loading="lazy" className="w-full rounded-[16px]" />
              {img[1] && <figcaption className="mt-3 text-[14px] text-label-2">{img[1]}</figcaption>}
            </figure>
          );
        }

        if (lines.every((l) => /^\s*[-*•]\s+/.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*[-*•]\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.replace(/^\s*\d+[.)]\s+/, ""))}</li>
              ))}
            </ol>
          );
        }
        if (block.startsWith(">")) {
          return <blockquote key={i}>{inline(lines.map((l) => l.replace(/^>\s?/, "")).join(" "))}</blockquote>;
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

function isSafeUrl(url: string) {
  return /^(https?:\/\/|\/(?!\/)|mailto:)/i.test(url);
}

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*|\[[^\]]+\]\([^)\s]+\))/g;

function inline(text: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      if (!isSafeUrl(link[2])) return link[1];
      const external = /^https?:\/\//i.test(link[2]);
      return (
        <a key={i} href={link[2]} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {link[1]}
        </a>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}
