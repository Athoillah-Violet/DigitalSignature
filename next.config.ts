import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Content Security Policy (CSP):
          // - Izinkan kamera untuk scan QR (html5-qrcode)
          // - Izinkan Google Fonts, Supabase Auth, Google OAuth
          // - Cegah framing (clickjacking)
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "img-src 'self' data: blob: https://*.googleusercontent.com",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "media-src 'self' blob:",
              "frame-ancestors 'none'",
              "form-action 'self' https://*.supabase.co https://accounts.google.com",
            ].join("; "),
          },
          // Cegah pembungkusan iframe / Clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Cegah MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Kebijakan Referrer yang aman
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Izin perangkat: kamera diizinkan untuk 'self' agar scanner berfungsi
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
