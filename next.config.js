/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  disable: process.env.NODE_ENV === 'development',
  dest: "public",
  register: true,
  skipWaiting: false,
  runtimeCaching,
});
const nextConfig = withPWA({
  reactStrictMode: process.env.NODE_ENV === 'development'
});

module.exports = nextConfig;
