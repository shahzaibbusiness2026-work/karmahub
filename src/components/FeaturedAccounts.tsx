"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Account } from "@/types";
import AccountCard from "./AccountCard";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface FeaturedAccountsProps {
  accounts: Account[];
}

type SortOption = "featured" | "newest" | "price-low" | "price-high" | "karma-high";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "karma-high", label: "Highest Karma" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest Listed" },
];

function sortAccounts(list: Account[], option: SortOption): Account[] {
  const copy = [...list];
  switch (option) {
    case "newest":
      // "Newest" = smallest ageYears (most recently created)
      return copy.sort((a, b) => a.ageYears - b.ageYears);
    case "price-low":
      return copy.sort((a, b) => a.price - b.price);
    case "price-high":
      return copy.sort((a, b) => b.price - a.price);
    case "karma-high":
      return copy.sort((a, b) => (b.totalKarma ?? 0) - (a.totalKarma ?? 0));
    case "featured":
    default:
      return copy;
  }
}

export default function FeaturedAccounts({ accounts }: FeaturedAccountsProps) {
  const [sortOption, setSortOption] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Show top 6 accounts with selected sorting applied
  const sortedAccounts = useMemo(
    () => sortAccounts(accounts.slice(0, 6), sortOption),
    [accounts, sortOption]
  );

  return (
    <section id="featured-listings" aria-labelledby="featured-listings-heading" className="space-y-4 pt-1">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 id="featured-listings-heading" className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
            Featured Accounts
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Hand-picked, top-rated listings verified by the AccoMarket escrow system.
          </p>
        </div>
        <Link
          href="#all-accounts"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#FF4500] hover:text-[#E03D00] shrink-0 transition-colors"
        >
          View all inventory
          <ArrowForwardIcon className="!text-[14px]" />
        </Link>
      </div>

      {/* Listing Toolbar */}
      <div className="bg-white border border-gray-200/80 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3.5 shadow-2xs">
        {/* Left: Count */}
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800 select-none">
          <GridViewRoundedIcon className="!text-[20px] text-[#FF4500]" aria-hidden="true" />
          <span>Showing {sortedAccounts.length} featured accounts</span>
        </div>

        {/* Right: Sort + View Mode Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <label htmlFor="featured-sort-dropdown" className="hidden sm:inline">
              Sort by:
            </label>
            <div className="relative inline-flex items-center">
              <select
                id="featured-sort-dropdown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-200 text-xs font-bold text-gray-800 min-h-[44px] h-11 pl-3.5 pr-9 rounded-xl cursor-pointer focus:outline-none focus:border-[#FF4500] focus-visible:ring-2 focus-visible:ring-[#FF4500] transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <KeyboardArrowDownIcon
                className="!text-[18px] text-gray-500 absolute right-2.5 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* View Mode Toggle */}
          <div
            role="group"
            aria-label="View layout options"
            className="flex items-center bg-gray-100 p-1 rounded-xl gap-1"
          >
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              aria-label="Grid layout view"
              aria-pressed={viewMode === "grid"}
              title="Grid View"
              className={`min-h-[44px] min-w-[44px] w-11 h-11 rounded-lg flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none ${
                viewMode === "grid"
                  ? "bg-[#FF4500] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 bg-transparent"
              }`}
            >
              <GridViewRoundedIcon className="!text-[20px]" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List layout view"
              aria-pressed={viewMode === "list"}
              title="List View"
              className={`min-h-[44px] min-w-[44px] w-11 h-11 rounded-lg flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none ${
                viewMode === "list"
                  ? "bg-[#FF4500] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 bg-transparent"
              }`}
            >
              <ViewListRoundedIcon className="!text-[20px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Account Cards Grid / List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "flex flex-col gap-4"
        }
      >
        {sortedAccounts.map((acc) => (
          <AccountCard key={acc.id} account={acc} isListView={viewMode === "list"} />
        ))}
      </div>
    </section>
  );
}
