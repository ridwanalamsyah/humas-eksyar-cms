/**
 * Default bio page configuration for `eksyar.bio`.
 *
 * Stored in `siteSettings` keyed by "bio" so it can be edited at runtime
 * (admin → /settings/bio) without redeploys.
 */

export interface BioLink {
  id: string;
  label: string;
  href: string;
  /** Optional emoji or single-char glyph rendered in the icon slot. */
  icon?: string;
  /** Optional secondary text shown below the label. */
  hint?: string;
  /** When true, link gets a brighter "primary" treatment. */
  featured?: boolean;
}

export interface BioConfig {
  /** Display name in the hero. */
  name: string;
  /** Short single-line tagline under the name. */
  tagline: string;
  /** Longer 2-3 sentence intro paragraph. */
  intro: string;
  /** Avatar emoji or image URL. Emoji rendered as text if not URL-like. */
  avatar: string;
  /** Brand accent color override (CSS color). Optional. */
  accent?: string;
  links: BioLink[];
  /** Whether the page surfaces upcoming events from the events table. */
  showEvents?: boolean;
  /** Whether the page surfaces the latest published content. */
  showLatestContent?: boolean;
  /** Whether the page surfaces upcoming Hijriah / national holidays. */
  showHolidays?: boolean;
}

export const defaultBioConfig: BioConfig = {
  name: "Humas Eksyar",
  tagline: "Dewan Hubungan Masyarakat — HMJ Ekonomi Syariah UIN SGD",
  intro:
    "Pusat informasi resmi Humas Ekonomi Syariah UIN Sunan Gunung Djati Bandung. Kabar kegiatan, kajian mingguan, dan agenda kampus.",
  avatar: "/eksyar-logo.png",
  showEvents: true,
  showLatestContent: true,
  showHolidays: true,
  links: [
    {
      id: "instagram",
      label: "Instagram",
      href: "https://instagram.com/eksyaruinsgd",
      icon: "📷",
      hint: "@eksyaruinsgd",
      featured: true,
    },
    {
      id: "tiktok",
      label: "TikTok",
      href: "https://tiktok.com/@eksyaruinsgd",
      icon: "🎵",
      hint: "@eksyaruinsgd",
    },
    {
      id: "whatsapp",
      label: "WhatsApp Channel",
      href: "https://whatsapp.com/channel/0029VaeksyarUINSGD",
      icon: "💬",
      hint: "Update kegiatan mingguan",
    },
    {
      id: "kampus",
      label: "Website Jurusan",
      href: "https://eksyar.uinsgd.ac.id",
      icon: "🏛️",
      hint: "Jurusan Ekonomi Syariah UIN SGD",
    },
    {
      id: "kontak",
      label: "Email Pengurus",
      href: "mailto:humas.eksyar@uinsgd.ac.id",
      icon: "✉️",
    },
  ],
};
