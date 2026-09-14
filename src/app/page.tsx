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

import InventoryFilters, {
  FilterState,
  AGE_OPTIONS,
} from "@/components/InventoryFilters";

export default function HomePage() {
  const { accounts } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("reddit");

  const [filterState, setFilterState] = useState<FilterState>({
    age: "all",
    postKarma: "all",
    commentKarma: "all",
    totalKarma: "all",
    sortBy: "default",
    tag: null,
  });

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
          (acc.subreddit && acc.subreddit.toLowerCase().includes(q)) ||
          (acc.description && acc.description.toLowerCase().includes(q)) ||
          acc.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by Account Age (1m, 3m, 6m, 1y, 2y, 3y, 5y)
    if (filterState.age !== "all") {
      const option = AGE_OPTIONS.find((a) => a.id === filterState.age);
      if (option) {
        list = list.filter((acc) => acc.ageYears >= option.minYears);
      }
    }

    // Filter by Post Karma
    if (filterState.postKarma !== "all") {
      const minPostKarma = Number(filterState.postKarma) || 0;
      list = list.filter((acc) => acc.postKarma >= minPostKarma);
    }

    // Filter by Comment Karma
    if (filterState.commentKarma !== "all") {
      const minCommentKarma = Number(filterState.commentKarma) || 0;
      list = list.filter((acc) => acc.commentKarma >= minCommentKarma);
    }

    // Filter by Total Karma
    if (filterState.totalKarma !== "all") {
      const minTotalKarma = Number(filterState.totalKarma) || 0;
      list = list.filter((acc) => acc.totalKarma >= minTotalKarma);
    }

    // Filter by quick-filter tag
    if (filterState.tag) {
      list = list.filter((acc) => {
        switch (filterState.tag) {
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

    // Sort accounts
    switch (filterState.sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "karma-desc":
        list.sort((a, b) => b.totalKarma - a.totalKarma);
        break;
      case "post-karma-desc":
        list.sort((a, b) => b.postKarma - a.postKarma);
        break;
      case "comment-karma-desc":
        list.sort((a, b) => b.commentKarma - a.commentKarma);
        break;
      case "age-desc":
        list.sort((a, b) => b.ageYears - a.ageYears);
        break;
      case "age-asc":
        list.sort((a, b) => a.ageYears - b.ageYears);
        break;
      default:
        // default order
        break;
    }

    return list;
  }, [accounts, searchQuery, filterState]);

  const handleTagToggle = (tag: string) => {
    setFilterState((prev) => ({
      ...prev,
      tag: prev.tag === tag ? null : tag,
    }));
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
        activeTag={filterState.tag}
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

          {/* Comprehensive Inventory Filters (Age, Post Karma, Comment Karma, Sort) */}
          {!showComingSoon && (
            <InventoryFilters
              filters={filterState}
              onFilterChange={setFilterState}
              totalResults={filteredAccounts.length}
              totalInventoryCount={accounts.length}
            />
          )}

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
                  setFilterState({
                    age: "all",
                    postKarma: "all",
                    commentKarma: "all",
                    totalKarma: "all",
                    sortBy: "default",
                    tag: null,
                  });
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
                Try clearing your search or resetting the filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterState({
                    age: "all",
                    postKarma: "all",
                    commentKarma: "all",
                    totalKarma: "all",
                    sortBy: "default",
                    tag: null,
                  });
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
