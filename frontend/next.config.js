 /** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export (Next.js 13+)
  },
};

module.exports = nextConfig;
