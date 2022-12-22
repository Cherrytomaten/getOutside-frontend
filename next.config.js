/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  disable: false,
  dest: 'public',
  swSrc: 'https://www.get-outside-app.de/sw.js',
  register: true,
  skipWaiting: true,
  fallbacks: {
    document: '/pages/_offline.tsx'
  },
  buildExcludes: [/middleware-manifest.json$/]
})

module.exports = withPWA({
  reactStrictMode: false,
  swcMinify: true,
});
