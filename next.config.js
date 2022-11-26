/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  swcMinify: true,
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  async redirects(){
    return [
      {
        source: '/',
        destination: '/payments',
        permanent: false
      }
    ]
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL
  }
};

module.exports = nextConfig;
