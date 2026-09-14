"use client";

import React from "react";
import Image from "next/image";

interface CardBannerProps {
  theme?: "volcano" | "cosmic" | "bull_growth" | "mountains" | "synthwave" | "candlestick" | string;
  className?: string;
}

const THEME_BANNER_MAP: Record<string, { src: string; alt: string }> = {
  volcano: {
    src: "/banners/volcano.jpg",
    alt: "High Trust Reddit Account Banner with Volcano Landscape & Snoo",
  },
  cosmic: {
    src: "/banners/cosmic.jpg",
    alt: "Organic Discussion Account Banner with Cosmic Space & Snoo",
  },
  bull_growth: {
    src: "/banners/bull_growth.jpg",
    alt: "Top Tier Authority Account Banner with Bull Growth & Snoo",
  },
  mountains: {
    src: "/banners/mountains.jpg",
    alt: "Niche Community Account Banner with Alpine Mountains & Snoo",
  },
  synthwave: {
    src: "/banners/synthwave.jpg",
    alt: "Vintage 7-Year Club Account Banner with Synthwave Sunset & Snoo",
  },
  candlestick: {
    src: "/banners/candlestick.jpg",
    alt: "Starter Discussion Profile Banner with Candlestick Chart & Snoo",
  },
};

export default function CardBanner({ theme = "volcano", className = "" }: CardBannerProps) {
  const banner = THEME_BANNER_MAP[theme] || THEME_BANNER_MAP.volcano;

  return (
    <div
      className={`relative w-full h-32 sm:h-[125px] overflow-hidden rounded-t-2xl select-none bg-gray-900 ${className}`}
      style={{
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <Image
        src={banner.src}
        alt={banner.alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority
        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
      />
      {/* Quieter top vignette for contrast without overwhelming imagery */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/10 pointer-events-none" />
    </div>
  );
}
