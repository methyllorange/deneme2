'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BRAND, CATEGORY_GRADE_COLORS } from '../lib/brand';
import { downloadAllDataCSV } from '../lib/data/exportData';
import TurkeyMap from '../components/TurkeyMap';
import TopNav from '../components/TopNav';
import { indicators } from '../lib/data/mockData';
import { GRADES } from '../lib/data/methodology';

const REPORTS = [
    {
        year: 2024,
        pdf: '/deneme2/reports/aso-iltek-2024.pdf',
        cover: '/deneme2/reports/aso-iltek-2024-cover.jpg',
    },
    {
        year: 2025,
        pdf: '/deneme2/reports/aso-iltek-2025.pdf',
        cover: '/deneme2/reports/aso-iltek-2025-cover.jpg',
    },
];

const CATEGORY_COLORS = {
    overall: null,
    sectoral: '#F68B1F',
    rnd: '#114B95',
    digital: '#1394B9',
    techOutput: '#9B92C6',
    lifeQuality: '#019963',
};

export default function LandingPage() {
    const router = useRouter();
    const [reportOpen, setReportOpen] = useState(false);
    const [reportYear, setReportYear] = useState(2025);
    const [mapOpen, setMapOpen] = useState(false);
    const [mapVisible, setMapVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState('overall');
    const [hoveredGrade, setHoveredGrade] = useState(null);
    const activeReport = REPORTS.find((r) => r.year === reportYear) ?? REPORTS[0];

    const ANIM_MS = 550;
    const handleKesfet = (e) => {
        e.preventDefault();
        if (mapVisible && mapOpen) {
            setMapOpen(false);
            setTimeout(() => setMapVisible(false), ANIM_MS);
        } else if (!mapVisible) {
            setMapVisible(true);
            setMapOpen(true);
        }
    };

    useEffect(() => {
        if (!reportOpen) return;
        const onKey = (e) => { if (e.key === 'Escape') setReportOpen(false); };
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [reportOpen]);

    return (
        <div className="lp-root" style={{
            position: 'relative',
            height: '100vh',
            backgroundColor: '#000',
            overflow: 'hidden',
            color: '#fff',
            fontFamily: 'inherit',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Background slideshow: 5 endüstri fotoğrafı, crossfade + slow zoom */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <img
                        key={i}
                        src={`/deneme2/images/landing-bg-${i}.jpg`}
                        alt=""
                        aria-hidden="true"
                        className="bg-slide"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0,
                            animationDelay: `${(i - 1) * 6}s`,
                        }}
                    />
                ))}
            </div>
            <style>{`
                @keyframes topnav-in {
                    0%   { opacity: 0; transform: translateY(-24px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes topnav-out {
                    0%   { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-24px); }
                }
                .landing-topnav { animation: topnav-in 1.3s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
                .landing-topnav.closing { animation: topnav-out 0.5s cubic-bezier(0.4, 0, 0.6, 1) both; }
                /* Landing'de TopNav arka planı şeffaf kalsın (diğer sayfalarda scroll'a göre) */
                .landing-topnav header {
                    background: transparent !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                    box-shadow: none !important;
                }

                @keyframes map-box-in {
                    0%   { opacity: 0; transform: translateX(40px); }
                    100% { opacity: 1; transform: translateX(0); }
                }
                @keyframes map-box-out {
                    0%   { opacity: 1; transform: translateX(0); }
                    100% { opacity: 0; transform: translateX(40px); }
                }
                .map-box { animation: map-box-in 0.55s cubic-bezier(0.2, 0.8, 0.2, 1) both; will-change: opacity, transform; }
                .map-box.closing { animation: map-box-out 0.5s cubic-bezier(0.4, 0, 0.6, 1) both; will-change: opacity, transform; }

                @keyframes side-btn-in {
                    0%   { opacity: 0; transform: translateY(-50%) translateX(40px); }
                    100% { opacity: 1; transform: translateY(-50%) translateX(0); }
                }
                @keyframes side-btn-out {
                    0%   { opacity: 1; transform: translateY(-50%) translateX(0); }
                    100% { opacity: 0; transform: translateY(-50%) translateX(40px); }
                }
                .side-btn { animation: side-btn-in 1.3s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
                .side-btn.closing { animation: side-btn-out 0.5s cubic-bezier(0.4, 0, 0.6, 1) both; }
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
                .side-btn.hub-hint-right { animation: side-btn-in 1.3s cubic-bezier(0.2, 0.8, 0.2, 1) both, hint-pulse-x-right 1.8s 1.3s ease-in-out infinite; }
                .side-btn.hub-hint-right.closing { animation: side-btn-out 0.5s cubic-bezier(0.4, 0, 0.6, 1) both; }
                .hub-hint { transition: color 0.18s ease, filter 0.18s ease; cursor: pointer; }
                .hub-hint:hover { color: #FFB36A !important; filter: drop-shadow(0 0 10px rgba(246,139,31,0.45)); }
                .hub-hint-down:hover { color: #93C5FD !important; filter: drop-shadow(0 0 10px rgba(96,165,250,0.5)); }
                @keyframes landing-exit {
                    0%   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
                    100% { opacity: 0; transform: translateY(-40px) scale(0.96); filter: blur(8px); }
                }
                @keyframes landing-bg-fade {
                    0%   { opacity: 1; }
                    100% { opacity: 0; }
                }
                .landing-exiting .landing-content {
                    animation: landing-exit 0.62s cubic-bezier(0.55, 0, 0.25, 1) forwards;
                }
                .landing-exiting .landing-bg {
                    animation: landing-bg-fade 0.62s ease forwards;
                }
                .bg-slide {
                    animation: bg-cycle 30s linear infinite;
                    transform-origin: center center;
                }
                @keyframes bg-cycle {
                    0%   { opacity: 0; transform: scale(1.00); }
                    3%   { opacity: 0.55; }
                    20%  { opacity: 0.55; transform: scale(1.08); }
                    23%  { opacity: 0; }
                    100% { opacity: 0; transform: scale(1.08); }
                }
                /* Telefon/dar ekran: Keşfet'e basınca harita YANA değil ALTA açılsın, sayfa kaydırılabilir olsun */
                @media (max-width: 860px) {
                    .lp-root { height: auto !important; min-height: 100vh; overflow-y: auto !important; }
                    .lp-main { flex-direction: column !important; align-items: stretch !important; height: auto !important; }
                    .lp-hero { width: 100% !important; align-self: stretch !important; }
                    .map-box.lp-mapbox { margin-top: 16px !important; min-height: 80vh; }
                }
                @media (max-width: 520px) {
                    .lp-filterbar button { font-size: 12px !important; padding: 8px 6px !important; }
                    .lp-legend span { font-size: 12px !important; }
                }
                .cta { transition: background 0.2s ease, background-image 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease; }
                .cta:hover { transform: translateY(-1px); }
                .cta-primary:hover { box-shadow: 0 14px 36px rgba(246,139,31,0.5); }
                .cta-secondary:hover {
                    background: transparent !important;
                    background-image: linear-gradient(135deg, #F68B1F, #ea580c) !important;
                    border-color: rgba(255,255,255,0.15) !important;
                    box-shadow: 0 10px 30px rgba(246,139,31,0.35);
                }
                @keyframes report-backdrop-in {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes report-drawer-in {
                    from { transform: translateX(100%); }
                    to   { transform: translateX(0); }
                }
                @keyframes cover-float {
                    0%   { transform: translateY(0) rotate(0deg); }
                    50%  { transform: translateY(-6px) rotate(0.6deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                }
                .report-backdrop { animation: report-backdrop-in 0.25s ease forwards; }
                .report-drawer { animation: report-drawer-in 0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
                .report-cover {
                    animation: cover-float 10s ease-in-out infinite;
                    transition: box-shadow 0.25s, transform 0.25s;
                }
                .report-cover:hover {
                    box-shadow: 0 30px 60px -10px rgba(0,0,0,0.55), 0 18px 36px -10px rgba(246,139,31,0.45);
                }
                .drawer-btn { transition: background-image 0.2s ease, background 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease; }
                .drawer-btn:hover { transform: translateY(-1px); }
                .drawer-btn-primary:hover {
                    background-image: linear-gradient(135deg, #ffa64d, #f68b1f) !important;
                    box-shadow: 0 14px 34px rgba(246,139,31,0.5) !important;
                }
                .drawer-btn-secondary:hover {
                    background: transparent !important;
                    background-image: linear-gradient(135deg, #F68B1F, #ea580c) !important;
                    border-color: rgba(255,255,255,0.15) !important;
                    box-shadow: 0 12px 30px rgba(246,139,31,0.4) !important;
                }
            `}</style>

            {/* Brand-tinted overlay: koyu vignette + ASO mavi/turuncu tonlama */}
            <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                background: `
                    radial-gradient(ellipse at 25% 40%, rgba(17,75,149,0.45) 0%, transparent 55%),
                    radial-gradient(ellipse at 80% 75%, rgba(246,139,31,0.25) 0%, transparent 50%),
                    linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.80) 100%)
                `,
                pointerEvents: 'none',
            }} />


            {/* Header: mapVisible açıkken dashboard TopNav, kapalıyken landing nav */}
            {mapVisible ? (
                <div className={`landing-topnav ${!mapOpen ? 'closing' : ''}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 25 }}>
                    <TopNav hideBrand />
                </div>
            ) : (
                <header style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '28px 56px',
                }}>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                        <Link href="#baskan-mesaji" style={navLinkStyle}>Başkanın Mesajı</Link>
                        <Link href="#hakkimizda" style={navLinkStyle}>Hakkımızda</Link>
                        <Link href="#iletisim" style={navLinkStyle}>İletişim</Link>
                    </nav>
                </header>
            )}

            {/* Hero: frosted panel solda + harita sağda */}
            <main className="lp-main" style={{
                position: 'relative',
                zIndex: 10,
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'flex-start',
                gap: 24,
                padding: '24px clamp(20px, 2vw, 36px)',
                flex: 1,
                minHeight: 0,
                height: '100%',
            }}>
                <div className="lp-hero" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    gap: 28,
                    padding: 'clamp(40px, 5vw, 72px) clamp(32px, 4vw, 64px)',
                    background: 'rgba(8, 16, 32, 0.08)',
                    backdropFilter: 'blur(5px) saturate(120%)',
                    WebkitBackdropFilter: 'blur(5px) saturate(120%)',
                    border: 'none',
                    borderRadius: 28,
                    boxShadow: '0 30px 120px 30px rgba(0,0,0,0.55)',
                    maskImage: 'radial-gradient(ellipse 110% 100% at 50% 50%, #000 65%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(ellipse 110% 100% at 50% 50%, #000 65%, transparent 100%)',
                    width: 'min(560px, 100%)',
                    flex: '0 0 auto',
                    alignSelf: 'stretch',
                }}>
                <img
                    src="/deneme2/brand/aso-logo-official.svg"
                    alt="Ankara Sanayi Odası"
                    style={{
                        height: 'clamp(170px, 19vw, 300px)',
                        width: 'auto',
                        display: 'block',
                        filter: 'brightness(0) invert(1)',
                        marginBottom: -4,
                    }}
                />
                <h1 style={{
                    fontSize: 'clamp(56px, 10vw, 132px)',
                    fontWeight: 800,
                    lineHeight: 0.95,
                    letterSpacing: '-0.04em',
                    margin: 0,
                    color: '#fff',
                    background: `linear-gradient(135deg, #fff 30%, ${BRAND.orange} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                }}>
                    İLTEK
                </h1>
                <div style={{
                    fontSize: 'clamp(11px, 1.05vw, 14px)',
                    fontWeight: 500,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.85)',
                    marginTop: 6,
                    whiteSpace: 'nowrap',
                }}>
                    İllerin Teknolojik Gelişmişlik Endeksi
                </div>

                <p style={{
                    fontSize: 'clamp(13px, 1.2vw, 16px)',
                    color: 'rgba(255,255,255,0.85)',
                    maxWidth: 480,
                    margin: 0,
                    lineHeight: 1.55,
                }}>
                    Ankara Sanayi Odası&apos;nın 81 ilin teknolojik gelişmişliğini ve
                    bölgesel sanayi dinamiklerini analiz etmek için geliştirdiği
                    araştırma ve veri görselleştirme platformu.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, width: '100%', maxWidth: 380 }}>
                    <Link href="/dashboard" onClick={handleKesfet} className="cta cta-primary" style={ctaPrimarySmall}>
                        <DashboardIcon />
                        <span>Keşfet</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setReportOpen(true)}
                        className="cta cta-secondary"
                        style={{ ...ctaSecondarySmall, cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', WebkitAppearance: 'none', boxSizing: 'border-box' }}
                    >
                        <ReportIcon />
                        <span>Rapor</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => downloadAllDataCSV()}
                        className="cta cta-secondary"
                        style={{ ...ctaSecondarySmall, cursor: 'pointer', fontFamily: 'inherit', appearance: 'none', WebkitAppearance: 'none', boxSizing: 'border-box' }}
                        title="81 il × 3 yıl × 42 gösterge · CSV"
                    >
                        <DownloadIcon />
                        <span>Veriyi İndir</span>
                    </button>
                    <Link href="/metodoloji" className="cta cta-secondary" style={ctaSecondarySmall}>
                        <MethodologyIcon />
                        <span>Metodoloji</span>
                    </Link>
                </div>
                </div>

                {/* Harita kutusu — Keşfet'e basınca açılır, panel stilinde frosted glass */}
                {mapVisible && (
                    <div className={`map-box lp-mapbox ${!mapOpen ? 'closing' : ''}`} style={{
                        flex: 1,
                        minWidth: 0,
                        alignSelf: 'stretch',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                        padding: 'clamp(28px, 3vw, 52px) clamp(24px, 3vw, 40px)',
                        marginTop: 80,
                        background: 'rgba(8, 16, 32, 0.08)',
                        backdropFilter: 'blur(5px) saturate(120%)',
                        WebkitBackdropFilter: 'blur(5px) saturate(120%)',
                        border: 'none',
                        borderRadius: 28,
                        boxShadow: '0 30px 120px 30px rgba(0,0,0,0.55)',
                        maskImage: 'radial-gradient(ellipse 110% 100% at 50% 50%, #000 65%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse 110% 100% at 50% 50%, #000 65%, transparent 100%)',
                    }}>
                        {/* Filter bar */}
                        <div className="lp-filterbar" style={{
                            alignSelf: 'center',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 8,
                            padding: '10px 16px',
                            background: 'rgba(13, 24, 40, 0.45)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            borderRadius: 16,
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                            flexShrink: 0,
                        }}>
                            {indicators.map((ind) => {
                                const color = CATEGORY_COLORS[ind.id];
                                const isActive = activeIndex === ind.id;
                                const navy = '#0B2E5C';
                                const accent = color || navy;
                                const style = {
                                    fontFamily: 'inherit',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    padding: '10px 18px',
                                    borderRadius: 10,
                                    cursor: 'pointer',
                                    background: isActive ? accent : 'transparent',
                                    color: '#fff',
                                    border: '1px solid transparent',
                                    textShadow: isActive ? `0 0 10px ${accent}aa` : 'none',
                                    boxShadow: isActive ? `0 0 14px ${accent}66` : 'none',
                                    transition: 'background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s, text-shadow 0.2s',
                                };
                                return (
                                    <button
                                        key={ind.id}
                                        type="button"
                                        onClick={() => setActiveIndex(ind.id)}
                                        style={style}
                                        onMouseOver={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.background = `${accent}22`;
                                                e.currentTarget.style.borderColor = `${accent}66`;
                                                e.currentTarget.style.boxShadow = `0 0 14px ${accent}55`;
                                                e.currentTarget.style.textShadow = `0 0 10px ${accent}aa`;
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
                            })}
                        </div>

                        {/* Harita */}
                        <div style={{
                            flex: 1,
                            minHeight: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            filter: CATEGORY_COLORS[activeIndex]
                                ? `drop-shadow(0 18px 28px rgba(0,0,0,0.55)) drop-shadow(0 0 24px ${CATEGORY_COLORS[activeIndex]}55)`
                                : 'drop-shadow(0 22px 36px rgba(0,0,0,0.6))',
                            transition: 'filter 0.4s ease',
                        }}>
                            <TurkeyMap activeIndex={activeIndex} hoveredGrade={hoveredGrade} />
                        </div>

                        {/* Legend altta yatay */}
                        <div className="lp-legend" style={{
                            alignSelf: 'center',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: 6,
                            flexShrink: 0,
                        }}>
                            {GRADES.map((g) => {
                                const activeRamp = CATEGORY_GRADE_COLORS[activeIndex];
                                const badgeColor = activeRamp ? activeRamp[g.letter] : g.color;
                                const lightGrades = new Set(['CC', 'DC', 'DD', 'FF']);
                                const badgeTextColor = (activeRamp && lightGrades.has(g.letter)) ? '#0B1120' : '#ffffff';
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
                                        }}
                                    >
                                        <div style={{
                                            width: 28, height: 28,
                                            borderRadius: 6,
                                            background: badgeColor,
                                            color: badgeTextColor,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 800, fontSize: 12,
                                            boxShadow: `0 3px 12px -3px ${badgeColor}99`,
                                            transition: 'background 0.3s ease, color 0.3s ease, box-shadow 0.3s ease',
                                        }}>{g.letter}</div>
                                        <span style={{ fontWeight: 700, fontSize: 14, lineHeight: 1 }}>{g.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tüm Sıralama hint butonu — legend altında */}
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
                                fontFamily: 'inherit',
                                fontSize: 13,
                                fontWeight: 800,
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                padding: '12px 22px',
                                boxShadow: '0 8px 26px rgba(96,165,250,0.22)',
                                cursor: 'pointer',
                                marginTop: 14,
                            }}
                        >
                            <span>Tüm Sıralama</span>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                )}

                {/* İlleri Karşılaştır - sağda fixed yan buton */}
                {mapVisible && (
                    <button
                        type="button"
                        onClick={() => router.push('/compare')}
                        className={`hub-hint hub-hint-right side-btn ${!mapOpen ? 'closing' : ''}`}
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
                            fontFamily: 'inherit',
                            fontSize: 13,
                            fontWeight: 800,
                            letterSpacing: '0.22em',
                            textTransform: 'uppercase',
                            zIndex: 30,
                            padding: '18px 12px',
                            boxShadow: '0 8px 26px rgba(246,139,31,0.22)',
                            cursor: 'pointer',
                        }}
                    >
                        <span style={{ writingMode: 'vertical-rl' }}>İlleri Karşılaştır</span>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </button>
                )}
            </main>

            {reportOpen && (
                <>
                    <div
                        className="report-backdrop"
                        onClick={() => setReportOpen(false)}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            zIndex: 100,
                            background: 'rgba(0,0,0,0.55)',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                        }}
                    />
                    <aside
                        className="report-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="ASO İLTEK 2025 Raporu"
                        style={{
                            position: 'fixed',
                            top: 0,
                            right: 0,
                            bottom: 0,
                            width: 'min(520px, 92vw)',
                            zIndex: 101,
                            background: 'linear-gradient(180deg, #0d1828 0%, #07101d 100%)',
                            borderLeft: '1px solid rgba(255,255,255,0.08)',
                            boxShadow: '-30px 0 80px rgba(0,0,0,0.6)',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '32px 36px',
                            color: '#fff',
                            overflowY: 'auto',
                        }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 8,
                        }}>
                            <span style={{
                                fontSize: 11,
                                letterSpacing: '0.18em',
                                textTransform: 'uppercase',
                                color: BRAND.orange,
                                fontWeight: 700,
                            }}>
                                Rapor Arşivi
                            </span>
                            <button
                                type="button"
                                onClick={() => setReportOpen(false)}
                                aria-label="Kapat"
                                style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    color: '#fff',
                                    width: 36,
                                    height: 36,
                                    borderRadius: 999,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    fontSize: 18,
                                    lineHeight: 1,
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <h2 style={{
                            fontSize: 26,
                            fontWeight: 800,
                            lineHeight: 1.2,
                            letterSpacing: '-0.01em',
                            margin: '4px 0 18px',
                        }}>
                            ASO İLTEK Raporu
                        </h2>

                        <a
                            key={activeReport.year}
                            href={activeReport.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="report-cover"
                            style={{
                                display: 'block',
                                alignSelf: 'center',
                                width: '100%',
                                maxWidth: 360,
                                aspectRatio: '1205 / 1701',
                                borderRadius: 8,
                                overflow: 'hidden',
                                boxShadow: '0 20px 45px -10px rgba(0,0,0,0.5), 0 10px 22px -10px rgba(0,0,0,0.4)',
                                cursor: 'pointer',
                                background: '#111',
                                outline: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <img
                                src={activeReport.cover}
                                alt={`ASO İLTEK ${activeReport.year} Raporu Kapağı`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                            />
                        </a>

                        <div role="tablist" aria-label="Yıl seçici" style={{
                            display: 'inline-flex',
                            alignSelf: 'center',
                            padding: 4,
                            borderRadius: 999,
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.10)',
                            marginTop: 22,
                        }}>
                            {REPORTS.map((r) => {
                                const active = r.year === reportYear;
                                return (
                                    <button
                                        key={r.year}
                                        type="button"
                                        role="tab"
                                        aria-selected={active}
                                        onClick={() => setReportYear(r.year)}
                                        style={{
                                            padding: '8px 18px',
                                            borderRadius: 999,
                                            border: 'none',
                                            background: active
                                                ? `linear-gradient(135deg, ${BRAND.orange}, #ea580c)`
                                                : 'transparent',
                                            color: '#fff',
                                            fontWeight: 700,
                                            fontSize: 13,
                                            letterSpacing: '0.02em',
                                            cursor: 'pointer',
                                            boxShadow: active ? '0 4px 14px rgba(246,139,31,0.35)' : 'none',
                                            transition: 'background 0.2s, box-shadow 0.2s',
                                        }}
                                    >
                                        {r.year}
                                    </button>
                                );
                            })}
                        </div>

                        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                            <a
                                href={activeReport.pdf}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="drawer-btn drawer-btn-primary"
                                style={{
                                    flex: 1,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    padding: '12px 16px',
                                    borderRadius: 10,
                                    backgroundImage: `linear-gradient(135deg, ${BRAND.orange}, #ea580c)`,
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    textDecoration: 'none',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    boxShadow: '0 8px 22px rgba(246,139,31,0.32)',
                                }}
                            >
                                <ReportIcon />
                                <span>PDF&apos;i Aç</span>
                            </a>
                            <a
                                href={activeReport.pdf}
                                download
                                className="drawer-btn drawer-btn-secondary"
                                style={{
                                    flex: 1,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    padding: '12px 16px',
                                    borderRadius: 10,
                                    background: 'rgba(255,255,255,0.06)',
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: 14,
                                    textDecoration: 'none',
                                    border: '1px solid rgba(255,255,255,0.16)',
                                }}
                            >
                                <DownloadIcon />
                                <span>İndir</span>
                            </a>
                        </div>
                    </aside>
                </>
            )}
        </div>
    );
}

const navLinkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.2,
};

const ctaPrimaryStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 28px',
    borderRadius: 12,
    background: `linear-gradient(135deg, ${BRAND.orange}, #ea580c)`,
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    textDecoration: 'none',
    boxShadow: '0 10px 30px rgba(246,139,31,0.35)',
    border: '1px solid rgba(255,255,255,0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s',
};

const ctaSecondaryStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
    padding: '14px 28px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 16,
    textDecoration: 'none',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.2)',
    transition: 'background 0.2s',
};

const ctaPrimarySmall = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'linear-gradient(135deg, #F68B1F, #ea580c)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
    textDecoration: 'none',
    boxShadow: '0 8px 22px rgba(246,139,31,0.32)',
    border: '1px solid rgba(255,255,255,0.15)',
    minHeight: 44,
    whiteSpace: 'nowrap',
};

const ctaSecondarySmall = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 13,
    textDecoration: 'none',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,255,255,0.2)',
    minHeight: 44,
    whiteSpace: 'nowrap',
};

const DashboardIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
);
const ReportIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
);
const DownloadIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);
const ProvincesIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);
const MethodologyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9 9a3 3 0 0 1 6 0c0 1.5-.75 2.25-1.5 2.75-.75.5-1.5 1-1.5 2.25" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
);

// Animated brand threads: v0 spec uyarlaması, brand mavi/turuncu
function BrandThreads() {
    const THREADS = [
        { d: 'M50 720 Q200 590 350 540 Q500 490 650 520 Q800 550 950 460 Q1100 370 1200 340', w: 0.8, o: 0.7, dur: '4s', grad: 'g1' },
        { d: 'M80 730 Q250 620 400 570 Q550 520 700 550 Q850 580 1000 490 Q1150 400 1300 370', w: 1.5, o: 0.7, dur: '5s', grad: 'g2' },
        { d: 'M20 710 Q180 580 320 530 Q460 480 600 510 Q740 540 880 450 Q1020 360 1200 330', w: 1.2, o: 0.7, dur: '4.5s', grad: 'g3' },
        { d: 'M120 740 Q280 640 450 590 Q620 540 770 570 Q920 600 1070 510 Q1220 420 1350 390', w: 0.6, o: 0.5, dur: '5.5s', grad: 'g1' },
        { d: 'M60 725 Q220 600 380 550 Q540 500 680 530 Q820 560 960 470 Q1100 380 1280 350', w: 1.0, o: 0.7, dur: '4.2s', grad: 'g2' },
        { d: 'M150 735 Q300 660 480 610 Q660 560 800 590 Q940 620 1080 530 Q1220 440 1400 410', w: 1.3, o: 0.5, dur: '5.2s', grad: 'g3' },
        { d: 'M40 715 Q190 585 340 535 Q490 485 630 515 Q770 545 910 455 Q1050 365 1250 335', w: 0.9, o: 0.7, dur: '4.8s', grad: 'g1' },
        { d: 'M100 728 Q260 630 420 580 Q580 530 720 560 Q860 590 1000 500 Q1140 410 1320 380', w: 1.4, o: 0.7, dur: '5.8s', grad: 'g2' },
        { d: 'M90 732 Q240 625 390 575 Q540 525 680 555 Q820 585 960 495 Q1100 405 1300 375', w: 1.1, o: 0.8, dur: '4.3s', grad: 'g3' },
        { d: 'M110 738 Q270 645 430 595 Q590 545 730 575 Q870 605 1010 515 Q1150 425 1380 395', w: 1.5, o: 0.7, dur: '4.7s', grad: 'g3' },
    ];
    return (
        <svg
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
            aria-hidden="true"
        >
            <defs>
                {/* Brand gradients: mavi → turkuaz → turuncu */}
                <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,0,0,1)" />
                    <stop offset="15%" stopColor="rgba(17,75,149,0.85)" />
                    <stop offset="85%" stopColor="rgba(246,139,31,0.85)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,1)" />
                </linearGradient>
                <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,0,0,1)" />
                    <stop offset="12%" stopColor="rgba(19,148,185,0.75)" />
                    <stop offset="88%" stopColor="rgba(155,146,198,0.75)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,1)" />
                </linearGradient>
                <linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,0,0,1)" />
                    <stop offset="18%" stopColor="rgba(45,110,186,0.8)" />
                    <stop offset="82%" stopColor="rgba(246,139,31,0.7)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,1)" />
                </linearGradient>
                <radialGradient id="pulse">
                    <stop offset="0%" stopColor="rgba(255,255,255,1)" />
                    <stop offset="30%" stopColor="rgba(246,139,31,0.95)" />
                    <stop offset="100%" stopColor="rgba(246,139,31,0)" />
                </radialGradient>
                <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" />
                </filter>
            </defs>
            {THREADS.map((t, i) => (
                <g key={i}>
                    <path id={`th-${i}`} d={t.d} stroke={`url(#${t.grad})`} strokeWidth={t.w} fill="none" opacity={t.o} />
                    <circle r={Math.max(1.5, t.w * 1.8)} fill="url(#pulse)" filter="url(#neon-glow)">
                        <animateMotion dur={t.dur} repeatCount="indefinite">
                            <mpath href={`#th-${i}`} />
                        </animateMotion>
                    </circle>
                </g>
            ))}
        </svg>
    );
}
