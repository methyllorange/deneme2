// ASO-İLTEK Brand Tokens (JS)
// CSS variables (globals.css) UI'da; bu modül Recharts ve inline style için.
// Renkler colors_and_type.css'ten: ASO 2025 PDF'inden extract edilmiş.

export const BRAND = {
    blue:       '#114B95',   // ASO Mavi (primary, PDF count: 204)
    blueDeep:   '#292562',   // ASO İndigo (chapter heads, PDF count: 76)
    teal:       '#1394B9',   // ASO Turkuaz (PDF count: 112)
    orange:     '#F68B1F',   // ASO Turuncu (PDF count: 73)
    lavender:   '#9B92C6',   // Data-viz lavanta (PDF count: 40)
    green:      '#019963',   // Brand success
    coral:      '#D7604D',   // Warm red-orange
    red:        '#B1172B',   // Brand danger

    // Chart chrome: dark theme uyumlu, brand-dışı kasıtlı
    chartGrid:          '#334155',
    chartTickPrimary:   '#e2e8f0',
    chartTickMuted:     '#94a3b8',
    chartTickSubtle:    '#64748b',
    chartTooltipBg:     '#1e293b',
    chartTooltipBorder: '#334155',
};

// Grade ramp: AA→FF (8 kademe, methodology GRADES ile birebir senkron)
// Tailwind tabanlı parlak palet (mavi → amber → red)
export const GRADE_COLORS = {
    AA: '#3b82f6',  // blue-500 (lider)
    BA: '#60a5fa',  // blue-400
    BB: '#93c5fd',  // blue-300
    CB: '#fcd34d',  // amber-300
    CC: '#fbbf24',  // amber-400
    DC: '#f59e0b',  // amber-500
    DD: '#d97706',  // amber-600
    FF: '#ef4444',  // red-500 (son sıra)
};

// Kategori-bazlı tek-hue gradyan skalalar (AA orta-koyu vibrant → FF açık pastel)
// Koyu arka plan üstünde okunabilirlik için en koyu ton Tailwind 700 seviyesinde.
export const CATEGORY_GRADE_COLORS = {
    sectoral: {   // Turuncu: vibrant turuncu → krem
        AA: '#C2410C', BA: '#EA580C', BB: '#F97316', CB: '#FB923C',
        CC: '#FDBA74', DC: '#FED7AA', DD: '#FFEDD5', FF: '#FFF7ED',
    },
    rnd: {        // Mavi: kraliyet mavisi → buz
        AA: '#1E40AF', BA: '#2563EB', BB: '#3B82F6', CB: '#60A5FA',
        CC: '#93C5FD', DC: '#BFDBFE', DD: '#DBEAFE', FF: '#EFF6FF',
    },
    digital: {    // Turkuaz: teal → açık camgöbeği
        AA: '#0F766E', BA: '#0E7490', BB: '#0891B2', CB: '#06B6D4',
        CC: '#22D3EE', DC: '#67E8F9', DD: '#A5F3FC', FF: '#CFFAFE',
    },
    techOutput: { // Mor: indigo → açık eflatun
        AA: '#4338CA', BA: '#4F46E5', BB: '#6366F1', CB: '#818CF8',
        CC: '#A78BFA', DC: '#C4B5FD', DD: '#DDD6FE', FF: '#EDE9FE',
    },
    lifeQuality: {// Yeşil: emerald → mint
        AA: '#047857', BA: '#059669', BB: '#10B981', CB: '#34D399',
        CC: '#6EE7B7', DC: '#A7F3D0', DD: '#D1FAE5', FF: '#ECFDF5',
    },
};

// Karşılaştırma serisi (max 5 il)
export const COMPARE_PALETTE = [
    BRAND.blue,     // 1. il: ASO Mavi
    BRAND.orange,   // 2. il: ASO Turuncu (yüksek kontrast)
    BRAND.teal,     // 3. il: Turkuaz
    BRAND.lavender, // 4. il: Lavanta
    BRAND.green,    // 5. il: Yeşil
];

// Kategori renkleri
export const CATEGORY_COLORS = {
    sectoral:    BRAND.orange,    // Sektörel Yapı
    rnd:         BRAND.blue,      // Ar-Ge ve Yenilikçilik
    digital:     BRAND.teal,      // Dijital Altyapı
    techOutput:  BRAND.lavender,  // Teknoloji Çıktıları
    lifeQuality: BRAND.green,     // Yaşam Kalitesi
};

// Semantic up/down (brand-aligned, dark-tema kontrastlı)
export const SEMANTIC = {
    up:   BRAND.green,  // #019963
    down: BRAND.red,    // #B1172B
};
