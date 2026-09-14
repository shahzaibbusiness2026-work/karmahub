"use client";

import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import TuneIcon from "@mui/icons-material/Tune";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

export type AgeFilterValue = "all" | "1m" | "3m" | "6m" | "1y" | "2y" | "3y" | "5y";
export type PostKarmaFilterValue = "all" | "500" | "1000" | "2500" | "5000" | "10000" | "20000";
export type CommentKarmaFilterValue = "all" | "1000" | "5000" | "10000" | "20000" | "30000";
export type TotalKarmaFilterValue = "all" | "1000" | "5000" | "10000" | "25000" | "50000";
export type SortOptionValue =
  | "default"
  | "price-asc"
  | "price-desc"
  | "karma-desc"
  | "post-karma-desc"
  | "comment-karma-desc"
  | "age-desc"
  | "age-asc";

export interface FilterState {
  age: AgeFilterValue;
  postKarma: PostKarmaFilterValue;
  commentKarma: CommentKarmaFilterValue;
  totalKarma: TotalKarmaFilterValue;
  sortBy: SortOptionValue;
  tag: string | null;
}

interface InventoryFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  totalResults: number;
  totalInventoryCount: number;
}

export const AGE_OPTIONS: { id: AgeFilterValue; label: string; shortLabel: string; minYears: number }[] = [
  { id: "all", label: "All Ages", shortLabel: "All", minYears: 0 },
  { id: "1m", label: "1 Month+", shortLabel: "1m+", minYears: 0.08 },
  { id: "3m", label: "3 Months+", shortLabel: "3m+", minYears: 0.25 },
  { id: "6m", label: "6 Months+", shortLabel: "6m+", minYears: 0.5 },
  { id: "1y", label: "1 Year+", shortLabel: "1y+", minYears: 1.0 },
  { id: "2y", label: "2 Years+", shortLabel: "2y+", minYears: 2.0 },
  { id: "3y", label: "3 Years+", shortLabel: "3y+", minYears: 3.0 },
  { id: "5y", label: "5+ Years", shortLabel: "5y+", minYears: 5.0 },
];

export const POST_KARMA_OPTIONS: { id: PostKarmaFilterValue; label: string; minKarma: number }[] = [
  { id: "all", label: "All Post Karma", minKarma: 0 },
  { id: "500", label: "500+ Post Karma", minKarma: 500 },
  { id: "1000", label: "1,000+ Post Karma", minKarma: 1000 },
  { id: "2500", label: "2,500+ Post Karma", minKarma: 2500 },
  { id: "5000", label: "5,000+ Post Karma", minKarma: 5000 },
  { id: "10000", label: "10,000+ Post Karma", minKarma: 10000 },
  { id: "20000", label: "20,000+ Post Karma", minKarma: 20000 },
];

export const COMMENT_KARMA_OPTIONS: { id: CommentKarmaFilterValue; label: string; minKarma: number }[] = [
  { id: "all", label: "All Comment Karma", minKarma: 0 },
  { id: "1000", label: "1,000+ Comment Karma", minKarma: 1000 },
  { id: "5000", label: "5,000+ Comment Karma", minKarma: 5000 },
  { id: "10000", label: "10,000+ Comment Karma", minKarma: 10000 },
  { id: "20000", label: "20,000+ Comment Karma", minKarma: 20000 },
  { id: "30000", label: "30,000+ Comment Karma", minKarma: 30000 },
];

export const TOTAL_KARMA_OPTIONS: { id: TotalKarmaFilterValue; label: string; minKarma: number }[] = [
  { id: "all", label: "All Total Karma", minKarma: 0 },
  { id: "1000", label: "1,000+ Total Karma", minKarma: 1000 },
  { id: "5000", label: "5,000+ Total Karma", minKarma: 5000 },
  { id: "10000", label: "10,000+ Total Karma", minKarma: 10000 },
  { id: "25000", label: "25,000+ Total Karma", minKarma: 25000 },
  { id: "50000", label: "50,000+ Total Karma", minKarma: 50000 },
];

export const SORT_OPTIONS: { id: SortOptionValue; label: string }[] = [
  { id: "default", label: "Sort by: Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "karma-desc", label: "Total Karma: Highest First" },
  { id: "post-karma-desc", label: "Post Karma: Highest First" },
  { id: "comment-karma-desc", label: "Comment Karma: Highest First" },
  { id: "age-desc", label: "Account Age: Oldest First" },
  { id: "age-asc", label: "Account Age: Newest First" },
];

export default function InventoryFilters({
  filters,
  onFilterChange,
  totalResults,
  totalInventoryCount,
}: InventoryFiltersProps) {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Prevent background scrolling when mobile filter drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen]);

  // Count how many filters are currently active (non-default)
  const activeFilterCount =
    (filters.age !== "all" ? 1 : 0) +
    (filters.postKarma !== "all" ? 1 : 0) +
    (filters.commentKarma !== "all" ? 1 : 0) +
    (filters.totalKarma !== "all" ? 1 : 0) +
    (filters.tag ? 1 : 0);

  const handleAgeSelect = (age: AgeFilterValue) => {
    onFilterChange({ ...filters, age });
  };

  const handlePostKarmaChange = (postKarma: PostKarmaFilterValue) => {
    onFilterChange({ ...filters, postKarma });
  };

  const handleCommentKarmaChange = (commentKarma: CommentKarmaFilterValue) => {
    onFilterChange({ ...filters, commentKarma });
  };

  const handleTotalKarmaChange = (totalKarma: TotalKarmaFilterValue) => {
    onFilterChange({ ...filters, totalKarma });
  };

  const handleSortChange = (sortBy: SortOptionValue) => {
    onFilterChange({ ...filters, sortBy });
  };

  const handleResetAll = () => {
    onFilterChange({
      age: "all",
      postKarma: "all",
      commentKarma: "all",
      totalKarma: "all",
      sortBy: "default",
      tag: null,
    });
  };

  return (
    <div className="space-y-4">
      {/* ------------------------------------------------------------- */}
      {/* Top Header Bar: Counts, Filter Button & Sort */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">
            Showing <span className="text-[#FF4500] font-black">{totalResults}</span> of {totalInventoryCount} accounts
          </span>
          {activeFilterCount > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF4500]">
              {activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile & Tablet Filter Drawer Trigger Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen(true)}
            aria-label={`Open filter drawer (${activeFilterCount} active)`}
            className="lg:hidden min-h-[44px] px-4 rounded-xl border border-gray-200 hover:border-[#FF4500] hover:bg-orange-50/60 bg-white text-gray-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-2xs"
          >
            <TuneIcon className="!text-[18px] text-[#FF4500]" />
            <span>All Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF4500] text-white text-[11px] font-extrabold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort By Dropdown */}
          <div className="relative inline-flex items-center flex-1 sm:flex-initial">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as SortOptionValue)}
              aria-label="Sort accounts"
              className="appearance-none w-full sm:w-auto text-xs font-bold text-gray-800 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl min-h-[44px] h-11 pl-3.5 pr-9 focus:outline-none focus:border-[#FF4500] focus-visible:ring-2 focus-visible:ring-[#FF4500] cursor-pointer transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
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
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Account Age Horizontal Filter Strip (Touch-scrollable on mobile) */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-gray-500 font-semibold px-0.5">
          <span className="flex items-center gap-1.5 text-gray-700">
            <CalendarTodayOutlinedIcon className="!text-[14px] text-[#FF4500]" />
            <span>Account Age:</span>
          </span>
          <span className="text-[11px] text-gray-400">Select age bracket</span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar -mx-1 px-1">
          {AGE_OPTIONS.map((opt) => {
            const isSelected = filters.age === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleAgeSelect(opt.id)}
                aria-pressed={isSelected}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 border ${
                  isSelected
                    ? "bg-[#FF4500] text-white border-[#FF4500] shadow-xs"
                    : "bg-white text-gray-700 border-gray-200 hover:border-[#FF4500] hover:text-[#FF4500]"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Desktop Filter Row: Post Karma, Comment Karma, Total Karma */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden lg:grid grid-cols-3 xl:grid-cols-4 gap-3 pt-1">
        {/* Post Karma Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <InsertDriveFileOutlinedIcon className="!text-[13px] text-[#FF4500]" />
            <span>Post Karma</span>
          </label>
          <div className="relative">
            <select
              value={filters.postKarma}
              onChange={(e) => handlePostKarmaChange(e.target.value as PostKarmaFilterValue)}
              aria-label="Filter by Post Karma"
              className={`w-full appearance-none text-xs font-bold bg-white border rounded-xl h-10 pl-3 pr-8 focus:outline-none focus:border-[#FF4500] cursor-pointer transition-colors ${
                filters.postKarma !== "all"
                  ? "border-[#FF4500] text-[#FF4500] bg-orange-50/30"
                  : "border-gray-200 text-gray-800 hover:border-gray-300"
              }`}
            >
              {POST_KARMA_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <KeyboardArrowDownIcon
              className="!text-[16px] text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Comment Karma Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <ChatBubbleOutlineRoundedIcon className="!text-[13px] text-blue-500" />
            <span>Comment Karma</span>
          </label>
          <div className="relative">
            <select
              value={filters.commentKarma}
              onChange={(e) => handleCommentKarmaChange(e.target.value as CommentKarmaFilterValue)}
              aria-label="Filter by Comment Karma"
              className={`w-full appearance-none text-xs font-bold bg-white border rounded-xl h-10 pl-3 pr-8 focus:outline-none focus:border-[#FF4500] cursor-pointer transition-colors ${
                filters.commentKarma !== "all"
                  ? "border-[#FF4500] text-[#FF4500] bg-orange-50/30"
                  : "border-gray-200 text-gray-800 hover:border-gray-300"
              }`}
            >
              {COMMENT_KARMA_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <KeyboardArrowDownIcon
              className="!text-[16px] text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Total Karma Dropdown */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <StarBorderRoundedIcon className="!text-[13px] text-amber-500" />
            <span>Total Karma</span>
          </label>
          <div className="relative">
            <select
              value={filters.totalKarma}
              onChange={(e) => handleTotalKarmaChange(e.target.value as TotalKarmaFilterValue)}
              aria-label="Filter by Total Karma"
              className={`w-full appearance-none text-xs font-bold bg-white border rounded-xl h-10 pl-3 pr-8 focus:outline-none focus:border-[#FF4500] cursor-pointer transition-colors ${
                filters.totalKarma !== "all"
                  ? "border-[#FF4500] text-[#FF4500] bg-orange-50/30"
                  : "border-gray-200 text-gray-800 hover:border-gray-300"
              }`}
            >
              {TOTAL_KARMA_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <KeyboardArrowDownIcon
              className="!text-[16px] text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Quick Reset Button on Desktop */}
        <div className="hidden xl:flex items-end">
          {activeFilterCount > 0 ? (
            <button
              type="button"
              onClick={handleResetAll}
              className="w-full h-10 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RestartAltIcon className="!text-[16px]" />
              <span>Reset Filters</span>
            </button>
          ) : (
            <div className="h-10 text-xs text-gray-400 flex items-center justify-center w-full">
              All accounts visible
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* Active Filter Chips Strip */}
      {/* ------------------------------------------------------------- */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-bold text-gray-500 mr-1">Active:</span>

          {filters.age !== "all" && (
            <button
              type="button"
              onClick={() => handleAgeSelect("all")}
              aria-label={`Remove Age filter: ${AGE_OPTIONS.find((a) => a.id === filters.age)?.label}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF4500] text-xs font-bold hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <span>Age: {AGE_OPTIONS.find((a) => a.id === filters.age)?.label}</span>
              <CloseIcon className="!text-[14px]" />
            </button>
          )}

          {filters.postKarma !== "all" && (
            <button
              type="button"
              onClick={() => handlePostKarmaChange("all")}
              aria-label={`Remove Post Karma filter: ${POST_KARMA_OPTIONS.find((p) => p.id === filters.postKarma)?.label}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF4500] text-xs font-bold hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <span>Post: {POST_KARMA_OPTIONS.find((p) => p.id === filters.postKarma)?.label}</span>
              <CloseIcon className="!text-[14px]" />
            </button>
          )}

          {filters.commentKarma !== "all" && (
            <button
              type="button"
              onClick={() => handleCommentKarmaChange("all")}
              aria-label={`Remove Comment Karma filter: ${COMMENT_KARMA_OPTIONS.find((c) => c.id === filters.commentKarma)?.label}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <span>Comment: {COMMENT_KARMA_OPTIONS.find((c) => c.id === filters.commentKarma)?.label}</span>
              <CloseIcon className="!text-[14px]" />
            </button>
          )}

          {filters.totalKarma !== "all" && (
            <button
              type="button"
              onClick={() => handleTotalKarmaChange("all")}
              aria-label={`Remove Total Karma filter: ${TOTAL_KARMA_OPTIONS.find((t) => t.id === filters.totalKarma)?.label}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <span>Total: {TOTAL_KARMA_OPTIONS.find((t) => t.id === filters.totalKarma)?.label}</span>
              <CloseIcon className="!text-[14px]" />
            </button>
          )}

          {filters.tag && (
            <button
              type="button"
              onClick={() => onFilterChange({ ...filters, tag: null })}
              aria-label={`Remove Tag filter: ${filters.tag}`}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 border border-gray-300 text-gray-800 text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <span>Tag: {filters.tag}</span>
              <CloseIcon className="!text-[14px]" />
            </button>
          )}

          <button
            type="button"
            onClick={handleResetAll}
            className="text-xs font-bold text-gray-500 hover:text-red-600 underline ml-1 cursor-pointer transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Mobile & Tablet Full Slide-Over Filter Drawer */}
      {/* ------------------------------------------------------------- */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TuneIcon className="!text-[22px] text-[#FF4500]" />
                <h3 className="text-base font-extrabold text-gray-900">Filter Inventory</h3>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF4500] text-xs font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                aria-label="Close filter drawer"
                className="p-2 min-h-[44px] min-w-[44px] rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center cursor-pointer transition-colors"
              >
                <CloseIcon className="!text-[20px]" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
              {/* Account Age Section */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarTodayOutlinedIcon className="!text-[15px] text-[#FF4500]" />
                  <span>Account Age</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {AGE_OPTIONS.map((opt) => {
                    const isSelected = filters.age === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleAgeSelect(opt.id)}
                        className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition-colors ${
                          isSelected
                            ? "bg-orange-50 border-[#FF4500] text-[#FF4500]"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckIcon className="!text-[16px] text-[#FF4500]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Post Karma Section */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <InsertDriveFileOutlinedIcon className="!text-[15px] text-[#FF4500]" />
                  <span>Post Karma</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {POST_KARMA_OPTIONS.map((opt) => {
                    const isSelected = filters.postKarma === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handlePostKarmaChange(opt.id)}
                        className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition-colors ${
                          isSelected
                            ? "bg-orange-50 border-[#FF4500] text-[#FF4500]"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckIcon className="!text-[16px] text-[#FF4500]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment Karma Section */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ChatBubbleOutlineRoundedIcon className="!text-[15px] text-blue-500" />
                  <span>Comment Karma</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMENT_KARMA_OPTIONS.map((opt) => {
                    const isSelected = filters.commentKarma === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleCommentKarmaChange(opt.id)}
                        className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition-colors ${
                          isSelected
                            ? "bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckIcon className="!text-[16px] text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Karma Section */}
              <div className="space-y-2.5">
                <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <StarBorderRoundedIcon className="!text-[15px] text-amber-500" />
                  <span>Total Karma</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TOTAL_KARMA_OPTIONS.map((opt) => {
                    const isSelected = filters.totalKarma === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleTotalKarmaChange(opt.id)}
                        className={`min-h-[42px] px-3 py-2 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition-colors ${
                          isSelected
                            ? "bg-amber-50 border-amber-500 text-amber-700"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <CheckIcon className="!text-[16px] text-amber-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50/60 flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetAll}
                className="min-h-[48px] px-4 rounded-xl border border-gray-300 hover:bg-gray-100 bg-white text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="flex-1 min-h-[48px] px-5 rounded-xl bg-[#FF4500] hover:bg-[#E03D00] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center"
              >
                Show {totalResults} Accounts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
