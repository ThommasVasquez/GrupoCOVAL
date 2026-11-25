import type { MetadataRoute } from "next";
import {
  getAllEquipment,
  getHomeContent,
  getRentalCategories,
} from "@/lib/content/repository";
import { getAllBlogPosts } from "@/lib/content/blog";
import { absoluteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const categories = getRentalCategories();
  const equipment = getAllEquipment();
  const home = getHomeContent();
  const posts = getAllBlogPosts();

  const staticRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/icopores-modulado", changeFrequency: "weekly", priority: 0.9 },
    { path: "/vt-ingequipos", changeFrequency: "weekly", priority: 0.9 },
    { path: "/alquiler", changeFrequency: "weekly", priority: 0.9 },
    { path: "/contacto", changeFrequency: "monthly", priority: 0.85 },
    { path: "/zonas", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.75 },
    { path: "/legal/politica-privacidad", changeFrequency: "yearly", priority: 0.3 },
    { path: "/legal/politica-cookies", changeFrequency: "yearly", priority: 0.3 },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  for (const zone of home.zonesOverview) {
    entries.push({
      url: absoluteUrl(`/zonas/${zone.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const cat of categories) {
    entries.push({
      url: absoluteUrl(`/alquiler/${cat.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  for (const item of equipment) {
    entries.push({
      url: absoluteUrl(`/alquiler/${item.category}/${item.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  for (const post of posts) {
    entries.push({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
