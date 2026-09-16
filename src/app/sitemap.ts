import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

const STATIC_PATHS = ["", "/start-project", "/consultations", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === "" ? "weekly" : "monthly",
        priority: path === "" ? 1 : 0.7,
      });
    }

    const dict = getDictionary(locale);
    for (const category of dict.consultationsIndex.categories) {
      entries.push({
        url: `${SITE_URL}/${locale}/consultations/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
