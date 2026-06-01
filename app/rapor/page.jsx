'use client';

import Link from 'next/link';
import { BRAND } from '../../lib/brand';

export default function RaporPage() {
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
                background: `${BRAND.orange}22`,
                border: `1px solid ${BRAND.orange}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 32,
            }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={BRAND.orange} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                </svg>
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>Rapor</h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 480, marginTop: 16 }}>
                81 il için AI destekli teknoloji raporu yakında. Politika önerileri, zayıf alan analizi, trend yorumları.
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
