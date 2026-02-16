import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // NOTE: nanti kalau sudah ada data paroki & seller beneran,
  // kita generate dinamis dari API/DB.
  return [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/rawamangun`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];
}
