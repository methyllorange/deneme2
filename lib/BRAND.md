# ASO-İLTEK Design System

A design system for **Ankara Sanayi Odası** (Ankara Chamber of Industry) and its flagship publication **ASO-İLTEK** — *İllerin Teknolojik Gelişmişlik Endeksi*.

> Bu, ASO ve ASO-İLTEK markası için tasarım sistemidir.

---

## Brand context

**ASO-İLTEK** ranks Türkiye's 81 provinces on technological development across five sub-indices:

1. **Sektörel Yapı** — Sectoral Structure
2. **Araştırma ve Yenilikçilik Kapasitesi** — R&D / Innovation Capacity
3. **Dijital Altyapı** — Digital Infrastructure
4. **Teknoloji Çıktıları** — Technology Outputs
5. **Yaşam Kalitesi ve İş Gücü Çekiciliği** — Quality of Life & Workforce Attractiveness

The 2025 edition added a thematic chapter on **Savunma Sanayii Teknolojileri** (Defense Industry Technologies). Top 10 provinces 2025: Ankara, İstanbul, Eskişehir, Kocaeli, İzmir, Kayseri, Bursa, Sakarya, Tekirdağ, Antalya. Chairman: **Seyit Ardıç**.

---

## Sources

- `uploads/aso-ilktek-2025.pdf` — the 2025 report (103 pages, Turkish, ISBN 978-625-390-045-8). **Brand colours below are extracted directly from this PDF's operator stream** across 20+ sampled pages.
- https://www.aso.org.tr/ — corporate site
- Related sub-brands referenced in the report: ASO Teknopark, ASO METES, ASO Model Fabrika, ASOTAUM, ASO Okulları, TOBB (parent body)

---

## Index

| Path | What |
|---|---|
| `README.md` | This file. |
| `SKILL.md` | Agent-skill manifest. |
| `colors_and_type.css` | All design tokens — CSS variables for colours, type, spacing, radii, shadows. |
| `assets/` | Logo placeholders, marks, rule SVG. |
| `preview/` | Atomic specimen cards — feed the Design System tab. |
| `slides/` | Slide templates using the brand chrome. |

There is **no website / UI kit** in this folder — it's a pure design system.

---

## CONTENT FUNDAMENTALS

**Language.** Turkish first. Preserve diacritics — İ, ı, ğ, ş, ç, ö, ü — never substitute ASCII.

**Tone.** Analytical, institutional, third-person. The report reads like an OECD/WIPO publication translated into Turkish: academic but accessible to policymakers and industrialists. Author voice: "biz" (we, ASO) for institutional action; impersonal third-person ("değerlendirilmektedir") for analysis. Recommendations end in *—malıdır / —edilmelidir*, never imperative "Yapın".

**Capitalization.**
- Headings: Turkish title case ("İllerin Teknolojik Gelişmişlik Endeksi").
- Acronyms ALL CAPS, always: ASO, ASO-İLTEK, OECD, WIPO, GSYH, Ar-Ge, KOBİ, TÜBİTAK, TÜİK, YZ.
- Eyebrow labels: UPPERCASE with wide tracking.

**Numbers (Turkish convention).**
- Decimals with comma: `0,962`, `%2,9`.
- Thousands with period: `300.000`.
- Percent **before** the number: `%80`.
- Em-dashes for parenthetical clauses: `—ABD, AB ve Çin—`.

**Sentence rhythm.** Long, multi-clause sentences are normal. Don't bulletise unless the source does.

**Emoji & dingbats: never.** ASO is state-aligned and institutional. If you need a flourish (e.g. trend arrows), use Unicode geometric glyphs sparingly — `▲ ▼ ▬`.

---

## VISUAL FOUNDATIONS

### Color vibe — blue-forward research publication
The brand is **blue-forward**: a royal blue + deep indigo + teal trio with a warm orange accent. This is the palette of a serious policy/research publication — OECD, WIPO, World Bank in feel. Lavender, green, and coral fill out the data-viz palette.

All colours below were **extracted from the PDF's actual operator stream** (`pdf.getOperatorList()` across pages 1–103). Counts indicate how many times each colour appears in the document.

**Primary brand**
- **ASO Mavi** (ASO Blue) `#114B95` — 204 occurrences. Primary brand colour, used in titles, charts, headers.
- **Derin İndigo** (Deep Indigo) `#292562` — 76 occurrences. Section heads, chapter numbers, deep text.
- **Turkuaz** (Teal) `#1394B9` — 112 occurrences. Secondary brand, paired with blue in charts and diagrams.
- **Turuncu** (Orange) `#F68B1F` — 73 occurrences. Warm accent for emphasis, calls to action, highlights.

**Data-viz palette**
- **Lavanta** `#9B92C6` — 40 occurrences. Tertiary chart colour.
- **Yeşil** `#019963` — 13 occurrences. Success / positive movement.
- **Mercan** `#D7604D` — 15 occurrences. Warm red-orange for warning.
- **Kırmızı** `#B1172B` — 11 occurrences. Danger / decline.

**Neutrals** (publication grays)
- Body text `#4D4D4F`
- Muted text `#6D6E71`
- Mid gray `#BCBEC0`
- Warm paper gray `#C1BFB7`
- Off-white `#F1F0EF`
- Pure white `#FFFFFF`

The colour system is intentionally narrow at the brand level (4 hues), with the data-viz palette extending it for charts.

### Typography — Myriad Pro

A **single humanist sans** family does the entire system. Hierarchy comes from weight + size, not face mixing.

Stack: `'Myriad Pro', 'Myriad Set Pro', 'Source Sans 3', 'Source Sans Pro', system-ui, sans-serif`

- **Myriad Pro** — proprietary (Adobe Fonts). Used if the team has a kit or self-hosted licence.
- **Source Sans 3** — Adobe-designed open-source font specifically as a Myriad-style alternative. Loaded from Google Fonts as the practical fallback.
- Weights in use: 400 / 500 / 600 / 700 / 800.
- Tabular figures (`font-variant-numeric: tabular-nums lining-nums`) for data tables.

> **Substitution flag**: Myriad Pro is not on Google Fonts. The stack falls through to Source Sans 3, which is the closest free relative. If your team has an Adobe Fonts kit, drop the `<link>` into each entry HTML and Myriad Pro takes over automatically.

### Backgrounds
**Predominantly white** (`#FFFFFF`). Hero sections use deep indigo (`#292562`) or ASO blue (`#114B95`) panels with white text. The orange (`#F68B1F`) appears as **thin top bands** (8–10px) on hero panels and as **rule accents**. No gradients except occasional text-gradient (mavi → turuncu) for hero numerals.

### Cards
- 1px gray border (`#DCDAD3`)
- Optional left-border accent in blue / orange / teal / lavender / indigo (4–6px) to signal sub-index category
- Padding 24px
- Radius 4–8px (publication-feel; not pill-rounded)
- Background white; near-white (`#F8F7F5`) for elevated panels
- Shadow: `0 1px 3px rgba(17,75,149,0.04), 0 4px 16px rgba(17,75,149,0.08)` — soft, blue-tinted

### Buttons
- **Primary**: ASO Blue bg, white text, radius 4px
- **Accent**: ASO Orange bg, white text, radius 4px
- **Secondary**: Teal bg, white text, radius 4px
- **Ghost**: transparent, blue border, blue text
- **Link**: blue text, orange underline (text-decoration-color)
- Press state: `transform: translateY(1px)` over 80ms

### Borders & rules
- **Blue rules** `3px solid #114B95` — section dividers, table headers
- **Orange rules** `3px solid #F68B1F` — accent / highlight dividers
- **Hairline gray** `1px solid #DCDAD3` — table rows, minor separators
- **Composite**: blue stroke with orange segment in the middle — for chapter rules

### Shadows
- `shadow-1`: `0 1px 2px rgba(17,75,149,0.06), 0 1px 3px rgba(17,75,149,0.05)`
- `shadow-2`: `0 2px 4px rgba(17,75,149,0.07), 0 4px 12px rgba(17,75,149,0.06)`
- `shadow-card`: `0 1px 3px rgba(17,75,149,0.04), 0 4px 16px rgba(17,75,149,0.08)`
- `shadow-deep`: `0 8px 32px rgba(41,37,98,0.18)` (indigo glow on hero cards)

### Animation
Sparse. Page transitions 200ms ease-out. Hover 150ms colour shift. Press 80ms 1px translate. Chart entry 600ms ease-out, once. No bounces, no spring, no parallax.

### Corner radii
- 0px — table cells, rules
- 2px — inputs
- 4px — buttons, cards
- 8px — logo tiles
- 12px — hero cards
- 999px (pill) — nav items only

### Imagery treatment
The report uses muted, slightly warm institutional photography (Ankara skyline, factories, defense industry). Treat photo slots with a subtle filter: `sepia(0.05) contrast(1.05) brightness(0.97)`. Never bright/saturated stock.

---

## ICONOGRAPHY

ASO does not ship an icon system. The PDF's icon language is **typographic + heraldic**: chapter numbers, section letters, simple geometric chart icons.

For UI work, use **Phosphor Icons (Regular weight)** from CDN. Phosphor's even stroke matches a humanist sans system without clashing.

- Source: `https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css` (already imported in `colors_and_type.css`)
- Usage: `<i class="ph ph-arrow-right"></i>`
- Stroke weight: regular only; never duotone/bold/fill.

**Emoji**: never used. Use Unicode geometric glyphs (`▲ ▼ ▬ • ‣`) instead when a small flourish is needed.

### Logos and marks

`assets/` contains placeholder marks built on the extracted palette:
- `aso-logo.svg` — full lockup (blue disc + wordmark)
- `aso-mark.svg` — square mark only
- `iltek-mark.svg` — report cover mark
- `badge-aa.svg` — example rating badge
- `rule.svg` — section rule (blue stroke + orange centre segment)

**Drop the real ASO logo SVG into `assets/aso-logo.svg`** to replace.

---

## Caveats — what's still missing

1. **Real ASO logo SVG.** Sandbox couldn't fetch aso.org.tr. Placeholder is a blue disc + lowercase "aso".
2. **Real Myriad Pro font files.** Proprietary. Source Sans 3 is the active fallback. To install, add `<link rel="stylesheet" href="https://use.typekit.net/YOUR-KIT-ID.css">` to each HTML entry.
3. **Photography.** No imagery is shipped — the slides leave hero photo slots as solid indigo panels for the user to fill.
