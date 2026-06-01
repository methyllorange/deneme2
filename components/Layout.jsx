'use client';

import { usePathname } from 'next/navigation';
import TopNav from './TopNav';

const Layout = ({ children }) => {
    const pathname = usePathname();
    // Dashboard'un kendi tam-ekran arka planı (hub-bg) var; bu slideshow orada
    // tamamen onun arkasında kalıp görünmüyor ama 5 katman compositing yapıyor.
    // Açılış anındaki GPU yükünü düşürmek için dashboard'da render etmiyoruz.
    const showSlideshow = !pathname?.startsWith('/dashboard');
    return (
        <div className="app-layout" style={{ position: 'relative', minHeight: '100vh' }}>
            {showSlideshow && (
            <div className="dash-bg" aria-hidden="true" style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
            }}>
                {[1, 2, 3, 4, 5].map((i) => (
                    <img
                        key={i}
                        src={`/deneme2/images/landing-bg-${i}.jpg`}
                        alt=""
                        aria-hidden="true"
                        className="dash-bg-slide"
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
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(3,7,18,0.78) 0%, rgba(3,7,18,0.86) 45%, rgba(3,7,18,0.92) 100%)',
                }} />
            </div>
            )}
            <style>{`
                .dash-bg-slide {
                    animation: dash-bg-cycle 30s linear infinite;
                    transform-origin: center center;
                }
                @keyframes dash-bg-cycle {
                    0%   { opacity: 0; transform: scale(1.00); }
                    3%   { opacity: 0.42; }
                    20%  { opacity: 0.42; transform: scale(1.08); }
                    23%  { opacity: 0; }
                    100% { opacity: 0; transform: scale(1.08); }
                }
            `}</style>
            <div style={{ position: 'relative', zIndex: 1 }}>
                <TopNav />
                <main className="main-content">
                    <div className="main-container">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
