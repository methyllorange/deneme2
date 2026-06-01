import './globals.css';
import { Inter } from 'next/font/google';
import { DataProvider } from '../lib/DataContext';

const inter = Inter({
    subsets: ['latin'],
    weight: ['300', '400', '500', '600', '700', '800'],
    display: 'swap',
});

export const metadata = {
    title: 'ASO-İLTEK · İllerin Teknolojik Gelişmişlik Endeksi',
    description: 'ASO-İLTEK 2025: Türkiye 81 ilinin teknolojik gelişmişlik endeksi. 37 gösterge, 5 alt endeks, interaktif harita ve karşılaştırma.',
    icons: {
        icon: '/brand/iltek-mark.svg',
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="tr" className={inter.className}>
            <body>
                <DataProvider>
                    {children}
                </DataProvider>
            </body>
        </html>
    );
}
