import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/:section(driver|partners|cities|faq|support|about|legal|waitlist-thank-you|waitlist-unsubscribe)/:rest*', destination: '/de/:section/:rest*', permanent: true },
    ];
  },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ...(process.env.LINES_FRAME_PROTECTION === '1' ? [{ key: 'X-Frame-Options', value: 'DENY' }] : []),
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }];
  },
};
export default nextConfig;
