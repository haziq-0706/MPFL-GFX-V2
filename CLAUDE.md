@AGENTS.md

# MPFL-GFX-V2

Live broadcast graphics system (HTML5 overlays) for **Malaysia Premier Futsal League (MPFL)**.

## Brand reference
@BRAND.md

## Project overview
- `/control` — Operator control room. Triggers overlays, manages match data, adjusts scores.
- `/output` — 1920x1080 transparent HTML5 overlay captured by OBS/vMix/Wirecast. Background must stay transparent.
- Supabase project: `dwlqqvkbbpndebchhsrx` — tables: `matches`, `broadcast_state` (Realtime enabled)
- Must always work offline: service worker (`public/sw.js`) + IndexedDB cache (`lib/offline/db.ts`)
- Deployed on Vercel (TELL team, always public): https://mpfl-gfx-v2.vercel.app
- GitHub: https://github.com/haziq-0706/MPFL-GFX-V2

## Key brand rules (from BRAND.md — do not override)
- Gold: `#B8923A` only. Retired `#C8A84E` and `#E8B000` must never appear.
- Dark backplates: `#0A0A0A` / `#111111` / `#1A1A1A` — never pure flat.
- Display type: **Barlow Condensed**, italic, 800-900, uppercase, negative tracking.
- Body type: **Inter** only. Never use system fonts or Arial.
- Corners: sharp (radius 0) for primary elements; 6px for cards.
- LIVE dot: `#00C853`, opacity pulse 1→0.3 over 1.2s.
- No em dashes. British English. Bilingual EN/BM equals.
- Midnight/violet palette only for stings and bumpers — not default on-air backgrounds.
