# Humas Eksyar — Ekosistem Organisasi

Pusat ekosistem organisasi & content management untuk **Humas Eksyar** (Ekonomi Syariah, Fakultas Ekonomi & Bisnis Islam, UIN Sunan Gunung Djati Bandung).

> **Eksyar Satu, Victory in Harmony!**

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19.2** + **TypeScript**
- **Tailwind CSS v4** dengan custom design tokens
- **Motion** (Framer Motion) untuk spring physics animations
- **Lenis** untuk momentum smooth scroll
- **next-themes** untuk dark/light/system mode
- **Lucide** icons (stroke 1.75)
- **Inter / Inter Tight / Fraunces / Geist** typography
- **Supabase** (Postgres + Auth + Storage + Realtime) — *Phase 1+*
- **Google Gemini 2.0 Flash** untuk AI Caption Generator — *Phase 2+*

## Design Language

Diadaptasi dari Apple **Liquid Glass** (iOS 26 / macOS Tahoe, WWDC 2025), dipadukan dengan brand IG **@eksyaruinsgd**:

- Brand teal `#0D9488` + cream `#F8F1DD` + gold `#E89422` + ink `#14201A`
- Glass material 3 variant (Regular / Thick / Thin) dengan specular highlights
- Continuous corners (squircle) + ambient teal glow per panel
- Spring physics motion (4 preset: gentle / standard / snappy / bouncy)
- Magazine-style asymmetric layout untuk hindari "AI template look"
- Dark mode first-class citizen dengan auto-invert

Detail lengkap: lihat `docs/DESIGN.md` (akan ditambahkan).

## Phase Roadmap

| Phase | Scope |
|---|---|
| **0** | Foundation: design system, glass components, login UI, dashboard skeleton |
| **1** | Core CMS: members, divisions, content pipeline (Kanban), media manager |
| **2** | AI Caption Generator (multimodal Gemini) |
| **3** | Workflow & Approval, kalender Hijriah-Masehi, RSVP/QR check-in |
| **4** | Gamification: XP, badges, streaks, quests, leaderboard |
| **5** | Analytics & Reports |
| **6** | PWA polish + production deploy + custom seed data |
| **7** | (opsional) Integrasi ERP internal |

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build (Turbopack)
pnpm start        # serve production build
pnpm lint         # ESLint
```

> **Catatan Next.js 16:** Turbopack adalah default untuk dev dan build. Async Request APIs (`cookies()`, `headers()`, `params`, `searchParams`) wajib di-`await`. Lihat `AGENTS.md`.

## Project Structure

```
src/
  app/                      # App Router routes
    layout.tsx              # Root layout (fonts, providers, mesh bg)
    page.tsx                # Dashboard (/)
    login/page.tsx          # Login (mock Google OAuth UI)
    content/page.tsx        # Content pipeline placeholder
    calendar/page.tsx       # Calendar placeholder
    analytics/page.tsx      # Analytics placeholder
    profile/page.tsx        # Profile placeholder
    globals.css             # Design tokens + glass utilities
  components/
    brand/eksyar-logo.tsx   # Monogram SVG (placeholder)
    navigation/bottom-dock.tsx  # Floating tab bar
    providers/              # Theme + Lenis providers
    ui/                     # Glass card, button, theme toggle, placeholder page
  lib/
    utils.ts                # cn() helper
```

## License

Internal use, Humas Eksyar UIN SGD.
