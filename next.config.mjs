/** @type {import('next').NextConfig} */
const nextConfig = {
  // SSG static export — produces an `out/` directory deployable to GitHub Pages.
  // Matches the legacy Vite app's gh-pages basename '/deneme2'.
  output: 'export',
  basePath: '/deneme2',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
