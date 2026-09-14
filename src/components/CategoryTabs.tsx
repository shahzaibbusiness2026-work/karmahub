"use client";

import React from "react";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import GridViewIcon from "@mui/icons-material/GridView";
import { useCart } from "@/context/CartContext";

interface CategoryTabsProps {
  selectedPlatform: string;
  onSelectPlatform: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Platform definitions — single source of truth for this component.
// The icon rendering uses ReactNode so each platform can have a unique icon
// without duplicating conditional render logic.
// ---------------------------------------------------------------------------
const PLATFORMS = [
  {
    id: "reddit",
    label: "Reddit",
    count: "1,200+",
    icon: <SmartToyIcon className="!text-[22px]" />,
    iconBg: "bg-[#FF4500]",
  },
  {
    id: "instagram",
    label: "Instagram",
    count: "800+",
    icon: <PhotoCameraIcon className="!text-[22px]" />,
    iconBg: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600",
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    count: "600+",
    // Unicode 𝕏 rendered directly — no icon library needed
    icon: <span className="text-base font-bold">𝕏</span>,
    iconBg: "bg-black",
  },
  {
    id: "tiktok",
    label: "TikTok",
    count: "450+",
    icon: <MusicNoteIcon className="!text-[20px] text-cyan-400" />,
    iconBg: "bg-gray-950",
  },
  {
    id: "youtube",
    label: "YouTube",
    count: "320+",
    icon: <PlayArrowIcon className="!text-[22px]" />,
    iconBg: "bg-red-600",
  },
  {
    id: "other",
    label: "Other",
    count: "200+",
    icon: <GridViewIcon className="!text-[20px] text-gray-600" />,
    iconBg: "bg-gray-100",
  },
] as const;

export default function CategoryTabs({ selectedPlatform, onSelectPlatform }: CategoryTabsProps) {
  const { showToast } = useCart();

  const handleTabClick = (id: string) => {
    onSelectPlatform(id);
    if (id !== "reddit") {
      const name = PLATFORMS.find((p) => p.id === id)?.label ?? id;
      showToast(`${name} catalog coming soon — stay tuned!`, "info");
    }
  };

  return (
    <div id="categories" className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {PLATFORMS.map(({ id, label, count, icon, iconBg }) => {
          const isActive = selectedPlatform === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleTabClick(id)}
              aria-pressed={isActive}
              aria-label={`${label} — ${count} accounts`}
              className={`rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-xs transition-all hover:shadow-md cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none ${
                isActive
                  ? "border-2 border-[#FF4500] bg-[#FFF8F5]"
                  : "border border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center text-white mb-2 shadow-xs`}
              >
                {icon}
              </div>
              <div className="text-sm font-bold text-gray-900 group-hover:text-[#FF4500] transition-colors">
                {label}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">{count} accounts</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
