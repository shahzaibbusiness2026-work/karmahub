"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

interface NavbarProps {
  onSearch?: (query: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const { cartCount, openCart, showToast } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)] select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3 lg:gap-6">
        
        {/* Left: Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none rounded-xl"
            aria-label="AccoMarket Home"
          >
            {/* Orange Snoo Avatar */}
            <div className="w-10 h-10 rounded-xl bg-[#FF4500] flex items-center justify-center text-white shrink-0 shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" aria-hidden="true">
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

            <div className="text-xl sm:text-[22px] font-black tracking-tight leading-none">
              <span className="text-gray-950">Acco</span>
              <span className="text-[#FF4500]">Market</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-gray-600 whitespace-nowrap">
            <Link
              href="/#featured-listings"
              className="py-1 text-gray-950 hover:text-[#FF4500] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none rounded-md"
            >
              Browse
            </Link>
            <Link
              href="/#categories"
              className="py-1 hover:text-[#FF4500] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none rounded-md"
            >
              Categories
            </Link>
            <Link
              href="/#how-it-works"
              className="py-1 hover:text-[#FF4500] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none rounded-md"
            >
              How It Works
            </Link>
            <Link
              href="/#all-accounts"
              className="py-1 hover:text-[#FF4500] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none rounded-md"
            >
              All Inventory
            </Link>
          </nav>
        </div>

        {/* Right: Search, Cart, Profile/Admin Dropdown & Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Header Flexible Search Input */}
          <div className="relative hidden md:block">
            <label htmlFor="navbar-search" className="sr-only">
              Search accounts
            </label>
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-[18px] pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="navbar-search"
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search accounts..."
              className="h-10 pl-9 pr-3 w-[180px] lg:w-[220px] text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500] focus:bg-white transition-colors text-gray-900 focus-visible:ring-2 focus-visible:ring-[#FF4500]"
            />
          </div>

          {/* Cart Icon Button */}
          <button
            onClick={openCart}
            aria-label={`Shopping cart with ${cartCount} items`}
            className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-gray-700 hover:text-gray-950 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
            title="View Shopping Basket"
          >
            <ShoppingBagOutlinedIcon className="!text-[22px]" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FF4500] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </button>

          {/* Authenticated Admin & Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
              aria-label="Admin and Profile Menu"
              className="h-10 sm:h-11 px-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
              title="Admin & Account Menu"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                AD
              </div>
              <span className="hidden xl:inline text-xs font-bold text-gray-800 whitespace-nowrap">
                Admin
              </span>
              <KeyboardArrowDownIcon
                className={`!text-[16px] text-gray-500 transition-transform duration-150 ${
                  isProfileMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-gray-100"
              >
                {/* User Info Header */}
                <div className="px-4 py-3">
                  <div className="text-xs font-bold text-gray-900">
                    Administrator
                  </div>
                  <div className="text-[11px] text-gray-500 truncate mt-0.5">
                    admin@accomarket.net
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-md bg-orange-50 text-[#FF4500] border border-orange-200">
                    SuperAdmin Role
                  </span>
                </div>

                {/* Actions */}
                <div className="py-1.5 text-xs font-semibold text-gray-700">
                  <Link
                    href="/admin"
                    onClick={() => setIsProfileMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-orange-50/70 hover:text-[#FF4500] transition-colors"
                  >
                    <AdminPanelSettingsOutlinedIcon className="!text-[18px] text-[#FF4500]" />
                    <span>Admin Command Center</span>
                  </Link>
                  <Link
                    href="/vault"
                    onClick={() => setIsProfileMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                  >
                    <LockOutlinedIcon className="!text-[18px] text-gray-500" />
                    <span>Decrypted Escrow Vault</span>
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsProfileMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                  >
                    <ReceiptLongOutlinedIcon className="!text-[18px] text-gray-500" />
                    <span>Checkout & Orders</span>
                  </Link>
                </div>

                {/* Sign Out Simulation */}
                <div className="py-1.5 px-2">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      showToast("Logged in as Verified Administrator", "info");
                    }}
                    role="menuitem"
                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Session Active (Simulated)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Log In Button */}
          <button
            onClick={() => showToast("Authentication pre-configured for live demo", "info")}
            className="hidden sm:inline-flex items-center justify-center h-10 sm:h-11 px-4 text-xs sm:text-sm font-bold text-gray-700 hover:text-gray-950 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
          >
            Log In
          </button>

          {/* Sign Up Button */}
          <Link
            href="/checkout"
            className="inline-flex items-center justify-center h-10 sm:h-11 px-4 sm:px-5 text-xs sm:text-sm font-bold text-white bg-[#FF4500] hover:bg-[#E03D00] rounded-xl shadow-xs transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
          >
            Sign Up
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="lg:hidden h-10 w-10 rounded-xl text-gray-700 hover:bg-gray-100 flex items-center justify-center border border-gray-200 focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none cursor-pointer"
          >
            {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200/80 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Search Bar */}
          <div className="relative">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-[18px] pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search accounts..."
              className="w-full h-11 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500] text-gray-900"
            />
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex flex-col space-y-1 pt-1 text-sm font-bold text-gray-800">
            <Link
              href="/#featured-listings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-[#FF4500] transition-colors"
            >
              Browse Featured
            </Link>
            <Link
              href="/#categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-[#FF4500] transition-colors"
            >
              Categories
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-[#FF4500] transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="/#all-accounts"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-gray-50 hover:text-[#FF4500] transition-colors"
            >
              All Inventory
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl bg-orange-50/70 text-[#FF4500] flex items-center justify-between"
            >
              <span>Admin Dashboard</span>
              <span className="text-[10px] font-extrabold uppercase bg-[#FF4500] text-white px-2 py-0.5 rounded-md">
                Admin
              </span>
            </Link>
            <Link
              href="/vault"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700"
            >
              Decrypted Escrow Vault
            </Link>
          </nav>

          {/* Mobile Auth Row */}
          <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                showToast("Authentication pre-configured for live demo", "info");
              }}
              className="flex-1 h-11 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
            >
              Log In
            </button>
            <Link
              href="/checkout"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex-1 h-11 rounded-xl bg-[#FF4500] text-white text-xs font-bold flex items-center justify-center shadow-xs"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
