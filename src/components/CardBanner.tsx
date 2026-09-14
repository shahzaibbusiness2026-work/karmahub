"use client";

import React from "react";
import Image from "next/image";

type BannerTheme = "volcano" | "cosmic" | "bull_growth" | "mountains" | "synthwave" | "candlestick";

interface CardBannerProps {
  theme?: BannerTheme | string;
  className?: string;
  /** Set to true only when this banner is the LCP element (e.g. first card above the fold) */
  isPriority?: boolean;
}

const THEME_BANNER_MAP: Record<string, { src: string; alt: string }> = {
  volcano: {
    src: "/banners/volcano.jpg",
    alt: "High Trust Reddit Account — volcanic landscape banner",
  },
  cosmic: {
    src: "/banners/cosmic.jpg",
    alt: "Organic Discussion Account — cosmic space banner",
  },
  bull_growth: {
    src: "/banners/bull_growth.jpg",
    alt: "Top Tier Authority Account — bull growth chart banner",
  },
  mountains: {
    src: "/banners/mountains.jpg",
    alt: "Niche Community Account — alpine mountains banner",
  },
  synthwave: {
    src: "/banners/synthwave.jpg",
    alt: "Vintage 7-Year Club Account — synthwave sunset banner",
  },
  candlestick: {
    src: "/banners/candlestick.jpg",
    alt: "Starter Discussion Profile — candlestick chart banner",
  },
};

export default function CardBanner({ theme = "volcano", className = "", isPriority = false }: CardBannerProps) {
  const banner = THEME_BANNER_MAP[theme] ?? THEME_BANNER_MAP.volcano;

  return (
    <div
      className={`relative w-full h-32 sm:h-[125px] overflow-hidden rounded-t-2xl select-none bg-gray-900 ${className}`}
    >
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        // Only mark as priority if this is genuinely the LCP image.
        // Setting priority=true on every card hurts performance by pre-fetching
        // images that are far below the fold.
        priority={isPriority}
        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {/* Subtle vignette for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/10 pointer-events-none" aria-hidden="true" />
    </div>
  );
}
