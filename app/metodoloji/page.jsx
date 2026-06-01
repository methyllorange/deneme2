'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BRAND } from '../../lib/brand';
import { METHODOLOGY_CATEGORIES, GRADES } from '../../lib/data/methodology';
import { turkeyPaths, VIEWBOX } from '../../lib/data/turkeyPaths';
import { provincesData, mapScoreToColor } from '../../lib/data/mockData';
import TopNav from '../../components/TopNav';

const SECTIONS = [
    { id: 'veri-seti', label: 'Veri Seti ve Kaynaklar' },
    { id: 'z-skor', label: 'Z-Skor Standardizasyonu' },
    { id: 'min-max', label: 'Min-Max Ölçeklendirme' },
    { id: 'pca', label: 'Temel Bileşenler Analizi (PCA)' },
    { id: 'kumeleme', label: 'Kümeleme Analizi' },
    { id: 'siniflandirma', label: 'Notlandırma' },
];

const TOTAL_VARS = METHODOLOGY_CATEGORIES.reduce((acc, c) => acc + c.variables.length, 0);

export default function MetodolojiPage() {
    const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [hoveredGrade, setHoveredGrade] = useState(null);
    const sectionRefs = useRef({});

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length === 0) return;
                const top = visible.reduce((best, cur) =>
                    cur.boundingClientRect.top < best.boundingClientRect.top ? cur : best
                );
                setActiveSection(top.target.id);
            },
            { rootMargin: '-30% 0px -50% 0px', threshold: 0 },
        );
        SECTIONS.forEach((s) => {
            const el = sectionRefs.current[s.id];
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            background: '#06101D',
            color: '#fff',
            fontFamily: 'inherit',
        }}>
            <TopNav />
            <Hero />
            <SectionNav active={activeSection} />

            {/* İçerik alanı: watermark yalnızca burada görünür, hero'da değil */}
            <div style={{ position: 'relative' }}>
                {/* ASO sembol watermark — sticky ile içerik scroll'u boyunca viewport merkezinde kalır */}
                <div
                    aria-hidden="true"
                    style={{
                        position: 'sticky',
                        top: 0,
                        height: '100vh',
                        width: '100%',
                        marginBottom: '-100vh',
                        pointerEvents: 'none',
                        zIndex: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <div style={{
                        width: 'min(640px, 65vw, 80vh)',
                        aspectRatio: '1520 / 1747',
                        backgroundImage: 'url(/deneme2/brand/aso-symbol-only.png)',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        opacity: 0.05,
                        filter: 'brightness(0) invert(1)',
                    }} />
                </div>

                <div style={{
                    maxWidth: 1320,
                    margin: '0 auto',
                    padding: '40px clamp(20px, 4vw, 56px) 120px',
                    position: 'relative',
                    zIndex: 1,
                }}>
                <main style={{ position: 'relative' }}>
                    {SECTIONS.map((section, i) => (
                        section.id === 'siniflandirma' ? (
                            <article
                                key={section.id}
                                id={section.id}
                                ref={(el) => { sectionRefs.current[section.id] = el; }}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 12,
                                    padding: '12px 0',
                                    borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                                    scrollMarginTop: 130,
                                }}
                            >
                                <div>
                                    <SectionContent id={section.id} onHoverCategory={setHoveredCategory} onHoverGrade={setHoveredGrade} />
                                </div>
                                <div>
                                    <SectionVisual id={section.id} hoveredCategory={hoveredCategory} hoveredGrade={hoveredGrade} />
                                </div>
                            </article>
                        ) : (
                            <article
                                key={section.id}
                                id={section.id}
                                ref={(el) => { sectionRefs.current[section.id] = el; }}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.05fr)',
                                    gap: 'clamp(28px, 4vw, 72px)',
                                    minHeight: section.id === 'veri-seti' ? undefined : 'calc(100vh - 110px)',
                                    alignItems: section.id === 'veri-seti' ? 'start' : 'center',
                                    padding: '16px 0',
                                    borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.06)',
                                    scrollMarginTop: 130,
                                }}
                            >
                                <div style={{
                                    position: 'sticky',
                                    top: 140,
                                    alignSelf: section.id === 'veri-seti' ? 'start' : 'center',
                                    height: 'fit-content',
                                    width: '100%',
                                }}>
                                    <SectionVisual id={section.id} hoveredCategory={hoveredCategory} hoveredGrade={hoveredGrade} />
                                </div>
                                <div>
                                    <SectionContent id={section.id} onHoverCategory={setHoveredCategory} onHoverGrade={setHoveredGrade} />
                                </div>
                            </article>
                        )
                    ))}
                </main>

                <ExploreIndexCTA />
            </div>
            </div>

        </div>
    );
}

function ExploreIndexCTA() {
    return (
        <Link
            href="/dashboard"
            aria-label="İllerin Teknolojik Gelişmişlik Endeksini keşfet"
            className="explore-index-cta"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                margin: '4px auto 0',
                padding: '4px 20px 0',
                width: 'fit-content',
                textDecoration: 'none',
                textAlign: 'center',
            }}
        >
            <style>{`
                @keyframes explore-index-bounce {
                    0%, 100% { transform: rotate(45deg) translate(0, 0); }
                    50%      { transform: rotate(45deg) translate(4px, 4px); }
                }
                .explore-index-cta {
                    color: rgba(255,255,255,0.55);
                    transition: color 0.25s ease, text-shadow 0.25s ease, filter 0.25s ease, transform 0.25s ease;
                }
                .explore-index-cta .eic-text { transition: border-color 0.25s ease, box-shadow 0.25s ease; }
                .explore-index-cta:hover {
                    color: #FFB36A;
                    text-shadow: 0 0 22px rgba(246,139,31,0.75), 0 0 8px rgba(246,139,31,0.55);
                    filter: drop-shadow(0 0 10px rgba(246,139,31,0.55));
                    transform: translateY(-2px);
                }
                .explore-index-cta:hover .eic-text {
                    border-color: #FFB36A;
                    box-shadow: 0 1px 0 rgba(246,139,31,0.4);
                }
            `}</style>
            <span
                className="eic-text"
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'currentColor',
                    paddingBottom: 6,
                    borderBottom: '1px solid currentColor',
                }}
            >
                İllerin Teknolojik Gelişmişlik Endeksini Keşfet
            </span>
            <span
                className="eic-arrow"
                aria-hidden="true"
                style={{
                    width: 12,
                    height: 12,
                    borderRight: '2px solid currentColor',
                    borderBottom: '2px solid currentColor',
                    animation: 'explore-index-bounce 1.6s ease-in-out infinite',
                }}
            />
        </Link>
    );
}

function Hero() {
    const onExplore = () => {
        const target = document.getElementById('veri-seti');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <section style={{
            position: 'relative',
            minHeight: 'calc(100vh - 68px)',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            isolation: 'isolate',
            overflow: 'hidden',
        }}>
            {/* Background image */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: -2,
                    backgroundImage: 'url(/deneme2/images/methodology-bg.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center 50%',
                }}
            />
            {/* Brand-tinted dark overlay */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: -1,
                    background: `
                        radial-gradient(ellipse at 18% 30%, rgba(17,75,149,0.55) 0%, transparent 55%),
                        radial-gradient(ellipse at 85% 80%, rgba(246,139,31,0.22) 0%, transparent 50%),
                        linear-gradient(180deg, rgba(6,16,29,0.78) 0%, rgba(6,16,29,0.65) 45%, rgba(6,16,29,0.92) 100%)
                    `,
                }}
            />

            <div style={{
                maxWidth: 980,
                margin: '0 auto',
                width: '100%',
                padding: 'clamp(20px, 3vw, 40px) clamp(20px, 4vw, 56px)',
                textAlign: 'center',
            }}>
            <style>{`
                @keyframes explore-bounce {
                    0%, 100% { transform: rotate(45deg) translate(0, 0); }
                    50%      { transform: rotate(45deg) translate(4px, 4px); }
                }
                .explore-btn {
                    appearance: none;
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.55);
                    cursor: pointer;
                    display: inline-flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 14px;
                    font: inherit;
                    transition: color 0.25s ease, text-shadow 0.25s ease, filter 0.25s ease, transform 0.25s ease;
                    padding: 8px 20px;
                }
                .explore-btn:hover {
                    color: #FFB36A;
                    text-shadow: 0 0 22px rgba(246,139,31,0.75), 0 0 8px rgba(246,139,31,0.55);
                    filter: drop-shadow(0 0 10px rgba(246,139,31,0.55));
                    transform: translateY(-2px);
                }
                .explore-btn:hover .explore-label {
                    border-color: #FFB36A;
                    box-shadow: 0 1px 0 rgba(246,139,31,0.4);
                }
                .explore-btn .explore-label {
                    font-size: 11px;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    font-weight: 700;
                    border-bottom: 1px solid currentColor;
                    padding-bottom: 6px;
                }
                .explore-chev {
                    width: 12px;
                    height: 12px;
                    border-right: 2px solid currentColor;
                    border-bottom: 2px solid currentColor;
                    transform: rotate(45deg);
                    animation: explore-bounce 1.6s ease-in-out infinite;
                }
            `}</style>

            <div>
                <h1 style={{
                    fontSize: 'clamp(52px, 7.5vw, 104px)',
                    fontWeight: 800,
                    lineHeight: 0.95,
                    letterSpacing: '-0.04em',
                    margin: 0,
                    maxWidth: 980,
                    background: 'linear-gradient(135deg, #ffffff 30%, #F68B1F 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 14px rgba(246,139,31,0.28)) drop-shadow(0 0 4px rgba(255,201,122,0.32))',
                }}>
                    ASO İLTEK nasıl hesaplanır?
                </h1>
                <p style={{
                    fontSize: 'clamp(16px, 1.4vw, 19px)',
                    lineHeight: 1.6,
                    color: '#fff',
                    marginTop: 28,
                    maxWidth: 720,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    İllerin Teknolojik Gelişmişlik Endeksi {TOTAL_VARS} değişken, 5 alt boyut ve üç farklı
                    kümeleme tekniğinin sentezinden oluşur. Veri standardizasyonundan harf notuna kadar
                    her adım istatistiksel olarak şeffaftır.
                </p>
            </div>
            </div>

            <button
                type="button"
                onClick={onExplore}
                className="explore-btn"
                aria-label="Metodoloji bölümlerine geç"
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 'clamp(28px, 4vw, 48px)',
                    margin: '0 auto',
                    width: 'fit-content',
                }}
            >
                <span className="explore-label">Metodolojiyi Keşfet</span>
                <span className="explore-chev" aria-hidden="true" />
            </button>
        </section>
    );
}

function SectionNav({ active }) {
    const activeIndex = SECTIONS.findIndex((s) => s.id === active);
    return (
        <nav style={{
            position: 'sticky',
            top: 52,
            zIndex: 25,
            backdropFilter: 'blur(14px) saturate(140%)',
            WebkitBackdropFilter: 'blur(14px) saturate(140%)',
            background: 'rgba(6,16,29,0.78)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
            <style>{`
                .section-nav-scroll { scrollbar-width: none; -ms-overflow-style: none; }
                .section-nav-scroll::-webkit-scrollbar { display: none; width: 0; height: 0; }
            `}</style>
            <div className="section-nav-scroll" style={{
                maxWidth: 1320,
                margin: '0 auto',
                padding: '0 clamp(8px, 1.5vw, 16px)',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'center',
                overflowX: 'auto',
            }}>
                {SECTIONS.map((s, i) => {
                    const isActive = i === activeIndex;
                    const isPast = i < activeIndex;
                    const num = String(i + 1).padStart(2, '0');
                    return (
                        <span key={s.id} style={{ display: 'inline-flex', alignItems: 'center' }}>
                            <a
                                href={`#${s.id}`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 7,
                                    padding: '11px 9px',
                                    borderBottom: isActive
                                        ? `2px solid ${BRAND.orange}`
                                        : '2px solid transparent',
                                    color: isActive ? '#fff' : (isPast ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)'),
                                    fontSize: 12.5,
                                    fontWeight: isActive ? 600 : 500,
                                    textDecoration: 'none',
                                    whiteSpace: 'nowrap',
                                    transition: 'color 0.18s ease, border-color 0.18s ease',
                                }}
                                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#fff'; }}
                                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = isPast ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.55)'; }}
                            >
                                <span style={{
                                    fontSize: 10,
                                    fontWeight: 800,
                                    letterSpacing: '0.08em',
                                    color: isActive ? BRAND.orange : (isPast ? 'rgba(246,139,31,0.65)' : 'rgba(255,255,255,0.35)'),
                                    minWidth: 18,
                                    transition: 'color 0.18s ease',
                                }}>
                                    {num}
                                </span>
                                <span>{s.label}</span>
                            </a>
                            {i < SECTIONS.length - 1 && (
                                <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                    style={{
                                        color: i < activeIndex ? 'rgba(246,139,31,0.55)' : 'rgba(255,255,255,0.2)',
                                        flexShrink: 0,
                                        transition: 'color 0.18s ease',
                                    }}
                                >
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            )}
                        </span>
                    );
                })}
            </div>
        </nav>
    );
}

function SectionContent({ id, onHoverCategory, onHoverGrade }) {
    if (id === 'veri-seti') return <DataSourcesContent onHoverCategory={onHoverCategory} />;
    if (id === 'z-skor') return <ZScoreContent />;
    if (id === 'min-max') return <MinMaxContent />;
    if (id === 'pca') return <PCAContent />;
    if (id === 'kumeleme') return <ClusteringContent />;
    if (id === 'siniflandirma') return <GradingContent onHoverGrade={onHoverGrade} />;
    return null;
}

function SectionVisual({ id, hoveredCategory, hoveredGrade }) {
    if (id === 'veri-seti') return <CategoryDonutVisual hoveredCategory={hoveredCategory} />;
    if (id === 'z-skor') return <ZScoreVisual />;
    if (id === 'min-max') return <MinMaxVisual />;
    if (id === 'pca') return <PCAVisual />;
    if (id === 'kumeleme') return <ClusteringVisual />;
    if (id === 'siniflandirma') return <GradeRampVisual hoveredGrade={hoveredGrade} />;
    return null;
}

// -------- Section contents --------

function SectionHeader({ index, title, kicker }) {
    return (
        <div style={{ marginBottom: 18 }}>
            <div style={{
                fontSize: 11,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: BRAND.orange,
                fontWeight: 700,
                marginBottom: 10,
            }}>
                {kicker}
            </div>
            <h2 style={{
                fontSize: 'clamp(28px, 2.6vw, 34px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                lineHeight: 1.15,
                margin: 0,
            }}>
                {title}
            </h2>
        </div>
    );
}

function Prose({ children }) {
    return (
        <div style={{
            fontSize: 14,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.78)',
            maxWidth: 640,
        }}>
            {children}
        </div>
    );
}

function DataSourcesContent({ onHoverCategory }) {
    return (
        <>
            <SectionHeader kicker="Adım 01" title="Veri Seti ve Kaynaklar" compact />
            <Prose compact>
                <p style={{ margin: 0 }}>
                    Endeks, beş ana boyut altında toplam <strong style={{ color: '#fff' }}>{TOTAL_VARS} değişkenle</strong> kurulur.
                    Tüm değişkenler kamuya açık kurumsal kaynaklardan; referans yılı ve birim tablolarda belirtilmiştir.
                </p>
            </Prose>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
                {METHODOLOGY_CATEGORIES.map((cat) => (
                    <CategoryTable
                        key={cat.id}
                        category={cat}
                        onHoverCategory={onHoverCategory}
                        compact
                    />
                ))}
            </div>
        </>
    );
}

function CategoryTable({ category, defaultOpen = false, onHoverCategory, compact = false }) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div
            onMouseEnter={() => onHoverCategory && onHoverCategory(category.id)}
            onMouseLeave={() => onHoverCategory && onHoverCategory(null)}
            style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.015)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            }}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                style={{
                    width: '100%',
                    minHeight: compact ? 44 : 76,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: compact ? '7px 16px' : '14px 22px',
                    borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                    background: `linear-gradient(90deg, ${category.color}1a 0%, transparent 60%)`,
                    border: 'none',
                    borderLeft: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    font: 'inherit',
                    textAlign: 'left',
                    transition: 'background-color 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
                <span style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: category.color,
                    boxShadow: `0 0 0 4px ${category.color}33`,
                    flexShrink: 0,
                }} />
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '0.01em', flex: 1 }}>
                    {category.title}
                </h3>
                <span style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.5)',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                }}>
                    {category.variables.length} DEĞİŞKEN
                </span>
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{
                        color: 'rgba(255,255,255,0.6)',
                        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        flexShrink: 0,
                    }}
                >
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </button>
            {open && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <th style={th}>Değişken</th>
                            <th style={{ ...th, width: 200 }}>Kaynak</th>
                            <th style={{ ...th, width: 90 }}>Yıl</th>
                            <th style={{ ...th, width: 70 }}>Birim</th>
                        </tr>
                    </thead>
                    <tbody>
                        {category.variables.map((v, i) => (
                            <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={td}>{v.name}</td>
                                <td style={{ ...td, color: 'rgba(255,255,255,0.6)' }}>{v.source}</td>
                                <td style={{ ...td, color: 'rgba(255,255,255,0.6)' }}>{v.year}</td>
                                <td style={{ ...td, color: 'rgba(255,255,255,0.6)' }}>{v.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

const th = {
    padding: '12px 18px',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'left',
};
const td = {
    padding: '14px 18px',
    fontSize: 13,
    lineHeight: 1.5,
    color: 'rgba(255,255,255,0.85)',
    verticalAlign: 'top',
};

function ZScoreContent() {
    return (
        <>
            <SectionHeader kicker="Adım 02" title="Z-Skor Standardizasyonu" compact />
            <Prose compact>
                <p style={{ margin: '0 0 16px' }}>
                    Farklı birimlere sahip (adet, TL, oran vb.) değişkenleri karşılaştırılabilir
                    yapmak için ilk aşamada <strong style={{ color: '#fff' }}>Z-skoru</strong> dönüşümü
                    uygulanır. Bu yöntem, her gözlemin ortalamadan sapmasını standart sapma cinsinden
                    ifade eder.
                </p>
                <Formula latex="Z = \frac{x - \overline{x}}{\sigma}" plain="Z = (x − Ortalama) / Standart Sapma" />
                <p style={{ margin: '16px 0 0' }}>
                    Z-skoru 0 etrafında merkezlidir; pozitif değerler ortalama üzerini, negatif değerler
                    ortalama altını ifade eder. Bu adım birim farkını ortadan kaldırır.
                </p>
            </Prose>
        </>
    );
}

function MinMaxContent() {
    return (
        <>
            <SectionHeader kicker="Adım 03" title="Min-Max Yeniden Ölçeklendirme" compact />
            <Prose compact>
                <p style={{ margin: '0 0 14px' }}>
                    Z-skorları, endeks skorlarının <strong style={{ color: '#fff' }}>0 ile 1</strong> arasında
                    değer almasını sağlamak için min-max yöntemiyle yeniden ölçeklendirilir.
                </p>
                <Formula latex="x' = \frac{x - \min(x)}{\max(x) - \min(x)}" plain="x' = (x − min(x)) / (max(x) − min(x))" />
                <p style={{ margin: '14px 0 0' }}>
                    İşsizlik oranı gibi <strong style={{ color: '#fff' }}>ters yönlü</strong> değişkenler için
                    ters ölçeklendirme uygulanır:
                </p>
                <Formula latex="x' = \frac{\max(x) - x}{\max(x) - \min(x)}" plain="x' = (max(x) − x) / (max(x) − min(x))" />
            </Prose>
        </>
    );
}

function PCAContent() {
    return (
        <>
            <SectionHeader kicker="Adım 04" title="Temel Bileşenler Analizi (PCA)" compact />
            <Prose compact>
                <p style={{ margin: '0 0 14px' }}>
                    Değişkenlerin ve alt endekslerin ağırlıkları, subjektif yargılar yerine veri
                    setindeki <strong style={{ color: '#fff' }}>varyansı</strong> esas alan
                    Temel Bileşenler Analizi (PCA) ile belirlenir.
                </p>
                <BulletList items={[
                    'Değişkenler arasındaki çoklu doğrusal bağlantı (multicollinearity) sorunu minimize edilir.',
                    'Her alt endeks için özdeğeri 1’den büyük olan temel bileşenler dikkate alınır.',
                    'Bileşenlerin açıkladığı varyans oranlarına göre ağırlıklı skorlar oluşturulur.',
                    'Nihai ASO-İLTEK skoru, 5 alt endeksin PCA ile birleştirilmesinden elde edilen birinci temel bileşen skorudur.',
                ]} />
            </Prose>
        </>
    );
}

function ClusteringContent() {
    return (
        <>
            <SectionHeader kicker="Adım 05" title="Kümeleme Analizi" />
            <Prose>
                <p style={{ margin: '0 0 16px' }}>
                    İllerin teknolojik gelişmişlik düzeylerine göre sınıflandırılmasında tek bir yöntem
                    yerine <strong style={{ color: '#fff' }}>üç farklı kümeleme tekniğinin sentezi</strong> kullanılır.
                </p>
            </Prose>

            <div style={{ display: 'grid', gap: 8, marginTop: 4 }}>
                <ClusteringCard
                    num="1"
                    title="Eşit Aralıklar"
                    desc="Skor aralığını eşit parçalara böler. Yorumlanması en kolay; uç değerlerden etkilenebilir."
                />
                <ClusteringCard
                    num="2"
                    title="Jenks Doğal Kırılmalar"
                    desc="Veri içindeki doğal gruplaşmaları ve kopuş noktalarını tespit ederek sınıf içi varyansı minimize eder."
                />
                <ClusteringCard
                    num="3"
                    title="K-Ortalamalar (K-Means)"
                    desc="İlleri benzerliklerine göre homojen gruplara ayırır. Geometrik mesafeye dayanır."
                />
            </div>

            <div style={{
                marginTop: 14,
                padding: '12px 16px',
                borderRadius: 10,
                border: `1px solid ${BRAND.orange}33`,
                background: `${BRAND.orange}0a`,
                fontSize: 13,
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.85)',
            }}>
                <strong style={{ color: BRAND.orange }}>Sentez:</strong> Her ilin üç yönteme göre aldığı küme değerlerinin
                ortalaması nihai harf notunu verir; uç değerlerin sapma etkisini dengeler.
            </div>
        </>
    );
}

function ClusteringCard({ num, title, desc }) {
    return (
        <div style={{
            display: 'flex',
            gap: 12,
            padding: '10px 14px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            alignItems: 'center',
        }}>
            <div style={{
                flexShrink: 0,
                width: 28,
                height: 28,
                borderRadius: 6,
                background: `${BRAND.orange}1a`,
                color: BRAND.orange,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 14,
            }}>
                {num}
            </div>
            <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 700 }}>{title}</h4>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.7)' }}>{desc}</p>
            </div>
        </div>
    );
}

function GradingContent({ onHoverGrade }) {
    return (
        <>
            <div style={{ marginBottom: 12, maxWidth: 920 }}>
                <div style={{
                    fontSize: 11,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: BRAND.orange,
                    fontWeight: 700,
                    marginBottom: 8,
                }}>
                    Adım 06
                </div>
                <h2 style={{
                    fontSize: 'clamp(26px, 2.4vw, 32px)',
                    fontWeight: 800,
                    letterSpacing: '-0.025em',
                    lineHeight: 1.1,
                    margin: '0 0 8px',
                }}>
                    Notlandırma
                </h2>
                <p style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.5,
                    color: 'rgba(255,255,255,0.72)',
                    maxWidth: 720,
                }}>
                    Üçlü kümeleme sentezi sonucunda her ile 8 kademeli bir harf notu atanır.
                    AA en üst, FF en alt kümeyi temsil eder.
                </p>
            </div>

            <div style={{ display: 'grid', gap: 6, marginTop: 4, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
                {GRADES.map((g) => (
                    <div
                        key={g.letter}
                        onMouseEnter={() => onHoverGrade && onHoverGrade(g.letter)}
                        onMouseLeave={() => onHoverGrade && onHoverGrade(null)}
                        style={{
                            display: 'flex',
                            gap: 8,
                            alignItems: 'center',
                            padding: '6px 9px',
                            borderRadius: 7,
                            border: '1px solid rgba(255,255,255,0.07)',
                            background: 'rgba(255,255,255,0.02)',
                            cursor: 'default',
                            transition: 'border-color 0.18s ease, background 0.18s ease',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = `${g.color}66`;
                            e.currentTarget.style.background = `${g.color}08`;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                            e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                        }}>
                        <div style={{
                            flexShrink: 0,
                            width: 26,
                            height: 26,
                            borderRadius: 5,
                            background: g.color,
                            color: '#fff',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: 11,
                            letterSpacing: '0.02em',
                            boxShadow: `0 3px 10px -3px ${g.color}99`,
                        }}>
                            {g.letter}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 1 }}>{g.label}</div>
                            <div style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', lineHeight: 1.35 }}>{g.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function BulletList({ items }) {
    return (
        <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0 }}>
            {items.map((t, i) => (
                <li key={i} style={{
                    display: 'flex',
                    gap: 12,
                    padding: '10px 0',
                    borderTop: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)',
                }}>
                    <span style={{
                        flexShrink: 0,
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: BRAND.orange,
                        marginTop: 9,
                    }} />
                    <span>{t}</span>
                </li>
            ))}
        </ul>
    );
}

function Formula({ latex, plain }) {
    return (
        <div style={{
            margin: '24px 0 0',
            padding: '22px 26px',
            borderRadius: 10,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: 22,
            letterSpacing: '0.01em',
            color: '#fff',
            fontFamily: '"Cambria Math", "Latin Modern Math", Georgia, serif',
            fontStyle: 'italic',
            textAlign: 'center',
        }}>
            {plain}
        </div>
    );
}

// -------- Visualizations (left sticky) --------

function CategoryDonutVisual({ hoveredCategory }) {
    const total = TOTAL_VARS;
    let cum = 0;
    const arcs = METHODOLOGY_CATEGORIES.map((c) => {
        const start = cum;
        cum += c.variables.length;
        return { ...c, start, end: cum, count: c.variables.length };
    });

    const cx = 160;
    const cy = 160;
    const rOuter = 130;
    const rInner = 76;

    function arcPath(startVal, endVal, outerR, innerR) {
        const a0 = (startVal / total) * Math.PI * 2 - Math.PI / 2;
        const a1 = (endVal / total) * Math.PI * 2 - Math.PI / 2;
        const large = endVal - startVal > total / 2 ? 1 : 0;
        const x0 = cx + outerR * Math.cos(a0);
        const y0 = cy + outerR * Math.sin(a0);
        const x1 = cx + outerR * Math.cos(a1);
        const y1 = cy + outerR * Math.sin(a1);
        const xi1 = cx + innerR * Math.cos(a1);
        const yi1 = cy + innerR * Math.sin(a1);
        const xi0 = cx + innerR * Math.cos(a0);
        const yi0 = cy + innerR * Math.sin(a0);
        return `M ${x0} ${y0} A ${outerR} ${outerR} 0 ${large} 1 ${x1} ${y1} L ${xi1} ${yi1} A ${innerR} ${innerR} 0 ${large} 0 ${xi0} ${yi0} Z`;
    }

    return (
        <div style={{
            padding: '24px 22px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            minHeight: 'inherit',
        }}>
            <svg viewBox="0 0 320 320" style={{ width: '100%', maxWidth: 340, display: 'block', margin: '0 auto' }}>
                <defs>
                    <filter id="arc-glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur stdDeviation="5" />
                    </filter>
                </defs>
                {arcs.map((a) => {
                    const isHovered = hoveredCategory === a.id;
                    const isDimmed = hoveredCategory && !isHovered;
                    const outerR = isHovered ? rOuter + 8 : rOuter;
                    return (
                        <g key={a.id} style={{ transition: 'opacity 0.25s ease' }}>
                            {isHovered && (
                                <path
                                    d={arcPath(a.start, a.end, outerR + 4, rInner)}
                                    fill={a.color}
                                    opacity={0.5}
                                    filter="url(#arc-glow)"
                                />
                            )}
                            <path
                                d={arcPath(a.start, a.end, outerR, rInner)}
                                fill={a.color}
                                opacity={isDimmed ? 0.25 : (isHovered ? 1 : 0.92)}
                                style={{ transition: 'opacity 0.2s ease, d 0.25s ease' }}
                            />
                        </g>
                    );
                })}
                <circle cx={cx} cy={cy} r={rInner - 1} fill="#0a1322" />
                <text x={cx} y={cy - 14} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" letterSpacing="0.22em" fontWeight="700">
                    {hoveredCategory ? 'BOYUT' : 'TOPLAM'}
                </text>
                <text x={cx} y={cy + 18} textAnchor="middle" fill="#fff" fontSize="40" fontWeight="800">
                    {hoveredCategory ? (arcs.find((a) => a.id === hoveredCategory)?.count ?? total) : total}
                </text>
                <text x={cx} y={cy + 38} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="10" letterSpacing="0.2em" fontWeight="600">
                    DEĞİŞKEN
                </text>
            </svg>
            <div style={{
                marginTop: 20,
                minHeight: 28,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                textAlign: 'center',
            }}>
                {hoveredCategory ? (
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#fff',
                    }}>
                        <span style={{
                            width: 10,
                            height: 10,
                            borderRadius: 999,
                            background: arcs.find((a) => a.id === hoveredCategory)?.color,
                            boxShadow: `0 0 0 4px ${arcs.find((a) => a.id === hoveredCategory)?.color}30`,
                        }} />
                        {arcs.find((a) => a.id === hoveredCategory)?.title}
                    </div>
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        flexWrap: 'wrap',
                    }}>
                        {arcs.map((a) => (
                            <span key={a.id} style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 4,
                                fontSize: 11,
                                color: 'rgba(255,255,255,0.7)',
                                fontWeight: 600,
                            }}>
                                <span style={{ width: 7, height: 7, borderRadius: 999, background: a.color }} />
                                {a.count}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function ZScoreVisual() {
    const points = Array.from({ length: 60 }, (_, i) => {
        const x = (i / 59 - 0.5) * 6;
        const y = Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);
        return { x: 50 + (x + 3) * (260 / 6), y: 220 - y * 380 };
    });
    const path = `M ${points.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')}`;
    return (
        <VisualFrame>
            <svg viewBox="0 0 360 260" style={{ width: '100%', display: 'block' }}>
                <defs>
                    <linearGradient id="zgrad" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={BRAND.orange} stopOpacity="0.55" />
                        <stop offset="100%" stopColor={BRAND.orange} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`${path} L 310 220 L 50 220 Z`} fill="url(#zgrad)" />
                <path d={path} fill="none" stroke={BRAND.orange} strokeWidth="2.5" />
                {[-3, -2, -1, 0, 1, 2, 3].map((v) => {
                    const x = 50 + (v + 3) * (260 / 6);
                    return (
                        <g key={v}>
                            <line x1={x} y1={220} x2={x} y2={225} stroke="rgba(255,255,255,0.35)" />
                            <text x={x} y={240} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">{v >= 0 ? `+${v}` : v}</text>
                        </g>
                    );
                })}
                <line x1={180} y1={50} x2={180} y2={220} stroke="rgba(246,139,31,0.35)" strokeDasharray="4 4" />
                <text x={180} y={42} textAnchor="middle" fill={BRAND.orange} fontSize="11" fontWeight="700">μ = 0</text>
            </svg>
            <div style={{ marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                Z-skor dönüşümü tüm değişkenleri ortalaması 0, standart sapması 1 olan ortak ölçeğe taşır.
            </div>
        </VisualFrame>
    );
}

function MinMaxVisual() {
    const bars = [
        { label: 'min(x)', raw: 12, scaled: 0 },
        { label: 'q25', raw: 35, scaled: 0.27 },
        { label: 'q50', raw: 58, scaled: 0.54 },
        { label: 'q75', raw: 78, scaled: 0.77 },
        { label: 'max(x)', raw: 100, scaled: 1 },
    ];
    return (
        <VisualFrame>
            {/* Header row: column titles */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '60px 60px 1fr 70px',
                gap: 14,
                alignItems: 'center',
                paddingBottom: 14,
                marginBottom: 18,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
            }}>
                <span>Konum</span>
                <span style={{ textAlign: 'right' }}>Ham</span>
                <span style={{ textAlign: 'center' }}>Eşleme</span>
                <span style={{ textAlign: 'right' }}>Ölçek</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {bars.map((b, i) => (
                    <div key={b.label} style={{
                        display: 'grid',
                        gridTemplateColumns: '60px 60px 1fr 70px',
                        gap: 14,
                        alignItems: 'center',
                    }}>
                        <span style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.85)',
                            fontFamily: '"Cambria Math", Georgia, serif',
                            fontStyle: 'italic',
                        }}>
                            {b.label}
                        </span>
                        <span style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: 'rgba(255,255,255,0.55)',
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                        }}>
                            {b.raw}
                        </span>
                        <div style={{
                            position: 'relative',
                            height: 14,
                            borderRadius: 7,
                            background: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            overflow: 'visible',
                        }}>
                            <div style={{
                                width: `${b.scaled * 100}%`,
                                height: '100%',
                                background: `linear-gradient(90deg, ${BRAND.orange}, #ea580c)`,
                                borderRadius: 7,
                                boxShadow: `0 0 12px ${BRAND.orange}55`,
                                transition: 'width 0.4s ease',
                            }} />
                            {b.scaled > 0 && b.scaled < 1 && (
                                <span style={{
                                    position: 'absolute',
                                    left: `calc(${b.scaled * 100}% - 6px)`,
                                    top: -3,
                                    width: 12,
                                    height: 20,
                                    background: '#fff',
                                    borderRadius: 3,
                                    boxShadow: `0 0 0 2px ${BRAND.orange}, 0 4px 12px ${BRAND.orange}88`,
                                }} />
                            )}
                        </div>
                        <span style={{
                            fontSize: 16,
                            fontWeight: 800,
                            color: BRAND.orange,
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                            letterSpacing: '-0.01em',
                        }}>
                            {b.scaled.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Footer axis: 0 → 1 scale indicator */}
            <div style={{
                marginTop: 24,
                paddingTop: 18,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                color: 'rgba(255,255,255,0.5)',
                fontWeight: 600,
                letterSpacing: '0.04em',
            }}>
                <span>0.00</span>
                <span style={{
                    flex: 1,
                    height: 1,
                    margin: '0 12px',
                    background: 'linear-gradient(90deg, transparent, rgba(246,139,31,0.6), transparent)',
                }} />
                <span style={{ color: BRAND.orange, fontWeight: 700 }}>0 — 1 ölçek</span>
                <span style={{
                    flex: 1,
                    height: 1,
                    margin: '0 12px',
                    background: 'linear-gradient(90deg, transparent, rgba(246,139,31,0.6), transparent)',
                }} />
                <span>1.00</span>
            </div>
        </VisualFrame>
    );
}

function PCAVisual() {
    const eigenvalues = [3.6, 2.2, 1.4, 0.9, 0.5, 0.3, 0.1];
    return (
        <VisualFrame>
            <svg viewBox="0 0 360 240" style={{ width: '100%', display: 'block' }}>
                <line x1={40} y1={200} x2={340} y2={200} stroke="rgba(255,255,255,0.15)" />
                <line x1={40} y1={30} x2={40} y2={200} stroke="rgba(255,255,255,0.15)" />
                <line x1={40} y1={160} x2={340} y2={160} stroke={BRAND.orange} strokeDasharray="4 4" opacity="0.7" />
                <rect x={246} y={146} width={94} height={18} rx={3} fill="rgba(6,16,29,0.92)" stroke={`${BRAND.orange}55`} strokeWidth="1" />
                <text x={293} y={158} textAnchor="middle" fill={BRAND.orange} fontSize="10.5" fontWeight="700" letterSpacing="0.04em">Eigenvalue = 1</text>
                {eigenvalues.map((v, i) => {
                    const x = 60 + i * 40;
                    const h = v * 40;
                    const above = v >= 1;
                    return (
                        <g key={i}>
                            <rect
                                x={x}
                                y={200 - h}
                                width={28}
                                height={h}
                                fill={above ? BRAND.orange : 'rgba(255,255,255,0.18)'}
                                rx="2"
                            />
                            <text x={x + 14} y={216} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="11">PC{i + 1}</text>
                            <text x={x + 14} y={200 - h - 6} textAnchor="middle" fill={above ? BRAND.orange : 'rgba(255,255,255,0.4)'} fontSize="11" fontWeight="700">{v.toFixed(1)}</text>
                        </g>
                    );
                })}
            </svg>
            <div style={{ marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
                Özdeğeri 1’den büyük olan bileşenler (turuncu) endeks ağırlıklarına dahil edilir.
            </div>
        </VisualFrame>
    );
}

function ClusteringVisual() {
    const items = [
        { name: 'Eşit Aralıklar', tag: '01', dots: [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95] },
        { name: 'Jenks Doğal Kırılmalar', tag: '02', dots: [0.08, 0.22, 0.31, 0.55, 0.62, 0.85, 0.92] },
        { name: 'K-Ortalamalar', tag: '03', dots: [0.1, 0.16, 0.32, 0.48, 0.7, 0.78, 0.94] },
    ];
    const groups = ['#114B95', '#2D6EBA', '#5BA0D8', '#9B92C6', '#D89A8B', '#D45A4F', '#B1172B'];
    return (
        <VisualFrame>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                {items.map((row) => (
                    <div key={row.name}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            marginBottom: 14,
                        }}>
                            <span style={{
                                fontSize: 11,
                                fontWeight: 800,
                                letterSpacing: '0.12em',
                                color: BRAND.orange,
                                background: `${BRAND.orange}1a`,
                                padding: '4px 9px',
                                borderRadius: 4,
                            }}>{row.tag}</span>
                            <span style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{row.name}</span>
                        </div>
                        <div style={{ position: 'relative', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 999 }}>
                            {row.dots.map((d, i) => (
                                <span key={i} style={{
                                    position: 'absolute',
                                    left: `calc(${d * 100}% - 9px)`,
                                    top: -3,
                                    width: 18,
                                    height: 18,
                                    borderRadius: 999,
                                    background: groups[i],
                                    boxShadow: `0 0 0 3px #06101D, 0 4px 12px ${groups[i]}55`,
                                }} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 13,
                color: 'rgba(255,255,255,0.7)',
                lineHeight: 1.5,
            }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={BRAND.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
                <span>Her ilin üç yönteme göre aldığı sınıf değerlerinin <strong style={{ color: '#fff', fontWeight: 700 }}>ortalaması</strong> nihai notu verir.</span>
            </div>
        </VisualFrame>
    );
}

function GradeRampVisual({ hoveredGrade: externalHoveredGrade }) {
    const [year, setYear] = useState(2025);
    const [hoveredId, setHoveredId] = useState(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [selectedId, setSelectedId] = useState(null);
    const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
    const closeTimeoutRef = useRef(null);

    const scheduleClose = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(() => setHoveredId(null), 180);
    };
    const cancelClose = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
    };

    const provinceGrades = {};
    const provinceMap = {};
    provincesData.forEach((p) => {
        provinceGrades[p.id] = p.history[year].grade;
        provinceMap[p.id] = p;
    });
    const gradeColorMap = GRADES.reduce((acc, g) => ({ ...acc, [g.letter]: g.color }), {});
    const gradeLabelMap = GRADES.reduce((acc, g) => ({ ...acc, [g.letter]: g.label }), {});

    const hoveredProvince = hoveredId ? provinceMap[hoveredId] : null;
    const hoveredGrade = hoveredId ? provinceGrades[hoveredId] : null;
    const hoveredRank = hoveredProvince ? hoveredProvince.history[year].rank : null;
    const hoveredScore = hoveredProvince ? hoveredProvince.history[year].scores.overall : null;

    const handleMouseMove = (e, id) => {
        cancelClose();
        const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
        setHoveredId(id);
        setTooltipPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
        }}>
            {/* Header: centered title + year selector on right */}
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                minHeight: 30,
            }}>
                <div style={{
                    fontSize: 13,
                    fontWeight: 800,
                    letterSpacing: '0.2em',
                    color: 'rgba(255,255,255,0.75)',
                    textTransform: 'uppercase',
                    textAlign: 'center',
                }}>
                    İllerin Teknolojik Gelişmişlik Endeksi
                </div>
                <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'inline-flex',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    padding: 2,
                    gap: 2,
                }}>
                    {[2023, 2024, 2025].map((y) => (
                        <button
                            key={y}
                            type="button"
                            onClick={() => setYear(y)}
                            style={{
                                appearance: 'none',
                                border: 'none',
                                background: year === y ? BRAND.orange : 'transparent',
                                color: year === y ? '#fff' : 'rgba(255,255,255,0.65)',
                                fontSize: 11.5,
                                fontWeight: 700,
                                letterSpacing: '0.04em',
                                padding: '4px 10px',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                transition: 'background 0.18s ease, color 0.18s ease',
                            }}
                        >
                            {y}
                        </button>
                    ))}
                </div>
            </div>

            {/* Map */}
            <div style={{ position: 'relative', maxWidth: 720, margin: '0 auto' }}>
                <svg
                    viewBox={VIEWBOX}
                    style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}
                    onMouseLeave={scheduleClose}
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
                    {turkeyPaths.map((p) => {
                        const grade = provinceGrades[p.id] || 'DD';
                        const color = gradeColorMap[grade] || '#3D3A6E';
                        const isHovered = hoveredId === p.id;
                        const isSelected = selectedId === p.id;
                        const isGradeMatch = externalHoveredGrade && grade === externalHoveredGrade;
                        let opacity = 0.92;
                        if (selectedId) opacity = isSelected ? 1 : 0.3;
                        else if (externalHoveredGrade) opacity = isGradeMatch ? 1 : 0.18;
                        else if (hoveredId) opacity = isHovered ? 1 : 0.45;
                        const showGlow = isSelected || isHovered || isGradeMatch;
                        return (
                            <path
                                key={p.id}
                                d={p.d}
                                fill={color}
                                fillOpacity={opacity}
                                stroke={(isSelected || isHovered || isGradeMatch) ? '#fff' : 'rgba(255,255,255,0.12)'}
                                strokeWidth={isSelected ? 1.6 : (isHovered ? 1.2 : (isGradeMatch ? 0.9 : 0.5))}
                                filter={showGlow ? 'url(#province-glow)' : undefined}
                                style={{
                                    cursor: 'pointer',
                                    transition: 'fill-opacity 0.15s ease, stroke 0.15s ease, stroke-width 0.15s ease',
                                }}
                                onMouseEnter={(e) => handleMouseMove(e, p.id)}
                                onMouseMove={(e) => handleMouseMove(e, p.id)}
                                onClick={(e) => {
                                    const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                                    setSelectedId(p.id);
                                    setPopupPos({
                                        x: e.clientX - rect.left,
                                        y: e.clientY - rect.top,
                                    });
                                }}
                            />
                        );
                    })}
                </svg>

                {/* Tooltip (hover) — gizlenir popup açıkken */}
                {hoveredProvince && !selectedId && (
                    <div
                        onMouseEnter={cancelClose}
                        onMouseLeave={scheduleClose}
                        style={{
                            position: 'absolute',
                            left: tooltipPos.x,
                            top: tooltipPos.y - 12,
                            transform: 'translate(-50%, -100%)',
                            background: 'rgba(6,16,29,0.98)',
                            backdropFilter: 'blur(14px)',
                            border: '1px solid rgba(255,255,255,0.14)',
                            borderRadius: 10,
                            padding: '10px 12px',
                            zIndex: 10,
                            minWidth: 220,
                            boxShadow: '0 12px 28px rgba(0,0,0,0.55)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', flex: 1 }}>{hoveredProvince.name}</span>
                            <span style={{
                                fontSize: 10,
                                fontWeight: 800,
                                color: gradeColorMap[hoveredGrade],
                                background: `${gradeColorMap[hoveredGrade]}25`,
                                padding: '2px 7px',
                                borderRadius: 3,
                                letterSpacing: '0.04em',
                            }}>
                                {hoveredGrade}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: 8, fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 9 }}>
                            <span>{gradeLabelMap[hoveredGrade]}</span>
                            <span>·</span>
                            <span>Puan <strong style={{ color: '#fff' }}>{hoveredScore.toFixed(1)}</strong></span>
                            <span>·</span>
                            <span>#<strong style={{ color: '#fff' }}>{hoveredRank}</strong></span>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <Link
                                href={`/province/${hoveredId}`}
                                style={{
                                    flex: 1,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '7px 10px',
                                    background: BRAND.orange,
                                    color: '#fff',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    borderRadius: 6,
                                    textDecoration: 'none',
                                    letterSpacing: '0.02em',
                                    transition: 'opacity 0.18s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                            >
                                Keşfet
                            </Link>
                            <Link
                                href={`/compare?with=${hoveredId}`}
                                style={{
                                    flex: 1,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '7px 10px',
                                    background: 'rgba(255,255,255,0.06)',
                                    color: '#fff',
                                    fontSize: 12,
                                    fontWeight: 700,
                                    borderRadius: 6,
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    textDecoration: 'none',
                                    letterSpacing: '0.02em',
                                    transition: 'background 0.18s ease',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                            >
                                Karşılaştır
                            </Link>
                        </div>
                    </div>
                )}

                {/* Popup (click) */}
                {selectedId && provinceMap[selectedId] && (() => {
                    const sel = provinceMap[selectedId];
                    const selGrade = provinceGrades[selectedId];
                    const selRank = sel.history[year].rank;
                    const selScore = sel.history[year].scores.overall;
                    return (
                        <>
                            {/* Click-outside catcher */}
                            <div
                                onClick={() => setSelectedId(null)}
                                style={{
                                    position: 'fixed',
                                    inset: 0,
                                    zIndex: 9,
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                left: popupPos.x,
                                top: popupPos.y - 12,
                                transform: 'translate(-50%, -100%)',
                                background: 'rgba(6,16,29,0.98)',
                                backdropFilter: 'blur(14px)',
                                border: '1px solid rgba(255,255,255,0.14)',
                                borderRadius: 10,
                                padding: '12px 14px',
                                zIndex: 10,
                                minWidth: 220,
                                boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: '#fff', flex: 1 }}>{sel.name}</span>
                                    <span style={{
                                        fontSize: 11,
                                        fontWeight: 800,
                                        color: gradeColorMap[selGrade],
                                        background: `${gradeColorMap[selGrade]}25`,
                                        padding: '3px 8px',
                                        borderRadius: 4,
                                        letterSpacing: '0.04em',
                                    }}>
                                        {selGrade}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); setSelectedId(null); }}
                                        style={{
                                            appearance: 'none',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'rgba(255,255,255,0.45)',
                                            cursor: 'pointer',
                                            padding: 0,
                                            fontSize: 16,
                                            lineHeight: 1,
                                            fontFamily: 'inherit',
                                        }}
                                        aria-label="Kapat"
                                    >
                                        ×
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: 'rgba(255,255,255,0.65)', marginBottom: 10 }}>
                                    <span>{gradeLabelMap[selGrade]}</span>
                                    <span>·</span>
                                    <span>Puan <strong style={{ color: '#fff' }}>{selScore.toFixed(1)}</strong></span>
                                    <span>·</span>
                                    <span>#<strong style={{ color: '#fff' }}>{selRank}</strong></span>
                                </div>
                                <div style={{ display: 'flex', gap: 6 }}>
                                    <Link
                                        href={`/province/${selectedId}`}
                                        style={{
                                            flex: 1,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 6,
                                            padding: '8px 10px',
                                            background: BRAND.orange,
                                            color: '#fff',
                                            fontSize: 12,
                                            fontWeight: 700,
                                            borderRadius: 6,
                                            textDecoration: 'none',
                                            letterSpacing: '0.02em',
                                            transition: 'opacity 0.18s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                                    >
                                        Keşfet
                                    </Link>
                                    <Link
                                        href={`/compare?with=${selectedId}`}
                                        style={{
                                            flex: 1,
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 6,
                                            padding: '8px 10px',
                                            background: 'rgba(255,255,255,0.06)',
                                            color: '#fff',
                                            fontSize: 12,
                                            fontWeight: 700,
                                            borderRadius: 6,
                                            border: '1px solid rgba(255,255,255,0.12)',
                                            textDecoration: 'none',
                                            letterSpacing: '0.02em',
                                            transition: 'background 0.18s ease',
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                                    >
                                        Karşılaştır
                                    </Link>
                                </div>
                            </div>
                        </>
                    );
                })()}
            </div>

        </div>
    );
}

function VisualFrame({ children }) {
    return (
        <div style={{
            padding: '28px 26px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
        }}>
            {children}
        </div>
    );
}

function Footer() {
    return (
        <footer style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '40px clamp(20px, 4vw, 56px)',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 13,
            textAlign: 'center',
        }}>
            Kaynak: ASO İLTEK 2025 Raporu, Metodoloji Eki (s.166–168).
            <span style={{ margin: '0 8px', opacity: 0.5 }}>•</span>
            <a href="/deneme2/reports/aso-iltek-2025.pdf" target="_blank" rel="noopener noreferrer" style={{ color: BRAND.orange, textDecoration: 'none' }}>
                Tam raporu indir →
            </a>
        </footer>
    );
}
