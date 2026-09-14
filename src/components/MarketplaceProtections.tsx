"use client";

import React from "react";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

interface Protection {
  Icon: SvgIconComponent;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  title: string;
  description: string;
}

const PROTECTIONS: Protection[] = [
  {
    Icon: ShieldOutlinedIcon,
    iconColor: "text-[#FF4500]",
    iconBg: "bg-orange-50",
    iconBorder: "border-orange-100",
    title: "Automated Escrow Clearing",
    description: "Funds held securely until credentials & 2FA are transferred.",
  },
  {
    Icon: VerifiedUserOutlinedIcon,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    iconBorder: "border-emerald-100",
    title: "Audited History & Clean Email",
    description: "0 shadowbans, genuine karma history, and original email handover.",
  },
  {
    Icon: HistoryToggleOffOutlinedIcon,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-100",
    title: "48-Hour Inspection Window",
    description: "Full verification time with instant dispute resolution support.",
  },
];

export default function MarketplaceProtections() {
  return (
    <section aria-label="Marketplace Buyer Protections" className="bg-gray-50/90 border border-gray-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs">
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/80 list-none m-0 p-0">
        {PROTECTIONS.map(({ Icon, iconColor, iconBg, iconBorder, title, description }, index) => (
          <li
            key={title}
            className={`flex items-center gap-3 ${index > 0 ? "pt-2.5 sm:pt-0 sm:px-3" : "pt-1 sm:pt-0 sm:px-3 sm:pl-1"} ${index === PROTECTIONS.length - 1 ? "sm:pr-1" : ""}`}
          >
            <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} border ${iconBorder} flex items-center justify-center shrink-0`}>
              <Icon className="!text-[20px]" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-tight">{title}</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-normal">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
