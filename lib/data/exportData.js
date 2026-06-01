// All-province / all-year data export utilities.
// Wide CSV: 1 row per il × yıl, columns = 6 main + 36 sub-indicators.

import { provincesData, indicators, subIndicatorsInfo } from './mockData';

const EXPORT_YEARS = [2025, 2024, 2023];

function escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (/[",\n\r]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
}

export function buildAllDataCSV() {
    const subCategoryOrder = ['sectoral', 'rnd', 'digital', 'techOutput', 'lifeQuality'];
    const subColumns = subCategoryOrder.flatMap((cat) =>
        subIndicatorsInfo[cat].map((ind) => ({ cat, id: ind.id, name: ind.name }))
    );

    const header = [
        'il_id',
        'il_adi',
        'yil',
        'sira',
        'not',
        ...indicators.map((i) => `${i.id}_skor`),
        ...subColumns.map((c) => `${c.id}_skor`),
    ];

    const lines = [header.join(',')];

    for (const province of provincesData) {
        for (const year of EXPORT_YEARS) {
            const yearData = province.history?.[year];
            if (!yearData) continue;

            const row = [
                province.id,
                province.name,
                year,
                yearData.rank,
                yearData.grade,
                ...indicators.map((i) => round(yearData.scores?.[i.id])),
                ...subColumns.map((c) => {
                    const list = yearData.subMetrics?.[c.cat] || [];
                    const found = list.find((m) => m.id === c.id);
                    return round(found?.score);
                }),
            ];

            lines.push(row.map(escapeCSV).join(','));
        }
    }

    return lines.join('\n');
}

export function buildAllDataJSON() {
    return JSON.stringify(
        {
            generated_at: new Date().toISOString(),
            indicators,
            subIndicatorsInfo,
            provinces: provincesData,
        },
        null,
        2,
    );
}

function round(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) return '';
    return Math.round(value * 10) / 10;
}

export function triggerDownload(filename, content, mimeType = 'text/csv;charset=utf-8') {
    const BOM = mimeType.startsWith('text/csv') ? '﻿' : '';
    const blob = new Blob([BOM + content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadAllDataCSV() {
    const today = new Date().toISOString().slice(0, 10);
    triggerDownload(`aso-iltek-tum-veri-${today}.csv`, buildAllDataCSV());
}
