"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { KARMA_ACCOUNTS } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ShareIcon from "@mui/icons-material/Share";
import PolicyIcon from "@mui/icons-material/Policy";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LockIcon from "@mui/icons-material/Lock";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShieldIcon from "@mui/icons-material/Shield";
import KeyIcon from "@mui/icons-material/Key";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import HomeIcon from "@mui/icons-material/Home";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function ListingDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "RDT-A492";
  const { addToCart, openProofModal, showToast, accounts } = useCart();

  const account = useMemo(() => {
    return (
      accounts.find((a) => a.id === id) ||
      KARMA_ACCOUNTS.find((a) => a.id === id) ||
      accounts[0] ||
      KARMA_ACCOUNTS[0]
    );
  }, [id, accounts]);

  const [qty, setQty] = useState(1);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Listing URL copied to clipboard!", "success");
    }
  };

  return (
    <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-6">
      
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
        <nav className="flex items-center gap-1.5">
          <Link href="/" className="hover:text-[#FF4500] flex items-center gap-1">
            <HomeIcon className="!text-[16px]" />
            Marketplace
          </Link>
          <ChevronRightIcon className="!text-[14px]" />
          <Link href="/#all-accounts" className="hover:text-[#FF4500]">
            Reddit Accounts
          </Link>
          <ChevronRightIcon className="!text-[14px]" />
          <span className="font-semibold text-gray-900">{account.id}</span>
        </nav>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 text-green-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
            Escrow Audited Profile
          </span>
          <span className="font-mono text-gray-400">{account.hash}</span>
        </div>
      </div>

      {/* Account Title Banner Card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF4500] shrink-0 shadow-2xs">
            <SmartToyIcon className="!text-[32px]" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  account.badgeType === "best-value"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : "bg-green-50 text-green-700 border border-green-200/60"
                }`}
              >
                {account.badgeType === "best-value" ? "🛡️ Best Value" : "✓ Verified"}
              </span>
              <span className="text-xs font-mono text-gray-400">{account.sku}</span>
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Instant Handover Ready
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {account.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{account.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleShare}
            className="px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ShareIcon className="!text-[16px]" />
            Share
          </button>
          <button
            onClick={() => openProofModal(account.id)}
            className="px-3.5 py-2 rounded-xl bg-orange-50 text-[#FF4500] border border-orange-200 hover:bg-orange-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <PolicyIcon className="!text-[16px]" />
            Proof Audit
          </button>
        </div>
      </div>

      {/* Main Split Grid (Left Analytics 8 cols / Right Buy Box 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* 4 Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs">
              <span className="text-xs text-gray-400 block mb-1">Total Karma</span>
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {account.totalKarmaDisplay}
              </span>
              <span className="text-[11px] text-gray-400 block mt-1">Combined Activity</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs">
              <span className="text-xs text-gray-400 block mb-1">Account Age</span>
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {account.ageDisplay}
              </span>
              <span className="text-[11px] text-gray-400 block mt-1">{account.registrationDate}</span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs">
              <span className="text-xs text-gray-400 block mb-1">Submissions (Posts)</span>
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {account.postsCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-400 block mt-1">
                {account.postKarma.toLocaleString()} Post Karma
              </span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs">
              <span className="text-xs text-gray-400 block mb-1">Comments</span>
              <span className="text-xl sm:text-2xl font-black text-gray-900">
                {account.commentsCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-gray-400 block mt-1">
                {account.commentKarma.toLocaleString()} Comment Karma
              </span>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <VerifiedIcon className="text-green-600 !text-[20px]" />
              Escrow Verification Check
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <CheckCircleIcon className="text-green-600 !text-[18px]" />
                <div>
                  <strong className="text-gray-900 block">Clean Shadowban Audit</strong>
                  <span className="text-gray-500">0 Reddit algorithmic strikes or penalties.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <CheckCircleIcon className="text-green-600 !text-[18px]" />
                <div>
                  <strong className="text-gray-900 block">Verified Recovery Email</strong>
                  <span className="text-gray-500">Original email included with clean handover.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <CheckCircleIcon className="text-green-600 !text-[18px]" />
                <div>
                  <strong className="text-gray-900 block">Organic Engagement</strong>
                  <span className="text-gray-500">High karma curve with genuine user discussions.</span>
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <CheckCircleIcon className="text-green-600 !text-[18px]" />
                <div>
                  <strong className="text-gray-900 block">48-Hour Inspection Guarantee</strong>
                  <span className="text-gray-500">Funds protected in escrow until you approve.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Karma Growth Trajectory Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Historical Karma Growth</h3>
              <span className="text-xs text-gray-400">Audited Ledger History</span>
            </div>
            <div className="h-40 flex items-end gap-3 pt-6 px-2 border-b border-gray-100">
              {account.trajectory.map((t) => (
                <div
                  key={t.year}
                  className="flex-1 bg-orange-400 hover:bg-[#FF4500] rounded-t-lg transition-all cursor-pointer relative group flex flex-col items-center justify-end"
                  style={{ height: t.height }}
                >
                  <span className="absolute -top-6 text-[10px] font-bold text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-1.5 py-0.5 rounded shadow-xs border border-gray-200">
                    {t.val}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-400 px-2">
              {account.trajectory.map((t) => (
                <span key={t.year}>{t.year}</span>
              ))}
            </div>
          </div>

          {/* Subreddit Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900">Karma Distribution by Subreddit</h3>
            <div className="space-y-3">
              {account.communities.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-900">{c.name}</span>
                    <span className="text-gray-500">
                      {c.karma.toLocaleString()} karma ({c.percent})
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#FF4500] h-2 rounded-full" style={{ width: c.percent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Escrow Purchase Box (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-lg space-y-4 sm:space-y-5 lg:sticky lg:top-24">
            
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                Acquisition Price
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-black text-gray-950">
                  ${(account.price * qty).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">USD</span>
              </div>
              <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
                <VerifiedIcon className="!text-[15px]" />
                0% Buyer Escrow Fee • Instant Delivery
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700">Select Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    disabled={qty <= 1}
                    className="px-3.5 py-2 hover:bg-gray-100 text-gray-600 font-bold text-base transition-colors cursor-pointer disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-sm text-gray-900 min-w-[36px] text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => Math.min(account.stock, q + 1))}
                    disabled={qty >= account.stock}
                    className="px-3.5 py-2 hover:bg-gray-100 text-gray-600 font-bold text-base transition-colors cursor-pointer disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-400">{account.stock} available</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <Link
                href={`/checkout?id=${account.id}&qty=${qty}`}
                className="w-full py-3.5 bg-[#FF4500] hover:bg-[#E03D00] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01]"
              >
                <LockIcon className="!text-[20px]" />
                <span>Proceed to Escrow Checkout</span>
              </Link>
              <button
                onClick={() => addToCart(account.id, qty)}
                className="w-full py-3 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <AddShoppingCartIcon className="!text-[18px]" />
                <span>Add to Basket</span>
              </button>
            </div>

            {/* Safeguards */}
            <div className="pt-4 border-t border-gray-100 space-y-2 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <ShieldIcon className="text-green-600 !text-[16px]" />
                <span>Payment held in escrow until verification</span>
              </div>
              <div className="flex items-center gap-2">
                <KeyIcon className="text-green-600 !text-[16px]" />
                <span>Credentials revealed immediately in your Vault</span>
              </div>
              <div className="flex items-center gap-2">
                <SupportAgentIcon className="text-green-600 !text-[16px]" />
                <span>24/7 dedicated dispute mediation</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </main>
  );
}

function ListingPageSkeleton() {
  return (
    <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
      <div className="animate-pulse space-y-6">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-gray-100 rounded-full w-64" />
        {/* Title card skeleton */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 h-28" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bg-gray-100 rounded-xl h-24" />
              ))}
            </div>
            <div className="bg-gray-100 rounded-2xl h-48" />
            <div className="bg-gray-100 rounded-2xl h-56" />
          </div>
          <div className="lg:col-span-4">
            <div className="bg-gray-100 rounded-2xl h-80" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ListingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD]">
      <Navbar />
      <Suspense fallback={<ListingPageSkeleton />}>
        <ListingDetailContent />
      </Suspense>
      <Footer />
    </div>
  );
}
