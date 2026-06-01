'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import TurkeyMap from '../../../components/TurkeyMap';
import { useData } from '../../../lib/DataContext';
import { indicators } from '../../../lib/data/mockData';
import { GRADES } from '../../../lib/data/methodology';
import { CATEGORY_GRADE_COLORS } from '../../../lib/brand';

const LIGHT_GRADE_LETTERS = new Set(['CC', 'DC', 'DD', 'FF']);
function readableTextColor(gradeLetter, isGradient) {
    if (isGradient && LIGHT_GRADE_LETTERS.has(gradeLetter)) return '#0B1120';
    return '#ffffff';
}

const CATEGORY_COLORS = {
    overall:    null,
    sectoral:   '#F68B1F',
    rnd:        '#114B95',
    digital:    '#1394B9',
    techOutput: '#9B92C6',
    lifeQuality:'#019963',
};

export default function HomePage() {
    const { provinces } = useData();
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState('overall');
    const [hoveredGrade, setHoveredGrade] = useState(null);
    const navLockRef = useRef(false);
    const touchStartRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const goRankings = () => {
            if (navLockRef.current) return;
            navLockRef.current = true;
            router.push('/rankings');
        };
        const goCompare = () => {
            if (navLockRef.current) return;
            navLockRef.current = true;
            router.push('/compare');
        };

        const onKey = (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                goCompare();
            }
        };

        let wheelXAccum = 0;
        const onWheel = (e) => {
            if (navLockRef.current) return;
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                wheelXAccum += e.deltaX;
                if (wheelXAccum > 140) {
                    wheelXAccum = 0;
                    e.preventDefault();
                    goCompare();
                } else if (wheelXAccum < 0) {
                    wheelXAccum = 0;
                }
            }
        };

        const onTouchStart = (e) => {
            const t = e.changedTouches[0];
            touchStartRef.current = { x: t.clientX, y: t.clientY };
        };
        const onTouchEnd = (e) => {
            const t = e.changedTouches[0];
            const dx = t.clientX - touchStartRef.current.x;
            const dy = t.clientY - touchStartRef.current.y;
            if (Math.abs(dx) > Math.abs(dy) && dx < -80) {
                goCompare();
            }
        };

        window.addEventListener('keydown', onKey);
        window.addEventListener('wheel', onWheel, { passive: false });
        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('wheel', onWheel);
            window.removeEventListener('touchstart', onTouchStart);
            window.removeEventListener('touchend', onTouchEnd);
        };
    }, [router]);

    return (
        <div style={{
            height: 'calc(100vh - 168px)',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            animation: 'hub-enter 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both',
            willChange: 'opacity, transform',
        }}>
            <style>{`
                @keyframes hub-enter {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes opacityFadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes hint-pulse-flow {
                    0%, 100% { transform: translateY(0); opacity: 0.85; }
                    50%      { transform: translateY(6px); opacity: 1; }
                }
                @keyframes hint-pulse-x-right {
                    0%, 100% { transform: translateY(-50%) translateX(0); opacity: 0.7; }
                    50%      { transform: translateY(-50%) translateX(6px); opacity: 1; }
                }
                .hub-hint-down { animation: hint-pulse-flow 1.8s ease-in-out infinite; }
                .hub-hint-right { animation: hint-pulse-x-right 1.8s ease-in-out infinite; }
                .hub-hint {
                    transition: color 0.18s ease, filter 0.18s ease;
                    cursor: pointer;
                }
                .hub-hint:hover {
                    color: #FFB36A !important;
                    filter: drop-shadow(0 0 10px rgba(246,139,31,0.45));
                }
                .hub-hint-down:hover {
                    color: #93C5FD !important;
                    filter: drop-shadow(0 0 10px rgba(96,165,250,0.5));
                }

                @keyframes blob-drift-a {
                    0%   { transform: translate(-15%, -10%) scale(1);    }
                    33%  { transform: translate(8%, 12%) scale(1.15);    }
                    66%  { transform: translate(-6%, 18%) scale(0.95);   }
                    100% { transform: translate(-15%, -10%) scale(1);    }
                }
                @keyframes blob-drift-b {
                    0%   { transform: translate(20%, 10%) scale(1.1);    }
                    33%  { transform: translate(-10%, -8%) scale(0.95);  }
                    66%  { transform: translate(12%, -14%) scale(1.2);   }
                    100% { transform: translate(20%, 10%) scale(1.1);    }
                }
                @keyframes blob-drift-c {
                    0%   { transform: translate(-25%, 25%) scale(1);     }
                    50%  { transform: translate(20%, -15%) scale(1.18);  }
                    100% { transform: translate(-25%, 25%) scale(1);     }
                }
                @keyframes grid-shimmer {
                    0%, 100% { opacity: 0.10; }
                    50%      { opacity: 0.18; }
                }
                @keyframes spotlight-breathe {
                    0%, 100% { opacity: 0.55; transform: scale(1);    }
                    50%      { opacity: 0.78; transform: scale(1.05); }
                }

                .hub-bg {
                    position: fixed;
                    inset: 0;
                    z-index: 0;
                    overflow: hidden;
                    pointer-events: none;
                }
                @keyframes ken-burns {
                    0%   { transform: scale(1.05) translate(0, 0); }
                    50%  { transform: scale(1.18) translate(-2%, -3%); }
                    100% { transform: scale(1.05) translate(0, 0); }
                }
                .hub-photo {
                    position: absolute;
                    inset: 0;
                    background-image: url('/deneme2/images/dashboard-bg.jpg');
                    background-size: cover;
                    background-position: center;
                    opacity: 0.40;
                    filter: saturate(1.2) contrast(1.05) brightness(0.9);
                    animation: ken-burns 38s ease-in-out infinite;
                    transform-origin: 50% 50%;
                }
                .hub-photo-overlay {
                    position: absolute;
                    inset: 0;
                    background:
                        linear-gradient(180deg, rgba(6,16,29,0.40) 0%, rgba(6,16,29,0.25) 50%, rgba(6,16,29,0.55) 100%),
                        radial-gradient(ellipse at center, rgba(6,16,29,0) 30%, rgba(6,16,29,0.55) 100%);
                    pointer-events: none;
                }
                .hub-blob {
                    position: absolute;
                    width: 640px;
                    height: 640px;
                    border-radius: 50%;
                    filter: blur(60px);
                    mix-blend-mode: screen;
                    opacity: 0.6;
                    will-change: transform;
                }
                .hub-blob-a {
                    top: -10%; left: -10%;
                    background: radial-gradient(circle, rgba(17,75,149,0.95) 0%, rgba(17,75,149,0) 70%);
                    animation: blob-drift-a 22s ease-in-out infinite;
                }
                .hub-blob-b {
                    top: 5%; right: -10%;
                    background: radial-gradient(circle, rgba(246,139,31,0.75) 0%, rgba(246,139,31,0) 70%);
                    animation: blob-drift-b 26s ease-in-out infinite;
                }
                .hub-blob-c {
                    bottom: -20%; left: 25%;
                    background: radial-gradient(circle, rgba(19,148,185,0.55) 0%, rgba(19,148,185,0) 70%);
                    animation: blob-drift-c 30s ease-in-out infinite;
                }
                .hub-grid {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
                    background-size: 56px 56px;
                    mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, #000 30%, transparent 90%);
                    -webkit-mask-image: radial-gradient(ellipse 90% 80% at 50% 50%, #000 30%, transparent 90%);
                    animation: grid-shimmer 8s ease-in-out infinite;
                }
                .hub-spotlight {
                    position: absolute;
                    left: 50%; top: 50%;
                    width: 1100px;
                    height: 720px;
                    transform: translate(-50%, -50%);
                    background: radial-gradient(ellipse at center,
                        rgba(255,255,255,0.06) 0%,
                        rgba(255,255,255,0.03) 30%,
                        rgba(0,0,0,0.0) 60%
                    );
                    animation: spotlight-breathe 9s ease-in-out infinite;
                    pointer-events: none;
                }
                .hub-vignette {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 110% 90% at 50% 50%, transparent 35%, rgba(6,16,29,0.55) 80%, rgba(6,16,29,0.85) 100%);
                    pointer-events: none;
                }
                .hub-content { position: relative; z-index: 1; }
            `}</style>

            <div className="hub-bg" aria-hidden="true">
                <div className="hub-photo" />
                <div className="hub-photo-overlay" />
                <div className="hub-blob hub-blob-a" />
                <div className="hub-blob hub-blob-b" />
                <div className="hub-blob hub-blob-c" />
                <div className="hub-grid" />
                <div className="hub-spotlight" />
                <div className="hub-vignette" />
            </div>

            <div style={{
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                flex: 1,
                minHeight: 0,
                position: 'relative',
                zIndex: 1,
                paddingBottom: 40,
            }}>
                <div className="filter-bar" style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    alignSelf: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    gap: 10,
                    padding: '12px 16px',
                    background: 'rgba(13, 24, 40, 0.55)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    borderRadius: 16,
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}>
                    {indicators.map((ind) => {
                        const color = CATEGORY_COLORS[ind.id];
                        const isActive = activeIndex === ind.id;
                        const baseStyle = { fontSize: 14, fontWeight: 600, padding: '10px 20px', textAlign: 'center', transition: 'background 0.22s ease, color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease' };
                        if (!color) {
                            const navyActive = '#0B2E5C';
                            const overallStyle = isActive
                                ? {
                                    ...baseStyle,
                                    background: navyActive,
                                    color: '#fff',
                                    border: '1px solid transparent',
                                    boxShadow: `0 0 16px ${navyActive}aa, 0 4px 14px ${navyActive}88`,
                                    textShadow: `0 0 10px ${navyActive}cc`,
                                }
                                : {
                                    ...baseStyle,
                                    background: 'transparent',
                                    color: '#fff',
                                    border: '1px solid transparent',
                                    textShadow: 'none',
                                };
                            return (
                                <button
                                    key={ind.id}
                                    type="button"
                                    onClick={() => setActiveIndex(ind.id)}
                                    className="filter-btn"
                                    style={overallStyle}
                                    onMouseOver={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = `${navyActive}26`;
                                            e.currentTarget.style.borderColor = `${navyActive}88`;
                                            e.currentTarget.style.boxShadow = `0 0 14px ${navyActive}77`;
                                            e.currentTarget.style.textShadow = `0 0 10px ${navyActive}cc`;
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.background = 'transparent';
                                            e.currentTarget.style.borderColor = 'transparent';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.textShadow = 'none';
                                        }
                                    }}
                                >
                                    {ind.name}
                                </button>
                            );
                        }
                        const style = isActive
                            ? {
                                ...baseStyle,
                                background: color,
                                color: '#fff',
                                border: '1px solid transparent',
                                boxShadow: `0 0 16px ${color}80, 0 4px 14px ${color}55`,
                                textShadow: `0 0 10px ${color}aa`,
                            }
                            : {
                                ...baseStyle,
                                background: 'transparent',
                                color: '#fff',
                                border: '1px solid transparent',
                                textShadow: 'none',
                            };
                        return (
                            <button
                                key={ind.id}
                                type="button"
                                onClick={() => setActiveIndex(ind.id)}
                                className="filter-btn"
                                style={style}
                                onMouseOver={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = `${color}18`;
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.borderColor = `${color}55`;
                                        e.currentTarget.style.boxShadow = `0 0 14px ${color}55`;
                                        e.currentTarget.style.textShadow = `0 0 10px ${color}aa`;
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.borderColor = 'transparent';
                                        e.currentTarget.style.boxShadow = 'none';
                                        e.currentTarget.style.textShadow = 'none';
                                    }
                                }}
                            >
                                {ind.name}
                            </button>
                        );
                    })}
                </div>

                <div style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    gap: 18,
                    width: '100%',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 7,
                        alignSelf: 'center',
                        flexShrink: 0,
                    }}>
                        {GRADES.map((g) => {
                            const activeRamp = CATEGORY_GRADE_COLORS[activeIndex];
                            const badgeColor = activeRamp ? activeRamp[g.letter] : g.color;
                            const badgeTextColor = readableTextColor(g.letter, !!activeRamp);
                            return (
                            <div
                                key={g.letter}
                                onMouseEnter={() => setHoveredGrade(g.letter)}
                                onMouseLeave={() => setHoveredGrade(null)}
                                style={{
                                    display: 'inline-flex',
                                    gap: 9,
                                    alignItems: 'center',
                                    padding: '7px 14px 7px 7px',
                                    borderRadius: 9,
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    background: 'rgba(255,255,255,0.02)',
                                    cursor: 'default',
                                    transition: 'border-color 0.18s ease, background 0.18s ease',
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.borderColor = `${badgeColor}66`;
                                    e.currentTarget.style.background = `${badgeColor}08`;
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                                }}
                            >
                                <div style={{
                                    flexShrink: 0,
                                    width: 28,
                                    height: 28,
                                    borderRadius: 6,
                                    background: badgeColor,
                                    color: badgeTextColor,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: 12,
                                    letterSpacing: '0.02em',
                                    boxShadow: `0 3px 12px -3px ${badgeColor}99`,
                                    transition: 'background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
                                }}>
                                    {g.letter}
                                </div>
                                <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{g.label}</span>
                            </div>
                            );
                        })}
                    </div>

                    <div style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        filter: CATEGORY_COLORS[activeIndex]
                            ? `drop-shadow(0 18px 28px rgba(0,0,0,0.55)) drop-shadow(0 0 28px ${CATEGORY_COLORS[activeIndex]}55) drop-shadow(0 0 10px ${CATEGORY_COLORS[activeIndex]}40)`
                            : 'drop-shadow(0 22px 36px rgba(0,0,0,0.6)) drop-shadow(0 6px 14px rgba(0,0,0,0.35))',
                        transition: 'filter 0.4s ease',
                    }}>
                        <TurkeyMap activeIndex={activeIndex} hoveredGrade={hoveredGrade} />
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => router.push('/rankings')}
                    className="hub-hint hub-hint-down"
                    aria-label="Tüm Sıralama"
                    style={{
                        alignSelf: 'center',
                        flexShrink: 0,
                        background: 'rgba(96,165,250,0.10)',
                        border: '1px solid rgba(96,165,250,0.45)',
                        borderRadius: 14,
                        color: '#FFFFFF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 10,
                        fontSize: 13,
                        fontWeight: 800,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        padding: '12px 22px',
                        boxShadow: '0 8px 26px rgba(96,165,250,0.22)',
                    }}
                >
                    <span>Tüm Sıralama</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            </div>

            <button
                type="button"
                onClick={() => router.push('/compare')}
                className="hub-hint hub-hint-right hub-hint-compare"
                aria-label="İlleri Karşılaştır"
                style={{
                    position: 'fixed',
                    right: 12,
                    top: '50%',
                    background: 'rgba(246,139,31,0.10)',
                    border: '1px solid rgba(246,139,31,0.45)',
                    borderRadius: 14,
                    color: '#FFFFFF',
                    display: 'inline-flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    zIndex: 30,
                    padding: '18px 12px',
                    boxShadow: '0 8px 26px rgba(246,139,31,0.22)',
                }}
            >
                <span style={{ writingMode: 'vertical-rl' }}>İlleri Karşılaştır</span>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            </button>

        </div>
    );
}
