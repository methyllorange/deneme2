// generateStaticParams runs at build time to pre-render all 81 province pages
// for static export (next.config.mjs `output: 'export'`).
import { provincesData } from '../../../../lib/data/mockData';

export function generateStaticParams() {
    return provincesData.map(p => ({ id: p.id }));
}

export default function ProvinceLayout({ children }) {
    return children;
}
