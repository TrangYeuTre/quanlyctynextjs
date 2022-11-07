/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DELAY_TIME_NOTI: 3000,
  },
};

module.exports = nextConfig;
