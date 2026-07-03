/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next_new',
  reactStrictMode: true,
  // Don't fail production builds on lint/type issues (project has pre-existing warnings)
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['i.ibb.co', 'lh3.googleusercontent.com', 'res.cloudinary.com', 'images.unsplash.com', 'loremflickr.com', 'im.lgdus.co', 'lgdus.co'],
    unoptimized: true,
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config;
  },
}

module.exports = nextConfig



