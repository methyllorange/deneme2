# ASO-İLTEK Web (Next.js)

ASO-İLTEK 2025 — İllerin Teknolojik Gelişmişlik Endeksi web uygulaması.

**Migrated** from Vite + React Router (`../ASO-Internet-Sitesi/`) to **Next.js 15 App Router + SSG export** in S167 (2026-05-20).

## Stack

- **Next.js 15** (App Router, static export)
- **React 19** + JSX
- **Tailwind CSS 3.4**
- **Recharts 3** (Radar, Line, Polar charts)
- **lucide-react** (icons)

## Yapı

```
app/
  layout.jsx            # Root: Inter font + AuthGate + DataProvider + nav Layout
  globals.css           # Migrated from src/index.css
  page.jsx              # Home (harita & sıralama)
  rankings/page.jsx     # Tüm sıralama tablosu
  compare/page.jsx      # 2-5 il radar karşılaştırma
  province/[id]/
    layout.jsx          # generateStaticParams (81 province pre-render)
    page.jsx            # İl detay (radar + trend + scorecard)
components/
  AuthGate.jsx          # localStorage 'site_auth' = 'asosa'
  Layout.jsx            # Top nav (NavItem with usePathname)
  TurkeyMap.jsx         # SVG choropleth with tooltip
lib/
  DataContext.jsx       # Provider (year + province slicer)
  data/
    mockData.js         # 81 provinces, sub-indicators, color mapper
    turkeyPaths.js      # SVG path data
public/
  brand/                # ASO logo + iltek-mark + badge-aa + rule SVGs
  design-system/        # colors_and_type.css (full token reference)
  turkey.svg            # raw Turkey outline
```

## Komutlar

```bash
npm install
npm run dev          # → http://localhost:3000/deneme2/
npm run build        # → out/ static export
```

## Deploy (GitHub Pages)

```bash
npm run build
# out/ dizinini gh-pages branch'ine push
```

`next.config.mjs` `basePath: '/deneme2'` ayarı GitHub Pages alt yolu için.
URL repo root'a taşınırsa `basePath` kaldır.

## Vite → Next.js Eşleme

| Vite | Next.js |
|---|---|
| `useNavigate()` | `useRouter()` from `next/navigation` |
| `useParams()` from react-router | `useParams()` from `next/navigation` |
| `Link to=...` from react-router | `Link href=...` from `next/link` |
| `NavLink` + `useLocation` | `Link` + `usePathname()` (manuel active) |
| `BrowserRouter` `basename="/deneme2"` | `next.config.mjs` `basePath: '/deneme2'` |
| `<Routes><Route />` | file-based `app/.../page.jsx` |
| `src/main.jsx` | `app/layout.jsx` (root html) |
| `index.html` | `app/layout.jsx` (metadata) |
| `index.css` | `app/globals.css` |

## Notlar

- **Auth client-side**: SSR'de localStorage yok, `AuthGate` `useEffect` ile gate açar. SSR'de `checked=false` → null render → hydration sonrası ya login ya panel.
- **Static export**: 81 il pre-render edilir (`generateStaticParams`). Yeni il eklenirse `mockData.js`'ye eklemek build'i otomatik kapsar.
- **Recharts**: client component, "use client" tüm chart kullanan sayfalarda.
- **Vite eski versiyonu**: `../ASO-Internet-Sitesi/` — referans için duruyor.
- **Design system**: `public/design-system/colors_and_type.css` — ASO PDF brand tokens (Mavi `#114B95`, Turuncu `#F68B1F`, Turkuaz `#1394B9` vb.). Şu an dark theme stilini koruyor; brand renkleri accent token'larında. Detaylı uygulama için `../docs/dashboard-referanslar.md`.

## Bağlantılar

- [[../ASO-context.md|ASO Project Context]]
- [[../ASO-progress.md|ASO Progress]]
- [[../docs/dashboard-referanslar.md|Dashboard Referansları]]
- [[../../../memory/MEMORY.md]]
