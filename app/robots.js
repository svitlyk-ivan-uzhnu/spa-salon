// app/robots.js
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Закриваємо від індексації адмінку, API та сторінки входу/реєстрації
        disallow: ["/dashboard/", "/api/", "/login", "/register"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}