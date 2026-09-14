"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Account } from "@/types";
import { useCart } from "@/context/CartContext";
import CardBanner from "./CardBanner";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";

// ---------------------------------------------------------------------------
// Snoo SVG — shared between card avatar and logo; kept inline to avoid an
// extra network request for a tiny decorative asset.
// ---------------------------------------------------------------------------
function SnooIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="white" aria-hidden="true">
      <circle cx="12" cy="13.5" r="7.2" />
      <circle cx="5.2" cy="12" r="2.2" />
      <circle cx="18.8" cy="12" r="2.2" />
      <path d="M12 6.3V3.6M12 3.6L14.6 4.6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="14.6" cy="4.6" r="1.2" fill="white" />
      <circle cx="9.6" cy="13" r="1.3" fill="#FF4500" />
      <circle cx="14.4" cy="13" r="1.3" fill="#FF4500" />
      <path d="M9.8 16.2C10.5 17.2 13.5 17.2 14.2 16.2" stroke="#FF4500" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

interface AccountCardProps {
  account: Account;
  isListView?: boolean;
}

export default function AccountCard({ account, isListView = false }: AccountCardProps) {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  const isPremium = account.badgeType === "premium";
  const isVerified = account.badgeType === "verified";

  // Safely display age — guard against 0 being falsy
  const ageDisplayStr =
    account.ageYears != null ? `${account.ageYears} yrs` : account.ageDisplay;

  const karmaDisplayStr =
    account.totalKarmaDisplay ?? account.totalKarma.toLocaleString();

  const postsDisplayStr = account.postsCount.toLocaleString();
  const commentsDisplayStr = account.commentsCount.toLocaleString();

  // -------------------------------------------------------------------------
  // List-view variant — horizontal layout with key stats inline
  // -------------------------------------------------------------------------
  if (isListView) {
    return (
      <article className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row items-stretch overflow-hidden group">
        {/* Thumbnail banner — narrow strip on the left in list view */}
        <div className="w-full sm:w-32 shrink-0">
          <CardBanner theme={account.bannerTheme ?? "volcano"} className="h-32 sm:h-full rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none" />
        </div>

        <div className="flex flex-col sm:flex-row flex-1 items-start sm:items-center gap-4 p-4">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-[#FF4500] border-2 border-white shadow-sm flex items-center justify-center shrink-0 -mt-7 sm:mt-0">
            <SnooIcon className="w-6 h-6" />
          </div>

          {/* Title + subreddit */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              {isPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-700 text-[10px] font-bold">
                  👑 Premium
                </span>
              )}
              {isVerified && !isPremium && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-700 text-[10px] font-bold">
                  ✓ Verified
                </span>
              )}
            </div>
            <h3 className="text-sm font-extrabold text-gray-900 leading-snug truncate">{account.title}</h3>
            <p className="text-xs text-gray-500 truncate mt-0.5">{account.subreddit ?? "u/AskReddit"}</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0 flex-wrap">
            <span className="font-semibold text-gray-700">{ageDisplayStr}</span>
            <span>{karmaDisplayStr} karma</span>
            <span>{postsDisplayStr} posts</span>
          </div>

          {/* Price + actions */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xl font-black text-gray-950">${account.price.toFixed(2)}</span>
            <button
              type="button"
              onClick={() => addToCart(account.id)}
              aria-label={`Add ${account.title} to shopping basket`}
              title="Add to Basket"
              className="min-h-[44px] min-w-[44px] w-11 h-11 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 flex items-center justify-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
            >
              <ShoppingCartOutlinedIcon className="!text-[19px]" />
            </button>
            <Link
              href={`/listing?id=${account.id}`}
              className="min-h-[44px] px-4 bg-[#FF4500] hover:bg-[#E03D00] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
            >
              <span>Details</span>
              <ArrowForwardIcon className="!text-[14px]" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  // -------------------------------------------------------------------------
  // Grid-view variant (default)
  // -------------------------------------------------------------------------
  return (
    <article className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-[box-shadow,transform] duration-200 flex flex-col justify-between overflow-hidden group h-full will-change-transform">
      {/* Top Banner with overlay badges */}
      <div className="relative w-full">
        <CardBanner theme={account.bannerTheme ?? "volcano"} />

        {/* Badge + Favourite button row */}
        <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between z-10">
          {isPremium ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 border border-amber-400/50 text-amber-300 text-xs font-bold shadow-xs select-none">
              <span>👑</span>
              <span>Premium</span>
            </span>
          ) : isVerified ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#05291b]/85 border border-emerald-400/50 text-emerald-300 text-xs font-bold shadow-xs select-none">
              <span className="font-black">✓</span>
              <span>Verified</span>
            </span>
          ) : (
            <span />
          )}

          {/* Favourite toggle — 44px touch target */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked((prev) => !prev);
            }}
            aria-label={isLiked ? `Remove ${account.title} from favourites` : `Add ${account.title} to favourites`}
            aria-pressed={isLiked}
            title={isLiked ? "Remove from favourites" : "Add to favourites"}
            className={`min-h-[44px] min-w-[44px] w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none ${
              isLiked
                ? "bg-white text-red-500 shadow-sm scale-105"
                : "bg-black/45 hover:bg-black/70 text-white"
            }`}
          >
            {isLiked ? (
              <FavoriteIcon className="!text-[20px] text-red-500" />
            ) : (
              <FavoriteBorderIcon className="!text-[20px]" />
            )}
          </button>
        </div>
      </div>

      {/* Overlapping Snoo avatar + title */}
      <div className="relative">
        <div className="absolute -top-5 left-5 z-20 w-11 h-11 rounded-xl bg-[#FF4500] border-2 border-white shadow-sm flex items-center justify-center shrink-0">
          <SnooIcon className="w-6 h-6" />
        </div>

        <div className="pt-2 pl-[74px] pr-5 min-h-[48px] flex flex-col justify-center">
          <h3 className="text-base font-extrabold text-gray-900 leading-snug line-clamp-2 min-h-[40px] flex items-center">
            {account.title}
          </h3>
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium mt-0.5">
            {/* Link icon */}
            <svg
              className="w-3.5 h-3.5 text-gray-400 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <span className="truncate">{account.subreddit ?? "u/AskReddit"}</span>
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 pt-3.5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3.5">
          {/* 4-stat pill grid */}
          <div className="bg-gray-50/90 border border-gray-200/80 rounded-xl py-2 px-1 grid grid-cols-4 divide-x divide-gray-200/80 text-center">
            {[
              { icon: <CalendarTodayOutlinedIcon className="!text-[12px] text-gray-400" />, label: "Age", value: ageDisplayStr },
              { icon: <StarBorderRoundedIcon className="!text-[13px] text-gray-400" />, label: "Karma", value: karmaDisplayStr },
              { icon: <InsertDriveFileOutlinedIcon className="!text-[12px] text-gray-400" />, label: "Posts", value: postsDisplayStr },
              { icon: <ChatBubbleOutlineRoundedIcon className="!text-[12px] text-gray-400" />, label: "Comments", value: commentsDisplayStr },
            ].map(({ icon, label, value }) => (
              <div key={label} className="px-1">
                <div className="flex items-center justify-center gap-1 text-[12px] font-semibold text-gray-500 mb-0.5">
                  {icon}
                  <span>{label}</span>
                </div>
                <div className="text-[13px] sm:text-sm font-bold text-gray-900 truncate">{value}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[40px]">
            {account.description ??
              "Well-established account with high karma and clean history. Perfect for marketing, promotion or business use."}
          </p>
        </div>

        {/* Price + CTA row */}
        <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 leading-none">
              Price
            </span>
            <span className="text-2xl font-black text-gray-950 tracking-tight mt-1">
              ${account.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Add to Cart */}
            <button
              type="button"
              onClick={() => addToCart(account.id)}
              aria-label={`Add ${account.title} to shopping basket`}
              title="Add to Basket"
              className="min-h-[44px] min-w-[44px] w-11 h-11 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 bg-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
            >
              <ShoppingCartOutlinedIcon className="!text-[19px]" />
            </button>

            {/* View Details */}
            <Link
              href={`/listing?id=${account.id}`}
              className="min-h-[44px] px-4 sm:px-5 bg-[#FF4500] hover:bg-[#E03D00] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
            >
              <span>View Details</span>
              <ArrowForwardIcon className="!text-[15px]" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
