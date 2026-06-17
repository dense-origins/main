/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Product images currently live in /public. Once photography moves to
    // Drive/Blob/R2, add the host here (or switch to a custom loader).
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

export default nextConfig;
