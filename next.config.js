// next.config.js (루트)
 /** @type {import('next').NextConfig} */
 module.exports = {
  reactStrictMode: true,
  devIndicators: false,
  images: {
    domains: [
      'gz-zigu.store',
      'zigu-bucket.s3.ap-northeast-2.amazonaws.com'
    ],
  },
}
