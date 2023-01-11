/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  disable: false,
  dest: "public",
  register: true,
  skipWaiting: false,
  runtimeCaching
});
const nextConfig = withPWA({
  reactStrictMode: false
});

module.exports = nextConfig;
