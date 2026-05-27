// app/sitemap.js
import dbConnect from "@/lib/db";
import Service from "@/lib/models/Service"; // Твоя реальна модель послуг з папки models

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  // 1. Статичні сторінки нашого спа-салону
  const staticRoutes = [
    { url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  let dynamicRoutes = [];
  try {
    await dbConnect();
    // Беремо тільки ті процедури, які доступні для запису
    const services = await Service.find({ available: true }).select("_id updatedAt").lean();
    
    dynamicRoutes = services.map((service) => ({
      url: `${siteUrl}/services/${service._id}`,
      lastModified: service.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));
  } catch (error) {
    // Якщо база даних офлайн під час білду — повертаємо хоча б статичні сторінки
    console.error("Sitemap DB error:", error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}