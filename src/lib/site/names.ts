/**
 * Normalisasi nama dosen agar data dari CMS, e-Knows, dan Digilib bisa
 * dicocokkan: buang gelar akademik, tanda baca, dan huruf besar.
 * "Dr. Evi Sopiah, M.Ag., CIIQA" → "evi sopiah"
 */
const TITLES =
  /\b(prof|dr|drs|dra|ir|h|hj|kh|lc|ma|mag|m\s?ag|m\s?si|m\s?e|m\s?e\s?sy|m\s?m|m\s?pd|m\s?h|m\s?hum|m\s?ak|m\s?sc|m\s?b\s?a|mba|m\s?e\s?i|s\s?e|s\s?e\s?i|s\s?e\s?sy|s\s?h\s?i|s\s?ag|s\s?pd|s\s?sos|s\s?h|s\s?ip|s\s?kom|ph\s?d|ak|ca|cpa|ciiqa|cielp|cfp|awp|crbd|ciib)\b/g;

export function normName(name: string): string {
  const main = name.split(",")[0].includes(" ") ? name.split(",")[0] : name;
  return main
    .toLowerCase()
    .replace(/\./g, " ")
    .replace(TITLES, " ")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Slug URL profil dosen: "Dr. Evi Sopiah, M.Ag." → "evi-sopiah". */
export function dosenSlug(name: string): string {
  return normName(name).replace(/\s+/g, "-");
}
