import type { Metadata } from "next";
import { getGroupEntity } from "@/lib/content/repository";
import { absoluteUrl } from "@/lib/utils";

export interface PageMetadataInput {
  title: string;
  description: string;
  path: string;
  ogImagePath?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  fallbackOgImagePath?: string;
  ogType?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
}

export function buildPageMetadata({
  title,
  description,
  path,
  ogImagePath,
  ogImageWidth = 1200,
  ogImageHeight = 630,
  fallbackOgImagePath,
  ogType = "website",
  publishedTime,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const group = getGroupEntity();
  const canonical = absoluteUrl(path);
  const resolvedOgImage = ogImagePath
    ? absoluteUrl(ogImagePath)
    : absoluteUrl("/opengraph-image");
  const resolvedFallback = fallbackOgImagePath
    ? absoluteUrl(fallbackOgImagePath)
    : null;

  const ogImages = [
    {
      url: resolvedOgImage,
      width: ogImageWidth,
      height: ogImageHeight,
      alt: `${title} — ${group.groupName}`,
    },
    ...(resolvedFallback && resolvedFallback !== resolvedOgImage
      ? [
          {
            url: resolvedFallback,
            width: 1200,
            height: 630,
            alt: `${title} — ${group.groupName}`,
          },
        ]
      : []),
  ];

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
      type: ogType,
      locale: "es_CO",
      url: canonical,
      siteName: group.groupName,
      title,
      description,
      ...(ogType === "article" && publishedTime ? { publishedTime } : {}),
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [resolvedOgImage],
    },
  };
}
