/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['mdx', 'md', 'jsx', 'js', 'tsx', 'ts'],
  async redirects(){
    return [
      {
        source: '/',
        destination: 'payments',
        permanent: false
      }
    ]
  }
};

module.exports = nextConfig;
