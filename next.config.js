/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  disable: true,
  dest: 'public',
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/pages/_offline.tsx',
  },
  buildExcludes: [/middleware-manifest.json$/]
})

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true
});
