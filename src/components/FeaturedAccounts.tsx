"use client";

import React, { useState, useMemo } from "react";
import { Account } from "@/types";
import AccountCard from "./AccountCard";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface FeaturedAccountsProps {
  accounts: Account[];
}

export default function FeaturedAccounts({ accounts }: FeaturedAccountsProps) {
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Show top accounts with user-selected sorting
  const sortedAccounts = useMemo(() => {
    const list = [...accounts.slice(0, 6)];
    if (sortOption === "featured") {
      return list;
    }
    if (sortOption === "newest") {
      return list.sort((a, b) => (b.ageYears || 0) - (a.ageYears || 0));
    }
    if (sortOption === "price-low") {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortOption === "price-high") {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortOption === "karma-high") {
      return list.sort((a, b) => (b.totalKarma || 0) - (a.totalKarma || 0));
    }
    return list;
  }, [accounts, sortOption]);

  return (
    <div id="featured-listings" className="space-y-4 pt-1">
      {/* Listing Toolbar: Aligned count, sort dropdown, and view controls */}
      <div className="bg-white border border-gray-200/80 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3.5 shadow-2xs">
        {/* Left: Filtered Results Count */}
        <div className="flex items-center gap-2 text-sm font-bold text-gray-800 select-none">
          <GridViewRoundedIcon className="!text-[20px] text-[#FF4500]" aria-hidden="true" />
          <span>Showing {sortedAccounts.length} accounts</span>
        </div>

        {/* Right: Sort Pill + Grid/List View Toggles */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Accessible Sort Dropdown with 44px min-height */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <label htmlFor="sort-dropdown" className="hidden sm:inline">
              Sort by:
            </label>
            <div className="relative inline-flex items-center">
              <select
                id="sort-dropdown"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-200 text-xs font-bold text-gray-800 min-h-[44px] h-11 pl-3.5 pr-9 rounded-xl cursor-pointer focus:outline-none focus:border-[#FF4500] focus-visible:ring-2 focus-visible:ring-[#FF4500] transition-colors"
              >
                <option value="featured">Newest First</option>
                <option value="karma-high">Highest Karma</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              <KeyboardArrowDownIcon
                className="!text-[18px] text-gray-500 absolute right-2.5 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* View Mode Toggle Buttons with 44px Touch Targets & Clear Active State */}
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
              className={`min-h-[44px] min-w-[44px] w-11 h-11 rounded-lg flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none ${
                viewMode === "grid"
                  ? "bg-[#FF4500] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 bg-transparent"
              }`}
              title="Grid View"
            >
              <GridViewRoundedIcon className="!text-[20px]" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              aria-label="List layout view"
              aria-pressed={viewMode === "list"}
              className={`min-h-[44px] min-w-[44px] w-11 h-11 rounded-lg flex items-center justify-center transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none ${
                viewMode === "list"
                  ? "bg-[#FF4500] text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 bg-transparent"
              }`}
              title="List View"
            >
              <ViewListRoundedIcon className="!text-[20px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Account Cards Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) with 24px gap */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "grid grid-cols-1 gap-6"
        }
      >
        {sortedAccounts.map((acc) => (
          <AccountCard key={acc.id} account={acc} />
        ))}
      </div>
    </div>
  );
}
