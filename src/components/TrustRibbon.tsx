import React from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import BoltIcon from "@mui/icons-material/Bolt";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import type { SvgIconComponent } from "@mui/icons-material";

interface TrustPillar {
  Icon: SvgIconComponent;
  title: string;
  description: string;
}

const TRUST_PILLARS: TrustPillar[] = [
  {
    Icon: LockOutlinedIcon,
    title: "Secure Payments",
    description: "Your money is protected",
  },
  {
    Icon: VerifiedUserOutlinedIcon,
    title: "Verified Sellers",
    description: "Trusted and reliable",
  },
  {
    Icon: BoltIcon,
    title: "Easy Transfers",
    description: "Fast and smooth process",
  },
  {
    Icon: HeadsetMicOutlinedIcon,
    title: "24/7 Support",
    description: "We're here to help",
  },
];

export default function TrustRibbon() {
  return (
    <div className="bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100 shadow-xs">
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 list-none m-0 p-0">
        {TRUST_PILLARS.map(({ Icon, title, description }) => (
          <li key={title} className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-orange-50/80 flex items-center justify-center text-[#FF4500] shrink-0">
              <Icon className="!text-[24px]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{title}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
