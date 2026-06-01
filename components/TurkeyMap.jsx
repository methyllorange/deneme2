'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { turkeyPaths, VIEWBOX } from '../lib/data/turkeyPaths';
import { useData } from '../lib/DataContext';
import { mapScoreToColor, getGrade } from '../lib/data/mockData';
import { BRAND } from '../lib/brand';

function readableTextColor(hex) {
    if (!hex) return '#fff';
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#0B1120' : '#ffffff';
}

const TurkeyMap = ({ activeIndex, hoveredGrade = null }) => {
    const { provinces } = useData();
    const router = useRouter();
    const [hoveredId, setHoveredId] = useState(null);
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, name: '', score: 0, grade: '' });
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!selectedProvince) return;
        const onKey = (e) => { if (e.key === 'Escape') setSelectedProvince(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedProvince]);

    const provinceMap = useMemo(() => {
        const map = {};
        provinces.forEach(p => { map[p.id] = p; });
        return map;
    }, [provinces]);

    const handleMouseEnter = (e, pathData) => {
        const prov = provinceMap[pathData.id];
        if (!prov) return;
        const rect = e.currentTarget.closest('svg').getBoundingClientRect();
        setHoveredId(pathData.id);
        setTooltip({
            show: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 60,
            name: prov.name,
            score: prov.scores[activeIndex]?.toFixed(1) || '-',
            grade: prov.grade,
            rank: prov.rankCurrent,
        });
    };

    const handleMouseMove = (e) => {
        if (!tooltip.show) return;
        const rect = e.currentTarget.closest('svg').getBoundingClientRect();
        setTooltip(prev => ({
            ...prev,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top - 60,
        }));
    };

    const handleMouseLeave = () => {
        setHoveredId(null);
        setTooltip({ show: false, x: 0, y: 0, name: '', score: 0, grade: '' });
    };

    const handleClick = (e, pathData) => {
        const prov = provinceMap[pathData.id];
        if (!prov) return;
        const rect = e.currentTarget.closest('svg').getBoundingClientRect();
        setPopupPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
        setSelectedProvince(prov);
        setTooltip({ show: false, x: 0, y: 0, name: '', score: 0, grade: '' });
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
                viewBox={VIEWBOX}
                preserveAspectRatio="xMidYMid meet"
                style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%', overflow: 'visible' }}
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    <filter id="province-glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {turkeyPaths.map(pathData => {
                    const prov = provinceMap[pathData.id];
                    const score = prov?.scores?.[activeIndex];
                    const grade = (activeIndex === 'overall' || score == null)
                        ? (prov?.grade || 'DD')
                        : getGrade(score);
                    const baseColor = mapScoreToColor(grade, activeIndex === 'overall' ? null : activeIndex);
                    const isHovered = hoveredId === pathData.id;
                    const gradeMatches = hoveredGrade && hoveredGrade === grade;
                    const dimByGrade = hoveredGrade && hoveredGrade !== grade;
                    const dimByHover = hoveredId && !isHovered;
                    let opacity = 0.92;
                    if (isHovered || gradeMatches) opacity = 1;
                    else if (dimByGrade) opacity = 0.3;
                    else if (dimByHover) opacity = 0.6;

                    return (
                        <path
                            key={pathData.id}
                            d={pathData.d}
                            fill={baseColor}
                            fillOpacity={opacity}
                            stroke="#ffffff"
                            strokeWidth={isHovered ? 1.6 : 0.9}
                            style={{
                                cursor: 'pointer',
                                transition: 'fill-opacity 0.18s, stroke 0.15s, stroke-width 0.15s',
                                filter: (isHovered || gradeMatches) ? 'url(#province-glow)' : 'none',
                            }}
                            onMouseEnter={(e) => handleMouseEnter(e, pathData)}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            onClick={(e) => handleClick(e, pathData)}
                        />
                    );
                })}
            </svg>

            {tooltip.show && (
                <div
                    style={{
                        position: 'absolute',
                        left: tooltip.x,
                        top: tooltip.y,
                        transform: 'translateX(-50%)',
                        background: 'rgba(15, 23, 42, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '12px',
                        padding: '10px 16px',
                        pointerEvents: 'none',
                        zIndex: 100,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '14px' }}>{tooltip.name}</span>
                        <span
                            style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: `${mapScoreToColor(tooltip.grade)}30`,
                                color: mapScoreToColor(tooltip.grade),
                            }}
                        >
                            {tooltip.grade}
                        </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'flex', gap: '12px' }}>
                        <span>Puan: <strong style={{ color: '#e2e8f0' }}>{tooltip.score}</strong></span>
                        <span>Sıra: <strong style={{ color: '#e2e8f0' }}>#{tooltip.rank}</strong></span>
                    </div>
                </div>
            )}

            {selectedProvince && (
                <>
                    <div
                        onClick={() => setSelectedProvince(null)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(2px)',
                            zIndex: 200,
                            cursor: 'pointer',
                        }}
                    />
                    <div
                        role="dialog"
                        aria-modal="true"
                        style={{
                            position: 'absolute',
                            left: Math.min(Math.max(popupPos.x, 140), 940),
                            top: Math.min(popupPos.y + 12, 540),
                            transform: 'translateX(-50%)',
                            minWidth: 280,
                            background: 'rgba(13,24,40,0.98)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            borderRadius: 14,
                            padding: 16,
                            zIndex: 210,
                            boxShadow: '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(246,139,31,0.08)',
                            color: '#fff',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setSelectedProvince(null)}
                            aria-label="Kapat"
                            style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                width: 24,
                                height: 24,
                                borderRadius: 6,
                                background: 'transparent',
                                border: 'none',
                                color: 'rgba(255,255,255,0.55)',
                                cursor: 'pointer',
                                fontSize: 18,
                                lineHeight: 1,
                            }}
                        >
                            ×
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <span style={{ fontWeight: 800, fontSize: 16 }}>{selectedProvince.name}</span>
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: 4,
                                fontSize: 11,
                                fontWeight: 800,
                                background: `${mapScoreToColor(selectedProvince.grade)}30`,
                                color: mapScoreToColor(selectedProvince.grade),
                            }}>
                                {selectedProvince.grade}
                            </span>
                        </div>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            gap: 8,
                            marginBottom: 14,
                            padding: '10px 12px',
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: 8,
                        }}>
                            <div>
                                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Puan</div>
                                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>
                                    {selectedProvince.scores[activeIndex]?.toFixed(1) || '-'}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>Sıralama</div>
                                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 2 }}>
                                    #{selectedProvince.rankCurrent} <span style={{ fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>/ 81</span>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button
                                type="button"
                                onClick={() => router.push(`/province/${selectedProvince.id}`)}
                                style={popupBtnStyle('primary')}
                            >
                                İl Sayfası
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push(`/indir`)}
                                style={popupBtnStyle()}
                            >
                                İl Raporu
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push(`/compare?ids=${selectedProvince.id}`)}
                                style={popupBtnStyle()}
                            >
                                Karşılaştır
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

function popupBtnStyle(variant) {
    const isPrimary = variant === 'primary';
    return {
        display: 'block',
        width: '100%',
        padding: '9px 14px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 700,
        textAlign: 'center',
        border: '1px solid',
        borderColor: isPrimary ? 'rgba(246,139,31,0.5)' : 'rgba(255,255,255,0.10)',
        background: isPrimary ? 'rgba(246,139,31,0.16)' : 'rgba(255,255,255,0.03)',
        color: isPrimary ? '#FFB36A' : '#fff',
        cursor: 'pointer',
        transition: 'background 0.18s ease, border-color 0.18s ease',
    };
}

export default TurkeyMap;
