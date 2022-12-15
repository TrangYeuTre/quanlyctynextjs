/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    DELAY_TIME_NOTI: 3000,
    MONGODB_USERNAME: "nghiadeptrai91",
    MONGODB_PASSWORD: "NghiaTrang9192",
    MONGODB_CLUSTER: "hoc-nodejs-cluster",
    NEXTAUTH_SECRET: "5c876e7f261d25c232a2dfa9ed19fc60",
  },
};

module.exports = nextConfig;
