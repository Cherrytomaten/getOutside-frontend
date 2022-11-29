const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
})

module.exports = {
  reactStrictMode: true,
  swcMinify: true
};
