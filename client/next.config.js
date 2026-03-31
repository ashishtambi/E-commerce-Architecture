/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Keep browser-side loading so localhost API upload URLs still work when client runs in Docker.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
