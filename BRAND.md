# MPFL Broadcast Graphics Brand Spec

Single-source brand reference for the MPFL broadcast graphics package (scorebug, lower-thirds, stat cards, line-ups, transitions, end boards). Every value here is extracted from the live `mpfl.my` site (`mpfl-master`) so on-air graphics match the digital product exactly.

Full name: **Malaysia Premier Futsal League**. Abbreviate as **MPFL** only. The official league of FAM. Domain: `mpfl.my`.

Sources: `app/globals.css`, `app/layout.jsx`, `lib/data.js` (`MPFL_COLORS`, club records), component inline styles across `components/`, and `BRAND.md`.

---

## 1. Logos and marks

All marks live in `/assets`. Use the PNGs unless an SVG exists.

| File | Pixels | Use |
|---|---|---|
| `mpfl-logo.png` | 695 x 695 | Primary square mark. Header logo on site (renders 42 to 66px tall). |
| `mpfl-badge.png` | 673 x 669 | Crest / badge form. Favicon and tight spaces. |
| `mpfl-stacked.png` | 678 x 1011 | Vertical lockup. Open Graph / social share image. Use for end boards and full-frame bumpers. |
| `mpfl-horizontal.png` | 1831 x 669 | Horizontal lockup. Best for lower-third left blocks and broadcast straps. |
| `MPFL-YouTube-Strap.png` | 760 x 108 | Ready-made horizontal strap, YouTube proportion. |

Governing body and partner marks (both colourways where supplied): `fam-crest.png`, `fam-crest-white.png`, `fam-crest-black.png`; production partner `strive-logo.png`, `strive-logo-white.png`; partners `joma-logo.svg`, `courtsite-logo.png`, `jobstreet-logo-white.png`, `zus-coffee-logo-white.png`, `anytime-fitness-logo.png`, `education-partner-logo.svg`.

**Clear space:** keep a margin of at least the height of the "M" around any lockup. Never crowd the mark with stats or scores.

**On dark vs light:** the site is light-first (page `#FAFAFA`). Broadcast graphics over footage are dark-first, so default to the white/reversed marks (`-white.png`) on dark scorebug backplates, and the standard marks on light cards.

---

## 2. Colour

The site runs a **neutral dark + single gold accent** system (decided for the MPFL audience), not the navy/violet brand palette. Use the neutral system as the primary on-air look. Reserve the midnight/violet "brand palette" for stings, bumpers and title cards where a richer brand moment is wanted.

### 2.1 Primary on-air system (use this by default)

**Dark ladder** (backplates, scorebug, lower-thirds over footage), four steps, never pure-flat:

| Role | Hex |
|---|---|
| Base | `#000000` |
| Deep section | `#0A0A0A` |
| Surface / cards | `#111111` |
| Raised / borders | `#1A1A1A` |

**Light surfaces** (stat cards, full-frame light graphics):

| Role | Hex |
|---|---|
| Page | `#FAFAFA` |
| Cards | `#FFFFFF` |
| Fills | `#F4F4F4` |
| Lines | `#E8E8E8` |

**Text / neutrals** (from `MPFL_COLORS`):

| Token | Hex | Use |
|---|---|---|
| Black (text) | `#111111` | Body text on light. The site's true "black". |
| Dark gray | `#333333` | Secondary text on light. |
| Mid gray | `#777777` | Muted labels, captions. |
| Light gray | `#E8E8E8` | Hairlines, dividers. |
| Border gray | `#E0E0E0` | Card borders on light. |
| Paper | `#E8E6DE` | Bone/off-white text on dark backplates. |
| White | `#FFFFFF` | Reversed text, crests. |

### 2.2 The accent: League Gold

| Token | Hex | Use |
|---|---|---|
| **Gold** | `#B8923A` | The single accent. Score, podium, CTA, live state, focus ring, hover. |
| Gold deep | `#8E7028` | Pressed / hover-dark / gold-on-gold shadow. |

**Gold is the moment.** It marks the score, the podium, the call to action, never decoration. If everything is gold, nothing is. The retired old gold `#C8A84E` must not appear. Selection highlight and the 2px keyboard focus ring are both gold.

### 2.3 Functional / status colours

| Token | Hex | Use |
|---|---|---|
| Live / win green | `#00C853` | LIVE dot, positive deltas. |
| Caution yellow | `#E6A817` | Warnings, draw/neutral. |

The LIVE indicator pulses (opacity 1 to 0.3, 1.2s). Carry that pulse into the broadcast live bug.

### 2.4 Brand palette (stings, title cards, bumpers only)

FAM visual language: midnight depth, electric violet motion, gold as the medal moment. Midnight first, never pure black; depth from layered navy with a violet bloom.

| Token | Hex |
|---|---|
| Ink | `#02060F` |
| Midnight | `#060C1E` |
| Midnight 2 | `#0D1633` |
| Violet | `#2E1F66` |
| Violet glow | `#4A3590` |
| Gold | `#B8923A` |
| Paper | `#E8E6DE` |

### 2.5 Club colours (for team-specific graphics, lower-thirds, line-ups)

From `lib/data.js`. `color` is the primary; `colorDark` the deep/secondary.

| Code | Club | Primary | Dark |
|---|---|---|---|
| JDT | Johor Darul Ta'zim | `#E2D505` | `#1A1464` |
| SEL | Selangor FC | `#DD1E35` | `#DD1E35` |
| PAH | Pahang Rangers | `#1B5E20` | `#1B5E20` |
| KLC | Kuala Lumpur City | `#7B1FA2` | `#7B1FA2` |
| PFA | PFA Odin Sarawak | `#1565C0` | `#0D47A1` |
| USM | USM FC | `#6A1B9A` | `#4A148C` |
| TRG | Terengganu | `#FFFFFF` | `#0A0A0A` |
| ATM | ATM | `#2E7D32` | `#1B5E20` |
| WIP | Wipers | `#E65100` | `#BF360C` |

Crests: `/assets/<code-lowercase>-crest.png` (e.g. `jdt-crest.png`). SVG crests exist for JDT, SEL, TRG. TRG is white-on-dark, so render it on a dark chip.

---

## 3. Typography

Two families only. No system fonts, no Arial. Never set a headline in Inter.

### 3.1 Families and loading

- **Display: Barlow Condensed** — italic, weights 800 to 900, UPPERCASE, tight tracking. Display only.
- **Body: Inter** — weights 400 to 700.

Loaded from Google Fonts (`app/layout.jsx`):
```
Barlow Condensed: ital,wght@0,600;0,700;0,800;0,900;1,600;1,700;1,800;1,900
Inter: wght@400;500;600;700
```
CSS body fallback stack: `'Inter', -apple-system, sans-serif`.

For broadcast/Premiere/After Effects, install **Barlow Condensed** (600/700/800/900 + matching Italics) and **Inter** (400/500/600/700) locally.

### 3.2 Display style (the headline DNA)

This is the signature look. Mirror it exactly on titles, score numbers, team names, big stats.

```
font-family: Barlow Condensed
font-style:  italic            (the slant is core to the brand; 114 italic uses on site)
font-weight: 900  (hero / score)   |  800 (section titles, CTAs)
text-transform: uppercase
letter-spacing: -0.02em (900 hero)  |  -0.01em (800 titles)
line-height: 0.92 (hero)  |  1.0 (titles)
color: #111 on light, #FAFAFA / #E8E6DE on dark
```

Headlines are **negatively tracked** (tight). Small labels are **positively tracked** (wide) — see 3.5.

### 3.3 Body style

```
font-family: Inter
font-weight: 400 body, 500/600 emphasis, 700 strong
text-transform: none
line-height: ~1.5 for paragraphs
color: #111 on light, #E8E6DE / #FFFFFF on dark
```

Tables use `font-variant-numeric: tabular-nums` (lock this on any on-screen number column so digits do not jitter).

### 3.4 Type scale (measured from the live site, px)

Display sizes are fluid on web (`clamp(min, vw, max)`); the **max** is the desktop/broadcast target. At 1080p, CSS px ≈ broadcast px, so these translate directly. Scale display up for full-frame title cards.

**Display tier — Barlow Condensed, italic, 800 to 900, uppercase:**

| Role | Site clamp (min, vw, max) | Broadcast target |
|---|---|---|
| Hero / full-frame title | `clamp(64px, 9vw, 132px)` | 120 to 160px (scale up for end boards) |
| Big number / score | `clamp(56px, 14vw, 126px)` | 100 to 140px |
| Page title | `clamp(44px, 12vw, 112px)` | 84 to 112px |
| Section title | `clamp(40px, 11vw, 96px)` | 64 to 96px |
| Sub-section | `clamp(34px, 8vw, 64px)` | 44 to 64px |
| Card heading | `clamp(28px, 6vw, 48px)` | 36 to 48px |

**Functional tier — used across UI (numeric `fontSize`, px), most-used first:**

| px | Typical role |
|---|---|
| 11 | Eyebrows, micro-labels, captions (most common) |
| 12 / 13 | Small labels, table cells, metadata |
| 14 | Default UI text, nav, body-small |
| 15 / 16 | CTA text (15), lead body (16) |
| 18 to 22 | Card titles, sub-heads, standings names |
| 24 to 36 | Small display, stat figures, module headers |
| 40 to 88 | Display set in px (heroes, big scores) |

Positions/scores often scale by rank (e.g. `pos === 1 ? 32 : 26`); top-ranked rows are larger. Carry that into leaderboard graphics: the leader's row is the largest.

### 3.5 Letter-spacing scale

Headlines tighten; labels widen. Common values on site:

| Tracking | Use |
|---|---|
| `-0.02em` to `-0.01em` | Display headlines (Barlow, the tighter the bigger) |
| `0.04em` | CTA buttons |
| `0.06em` to `0.08em` | Standard uppercase labels / nav |
| `0.1em` to `0.14em` | Eyebrows, section kickers (most common label tracking) |
| `0.16em` to `0.28em` | Wide spaced micro-labels, dividers |

Rule of thumb for broadcast: any small UPPERCASE Inter label gets `0.1em`+; any large Barlow headline gets negative tracking.

---

## 4. Geometry and treatment

- **Corners:** Buttons and primary CTAs are **sharp (radius 0)**. Cards/chips use a small **6px** radius (occasionally 4px). Avatars/crests and dots are circular (`50%`). Pills use `999`. Keep the look square and disciplined, not rounded.
- **Buttons (the "nike-cta" system):**
  - Solid: bg `#111`, text `#FAFAFA`, hover bg gold `#B8923A` + text `#111`.
  - Outline: transparent, 2px `#111` border, hover inverts to solid dark.
  - Dark: bg `#000`, text `#FAFAFA`, hover gold.
  - All: Barlow Condensed, 800, italic, uppercase, `0.04em`, padding ~14px 32px, radius 0, 15px.
- **Links:** Inter 12px, 600, uppercase, `0.06em`, gold underline that wipes in on hover.
- **Photography treatment:** photos sit **desaturated and dimmed** by default and brighten/zoom on focus (poster cards `grayscale(0.5) brightness(0.5)`; galleries `grayscale(0.35) brightness(0.72)`; squad portraits full grayscale until active). For broadcast, treat stills the same: graded-down monochrome base, full colour as the "active" reveal.
- **Edge vignette:** scrolling strips fade at both edges via a linear-gradient mask (transparent to solid at 5% and 95%). Good model for ticker/strap edges.

---

## 5. Motion

Discipline for the speed of futsal: small graphics, fast cuts, no decoration. Site easing and timings to reuse:

- Signature easing: `cubic-bezier(0.16, 0.84, 0.44, 1)` (fast-out, soft-settle).
- Reveal: fade-up 16px over 0.5 to 0.6s.
- Hover lift: translateY(-4px), 0.18s.
- Photo brighten: 0.45s; photo zoom: 0.6 to 0.7s.
- LIVE dot: opacity pulse 1 to 0.3, 1.2s infinite.
- Ticker: linear scroll, pauses on hover; gallery marquee 90s linear.

Keep transitions quick and clean. The brand reads as sharp, not flashy.

---

## 6. Applying it to the scorebug / lower-thirds (recommendation)

Derived from the system above, for a consistent on-air package:

- **Backplate:** dark ladder `#0A0A0A`/`#111` with `#1A1A1A` hairline borders, slight elevation, never pure-flat. Reversed (white/`#E8E6DE`) text.
- **Team names / score:** Barlow Condensed 900 italic uppercase, negative tracking, tabular-nums on the score. Score is the gold moment; outline or fill the leading/changed number in `#B8923A`.
- **Club identity:** crest from `/assets/<code>-crest.png`, club primary colour as a thin accent bar; use `colorDark` for the chip behind a light crest (TRG especially).
- **Period / clock / labels:** Inter 600 uppercase, 11 to 14px equivalent, `0.1em` tracking, `#777` muted or `#E8E6DE`.
- **LIVE bug:** green `#00C853` dot with the 1.2s pulse + "LIVE" in wide-tracked Inter.
- **Lower-third name strap:** use `mpfl-horizontal.png` or the YouTube strap on the dark plate; name in Barlow 800 italic, role/club in Inter 600 uppercase gold or paper.
- **Stat / end cards:** can flip to the light surface (`#FFFFFF` card on `#FAFAFA`) with `#111` Barlow headings and gold figures, matching the site's full-frame look.

---

## 7. Voice (for on-screen copy)

"Write like the game is on." Short sentences, active verbs, numbers, names, places. No clichés about the beautiful game.

We are: sharp (not loud), modern (not trendy), local (not provincial), direct (not blunt), confident (not arrogant).

Bilingual: **English and Bahasa Malaysia are equals**, not translations of each other. Never machine-translate. Bahasa Malaysia is standard Malaysian (baku), not Indonesian. Futsal terms: gol, jaringan, perlawanan, babak / separuh masa, kemenangan, kekalahan, seri, litar/sirkit (circuit).

---

## 8. Hard rules

- **No em dashes anywhere.** Use commas, colons or full stops. En dashes are allowed only for scores and date ranges (2-2, 16-17 May).
- **British English** spelling.
- **Never set a headline in Inter**; no system fonts, no Arial.
- **Gold is never decoration** — score, podium, CTA and live state only. Retired gold `#C8A84E` must not appear.
- Midnight/violet is for brand collateral and stings, not the default on-air background; default to the neutral dark ladder.
- Domain on everything: `mpfl.my`. Full name once, then "MPFL". Not "Malaysian", not "Premier Futsal Malaysia".
- Never translate player names, club names or venues; keep them identical in both languages.
