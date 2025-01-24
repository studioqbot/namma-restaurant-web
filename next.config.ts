/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  reactStrictMode: true, // Enable strict React mode
  swcMinify: true,
  images: {
    unoptimized: true,
  },

}
 
module.exports = nextConfig