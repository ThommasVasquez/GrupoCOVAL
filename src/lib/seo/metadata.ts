import type { Metadata } from "next";
import { getGroupEntity } from "@/lib/content/repository";
import { absoluteUrl } from "@/lib/utils";

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  ogImagePath?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  ogImagePath,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const group = getGroupEntity();
  const canonical = absoluteUrl(path);
  const resolvedOgImage = ogImagePath
    ? absoluteUrl(ogImagePath)
    : absoluteUrl("/opengraph-image");

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        "es-CO": canonical,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: "es_CO",
      url: canonical,
      siteName: group.groupName,
      title,
      description,
      images: [
        {
          url: resolvedOgImage,
          width: 1200,
          height: 630,
          alt: `${title} — ${group.groupName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage],
    },
  };
}
