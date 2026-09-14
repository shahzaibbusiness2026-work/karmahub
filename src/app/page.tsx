"use client";

import React, { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import StatsRibbon from "@/components/StatsRibbon";
import FeaturedAccounts from "@/components/FeaturedAccounts";
import MarketplaceProtections from "@/components/MarketplaceProtections";
import TrustRibbon from "@/components/TrustRibbon";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import AccountCard from "@/components/AccountCard";
import { useCart } from "@/context/CartContext";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Platform IDs that have real inventory — everything else shows a coming-soon state
const ACTIVE_PLATFORM_IDS = ["reddit"] as const;
type ActivePlatform = (typeof ACTIVE_PLATFORM_IDS)[number];

function isPlatformActive(id: string): id is ActivePlatform {
  return ACTIVE_PLATFORM_IDS.includes(id as ActivePlatform);
}

type SortKey = "default" | "price-asc" | "price-desc" | "karma-desc" | "age-desc";

export default function HomePage() {
  const { accounts } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState("reddit");
  const [sortBy, setSortBy] = useState<SortKey>("default");

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

    // Filter by quick-filter tag
    if (selectedTag) {
      list = list.filter((acc) => {
        switch (selectedTag) {
          case "1+ Year":
            return acc.ageYears >= 1.0;
          case "10K+ Karma":
            return acc.totalKarma >= 10_000;
          case "Verified Email":
            return (
              acc.emailStatus.includes("Transferable") ||
              acc.emailStatus.includes("Clean")
            );
          case "Active":
            return acc.tags.includes("Active") || acc.commentsCount > 1_000;
          case "Low Price":
            return acc.price <= 100;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "karma-desc":
        list.sort((a, b) => b.totalKarma - a.totalKarma);
        break;
      case "age-desc":
        list.sort((a, b) => b.ageYears - a.ageYears);
        break;
    }

    return list;
  }, [accounts, searchQuery, selectedTag, sortBy]);

  const handleTagToggle = (tag: string) => {
    setSelectedTag((prev) => (prev === tag ? null : tag));
    document.getElementById("all-accounts")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    document.getElementById("all-accounts")?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePlatformSelect = (id: string) => {
    setSelectedPlatform(id);
    // Scroll into the accounts section so the coming-soon state is visible
    if (!isPlatformActive(id)) {
      document.getElementById("all-accounts")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const showComingSoon = !isPlatformActive(selectedPlatform);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar onSearch={setSearchQuery} />

      <Hero
        onSearch={handleHeroSearch}
        onTagSelect={handleTagToggle}
        activeTag={selectedTag}
      />

      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 py-8 w-full space-y-10 flex-1">

        {/* Platform Category Tabs */}
        <CategoryTabs
          selectedPlatform={selectedPlatform}
          onSelectPlatform={handlePlatformSelect}
        />

        {/* Platform-wide Statistics */}
        <StatsRibbon />

        {/* Marketplace Buyer Protections strip */}
        <MarketplaceProtections />

        {/* Featured Listings — only shown for active platform */}
        {!showComingSoon && <FeaturedAccounts accounts={accounts} />}

        {/* Trust & Security Features */}
        <TrustRibbon />

        {/* How It Works */}
        <HowItWorks />

        {/* Full Filterable Inventory */}
        <section id="all-accounts" className="space-y-6 pt-6 border-t border-gray-100" aria-labelledby="all-accounts-heading">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 id="all-accounts-heading" className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
                {showComingSoon
                  ? `${selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} Accounts`
                  : "All Inventory Accounts"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                {showComingSoon
                  ? "This platform catalog is coming soon — sign up to get notified."
                  : "Browse complete verified stock with instant automated escrow handoff."}
              </p>
            </div>

            {/* Sort & Filter Controls — hidden when showing coming-soon state */}
            {!showComingSoon && (
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
                    onChange={(e) => setSortBy(e.target.value as SortKey)}
                    aria-label="Sort accounts"
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
            )}
          </div>

          {/* Coming Soon State */}
          {showComingSoon ? (
            <div className="py-20 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="font-bold text-gray-900 text-lg">Coming Soon</h3>
              <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
                We&apos;re onboarding verified{" "}
                {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)} sellers.
                Check back soon or browse our Reddit catalog in the meantime.
              </p>
              <button
                onClick={() => {
                  setSelectedPlatform("reddit");
                  setSearchQuery("");
                  setSelectedTag(null);
                }}
                className="mt-6 min-h-[44px] px-6 py-2.5 bg-[#FF4500] hover:bg-[#E03D00] text-white rounded-xl text-sm font-bold transition-colors cursor-pointer shadow-xs"
              >
                Browse Reddit Accounts
              </button>
            </div>
          ) : filteredAccounts.length === 0 ? (
            /* Empty search results */
            <div className="col-span-full py-16 text-center text-gray-500 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <SearchOffIcon className="!text-[48px] text-gray-300 mb-2" aria-hidden="true" />
              <h3 className="font-bold text-gray-900 text-base">No matching accounts found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try clearing your search or selecting a different filter tag.
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
            /* Accounts grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccounts.map((acc) => (
                <AccountCard key={acc.id} account={acc} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
