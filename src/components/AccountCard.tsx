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

interface AccountCardProps {
  account: Account;
}

export default function AccountCard({ account }: AccountCardProps) {
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);

  const isPremium = account.badgeType === "premium";
  const isVerified = account.badgeType === "verified";

  // Formatter helpers
  const formatCompact = (num?: number) => {
    if (!num && num !== 0) return "0";
    return num.toLocaleString();
  };

  const ageDisplayStr = account.ageYears ? `${account.ageYears} yrs` : account.ageDisplay;
  const karmaDisplayStr = account.totalKarmaDisplay || formatCompact(account.totalKarma);
  const postsDisplayStr = formatCompact(account.postsCount);
  const commentsDisplayStr = formatCompact(account.commentsCount);

  return (
    <article
      className="bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md transition-[box-shadow,transform] duration-200 flex flex-col justify-between overflow-hidden group h-full"
      style={{
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      {/* Top Banner with overlay badge & accessible heart action */}
      <div className="relative w-full">
        <CardBanner theme={account.bannerTheme || "volcano"} />

        {/* Top Badges & Favourites Action */}
        <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
          {isPremium ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 border border-amber-400/50 text-amber-300 text-xs font-bold shadow-xs select-none">
              <span className="text-xs">👑</span>
              <span>Premium</span>
            </span>
          ) : isVerified ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#05291b]/85 border border-emerald-400/50 text-emerald-300 text-xs font-bold shadow-xs select-none">
              <span className="text-xs font-black">✓</span>
              <span>Verified</span>
            </span>
          ) : (
            <span />
          )}

          {/* Favourite Button with 44px touch target */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            aria-label={
              isLiked
                ? `Remove ${account.title} from favourites`
                : `Add ${account.title} to favourites`
            }
            aria-pressed={isLiked}
            className={`min-h-[44px] min-w-[44px] w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none ${
              isLiked
                ? "bg-white text-red-500 shadow-sm scale-105"
                : "bg-black/45 hover:bg-black/70 text-white"
            }`}
            title={isLiked ? "Remove from favourites" : "Add to favourites"}
          >
            {isLiked ? (
              <FavoriteIcon className="!text-[20px] text-red-500" />
            ) : (
              <FavoriteBorderIcon className="!text-[20px]" />
            )}
          </button>
        </div>
      </div>

      {/* Account Icon & Header Row */}
      <div className="relative">
        {/* Subtle, refined overlapping Snoo avatar (44px) without harsh neon glow */}
        <div className="absolute -top-5 left-5 z-20 w-11 h-11 rounded-xl bg-[#FF4500] border-2 border-white shadow-sm flex items-center justify-center shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <circle cx="12" cy="13.5" r="7.2" />
            <circle cx="5.2" cy="12" r="2.2" />
            <circle cx="18.8" cy="12" r="2.2" />
            <path
              d="M12 6.3V3.6M12 3.6L14.6 4.6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <circle cx="14.6" cy="4.6" r="1.2" fill="white" />
            <circle cx="9.6" cy="13" r="1.3" fill="#FF4500" />
            <circle cx="14.4" cy="13" r="1.3" fill="#FF4500" />
            <path
              d="M9.8 16.2C10.5 17.2 13.5 17.2 14.2 16.2"
              stroke="#FF4500"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Title and Subreddit Area with generous clearance so avatar never crowds title */}
        <div className="pt-2 pl-[74px] pr-5 min-h-[48px] flex flex-col justify-center">
          {/* Dark title color across all cards */}
          <h3 className="text-base font-extrabold text-gray-900 leading-snug line-clamp-2 min-h-[40px] flex items-center">
            {account.title}
          </h3>
          {/* Username or category only (age is strictly reserved for stats row) */}
          <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium mt-0.5">
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
            <span className="truncate">{account.subreddit || "u/AskReddit"}</span>
          </div>
        </div>
      </div>

      {/* 20px Padding Card Content Body */}
      <div className="p-5 pt-3.5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3.5">
          {/* 4 Evenly Spaced Statistics: Age, Karma, Posts, Comments */}
          <div className="bg-gray-50/90 border border-gray-200/80 rounded-xl py-2 px-1 grid grid-cols-4 divide-x divide-gray-200/80 text-center">
            {/* Age */}
            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-[12px] font-semibold text-gray-500 mb-0.5">
                <CalendarTodayOutlinedIcon className="!text-[12px] text-gray-400" />
                <span>Age</span>
              </div>
              <div className="text-[13px] sm:text-sm font-bold text-gray-900 truncate">
                {ageDisplayStr}
              </div>
            </div>

            {/* Karma */}
            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-[12px] font-semibold text-gray-500 mb-0.5">
                <StarBorderRoundedIcon className="!text-[13px] text-gray-400" />
                <span>Karma</span>
              </div>
              <div className="text-[13px] sm:text-sm font-bold text-gray-900 truncate">
                {karmaDisplayStr}
              </div>
            </div>

            {/* Posts */}
            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-[12px] font-semibold text-gray-500 mb-0.5">
                <InsertDriveFileOutlinedIcon className="!text-[12px] text-gray-400" />
                <span>Posts</span>
              </div>
              <div className="text-[13px] sm:text-sm font-bold text-gray-900 truncate">
                {postsDisplayStr}
              </div>
            </div>

            {/* Comments */}
            <div className="px-1">
              <div className="flex items-center justify-center gap-1 text-[12px] font-semibold text-gray-500 mb-0.5">
                <ChatBubbleOutlineRoundedIcon className="!text-[12px] text-gray-400" />
                <span>Comments</span>
              </div>
              <div className="text-[13px] sm:text-sm font-bold text-gray-900 truncate">
                {commentsDisplayStr}
              </div>
            </div>
          </div>

          {/* Description Text: 14px with readable contrast and 2-line limit */}
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 min-h-[40px]">
            {account.description ||
              "Well-established account with high karma and clean history. Perfect for marketing, promotion or business use."}
          </p>
        </div>

        {/* Flexible bottom row: Price & Action Buttons aligned across cards */}
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
            {/* Secondary Action: Add to Cart (44px touch target) */}
            <button
              type="button"
              onClick={() => addToCart(account.id)}
              aria-label={`Add ${account.title} to shopping basket`}
              className="min-h-[44px] min-w-[44px] w-11 h-11 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 bg-white flex items-center justify-center transition-colors cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
              title="Add to Basket"
            >
              <ShoppingCartOutlinedIcon className="!text-[19px]" />
            </button>

            {/* Primary Action: View Details (44px touch target) */}
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
