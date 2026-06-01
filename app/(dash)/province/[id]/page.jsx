'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '../../../../lib/DataContext';
import { mapScoreToColor } from '../../../../lib/data/mockData';
import { CATEGORY_COLORS, SEMANTIC } from '../../../../lib/brand';
import { generatePolicyRecommendations } from '../../../../lib/data/policyEngine';

const SECTIONS = [
    { id: 'kimlik',     label: 'Kimlik' },
    { id: 'genel',      label: 'Genel Tablo' },
    { id: 'sektorel',   label: 'Sektörel Yapı',                 sub: 'sectoral' },
    { id: 'arge',       label: 'Araştırma ve Yenilikçilik',     sub: 'rnd' },
    { id: 'dijital',    label: 'Dijital Altyapı',               sub: 'digital' },
    { id: 'teknoloji',  label: 'Teknoloji Çıktıları',           sub: 'techOutput' },
    { id: 'yasam',      label: 'Yaşam Kalitesi',                sub: 'lifeQuality' },
    { id: 'guclu-zayif',label: 'Güçlü ve Zayıf Yönler' },
    { id: 'politika',   label: 'Politika Önerileri' },
];

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export default function ProvinceDetailPage() {
    const params = useParams();
    const id = params?.id;
    const { provinces } = useData();
    const router = useRouter();
    const province = provinces.find(p => p.id === id);

    const [activeId, setActiveId] = useState('kimlik');
    const activeIndex = SECTIONS.findIndex(s => s.id === activeId);

    useEffect(() => {
        const prevHtml = document.documentElement.style.overflow;
        const prevBody = document.body.style.overflow;
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        return () => {
            document.documentElement.style.overflow = prevHtml;
            document.body.style.overflow = prevBody;
        };
    }, []);

    if (!province) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
                <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>İl Bulunamadı</h2>
                <button type="button" onClick={() => router.push('/rankings')} style={{ color: 'var(--accent-blue)' }}>Sıralamaya Geri Dön</button>
            </div>
        );
    }

    const gradeColor = mapScoreToColor(province.grade);
    const rankDiff = (province.rankPrev ?? province.rankCurrent) - province.rankCurrent;
    const isRankUp = rankDiff > 0;
    const rankDiffColor = isRankUp ? SEMANTIC.up : (rankDiff < 0 ? SEMANTIC.down : 'var(--text-secondary)');

    const policy = generatePolicyRecommendations(province, provinces);

    return (
        <div className="province-page">
            <SectionNav
                sections={SECTIONS}
                active={activeId}
                onClick={setActiveId}
            />

            <div className="story-viewport">
                <div
                    className="story-track"
                    style={{ transform: `translateY(${-activeIndex * 100}%)` }}
                >
                    {/* 1 · Kimlik */}
                    <Pane>
                        <PaneHeader kicker="01" title={province.name} />
                        <HeroBlock province={province} gradeColor={gradeColor} rankDiff={rankDiff} isRankUp={isRankUp} rankDiffColor={rankDiffColor} />
                    </Pane>

                    {/* 2 · Genel Tablo */}
                    <Pane>
                        <PaneHeader kicker="02" title="Genel Tablo" />
                        <Placeholder text="5 alt endeks kartı, radar chart, 81 il strip plot buraya gelecek." />
                    </Pane>

                    {/* 3 · Sektörel Yapı */}
                    <Pane>
                        <PaneHeader kicker="03" title="Sektörel Yapı" accent={CATEGORY_COLORS.sectoral} />
                        <Placeholder text="2 gösterge: yüksek-teknoloji girişim payı, yüksek-teknoloji istihdam payı." />
                    </Pane>

                    {/* 4 · Araştırma ve Yenilikçilik */}
                    <Pane>
                        <PaneHeader kicker="04" title="Araştırma ve Yenilikçilik Kapasitesi" accent={CATEGORY_COLORS.rnd} />
                        <Placeholder text="11 gösterge: Ar-Ge Merkezi, Tekno Park, Tasarım Merkezi, Üniversite yayını, TÜBİTAK destekleri." />
                    </Pane>

                    {/* 5 · Dijital Altyapı */}
                    <Pane>
                        <PaneHeader kicker="05" title="Dijital Altyapı" accent={CATEGORY_COLORS.digital} />
                        <Placeholder text="4 gösterge: geniş bant, fiber payı, mobil geniş bant, 3G/4.5G." />
                    </Pane>

                    {/* 6 · Teknoloji Çıktıları */}
                    <Pane>
                        <PaneHeader kicker="06" title="Teknoloji Çıktıları" accent={CATEGORY_COLORS.techOutput} />
                        <Placeholder text="4 gösterge: Patent, faydalı model, tasarım tescili, yüksek-teknoloji ihracatı." />
                    </Pane>

                    {/* 7 · Yaşam Kalitesi */}
                    <Pane>
                        <PaneHeader kicker="07" title="Yaşam Kalitesi ve İş Gücü Çekiciliği" accent={CATEGORY_COLORS.lifeQuality} />
                        <Placeholder text="16 gösterge, 3 tema grubu: Eğitim & Sağlık, Ekonomi & İstihdam, Kültür & Yaşam." />
                    </Pane>

                    {/* 8 · Güçlü ve Zayıf Yönler */}
                    <Pane>
                        <PaneHeader kicker="08" title="Güçlü ve Zayıf Yönler" />
                        <Placeholder text="37 göstergenin Türkiye ortalamasından sapması (divergent bar). TOP 5 güçlü / BOTTOM 5 zayıf kartları." />
                    </Pane>

                    {/* 9 · Politika Önerileri */}
                    <Pane>
                        <PaneHeader kicker="09" title="Politika Önerileri" />
                        <PolicyPreview policy={policy} />
                    </Pane>
                </div>
            </div>

            <ArrowNav
                activeIndex={activeIndex}
                total={SECTIONS.length}
                onPrev={() => setActiveId(SECTIONS[Math.max(0, activeIndex - 1)].id)}
                onNext={() => setActiveId(SECTIONS[Math.min(SECTIONS.length - 1, activeIndex + 1)].id)}
            />

            <style>{`
                .province-page {
                    position: relative;
                    margin: 0 calc(-1 * clamp(20px, 4vw, 56px));
                    overflow: hidden;
                }
                .story-viewport {
                    height: calc(100vh - 116px - 56px - 80px);
                    overflow: hidden;
                    position: relative;
                    padding: 0 clamp(20px, 4vw, 56px);
                }
                .story-track {
                    height: 100%;
                    width: 100%;
                    will-change: transform;
                    transition: transform 0.85s cubic-bezier(0.65, 0, 0.35, 1);
                }
                .pane {
                    height: 100%;
                    width: 100%;
                    overflow: hidden;
                    padding: 36px 0 32px;
                    display: flex;
                    flex-direction: column;
                    animation: pane-fade-in 0.85s ease both;
                }
                @keyframes pane-fade-in {
                    0%   { opacity: 0.55; }
                    100% { opacity: 1; }
                }
                .pane-kicker {
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    color: rgba(255,255,255,0.4);
                    text-transform: uppercase;
                    margin-bottom: 14px;
                    display: inline-flex;
                    align-items: center;
                    gap: 12px;
                }
                .pane-kicker::after {
                    content: '';
                    display: inline-block;
                    width: 56px;
                    height: 1px;
                    background: rgba(255,255,255,0.18);
                }
                .pane-title {
                    font-size: clamp(28px, 4vw, 44px);
                    font-weight: 800;
                    color: #fff;
                    margin: 0 0 32px;
                    line-height: 1.15;
                    letter-spacing: -0.01em;
                }
                .pane-title .accent-bar {
                    display: inline-block;
                    width: 6px;
                    height: 0.85em;
                    border-radius: 3px;
                    margin-right: 14px;
                    vertical-align: -0.05em;
                }
                .placeholder-box {
                    flex: 1;
                    border: 1px dashed rgba(255,255,255,0.15);
                    border-radius: 14px;
                    background: rgba(255,255,255,0.02);
                    padding: 40px;
                    color: rgba(255,255,255,0.45);
                    font-size: 14px;
                    line-height: 1.7;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    justify-content: center;
                    align-items: flex-start;
                }
                .placeholder-box em {
                    color: rgba(255,201,122,0.7);
                    font-style: normal;
                    font-size: 12px;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                }
                .lorem-text {
                    color: rgba(255,255,255,0.62);
                    line-height: 1.75;
                    font-size: 15px;
                    max-width: 720px;
                }
            `}</style>
        </div>
    );
}

function Pane({ children }) {
    return <div className="pane">{children}</div>;
}

function PaneHeader({ kicker, title, accent }) {
    return (
        <>
            <div className="pane-kicker">{kicker}</div>
            <h2 className="pane-title">
                {accent && <span className="accent-bar" style={{ background: accent }} />}
                {title}
            </h2>
        </>
    );
}

function SectionNav({ sections, active, onClick }) {
    return (
        <>
            <nav className="province-nav">
                <div className="province-nav-inner">
                    {sections.map((s, i) => {
                        const isActive = active === s.id;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => onClick(s.id)}
                                className={`province-nav-btn ${isActive ? 'is-active' : ''}`}
                            >
                                <span className="province-nav-idx">{String(i + 1).padStart(2, '0')}</span>
                                <span className="province-nav-label">{s.label}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>
            <style>{`
                .province-nav {
                    position: sticky;
                    top: 116px;
                    z-index: 20;
                    background: rgba(6, 16, 29, 0.78);
                    backdrop-filter: blur(14px) saturate(160%);
                    -webkit-backdrop-filter: blur(14px) saturate(160%);
                    border-top: 1px solid rgba(255,255,255,0.06);
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    padding: 0 clamp(20px, 4vw, 56px);
                }
                .province-nav-inner {
                    display: flex;
                    gap: 4px;
                    overflow-x: auto;
                    padding: 10px 0;
                    scrollbar-width: thin;
                }
                .province-nav-inner::-webkit-scrollbar { height: 4px; }
                .province-nav-inner::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
                .province-nav-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: transparent;
                    border: 1px solid transparent;
                    color: rgba(255,255,255,0.55);
                    padding: 7px 12px;
                    border-radius: 999px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    white-space: nowrap;
                    transition: color 0.2s ease, background 0.2s ease, border-color 0.2s ease;
                }
                .province-nav-btn:hover {
                    color: #fff;
                    background: rgba(246,139,31,0.10);
                    border-color: rgba(246,139,31,0.30);
                }
                .province-nav-btn.is-active {
                    color: #fff;
                    background: rgba(246,139,31,0.18);
                    border-color: rgba(246,139,31,0.55);
                    box-shadow: 0 2px 10px rgba(246,139,31,0.18);
                }
                .province-nav-idx {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.1em;
                    color: rgba(255,255,255,0.4);
                }
                .province-nav-btn.is-active .province-nav-idx {
                    color: rgba(255,201,122,0.9);
                }
            `}</style>
        </>
    );
}

function ArrowNav({ activeIndex, total, onPrev, onNext }) {
    return (
        <>
            <div className="arrow-nav">
                <button
                    type="button"
                    onClick={onPrev}
                    disabled={activeIndex === 0}
                    className="arrow-btn"
                    aria-label="Önceki bölüm"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="18 15 12 9 6 15" />
                    </svg>
                </button>
                <span className="arrow-counter">
                    {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </span>
                <button
                    type="button"
                    onClick={onNext}
                    disabled={activeIndex === total - 1}
                    className="arrow-btn"
                    aria-label="Sonraki bölüm"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </button>
            </div>
            <style>{`
                .arrow-nav {
                    position: fixed;
                    right: 28px;
                    bottom: 30px;
                    z-index: 30;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    background: rgba(6, 16, 29, 0.78);
                    backdrop-filter: blur(14px) saturate(160%);
                    -webkit-backdrop-filter: blur(14px) saturate(160%);
                    padding: 12px 10px;
                    border-radius: 999px;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 8px 28px rgba(0,0,0,0.4);
                }
                .arrow-btn {
                    width: 38px;
                    height: 38px;
                    border-radius: 50%;
                    border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.04);
                    color: rgba(255,255,255,0.75);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }
                .arrow-btn:hover:not(:disabled) {
                    color: #fff;
                    background: rgba(246,139,31,0.18);
                    border-color: rgba(246,139,31,0.45);
                    box-shadow: 0 0 14px rgba(246,139,31,0.25);
                }
                .arrow-btn:disabled {
                    opacity: 0.25;
                    cursor: not-allowed;
                }
                .arrow-counter {
                    font-size: 11px;
                    font-weight: 700;
                    color: rgba(255,255,255,0.55);
                    letter-spacing: 0.1em;
                }
            `}</style>
        </>
    );
}

function HeroBlock({ province, gradeColor, rankDiff, isRankUp, rankDiffColor }) {
    return (
        <div className="hero-grid">
            <div className="hero-left">
                <div className="hero-grade-row">
                    <div className="hero-grade-box" style={{ borderColor: gradeColor, color: gradeColor, background: `${gradeColor}18` }}>
                        {province.grade}
                    </div>
                    <div>
                        <div className="hero-rank">#{province.rankCurrent}<span className="hero-rank-of"> / 81</span></div>
                        {rankDiff !== 0 ? (
                            <span className="hero-rank-diff" style={{ color: rankDiffColor, background: `${rankDiffColor}22` }}>
                                {isRankUp ? '▲' : '▼'} {Math.abs(rankDiff)} basamak
                            </span>
                        ) : (
                            <span className="hero-rank-diff" style={{ color: 'rgba(255,255,255,0.55)', background: 'rgba(255,255,255,0.05)' }}>
                                ▬ değişim yok
                            </span>
                        )}
                    </div>
                </div>
                <p className="lorem-text">{LOREM} {LOREM}</p>
            </div>
            <div className="hero-kpis">
                <KPI label="Genel Puan" value={province.scores.overall.toFixed(1)} accent={gradeColor} />
                <KPI label="Sıralama" value={`#${province.rankCurrent}`} sub={`/ 81 il`} />
                <KPI label="Yıllık Değişim" value={rankDiff > 0 ? `▲ ${rankDiff}` : rankDiff < 0 ? `▼ ${Math.abs(rankDiff)}` : '0'} sub="basamak" accent={rankDiffColor} />
            </div>
            <div className="hero-map">
                <Placeholder text="Türkiye haritası silüeti, il vurgulu" compact />
            </div>
            <style>{`
                .hero-grid {
                    display: grid;
                    grid-template-columns: 1.4fr 1fr 1fr;
                    gap: 32px;
                    align-items: start;
                    flex: 1;
                }
                @media (max-width: 980px) {
                    .hero-grid { grid-template-columns: 1fr; }
                }
                .hero-grade-row {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                    margin-bottom: 22px;
                }
                .hero-grade-box {
                    width: 72px; height: 72px;
                    border-radius: 14px;
                    border: 2px solid;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 28px; font-weight: 800; letter-spacing: 0.02em;
                }
                .hero-rank {
                    font-size: 32px; font-weight: 800; color: #fff; line-height: 1;
                }
                .hero-rank-of {
                    font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.5);
                }
                .hero-rank-diff {
                    display: inline-block;
                    margin-top: 8px;
                    font-size: 12px; font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 999px;
                    letter-spacing: 0.05em;
                }
                .hero-kpis {
                    display: flex; flex-direction: column; gap: 14px;
                }
            `}</style>
        </div>
    );
}

function KPI({ label, value, sub, accent }) {
    return (
        <div style={{
            padding: '20px 22px',
            borderRadius: 12,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
        }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>{label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: accent || '#fff', marginTop: 6, lineHeight: 1 }}>
                {value}
                {sub && <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', marginLeft: 6 }}>{sub}</span>}
            </div>
        </div>
    );
}

function Placeholder({ text, compact }) {
    return (
        <div className="placeholder-box" style={compact ? { minHeight: 220, padding: 24, flex: 'none' } : undefined}>
            <em>{compact ? 'Placeholder' : 'Bu bölüm yapım aşamasında'}</em>
            <span>{text}</span>
            {!compact && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>{LOREM}</span>}
        </div>
    );
}

function PolicyPreview({ policy }) {
    if (!policy || (!policy.kisaVade.length && !policy.ortaVade.length && !policy.uzunVade.length)) {
        return <Placeholder text="Politika önerileri henüz üretilemedi." />;
    }
    return (
        <div className="policy-grid">
            <PolicyColumn title="Kısa Vade" subtitle="0-2 yıl" items={policy.kisaVade} />
            <PolicyColumn title="Orta Vade" subtitle="3-5 yıl" items={policy.ortaVade} />
            <PolicyColumn title="Uzun Vade" subtitle="5+ yıl" items={policy.uzunVade} />
            <style>{`
                .policy-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 22px;
                    flex: 1;
                }
                @media (max-width: 900px) {
                    .policy-grid { grid-template-columns: 1fr; }
                }
                .policy-col-head {
                    margin-bottom: 18px;
                    padding-bottom: 12px;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                }
                .policy-col-title {
                    font-size: 13px; font-weight: 800;
                    letter-spacing: 0.14em; text-transform: uppercase;
                    color: rgba(255,201,122,0.9);
                }
                .policy-col-sub {
                    font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px;
                }
                .policy-card {
                    padding: 16px 18px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-left: 3px solid;
                    border-radius: 10px;
                    margin-bottom: 12px;
                }
                .policy-card-title {
                    font-size: 14px; font-weight: 700;
                    color: #fff; margin: 0 0 8px;
                    line-height: 1.35;
                }
                .policy-rationale {
                    font-size: 12px; color: rgba(255,255,255,0.65);
                    line-height: 1.55; margin-bottom: 10px;
                }
                .policy-action {
                    font-size: 12px; color: rgba(255,255,255,0.45);
                    line-height: 1.55; font-style: italic;
                    margin-bottom: 10px;
                }
                .policy-impact {
                    display: inline-block;
                    font-size: 11px; font-weight: 700;
                    padding: 4px 9px;
                    border-radius: 999px;
                    background: rgba(1,153,99,0.15);
                    color: rgba(110,231,183,0.95);
                    letter-spacing: 0.03em;
                }
            `}</style>
        </div>
    );
}

function PolicyColumn({ title, subtitle, items }) {
    return (
        <div>
            <div className="policy-col-head">
                <div className="policy-col-title">{title}</div>
                <div className="policy-col-sub">{subtitle}</div>
            </div>
            {items.length === 0 ? (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic', padding: 16 }}>
                    Bu zaman dilimi için öneri üretilmedi.
                </div>
            ) : items.map((item, idx) => (
                <div key={idx} className="policy-card" style={{ borderLeftColor: item.color }}>
                    <h4 className="policy-card-title">{item.title}</h4>
                    <p className="policy-rationale">{item.rationale}</p>
                    <p className="policy-action">{item.action}</p>
                    <span className="policy-impact">{item.impact}</span>
                </div>
            ))}
        </div>
    );
}
