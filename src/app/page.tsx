"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import StatsRibbon from "@/components/StatsRibbon";
import FeaturedAccounts from "@/components/FeaturedAccounts";
import MarketplaceProtections from "@/components/MarketplaceProtections";
import TrustRibbon from "@/components/TrustRibbon";
import Footer from "@/components/Footer";
import AccountCard from "@/components/AccountCard";
import { useCart } from "@/context/CartContext";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function HomePage() {
  const { accounts } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("reddit");
  const [sortBy, setSortBy] = useState("default");

  const filteredAccounts = useMemo(() => {
    let list = [...accounts];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (acc) =>
          acc.title.toLowerCase().includes(q) ||
          acc.subtitle.toLowerCase().includes(q) ||
          acc.id.toLowerCase().includes(q) ||
          acc.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by tag
    if (selectedTag) {
      list = list.filter((acc) => {
        if (selectedTag === "1+ Year") return acc.ageYears >= 1.0;
        if (selectedTag === "10K+ Karma") return acc.totalKarma >= 10000;
        if (selectedTag === "Verified Email")
          return acc.emailStatus.includes("Transferable") || acc.emailStatus.includes("Clean");
        if (selectedTag === "Active")
          return acc.tags.includes("Active") || acc.commentsCount > 1000;
        if (selectedTag === "Low Price") return acc.price <= 100;
        return true;
      });
    }

    // Sorting
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sortBy === "karma-desc") list.sort((a, b) => b.totalKarma - a.totalKarma);
    else if (sortBy === "age-desc") list.sort((a, b) => b.ageYears - a.ageYears);

    return list;
  }, [accounts, searchQuery, selectedTag, sortBy]);

  const handleTagToggle = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      document.getElementById("all-accounts")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    document.getElementById("all-accounts")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navigation Header (72px desktop height, flexible search, admin profile dropdown) */}
      <Navbar onSearch={(q) => setSearchQuery(q)} />

      {/* Hero Section */}
      <Hero
        onSearch={handleHeroSearch}
        onTagSelect={handleTagToggle}
        activeTag={selectedTag}
      />

      {/* Main Container - Centered max-w-[1240px] aligned with listings */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 w-full space-y-10 flex-1">
        
        {/* Category Tabs (Row of 6 Platforms) */}
        <CategoryTabs
          selectedPlatform={selectedPlatform}
          onSelectPlatform={setSelectedPlatform}
        />

        {/* Platform Statistics Ribbon */}
        <StatsRibbon />

        {/* Compact Marketplace-Wide Protections Strip above listings */}
        <MarketplaceProtections />

        {/* Featured Reddit Accounts (Refined Cards & Toolbar with 24px gap) */}
        <FeaturedAccounts accounts={accounts} />

        {/* Bottom Trust & Security Features Ribbon */}
        <TrustRibbon />

        {/* Dynamic Filterable Complete Inventory */}
        <div id="all-accounts" className="space-y-6 pt-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                All Inventory Accounts
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Browse complete verified stock with instant automated escrow handoff.
              </p>
            </div>

            {/* Sorting & Filter Controls */}
            <div className="flex items-center gap-3">
              {selectedTag && (
                <button
                  onClick={() => setSelectedTag(null)}
                  className="text-xs px-3 py-1.5 bg-orange-50 text-[#FF4500] font-bold rounded-xl border border-orange-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4500]"
                >
                  Filter: {selectedTag} ✕
                </button>
              )}
              <div className="relative inline-flex items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none text-xs font-bold text-gray-800 bg-gray-50 hover:bg-gray-100/80 border border-gray-200 rounded-xl min-h-[44px] h-11 pl-3.5 pr-9 focus:outline-none focus:border-[#FF4500] focus-visible:ring-2 focus-visible:ring-[#FF4500] cursor-pointer transition-colors"
                >
                  <option value="default">Sort by: Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="karma-desc">Karma: Highest First</option>
                  <option value="age-desc">Age: Oldest First</option>
                </select>
                <KeyboardArrowDownIcon
                  className="!text-[18px] text-gray-500 absolute right-2.5 pointer-events-none"
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Cards Grid: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) with 24px gap */}
          {filteredAccounts.length === 0 ? (
            <div className="col-span-full py-16 text-center text-gray-500 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <SearchOffIcon className="!text-[48px] text-gray-300 mb-2" aria-hidden="true" />
              <h3 className="font-bold text-gray-900 text-base">No matching accounts found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No accounts matched your search criteria. Try clearing your search query or selecting another tag.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag(null);
                }}
                className="mt-4 min-h-[44px] px-5 py-2.5 bg-[#FF4500] hover:bg-[#E03D00] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs focus-visible:ring-2 focus-visible:ring-[#FF4500]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccounts.map((acc) => (
                <AccountCard key={acc.id} account={acc} />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
