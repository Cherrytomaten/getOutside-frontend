/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  disable: true,
  dest: "public",
  register: true,
  skipWaiting: false,
  runtimeCaching
});
const nextConfig = withPWA({
  reactStrictMode: true
});

module.exports = nextConfig;
