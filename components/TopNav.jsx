'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useData } from '../lib/DataContext';

function navItemStyle(active) {
    return {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '8px 14px',
        height: 'auto',
        fontSize: 17,
        fontWeight: 600,
        letterSpacing: '0.15px',
        lineHeight: 1.5,
        textDecoration: 'none',
        color: '#ffffff',
        background: active ? 'rgba(246,139,31,0.18)' : 'transparent',
        border: active ? '1px solid rgba(246,139,31,0.5)' : '1px solid transparent',
        borderRadius: 999,
        transition: 'color 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, text-shadow 0.2s ease, filter 0.2s ease',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: active ? '0 4px 14px rgba(246,139,31,0.25)' : 'none',
        whiteSpace: 'nowrap',
    };
}

const NavLink = ({ href, exact, children }) => {
    const pathname = usePathname();
    const stripped = (pathname.replace(/^\/deneme2/, '').replace(/\/$/, '')) || '/';
    const isActive = exact ? stripped === href : stripped.startsWith(href);
    return (
        <Link href={href} className="topnav-link" style={navItemStyle(isActive)}>
            {children}
        </Link>
    );
};

export default function TopNav({ hideBrand = false }) {
    const { provinces, globalYear, setGlobalYear } = useData();
    const [isProvincesOpen, setIsProvincesOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollY, setScrollY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const provincesRef = useRef(null);
    const yearRef = useRef(null);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollProgress = Math.min(scrollY / 240, 1);
    const baseOpacity = 0.55 - scrollProgress * 0.33;
    const headerOpacity = isHovered || isProvincesOpen || isYearOpen ? 0.72 : baseOpacity;
    const headerGlow = (isHovered || isProvincesOpen || isYearOpen) && scrollY > 40;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (provincesRef.current && !provincesRef.current.contains(event.target)) {
                setIsProvincesOpen(false);
            }
            if (yearRef.current && !yearRef.current.contains(event.target)) {
                setIsYearOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setIsProvincesOpen(false);
        setIsYearOpen(false);
        setSearchQuery('');
    }, [pathname]);

    const filteredProvinces = provinces.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stripped = (pathname.replace(/^\/deneme2/, '').replace(/\/$/, '')) || '/';
    const isProvinceActive = stripped.startsWith('/province/');

    return (
        <header
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 50,
                background: `rgba(6,16,29,${headerOpacity})`,
                backdropFilter: 'blur(14px) saturate(140%)',
                WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                boxShadow: headerGlow
                    ? '0 0 32px rgba(246,139,31,0.28), 0 2px 6px rgba(0,0,0,0.45), 0 4px 24px rgba(17,75,149,0.22)'
                    : '0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12)',
                borderBottomLeftRadius: 24,
                borderBottomRightRadius: 24,
                padding: '0 clamp(20px, 4vw, 56px)',
                height: 116,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 24,
                transition: 'background 0.25s ease, box-shadow 0.35s ease, backdrop-filter 0.3s ease',
            }}
        >
            <style>{`
                .topnav-link:hover,
                .topnav-btn:hover {
                    color: #ffffff !important;
                    text-shadow: 0 0 12px rgba(255,201,122,0.85), 0 0 22px rgba(246,139,31,0.55);
                    filter: drop-shadow(0 0 6px rgba(246,139,31,0.45));
                    background: rgba(246,139,31,0.10) !important;
                    border-color: rgba(246,139,31,0.45) !important;
                    box-shadow: 0 0 18px rgba(246,139,31,0.35), 0 4px 14px rgba(246,139,31,0.22) !important;
                }
                .topnav-link:hover svg,
                .topnav-btn:hover svg {
                    filter: drop-shadow(0 0 6px rgba(246,139,31,0.6));
                }
                .topnav-btn:hover {
                    background: rgba(255,255,255,0.1) !important;
                    color: #fff !important;
                }
                .topnav-dropdown {
                    position: absolute;
                    top: calc(100% + 8px);
                    right: 0;
                    min-width: 180px;
                    background: #ffffff;
                    border: 1px solid rgba(0,0,0,0.08);
                    border-radius: 16px;
                    padding: 8px;
                    box-shadow: 0 12px 36px rgba(0,0,0,0.18);
                    z-index: 60;
                }
                .topnav-dropdown-item {
                    display: block;
                    padding: 10px 14px;
                    border-radius: 10px;
                    font-size: 14px;
                    color: #114B95;
                    text-decoration: none;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    width: 100%;
                    text-align: left;
                    transition: background 0.15s ease;
                }
                .topnav-dropdown-item:hover {
                    background: rgba(17,75,149,0.08);
                    color: #114B95;
                }
                .topnav-search {
                    width: 100%;
                    padding: 8px 12px;
                    font-size: 13px;
                    background: #fff;
                    border: 1px solid rgba(0,0,0,0.12);
                    border-radius: 4px;
                    color: #114B95;
                    outline: none;
                    margin-bottom: 6px;
                }
                .topnav-search::placeholder {
                    color: rgba(17,75,149,0.45);
                }
            `}</style>

            {!hideBrand && (
            <Link href="/" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 16,
                textDecoration: 'none',
                flexShrink: 0,
            }}>
                <img
                    src="/deneme2/brand/aso-logo-official.svg"
                    alt="ASO"
                    style={{ height: 104, width: 'auto', filter: 'brightness(0) invert(1)', alignSelf: 'center', display: 'block' }}
                />
                <span aria-hidden="true" style={{
                    width: 1,
                    height: 42,
                    background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.22) 50%, transparent 100%)',
                    flexShrink: 0,
                }} />
                <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1 }}>
                    <span style={{
                        fontWeight: 800,
                        fontSize: 34,
                        lineHeight: 1.05,
                        letterSpacing: '0.02em',
                        whiteSpace: 'nowrap',
                        background: 'linear-gradient(135deg, #ffffff 0%, #FFD9A8 30%, #FFB36A 60%, #F68B1F 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 18px rgba(246,139,31,0.45)) drop-shadow(0 0 6px rgba(255,201,122,0.55))',
                    }}>
                        İLTEK
                    </span>
                    <span style={{
                        marginTop: 6,
                        fontSize: 11,
                        fontWeight: 500,
                        letterSpacing: '0.05em',
                        color: 'rgba(255,255,255,0.75)',
                        whiteSpace: 'nowrap',
                    }}>
                        İllerin Teknolojik Gelişmişlik Endeksi
                    </span>
                </span>
            </Link>
            )}

            <nav style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap', justifyContent: 'flex-end', marginLeft: 'auto' }}>
                <NavLink href="/rankings">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6" />
                        <line x1="8" y1="12" x2="21" y2="12" />
                        <line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" />
                        <line x1="3" y1="12" x2="3.01" y2="12" />
                        <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                    Sıralama
                </NavLink>
                <NavLink href="/compare">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    Karşılaştırma
                </NavLink>

                <div ref={provincesRef} style={{ position: 'relative' }}>
                    <button
                        type="button"
                        className="topnav-btn"
                        style={navItemStyle(isProvinceActive)}
                        onClick={() => setIsProvincesOpen(!isProvincesOpen)}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                        </svg>
                        İl Sayfaları
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transition: 'transform 0.2s ease', transform: isProvincesOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                    {isProvincesOpen && (
                        <div className="topnav-dropdown" style={{ width: 280, padding: 8 }}>
                            <input
                                type="text"
                                className="topnav-search"
                                placeholder="İl ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                                {filteredProvinces.length > 0 ? filteredProvinces.map(p => (
                                    <Link
                                        key={p.id}
                                        href={`/province/${p.id}`}
                                        className="topnav-dropdown-item"
                                        onClick={() => setIsProvincesOpen(false)}
                                    >
                                        {p.name} <span style={{ color: 'rgba(17,75,149,0.55)', fontSize: 11 }}>#{p.rankCurrent}</span>
                                    </Link>
                                )) : (
                                    <div style={{ padding: 16, color: 'rgba(17,75,149,0.55)', fontSize: 13, textAlign: 'center' }}>
                                        Sonuç bulunamadı
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div ref={yearRef} style={{ position: 'relative' }}>
                    <button
                        type="button"
                        className="topnav-btn"
                        style={navItemStyle(false)}
                        onClick={() => setIsYearOpen(!isYearOpen)}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {globalYear}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transition: 'transform 0.2s ease', transform: isYearOpen ? 'rotate(180deg)' : 'rotate(0)' }}>
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </button>
                    {isYearOpen && (
                        <div className="topnav-dropdown" style={{ minWidth: 120 }}>
                            {[2025, 2024, 2023].map(yr => (
                                <button
                                    key={yr}
                                    type="button"
                                    className="topnav-dropdown-item"
                                    style={{
                                        fontWeight: globalYear === yr ? 700 : 500,
                                        color: globalYear === yr ? '#F68B1F' : '#114B95',
                                    }}
                                    onClick={() => { setGlobalYear(yr); setIsYearOpen(false); }}
                                >
                                    {yr} {globalYear === yr && '✓'}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <NavLink href="/metodoloji">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    Metodoloji
                </NavLink>
            </nav>
        </header>
    );
}
