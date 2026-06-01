// Politika Önerisi Motoru — il verisinden otomatik öneri üretir
// Katman 1: Veriden çıkarılan tespit (zayıf gösterge, trend, grade gap) — gerçek veri
// Katman 2: Eylem şablonları — şimdilik lorem ipsum, sonra uzman tablosuyla doldurulacak

import { CATEGORY_COLORS } from '../brand';

const SUBINDEX_LABELS = {
    sectoral:    'Sektörel Yapı',
    rnd:         'Araştırma ve Yenilikçilik',
    digital:     'Dijital Altyapı',
    techOutput:  'Teknoloji Çıktıları',
    lifeQuality: 'Yaşam Kalitesi',
};

const GRADE_ORDER = ['FF', 'DD', 'DC', 'CC', 'CB', 'BB', 'BA', 'AA'];

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.';

function nextGradeUp(grade) {
    const idx = GRADE_ORDER.indexOf(grade);
    if (idx < 0 || idx >= GRADE_ORDER.length - 1) return null;
    return GRADE_ORDER[idx + 1];
}

function analyzeProvince(province, allProvinces) {
    if (!province) return null;

    const subIds = ['sectoral', 'rnd', 'digital', 'techOutput', 'lifeQuality'];

    // Türkiye ortalaması (alt endeks bazında)
    const trAvg = {};
    subIds.forEach(id => {
        const sum = allProvinces.reduce((acc, p) => acc + (p.scores?.[id] || 0), 0);
        trAvg[id] = sum / allProvinces.length;
    });

    // Alt endeks sapmaları + sıralama
    const subAnalysis = subIds.map(id => {
        const score = province.scores?.[id] || 0;
        const deviation = score - trAvg[id];
        const sorted = [...allProvinces].sort((a, b) => (b.scores?.[id] || 0) - (a.scores?.[id] || 0));
        const rank = sorted.findIndex(p => p.id === province.id) + 1;
        return { id, label: SUBINDEX_LABELS[id], score, deviation, rank, total: allProvinces.length };
    });

    // En zayıf alt endeks
    const weakestSubIndex = [...subAnalysis].sort((a, b) => a.deviation - b.deviation)[0];
    // En güçlü alt endeks
    const strongestSubIndex = [...subAnalysis].sort((a, b) => b.deviation - a.deviation)[0];

    // Kötüleşen trend (son yıl, önceki yıl karşılaştırması)
    const decliningSubIndices = subIds
        .filter(id => {
            const curr = province.scores?.[id] || 0;
            const prev = province.prevScores?.[id] || 0;
            return curr < prev - 0.5;
        })
        .map(id => ({ id, label: SUBINDEX_LABELS[id] }));

    // Bir üst grade'e yükselme için gereken puan farkı (kabaca)
    const nextGrade = nextGradeUp(province.grade);
    const sameOrBetterGradeProvinces = allProvinces.filter(p =>
        GRADE_ORDER.indexOf(p.grade) > GRADE_ORDER.indexOf(province.grade)
    );
    const gradeGap = sameOrBetterGradeProvinces.length > 0
        ? Math.min(...sameOrBetterGradeProvinces.map(p => p.scores.overall)) - province.scores.overall
        : 0;

    return {
        weakestSubIndex,
        strongestSubIndex,
        decliningSubIndices,
        nextGrade,
        gradeGap: Math.max(0, gradeGap),
        subAnalysis,
        trAvg,
    };
}

// Öneri üretici — analiz çıkarımlarını politika önerilerine çevirir
export function generatePolicyRecommendations(province, allProvinces) {
    const analysis = analyzeProvince(province, allProvinces);
    if (!analysis) return { kisaVade: [], ortaVade: [], uzunVade: [], analysis: null };

    const kisaVade = [];
    const ortaVade = [];
    const uzunVade = [];

    // Kısa vade: en zayıf alt endeks için hızlı eylem
    if (analysis.weakestSubIndex && analysis.weakestSubIndex.deviation < 0) {
        kisaVade.push({
            title: `${analysis.weakestSubIndex.label} alanında müdahale planı`,
            subIndex: analysis.weakestSubIndex.id,
            color: CATEGORY_COLORS[analysis.weakestSubIndex.id],
            rationale: `Bu alt endekste Türkiye ortalamasının ${Math.abs(analysis.weakestSubIndex.deviation).toFixed(1)} puan altında, 81 il arasında ${analysis.weakestSubIndex.rank}. sıradasınız.`,
            action: LOREM,
            impact: `${analysis.weakestSubIndex.label} sıralamasında +${Math.min(15, analysis.weakestSubIndex.total - analysis.weakestSubIndex.rank)} basamak yükselme potansiyeli.`,
        });
    }

    // Kısa vade: kötüleşen trendler için
    analysis.decliningSubIndices.slice(0, 2).forEach(sub => {
        kisaVade.push({
            title: `${sub.label} alanında düşüşü durdur`,
            subIndex: sub.id,
            color: CATEGORY_COLORS[sub.id],
            rationale: `Bu alt endekste son yıl puanınız geriledi. Acil müdahale gerekiyor.`,
            action: LOREM,
            impact: 'Trend tersine çevrilirse mevcut sıralama korunabilir.',
        });
    });

    // Orta vade: güçlü alanı kaldıraç olarak kullan
    if (analysis.strongestSubIndex && analysis.strongestSubIndex.deviation > 0) {
        ortaVade.push({
            title: `${analysis.strongestSubIndex.label} avantajını koruyup büyüt`,
            subIndex: analysis.strongestSubIndex.id,
            color: CATEGORY_COLORS[analysis.strongestSubIndex.id],
            rationale: `Bu alanda Türkiye ortalamasının +${analysis.strongestSubIndex.deviation.toFixed(1)} puan üzerinde, ${analysis.strongestSubIndex.rank}. sıradasınız.`,
            action: LOREM,
            impact: 'Mevcut konumun korunması ve diğer alt endekslere taşıma fırsatı.',
        });
    }

    // Orta vade: ikinci en zayıf alt endeks
    const secondWeakest = [...analysis.subAnalysis].sort((a, b) => a.deviation - b.deviation)[1];
    if (secondWeakest && secondWeakest.deviation < 0) {
        ortaVade.push({
            title: `${secondWeakest.label} alanında yapısal iyileştirme`,
            subIndex: secondWeakest.id,
            color: CATEGORY_COLORS[secondWeakest.id],
            rationale: `Türkiye ortalamasının ${Math.abs(secondWeakest.deviation).toFixed(1)} puan altında. Orta vadeli stratejiyle kapatılabilir.`,
            action: LOREM,
            impact: 'Genel puanda 1.5-3 puanlık iyileşme öngörüsü.',
        });
    }

    // Uzun vade: grade yükseltme stratejisi
    if (analysis.nextGrade && analysis.gradeGap > 0) {
        uzunVade.push({
            title: `${province.grade} → ${analysis.nextGrade} notuna yükselme stratejisi`,
            subIndex: null,
            color: '#F68B1F',
            rationale: `Bir üst grade'e geçmek için ${analysis.gradeGap.toFixed(1)} puanlık iyileşme gerekiyor.`,
            action: LOREM,
            impact: `${analysis.nextGrade} notu, "${gradeLabel(analysis.nextGrade)}" iller arasına katılma.`,
        });
    }

    // Uzun vade: ekosistem dönüşümü
    uzunVade.push({
        title: 'Bölgesel teknoloji ekosistemi vizyonu',
        subIndex: null,
        color: '#114B95',
        rationale: 'Üniversite-sanayi-kamu işbirliği ekseninde uzun vadeli yapısal dönüşüm.',
        action: LOREM,
        impact: '10 yıllık ufukta sıralamada kalıcı yükselme.',
    });

    return { kisaVade, ortaVade, uzunVade, analysis };
}

function gradeLabel(grade) {
    const labels = {
        AA: 'Öncü', BA: 'Güçlü', BB: 'Dengeli', CB: 'Orta',
        CC: 'Gelişen', DC: 'Yükselen', DD: 'Zayıf', FF: 'Kritik',
    };
    return labels[grade] || '';
}
