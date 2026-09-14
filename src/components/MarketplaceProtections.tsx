"use client";

import React from "react";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import HistoryToggleOffOutlinedIcon from "@mui/icons-material/HistoryToggleOffOutlined";

export default function MarketplaceProtections() {
  return (
    <section
      aria-label="Marketplace Buyer Protections"
      className="bg-gray-50/90 border border-gray-200/80 rounded-2xl p-3.5 sm:p-4 shadow-xs"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200/80 text-left">
        {/* Protection 1: Escrow Clearing */}
        <div className="flex items-center gap-3 pt-1 sm:pt-0 sm:px-3 first:pl-1">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF4500] border border-orange-100 flex items-center justify-center shrink-0">
            <LockOutlinedIcon className="!text-[20px]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-tight">
              Automated Escrow Clearing
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-normal">
              Funds held securely until credentials & 2FA are transferred.
            </p>
          </div>
        </div>

        {/* Protection 2: Verified Ownership */}
        <div className="flex items-center gap-3 pt-2.5 sm:pt-0 sm:px-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <VerifiedUserOutlinedIcon className="!text-[20px]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-tight">
              Audited History & Clean Email
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-normal">
              0 shadowbans, genuine karma history, and original email handover.
            </p>
          </div>
        </div>

        {/* Protection 3: 48-Hour Inspection */}
        <div className="flex items-center gap-3 pt-2.5 sm:pt-0 sm:px-3 last:pr-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <HistoryToggleOffOutlinedIcon className="!text-[20px]" />
          </div>
          <div>
            <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 leading-tight">
              48-Hour Inspection Window
            </h4>
            <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 leading-normal">
              Full verification time with instant dispute resolution support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
