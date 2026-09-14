"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Account, CommunityItem } from "@/types";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";
import LaunchIcon from "@mui/icons-material/Launch";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DownloadIcon from "@mui/icons-material/Download";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import StarIcon from "@mui/icons-material/Star";
import ForumIcon from "@mui/icons-material/Forum";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import GroupsIcon from "@mui/icons-material/Groups";

export default function AdminDashboardPage() {
  const {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
    orders,
    updateOrderStatus,
    logs,
    showToast,
  } = useCart();

  const [activeTab, setActiveTab] = useState<"listings" | "orders" | "logs" | "settings">("listings");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("all");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalTab, setAddModalTab] = useState<"general" | "activity" | "pricing" | "vault" | "communities">("general");

  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [editModalTab, setEditModalTab] = useState<"general" | "activity" | "pricing" | "vault" | "communities">("general");

  const createInitialForm = (): Partial<Account> => ({
    id: `RDT-${Math.floor(1000 + Math.random() * 9000)}`,
    title: "",
    subtitle: "High Trust Score • Clean Historical Record",
    price: 149,
    ageYears: 3.2,
    ageDisplay: "3.2 years",
    totalKarma: 25000,
    totalKarmaDisplay: "25,000",
    postsCount: 420,
    commentsCount: 3120,
    postKarma: 4200,
    commentKarma: 20800,
    stock: 1,
    badge: "Verified",
    badgeType: "verified",
    tier: "High Trust Authority",
    sku: `RDT-3YR-EST-${Math.floor(100 + Math.random() * 900)}`,
    registrationDate: "14 May 2023",
    emailStatus: "Transferable (Clean Sterile OG Mail)",
    shadowbanAudit: "100% Clean (0 Strikes)",
    tags: ["1+ Year", "10K+ Karma", "Verified Email", "Active"],
    bannerTheme: "volcano",
    subreddit: "u/AskReddit",
    description: "Well-established account with high karma and clean history. Perfect for marketing, promotion or business use.",
    activityStatus: "High Activity (Daily Comments & Discussions)",
    hash: `#0x${Math.random().toString(16).substring(2, 6).toUpperCase()}...${Math.random().toString(16).substring(2, 6).toUpperCase()}`,
    vaultUsername: "u/AskReddit_veteran",
    vaultPasskey: "M4$t3r_P@ss_2026!",
    vaultEmail: "vault-transfer-sterile@accomarket.net",
    vaultToken: `tk_live_${Math.floor(1000 + Math.random() * 9000)}`,
    communities: [
      { name: "r/technology", karma: 8400, percent: "33.6%", color: "bg-[#FF4500]" },
      { name: "r/AskReddit", karma: 7200, percent: "28.8%", color: "bg-[#FF6B35]" },
      { name: "r/science", karma: 4800, percent: "19.2%", color: "bg-[#FFA07A]" },
    ],
    badges: [
      { title: "Three-Year Club", date: "Granted May 2026", icon: "workspace_premium", color: "text-[#FF4500]" },
      { title: "Verified Email", date: "Validated 2023", icon: "verified_user", color: "text-green-600" },
    ],
    trajectory: [
      { year: "'24", height: "35%", val: "4.2k" },
      { year: "'25", height: "70%", val: "14.8k" },
      { year: "'26", height: "100%", val: "25.0k" },
    ],
  });

  // New Listing Form State
  const [newAccForm, setNewAccForm] = useState<Partial<Account>>(createInitialForm());

  // Filtered Listings
  const filteredListings = useMemo(() => {
    let list = [...accounts];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (acc) =>
          acc.title.toLowerCase().includes(q) ||
          acc.id.toLowerCase().includes(q) ||
          (acc.subreddit && acc.subreddit.toLowerCase().includes(q)) ||
          (acc.sku && acc.sku.toLowerCase().includes(q)) ||
          acc.subtitle.toLowerCase().includes(q)
      );
    }
    if (filterTier !== "all") {
      list = list.filter((acc) => acc.badgeType === filterTier);
    }
    return list;
  }, [accounts, searchQuery, filterTier]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalVolume = orders.reduce((sum, o) => sum + o.subtotal, 0) + 28400;
    const activeEscrow = orders
      .filter((o) => o.status === "locked")
      .reduce((sum, o) => sum + o.subtotal, 0) + 1420;
    const totalListings = accounts.length;
    const totalStock = accounts.reduce((sum, a) => sum + a.stock, 0);
    return { totalVolume, activeEscrow, totalListings, totalStock };
  }, [orders, accounts]);

  // Handle Form Submission: Create Listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccForm.title?.trim()) {
      showToast("Please enter an account title", "error");
      setAddModalTab("general");
      return;
    }

    const postK = Number(newAccForm.postKarma) || 0;
    const commentK = Number(newAccForm.commentKarma) || 0;
    const totalK = Number(newAccForm.totalKarma) || (postK + commentK) || 15000;

    const badgeLabel =
      newAccForm.badgeType === "premium"
        ? "Premium"
        : newAccForm.badgeType === "best-value"
        ? "Best Value"
        : "Verified";

    const created: Account = {
      id: newAccForm.id || `RDT-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newAccForm.title.trim(),
      subtitle: newAccForm.subtitle || "Organic Discussions • Clean Standing",
      registrationDate: newAccForm.registrationDate || "12 Jan 2024",
      sku: newAccForm.sku || `RDT-SKU-${Math.floor(100 + Math.random() * 900)}`,
      ageYears: Number(newAccForm.ageYears) || 2.5,
      ageDisplay: `${newAccForm.ageYears || 2.5} years`,
      price: Number(newAccForm.price) || 99,
      stock: Number(newAccForm.stock) !== undefined ? Number(newAccForm.stock) : 1,
      tier: newAccForm.tier || "High Trust Authority",
      types: ["aged", "verified"],
      postKarma: postK,
      commentKarma: commentK,
      totalKarma: totalK,
      totalKarmaDisplay: totalK.toLocaleString(),
      postsCount: Number(newAccForm.postsCount) || 350,
      commentsCount: Number(newAccForm.commentsCount) || 2100,
      badge: badgeLabel,
      badgeType: (newAccForm.badgeType as "verified" | "best-value" | "premium") || "verified",
      bannerTheme: newAccForm.bannerTheme || "volcano",
      subreddit: newAccForm.subreddit || "u/AskReddit",
      description:
        newAccForm.description ||
        "Well-established account with high karma and clean history. Perfect for marketing, promotion or business use.",
      activityStatus: newAccForm.activityStatus || "High Activity (Daily Comments & Discussions)",
      emailStatus: newAccForm.emailStatus || "Transferable (Clean Sterile OG Mail)",
      shadowbanAudit: newAccForm.shadowbanAudit || "100% Clean (0 Strikes)",
      tags:
        newAccForm.tags && newAccForm.tags.length > 0
          ? newAccForm.tags
          : ["1+ Year", "10K+ Karma", "Verified Email", "Active"],
      communities: newAccForm.communities || [
        { name: "r/technology", karma: 6200, percent: "41.3%", color: "bg-[#FF4500]" },
        { name: "r/AskReddit", karma: 5100, percent: "34.0%", color: "bg-[#FF6B35]" },
        { name: "r/science", karma: 3700, percent: "24.7%", color: "bg-[#FFA07A]" },
      ],
      badges: newAccForm.badges || [
        { title: "Two-Year Club", date: "Granted Aug 2026", icon: "workspace_premium", color: "text-[#FF4500]" },
        { title: "Verified Email", date: "Validated 2024", icon: "verified_user", color: "text-green-600" },
      ],
      trajectory: newAccForm.trajectory || [
        { year: "'24", height: "35%", val: "4.2k" },
        { year: "'25", height: "70%", val: "14.8k" },
        { year: "'26", height: "100%", val: `${(totalK / 1000).toFixed(1)}k` },
      ],
      hash: newAccForm.hash || "#0x889F...7AC1",
      vaultPasskey: newAccForm.vaultPasskey || "VaultPass_2026!",
      vaultUsername: newAccForm.vaultUsername || `u/${newAccForm.title.toLowerCase().replace(/\s+/g, "_")}`,
      vaultEmail: newAccForm.vaultEmail || "vault-auto@accomarket.net",
      vaultToken: newAccForm.vaultToken || "tk_live_auto",
    };

    addAccount(created);
    setIsAddModalOpen(false);
    setNewAccForm(createInitialForm());
    setAddModalTab("general");
  };

  // Handle Form Submission: Update Listing
  const handleUpdateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;

    const postK = Number(editingAccount.postKarma) || 0;
    const commentK = Number(editingAccount.commentKarma) || 0;
    const totalK = Number(editingAccount.totalKarma) || (postK + commentK) || 15000;

    const badgeLabel =
      editingAccount.badgeType === "premium"
        ? "Premium"
        : editingAccount.badgeType === "best-value"
        ? "Best Value"
        : "Verified";

    updateAccount(editingAccount.id, {
      ...editingAccount,
      title: editingAccount.title,
      price: Number(editingAccount.price),
      stock: Number(editingAccount.stock),
      ageYears: Number(editingAccount.ageYears),
      ageDisplay: `${editingAccount.ageYears} years`,
      postKarma: postK,
      commentKarma: commentK,
      totalKarma: totalK,
      totalKarmaDisplay: totalK.toLocaleString(),
      postsCount: Number(editingAccount.postsCount),
      commentsCount: Number(editingAccount.commentsCount),
      badge: badgeLabel,
      badgeType: editingAccount.badgeType,
      bannerTheme: editingAccount.bannerTheme,
      subreddit: editingAccount.subreddit,
      description: editingAccount.description,
      activityStatus: editingAccount.activityStatus,
      emailStatus: editingAccount.emailStatus,
      shadowbanAudit: editingAccount.shadowbanAudit,
      tier: editingAccount.tier,
      vaultUsername: editingAccount.vaultUsername,
      vaultPasskey: editingAccount.vaultPasskey,
      vaultEmail: editingAccount.vaultEmail,
    });
    setEditingAccount(null);
  };

  const handleExportDatabase = () => {
    const data = {
      timestamp: new Date().toISOString(),
      inventory: accounts,
      orders,
      logs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AccoMarket_Database_Export_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Marketplace database exported as JSON!", "success");
  };

  // Tag toggle helper for create form
  const toggleNewTag = (tag: string) => {
    const currentTags = newAccForm.tags || [];
    if (currentTags.includes(tag)) {
      setNewAccForm({ ...newAccForm, tags: currentTags.filter((t) => t !== tag) });
    } else {
      setNewAccForm({ ...newAccForm, tags: [...currentTags, tag] });
    }
  };

  // Tag toggle helper for edit form
  const toggleEditTag = (tag: string) => {
    if (!editingAccount) return;
    const currentTags = editingAccount.tags || [];
    if (currentTags.includes(tag)) {
      setEditingAccount({ ...editingAccount, tags: currentTags.filter((t) => t !== tag) });
    } else {
      setEditingAccount({ ...editingAccount, tags: [...currentTags, tag] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Admin Top Header */}
      <header className="bg-gray-950 text-white border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="text-xl sm:text-2xl font-black tracking-tight flex items-center">
                <span className="text-white">Acco</span>
                <span className="text-[#FF4500]">Market</span>
              </div>
            </Link>
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF4500]/20 text-[#FF4500] border border-[#FF4500]/30 text-xs font-bold uppercase tracking-wider">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Escrow Multi-Sig Node: Online
            </div>

            <button
              onClick={handleExportDatabase}
              className="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Export database JSON"
            >
              <DownloadIcon className="!text-[16px]" />
              <span className="hidden sm:inline">Export DB</span>
            </button>

            <Link
              href="/"
              className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
            >
              <StorefrontIcon className="!text-[16px]" />
              <span>Live Storefront</span>
            </Link>

            <button
              onClick={() => {
                setNewAccForm(createInitialForm());
                setAddModalTab("general");
                setIsAddModalOpen(true);
              }}
              className="px-4 py-1.5 rounded-lg bg-[#FF4500] hover:bg-[#E03D00] text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <AddIcon className="!text-[18px]" />
              <span>New Listing</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 w-full space-y-5 sm:space-y-8 flex-1">
          {/* KPI Metric Cards — 1 col on xs, 2 on sm, 4 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF4500] shrink-0">
              <AttachMoneyIcon className="!text-[28px]" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">Total Gross Volume</span>
              <span className="text-2xl font-black text-gray-900">
                ${metrics.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-green-600 font-semibold block mt-0.5">
                ↑ +18.4% this week
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldIcon className="!text-[28px]" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">Active in Escrow</span>
              <span className="text-2xl font-black text-gray-900">
                ${metrics.activeEscrow.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-0.5">
                ● 100% Funds Secured
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <InventoryIcon className="!text-[28px]" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">Active Listings</span>
              <span className="text-2xl font-black text-gray-900">{metrics.totalListings} Profiles</span>
              <span className="text-[11px] text-gray-500 font-medium block mt-0.5">
                {metrics.totalStock} total available units
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <FactCheckIcon className="!text-[28px]" />
            </div>
            <div>
              <span className="text-xs font-medium text-gray-400 block">Escrow Clearance</span>
              <span className="text-2xl font-black text-gray-900">99.8%</span>
              <span className="text-[11px] text-purple-600 font-semibold block mt-0.5">
                0 Strikes / 0 Chargebacks
              </span>
            </div>
          </div>
        </div>
              {/* Tab Navigation — horizontally scrollable on mobile */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex gap-1 sm:gap-2 text-sm font-bold min-w-max pb-px" aria-label="Admin sections">
            {([
              { id: "listings", label: `Listings (${accounts.length})` },
              { id: "orders", label: `Orders (${orders.length})` },
              { id: "logs", label: `Logs (${logs.length})` },
              { id: "settings", label: "Settings" },
            ] as const).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`pb-3 px-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === id
                    ? "border-[#FF4500] text-[#FF4500]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* TAB 1: LISTINGS MANAGEMENT */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {/* Search & Action Bar */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 !text-[20px]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, SKU, subreddit..."
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500] focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <select
                  value={filterTier}
                  onChange={(e) => setFilterTier(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500]"
                >
                  <option value="all">All Tiers & Badges</option>
                  <option value="premium">Premium Only</option>
                  <option value="verified">Verified Only</option>
                  <option value="best-value">Best Value Only</option>
                </select>

                <button
                  onClick={() => {
                    setNewAccForm(createInitialForm());
                    setAddModalTab("general");
                    setIsAddModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#FF4500] hover:bg-[#E03D00] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                >
                  <AddIcon className="!text-[18px]" />
                  <span>Create Listing</span>
                </button>
              </div>
            </div>

            {/* Listings Table with Full Activity Metrics */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Account / Subreddit</th>
                      <th className="py-3.5 px-4">Age</th>
                      <th className="py-3.5 px-4">Total Karma</th>
                      <th className="py-3.5 px-4">Activity & Engagement</th>
                      <th className="py-3.5 px-4">Banner Theme</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock</th>
                      <th className="py-3.5 px-4">Badge</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredListings.map((acc) => (
                      <tr key={acc.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#FF4500] flex items-center justify-center font-bold shrink-0 shadow-2xs">
                              <SmartToyIcon className="!text-[19px]" />
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block">{acc.title}</span>
                              <span className="font-mono text-[11px] text-gray-400">
                                {acc.subreddit || acc.id} • {acc.sku}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 font-medium text-gray-700">{acc.ageDisplay}</td>
                        <td className="py-4 px-4 font-extrabold text-gray-900">
                          {acc.totalKarmaDisplay || acc.totalKarma.toLocaleString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-800 text-xs">
                            {acc.activityStatus || "High Activity (Daily Comments)"}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {acc.postsCount.toLocaleString()} posts • {acc.commentsCount.toLocaleString()} comments
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                            {acc.bannerTheme || "volcano"}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-black text-gray-950 text-sm">
                          ${acc.price.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              acc.stock > 0
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {acc.stock > 0 ? `${acc.stock} Available` : "Sold Out"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              acc.badgeType === "premium"
                                ? "bg-amber-50 text-amber-800 border-amber-300"
                                : acc.badgeType === "best-value"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-green-50 text-green-700 border-green-200"
                            }`}
                          >
                            {acc.badgeType === "premium" ? "👑 Premium" : acc.badge}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/listing?id=${acc.id}`}
                              target="_blank"
                              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              title="View storefront page"
                            >
                              <LaunchIcon className="!text-[16px]" />
                            </Link>
                            <button
                              onClick={() => {
                                setEditingAccount({ ...acc });
                                setEditModalTab("general");
                              }}
                              className="p-1.5 text-gray-400 hover:text-[#FF4500] hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit listing details"
                            >
                              <EditOutlinedIcon className="!text-[16px]" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove ${acc.title}?`)) {
                                  deleteAccount(acc.id);
                                }
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Delete listing"
                            >
                              <DeleteOutlineIcon className="!text-[16px]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ESCROW & ORDERS */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Escrow Transaction Ledger</h3>
                  <p className="text-xs text-gray-500">
                    Live record of customer acquisitions, cold quarantine locks, and seller payouts.
                  </p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  48-Hour Inspection Quarantine Active
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-bold text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Purchased Listing</th>
                      <th className="py-3.5 px-4">Buyer Entity</th>
                      <th className="py-3.5 px-4">Payment Method</th>
                      <th className="py-3.5 px-4">Escrow Amount</th>
                      <th className="py-3.5 px-4">Escrow Status</th>
                      <th className="py-3.5 px-4 text-right">Moderation Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((o) => (
                      <tr key={o.orderId} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-4 px-4 font-mono">
                          <span className="font-bold text-gray-900 block">{o.orderId}</span>
                          <span className="text-[11px] text-gray-400">
                            {new Date(o.timestamp).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-bold text-gray-900">{o.account?.title || "Reddit Profile"}</div>
                          <div className="text-[11px] text-gray-400">{o.account?.sku}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{o.email}</td>
                        <td className="py-4 px-4 font-medium text-gray-600">{o.paymentMethod || "Crypto (USDT)"}</td>
                        <td className="py-4 px-4 font-black text-gray-950 text-sm">
                          ${o.subtotal.toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              o.status === "released"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : o.status === "disputed"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            {o.status === "released"
                              ? "✓ Released"
                              : o.status === "disputed"
                              ? "⚠ Disputed"
                              : "🔒 Escrow Locked"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {o.status === "locked" && (
                              <button
                                onClick={() => updateOrderStatus(o.orderId, "released")}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Release Escrow
                              </button>
                            )}
                            {o.status === "locked" && (
                              <button
                                onClick={() => updateOrderStatus(o.orderId, "disputed")}
                                className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                Dispute
                              </button>
                            )}
                            {o.status === "released" && (
                              <span className="text-[11px] text-emerald-600 font-semibold">Completed</span>
                            )}
                            {o.status === "disputed" && (
                              <button
                                onClick={() => updateOrderStatus(o.orderId, "released")}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                              >
                                Re-verify
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Security & Ledger Audit Logs</h3>
                <p className="text-xs text-gray-500">
                  Cryptographic transaction timestamps, admin modifications, and automatic quarantine audits.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Live Daemon Feed: Active
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-gray-50/80 rounded-xl border border-gray-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#FF4500]"></span>
                    <span className="font-bold text-gray-800">{log.message}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded-md text-[10px] font-bold text-gray-600">
                      {log.badge}
                    </span>
                    <span className="text-gray-400 text-[11px]">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PLATFORM SETTINGS */}
        {activeTab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <LockIcon className="text-[#FF4500] !text-[20px]" />
                Escrow Hold Periods & Auto-Release
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Standard Quarantine Window</label>
                  <select className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none">
                    <option>48 Hours (Recommended Default)</option>
                    <option>24 Hours (Fast Release)</option>
                    <option>72 Hours (High Security VIP)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Platform Commission Fee</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      defaultValue="3.5%"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <VerifiedUserIcon className="text-green-600 !text-[20px]" />
                Sterile Transfer Node
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Default Transfer Domain</label>
                  <input
                    type="text"
                    defaultValue="sterile-transfer@accomarket.net"
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                  />
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800">
                  <span className="font-bold block mb-0.5">PGP Key Attestation Active</span>
                  <span>All customer vault credentials encrypted with RSA-4096 before transmission.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: CREATE NEW LISTING WITH ALL REQUIRED & ACTIVITY FIELDS */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[92vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <span>Create New Account Listing</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-[#FF4500] font-mono border border-orange-200">
                    {newAccForm.id}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Configure complete profile metadata, activity metrics, banner theme, and vault credentials.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Inner Tabs for Organizing All Options */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAddModalTab("general")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  addModalTab === "general"
                    ? "bg-[#FF4500] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <SmartToyIcon className="!text-[16px]" />
                <span>General & Theme</span>
              </button>

              <button
                type="button"
                onClick={() => setAddModalTab("activity")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  addModalTab === "activity"
                    ? "bg-[#FF4500] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ForumIcon className="!text-[16px]" />
                <span>Activity & Karma (Required)</span>
              </button>

              <button
                type="button"
                onClick={() => setAddModalTab("pricing")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  addModalTab === "pricing"
                    ? "bg-[#FF4500] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <AttachMoneyIcon className="!text-[16px]" />
                <span>Pricing & Stock</span>
              </button>

              <button
                type="button"
                onClick={() => setAddModalTab("vault")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  addModalTab === "vault"
                    ? "bg-[#FF4500] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <VpnKeyIcon className="!text-[16px]" />
                <span>Vault Credentials</span>
              </button>

              <button
                type="button"
                onClick={() => setAddModalTab("communities")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  addModalTab === "communities"
                    ? "bg-[#FF4500] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <GroupsIcon className="!text-[16px]" />
                <span>Communities</span>
              </button>
            </div>

            {/* Modal Form Scrollable Body */}
            <form onSubmit={handleCreateListing} id="addListingForm" className="overflow-y-auto space-y-4 text-xs pr-1 flex-1">
              {/* TAB 1: GENERAL & THEME */}
              {addModalTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Account Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. High Trust Reddit Account"
                        value={newAccForm.title || ""}
                        onChange={(e) => setNewAccForm({ ...newAccForm, title: e.target.value })}
                        required
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Target Subreddit Handle
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. u/AskReddit or u/Technology"
                        value={newAccForm.subreddit || ""}
                        onChange={(e) => setNewAccForm({ ...newAccForm, subreddit: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                      />
                    </div>
                  </div>

                  {/* Banner Theme Selector with Visual Descriptions */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1.5">
                      Card Header Banner Theme (3D Snoo Mascot Illustration)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: "volcano", label: "Volcano Magma", desc: "Fire peak & embers", color: "border-orange-500 bg-orange-50/50" },
                        { id: "cosmic", label: "Cosmic Cyber", desc: "Blue space & neon cubes", color: "border-indigo-500 bg-indigo-50/50" },
                        { id: "bull_growth", label: "Bull Growth", desc: "Orange stock arrow", color: "border-amber-500 bg-amber-50/50" },
                        { id: "mountains", label: "Alpine Mountains", desc: "Snowy peaks & pines", color: "border-teal-500 bg-teal-50/50" },
                        { id: "synthwave", label: "Synthwave Sunset", desc: "Neon sun, city & sunglasses", color: "border-fuchsia-500 bg-fuchsia-50/50" },
                        { id: "candlestick", label: "Candlestick Chart", desc: "Emerald breakout arrow", color: "border-emerald-500 bg-emerald-50/50" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setNewAccForm({ ...newAccForm, bannerTheme: t.id as any })}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            newAccForm.bannerTheme === t.id
                              ? `${t.color} ring-2 ring-[#FF4500]`
                              : "border-gray-200 bg-gray-50 hover:bg-white"
                          }`}
                        >
                          <div className="font-bold text-gray-900">{t.label}</div>
                          <div className="text-[10px] text-gray-500">{t.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Badge Type</label>
                      <select
                        value={newAccForm.badgeType || "verified"}
                        onChange={(e) =>
                          setNewAccForm({
                            ...newAccForm,
                            badgeType: e.target.value as "verified" | "best-value" | "premium",
                            badge:
                              e.target.value === "premium"
                                ? "Premium"
                                : e.target.value === "best-value"
                                ? "Best Value"
                                : "Verified",
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500]"
                      >
                        <option value="premium">👑 Premium (Gold Crown Pill)</option>
                        <option value="verified">✓ Verified (Green Pill)</option>
                        <option value="best-value">🛡️ Best Value (Blue Shield Pill)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Account Tier</label>
                      <select
                        value={newAccForm.tier || "High Trust Authority"}
                        onChange={(e) => setNewAccForm({ ...newAccForm, tier: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500]"
                      >
                        <option value="High Trust Authority">High Trust Authority</option>
                        <option value="VIP Power Profile">VIP Power Profile</option>
                        <option value="Organic Contributor">Organic Contributor</option>
                        <option value="Best Value Specialist">Best Value Specialist</option>
                        <option value="Legacy Institutional">Legacy Institutional</option>
                        <option value="Starter Clean">Starter Clean</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Description / Summary (Card Excerpt)</label>
                    <textarea
                      rows={2}
                      value={newAccForm.description || ""}
                      onChange={(e) => setNewAccForm({ ...newAccForm, description: e.target.value })}
                      placeholder="Well-established account with high karma and clean history. Perfect for marketing, promotion or business use."
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: ACTIVITY & ENGAGEMENT METRICS (USER'S KEY REQUEST) */}
              {addModalTab === "activity" && (
                <div className="space-y-4">
                  <div className="p-3 bg-orange-50/70 border border-orange-200/70 rounded-xl text-[#FF4500] text-xs">
                    <span className="font-bold block mb-0.5">⚡ Engagement & Activity Metrics</span>
                    <span>
                      These values populate the 4-column metric box and audit badge displayed directly on the card and detail page.
                    </span>
                  </div>

                  {/* Activity Profile Status */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Account Activity Level & Status
                    </label>
                    <select
                      value={newAccForm.activityStatus || "High Activity (Daily Comments & Discussions)"}
                      onChange={(e) => setNewAccForm({ ...newAccForm, activityStatus: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500] font-medium"
                    >
                      <option value="High Activity (Daily Comments & Discussions)">
                        High Activity (Daily Comments & Discussions)
                      </option>
                      <option value="Viral Submitter (Multiple Top Posts)">
                        Viral Submitter (Multiple Top Frontpage Posts)
                      </option>
                      <option value="Consistent Organic Contributor (Steady Interactions)">
                        Consistent Organic Contributor (Steady Interactions)
                      </option>
                      <option value="Aged Reserve Lurker (Clean History, Low Noise)">
                        Aged Reserve Lurker (Clean History, Low Noise)
                      </option>
                      <option value="Specialist Community Leader (Moderator Standing)">
                        Specialist Community Leader (Moderator Standing)
                      </option>
                      <option value="Starter Active (Recent Consistent Activity)">
                        Starter Active (Recent Consistent Activity)
                      </option>
                    </select>
                  </div>

                  {/* Karma Breakdown: Total, Post, Comment */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Total Karma <span className="text-gray-400 font-normal">⭐</span>
                      </label>
                      <input
                        type="number"
                        value={newAccForm.totalKarma || 25000}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setNewAccForm({
                            ...newAccForm,
                            totalKarma: val,
                            totalKarmaDisplay: val.toLocaleString(),
                          });
                        }}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Post Karma <span className="text-gray-400 font-normal">📄</span>
                      </label>
                      <input
                        type="number"
                        value={newAccForm.postKarma || 4200}
                        onChange={(e) => {
                          const pK = Number(e.target.value);
                          const cK = Number(newAccForm.commentKarma) || 0;
                          setNewAccForm({
                            ...newAccForm,
                            postKarma: pK,
                            totalKarma: pK + cK,
                            totalKarmaDisplay: (pK + cK).toLocaleString(),
                          });
                        }}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Comment Karma <span className="text-gray-400 font-normal">💬</span>
                      </label>
                      <input
                        type="number"
                        value={newAccForm.commentKarma || 20800}
                        onChange={(e) => {
                          const cK = Number(e.target.value);
                          const pK = Number(newAccForm.postKarma) || 0;
                          setNewAccForm({
                            ...newAccForm,
                            commentKarma: cK,
                            totalKarma: pK + cK,
                            totalKarmaDisplay: (pK + cK).toLocaleString(),
                          });
                        }}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                      />
                    </div>
                  </div>

                  {/* Activity Counts: Posts & Comments */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Posts Count (Submitted Submissions)
                      </label>
                      <input
                        type="number"
                        value={newAccForm.postsCount || 420}
                        onChange={(e) =>
                          setNewAccForm({ ...newAccForm, postsCount: Number(e.target.value) })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Comments Count (Total Discussion Comments)
                      </label>
                      <input
                        type="number"
                        value={newAccForm.commentsCount || 3120}
                        onChange={(e) =>
                          setNewAccForm({ ...newAccForm, commentsCount: Number(e.target.value) })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                      />
                    </div>
                  </div>

                  {/* Shadowban Audit */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Shadowban & Infraction Audit
                    </label>
                    <select
                      value={newAccForm.shadowbanAudit || "100% Clean (0 Strikes)"}
                      onChange={(e) => setNewAccForm({ ...newAccForm, shadowbanAudit: e.target.value })}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500]"
                    >
                      <option value="100% Clean (0 Strikes)">100% Clean (0 Strikes / Never Shadowbanned)</option>
                      <option value="Passed OAuth Shadowban Check">Passed Automated OAuth Check (Verified Clean)</option>
                      <option value="Clean Historical Standing">Clean Historical Standing (0 Infractions)</option>
                    </select>
                  </div>

                  {/* Filter Tags Checklist */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1.5">
                      Search & Discovery Badges (Click to toggle)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["1+ Year", "10K+ Karma", "Verified Email", "Active", "Low Price"].map((t) => {
                        const active = (newAccForm.tags || []).includes(t);
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => toggleNewTag(t)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              active
                                ? "bg-[#FF4500] text-white shadow-2xs"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {active ? `✓ ${t}` : `+ ${t}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRICING & STOCK */}
              {addModalTab === "pricing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Price (USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="1"
                        value={newAccForm.price || 149}
                        onChange={(e) => setNewAccForm({ ...newAccForm, price: Number(e.target.value) })}
                        required
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] text-base font-black text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Available Stock (Units)
                      </label>
                      <input
                        type="number"
                        value={newAccForm.stock !== undefined ? newAccForm.stock : 1}
                        onChange={(e) => setNewAccForm({ ...newAccForm, stock: Number(e.target.value) })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Account Age (Years)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newAccForm.ageYears || 3.2}
                        onChange={(e) =>
                          setNewAccForm({
                            ...newAccForm,
                            ageYears: Number(e.target.value),
                            ageDisplay: `${e.target.value} years`,
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Registration Date</label>
                      <input
                        type="text"
                        value={newAccForm.registrationDate || "14 May 2023"}
                        onChange={(e) =>
                          setNewAccForm({ ...newAccForm, registrationDate: e.target.value })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">SKU Code</label>
                      <input
                        type="text"
                        value={newAccForm.sku || ""}
                        onChange={(e) => setNewAccForm({ ...newAccForm, sku: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: VAULT & ESCROW CREDENTIALS */}
              {addModalTab === "vault" && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs">
                    <span className="font-bold block mb-0.5">🔒 Automated Escrow Vault Delivery</span>
                    <span>
                      Credentials stored here are securely held in multi-sig quarantine and only decrypted for the buyer upon order completion.
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Reddit Username (Vault Asset)
                      </label>
                      <input
                        type="text"
                        value={newAccForm.vaultUsername || ""}
                        onChange={(e) =>
                          setNewAccForm({ ...newAccForm, vaultUsername: e.target.value })
                        }
                        placeholder="u/AskReddit_veteran"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Master Password Passkey
                      </label>
                      <input
                        type="text"
                        value={newAccForm.vaultPasskey || ""}
                        onChange={(e) =>
                          setNewAccForm({ ...newAccForm, vaultPasskey: e.target.value })
                        }
                        placeholder="K9#mX$79pQ_Vault!"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Original Sterile Handover Email
                      </label>
                      <input
                        type="email"
                        value={newAccForm.vaultEmail || ""}
                        onChange={(e) =>
                          setNewAccForm({ ...newAccForm, vaultEmail: e.target.value })
                        }
                        placeholder="vault-transfer-8921@accomarket.net"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Email Handover Type
                      </label>
                      <select
                        value={newAccForm.emailStatus || "Transferable (Clean Sterile OG Mail)"}
                        onChange={(e) =>
                          setNewAccForm({ ...newAccForm, emailStatus: e.target.value })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500]"
                      >
                        <option value="Transferable (Clean Sterile OG Mail)">
                          Transferable (Clean Sterile OG Mail)
                        </option>
                        <option value="Transferable (Instant Automated Handover)">
                          Transferable (Instant Automated Handover)
                        </option>
                        <option value="Transferable (Clean Handover)">
                          Transferable (Clean Handover)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Vault Auth Token
                      </label>
                      <input
                        type="text"
                        value={newAccForm.vaultToken || ""}
                        onChange={(e) =>
                          setNewAccForm({ ...newAccForm, vaultToken: e.target.value })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">
                        Cryptographic Hash Audit
                      </label>
                      <input
                        type="text"
                        value={newAccForm.hash || ""}
                        onChange={(e) => setNewAccForm({ ...newAccForm, hash: e.target.value })}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: COMMUNITIES BREAKDOWN */}
              {addModalTab === "communities" && (
                <div className="space-y-4">
                  <p className="text-gray-500 text-xs">
                    Configure the top 3 subreddits where the account has accumulated the highest discussion karma:
                  </p>

                  {[0, 1, 2].map((idx) => {
                    const current = (newAccForm.communities && newAccForm.communities[idx]) || {
                      name: idx === 0 ? "r/technology" : idx === 1 ? "r/AskReddit" : "r/science",
                      karma: idx === 0 ? 8400 : idx === 1 ? 7200 : 4800,
                      percent: idx === 0 ? "33.6%" : idx === 1 ? "28.8%" : "19.2%",
                      color: idx === 0 ? "bg-[#FF4500]" : idx === 1 ? "bg-[#FF6B35]" : "bg-[#FFA07A]",
                    };

                    return (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-3 gap-3"
                      >
                        <div>
                          <label className="font-bold text-gray-700 block mb-1">
                            Subreddit #{idx + 1}
                          </label>
                          <input
                            type="text"
                            value={current.name}
                            onChange={(e) => {
                              const updated = [...(newAccForm.communities || [])];
                              updated[idx] = { ...current, name: e.target.value };
                              setNewAccForm({ ...newAccForm, communities: updated });
                            }}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Karma</label>
                          <input
                            type="number"
                            value={current.karma}
                            onChange={(e) => {
                              const updated = [...(newAccForm.communities || [])];
                              updated[idx] = { ...current, karma: Number(e.target.value) };
                              setNewAccForm({ ...newAccForm, communities: updated });
                            }}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                          />
                        </div>

                        <div>
                          <label className="font-bold text-gray-700 block mb-1">Percentage</label>
                          <input
                            type="text"
                            value={current.percent}
                            onChange={(e) => {
                              const updated = [...(newAccForm.communities || [])];
                              updated[idx] = { ...current, percent: e.target.value };
                              setNewAccForm({ ...newAccForm, communities: updated });
                            }}
                            className="w-full p-2 bg-white border border-gray-200 rounded-lg"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </form>

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3 shrink-0">
              <span className="text-xs text-gray-400">
                All 5 categories saved together on publish
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="addListingForm"
                  className="px-6 py-2.5 rounded-xl bg-[#FF4500] hover:bg-[#E03D00] text-white font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                >
                  Publish Listing to Storefront
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: EDIT LISTING DETAILS                                  */}
      {/* ============================================================ */}
      {editingAccount && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[92vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 shrink-0">
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <span>Edit Listing Details</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-[#FF4500] font-mono border border-orange-200">
                    {editingAccount.id}
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 font-mono">
                  {editingAccount.sku} • {editingAccount.subreddit}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 cursor-pointer transition-colors"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Inner Tabs for Edit Modal */}
            <div className="flex items-center gap-2 border-b border-gray-100 pb-3 overflow-x-auto shrink-0 text-xs font-bold">
              <button
                type="button"
                onClick={() => setEditModalTab("general")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  editModalTab === "general"
                    ? "bg-[#FF4500] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <SmartToyIcon className="!text-[16px]" />
                <span>General & Theme</span>
              </button>

              <button
                type="button"
                onClick={() => setEditModalTab("activity")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  editModalTab === "activity"
                    ? "bg-[#FF4500] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ForumIcon className="!text-[16px]" />
                <span>Activity & Engagement</span>
              </button>

              <button
                type="button"
                onClick={() => setEditModalTab("pricing")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  editModalTab === "pricing"
                    ? "bg-[#FF4500] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <AttachMoneyIcon className="!text-[16px]" />
                <span>Pricing & Stock</span>
              </button>

              <button
                type="button"
                onClick={() => setEditModalTab("vault")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  editModalTab === "vault"
                    ? "bg-[#FF4500] text-white shadow-2xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <VpnKeyIcon className="!text-[16px]" />
                <span>Vault Credentials</span>
              </button>
            </div>

            <form onSubmit={handleUpdateListing} id="editListingForm" className="overflow-y-auto space-y-4 text-xs pr-1 flex-1">
              {editModalTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Title</label>
                      <input
                        type="text"
                        value={editingAccount.title}
                        onChange={(e) =>
                          setEditingAccount({ ...editingAccount, title: e.target.value })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Subreddit Handle</label>
                      <input
                        type="text"
                        value={editingAccount.subreddit || ""}
                        onChange={(e) =>
                          setEditingAccount({ ...editingAccount, subreddit: e.target.value })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                      />
                    </div>
                  </div>

                  {/* Banner Theme */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1.5">
                      Card Header Banner Theme
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: "volcano", label: "Volcano Magma" },
                        { id: "cosmic", label: "Cosmic Cyber" },
                        { id: "bull_growth", label: "Bull Growth" },
                        { id: "mountains", label: "Alpine Mountains" },
                        { id: "synthwave", label: "Synthwave Sunset" },
                        { id: "candlestick", label: "Candlestick Chart" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setEditingAccount({ ...editingAccount, bannerTheme: t.id as any })}
                          className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            editingAccount.bannerTheme === t.id
                              ? "border-[#FF4500] bg-orange-50/60 font-bold text-[#FF4500]"
                              : "border-gray-200 bg-gray-50"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Badge Type</label>
                      <select
                        value={editingAccount.badgeType || "verified"}
                        onChange={(e) =>
                          setEditingAccount({
                            ...editingAccount,
                            badgeType: e.target.value as "verified" | "best-value" | "premium",
                            badge:
                              e.target.value === "premium"
                                ? "Premium"
                                : e.target.value === "best-value"
                                ? "Best Value"
                                : "Verified",
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                      >
                        <option value="premium">👑 Premium</option>
                        <option value="verified">✓ Verified</option>
                        <option value="best-value">🛡️ Best Value</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Account Tier</label>
                      <input
                        type="text"
                        value={editingAccount.tier || ""}
                        onChange={(e) =>
                          setEditingAccount({ ...editingAccount, tier: e.target.value })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingAccount.description || ""}
                      onChange={(e) =>
                        setEditingAccount({ ...editingAccount, description: e.target.value })
                      }
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {editModalTab === "activity" && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Activity Level & Status</label>
                    <select
                      value={editingAccount.activityStatus || "High Activity (Daily Comments & Discussions)"}
                      onChange={(e) =>
                        setEditingAccount({ ...editingAccount, activityStatus: e.target.value })
                      }
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    >
                      <option value="High Activity (Daily Comments & Discussions)">
                        High Activity (Daily Comments & Discussions)
                      </option>
                      <option value="Viral Submitter (Multiple Top Posts)">
                        Viral Submitter (Multiple Top Frontpage Posts)
                      </option>
                      <option value="Consistent Organic Contributor (Steady Interactions)">
                        Consistent Organic Contributor (Steady Interactions)
                      </option>
                      <option value="Aged Reserve Lurker (Clean History, Low Noise)">
                        Aged Reserve Lurker (Clean History, Low Noise)
                      </option>
                      <option value="Specialist Community Leader (Moderator Standing)">
                        Specialist Community Leader (Moderator Standing)
                      </option>
                      <option value="Starter Active (Recent Consistent Activity)">
                        Starter Active (Recent Consistent Activity)
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Total Karma</label>
                      <input
                        type="number"
                        value={editingAccount.totalKarma}
                        onChange={(e) =>
                          setEditingAccount({
                            ...editingAccount,
                            totalKarma: Number(e.target.value),
                            totalKarmaDisplay: Number(e.target.value).toLocaleString(),
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Post Karma</label>
                      <input
                        type="number"
                        value={editingAccount.postKarma || 0}
                        onChange={(e) =>
                          setEditingAccount({
                            ...editingAccount,
                            postKarma: Number(e.target.value),
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Comment Karma</label>
                      <input
                        type="number"
                        value={editingAccount.commentKarma || 0}
                        onChange={(e) =>
                          setEditingAccount({
                            ...editingAccount,
                            commentKarma: Number(e.target.value),
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Posts Count</label>
                      <input
                        type="number"
                        value={editingAccount.postsCount || 0}
                        onChange={(e) =>
                          setEditingAccount({
                            ...editingAccount,
                            postsCount: Number(e.target.value),
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Comments Count</label>
                      <input
                        type="number"
                        value={editingAccount.commentsCount || 0}
                        onChange={(e) =>
                          setEditingAccount({
                            ...editingAccount,
                            commentsCount: Number(e.target.value),
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Shadowban Audit Status</label>
                    <input
                      type="text"
                      value={editingAccount.shadowbanAudit || ""}
                      onChange={(e) =>
                        setEditingAccount({ ...editingAccount, shadowbanAudit: e.target.value })
                      }
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {editModalTab === "pricing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Price (USD)</label>
                      <input
                        type="number"
                        value={editingAccount.price}
                        onChange={(e) =>
                          setEditingAccount({
                            ...editingAccount,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Stock</label>
                      <input
                        type="number"
                        value={editingAccount.stock}
                        onChange={(e) =>
                          setEditingAccount({
                            ...editingAccount,
                            stock: Number(e.target.value),
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Age (Years)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={editingAccount.ageYears}
                        onChange={(e) =>
                          setEditingAccount({
                            ...editingAccount,
                            ageYears: Number(e.target.value),
                            ageDisplay: `${e.target.value} years`,
                          })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">SKU</label>
                      <input
                        type="text"
                        value={editingAccount.sku}
                        onChange={(e) =>
                          setEditingAccount({ ...editingAccount, sku: e.target.value })
                        }
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {editModalTab === "vault" && (
                <div className="space-y-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Vault Username</label>
                    <input
                      type="text"
                      value={editingAccount.vaultUsername || ""}
                      onChange={(e) =>
                        setEditingAccount({ ...editingAccount, vaultUsername: e.target.value })
                      }
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Vault Passkey</label>
                    <input
                      type="text"
                      value={editingAccount.vaultPasskey || ""}
                      onChange={(e) =>
                        setEditingAccount({ ...editingAccount, vaultPasskey: e.target.value })
                      }
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Vault Sterile Email</label>
                    <input
                      type="email"
                      value={editingAccount.vaultEmail || ""}
                      onChange={(e) =>
                        setEditingAccount({ ...editingAccount, vaultEmail: e.target.value })
                      }
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl"
                    />
                  </div>
                </div>
              )}
            </form>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setEditingAccount(null)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="editListingForm"
                className="px-6 py-2.5 rounded-xl bg-[#FF4500] hover:bg-[#E03D00] text-white font-bold cursor-pointer shadow-xs active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
