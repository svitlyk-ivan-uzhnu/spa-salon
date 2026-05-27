/** @type {import('next').NextConfig} */
const nextConfig = {
  // Тиждень 13: Оптимізація зображень та дозволені зовнішні домени
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Тиждень 10: Безпекові HTTP-заголовки (залишаємо твої налаштування)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;