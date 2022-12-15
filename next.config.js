/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DELAY_TIME_NOTI: 3000,
    MONGODB_USERNAME: "nghiadeptrai91",
    MONGODB_PASSWORD: "NghiaTrang9192",
    MONGODB_CLUSTER: "hoc-nodejs-cluster",
  },
};

module.exports = nextConfig;
