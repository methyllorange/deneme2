'use client';

import Link from 'next/link';
import { BRAND } from '../../lib/brand';

export default function IndirPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: '#000',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 40,
            textAlign: 'center',
        }}>
            <div style={{
                width: 80, height: 80, borderRadius: 24,
                background: `${BRAND.teal}22`,
                border: `1px solid ${BRAND.teal}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 32,
            }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={BRAND.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>İndir</h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 480, marginTop: 16 }}>
                Veri setleri (CSV/JSON), 81 il PDF raporları ve metodoloji dokümanı bu sayfada yer alacak.
            </p>
            <Link href="/" style={{
                marginTop: 32, padding: '12px 24px', borderRadius: 10,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
            }}>
                ← Ana sayfaya dön
            </Link>
        </div>
    );
}
