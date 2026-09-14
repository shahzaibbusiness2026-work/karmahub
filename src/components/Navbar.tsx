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

const NAV_LINKS = [
  { href: "/#featured-listings", label: "Browse" },
  { href: "/#categories", label: "Categories" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#all-accounts", label: "All Inventory" },
] as const;

export default function Navbar({ onSearch }: NavbarProps) {
  const { cartCount, openCart, showToast } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown and nav menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (
        isMobileMenuOpen &&
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target as Node)
      ) {
        // Only close if click was not on the toggle button
        const target = event.target as HTMLElement;
        if (!target.closest("[aria-controls='navbar-menu']")) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)] select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between gap-3 lg:gap-6">

        {/* Logo & Desktop Navigation */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none rounded-xl"
            aria-label="AccoMarket — go to homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF4500] flex items-center justify-center text-white shrink-0 shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <circle cx="12" cy="13.5" r="7.2" />
                <circle cx="5.2" cy="12" r="2.2" />
                <circle cx="18.8" cy="12" r="2.2" />
                <path d="M12 6.3V3.6M12 3.6L14.6 4.6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="14.6" cy="4.6" r="1.2" fill="white" />
                <circle cx="9.6" cy="13" r="1.3" fill="#FF4500" />
                <circle cx="14.4" cy="13" r="1.3" fill="#FF4500" />
                <path d="M9.8 16.2C10.5 17.2 13.5 17.2 14.2 16.2" stroke="#FF4500" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="text-xl sm:text-[22px] font-black tracking-tight leading-none">
              <span className="text-gray-950">Acco</span>
              <span className="text-[#FF4500]">Market</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-[13px] font-semibold text-gray-600 whitespace-nowrap" aria-label="Primary navigation">
            {NAV_LINKS.map(({ href, label }, i) => (
              <Link
                key={href}
                href={href}
                className={`py-1 transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none rounded-md hover:text-[#FF4500] ${
                  i === 0 ? "text-gray-950" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Search, Cart, Profile, Auth */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Desktop Search */}
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
              type="search"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search accounts..."
              autoComplete="off"
              className="h-10 pl-9 pr-3 w-[180px] lg:w-[220px] text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500] focus:bg-white transition-colors text-gray-900 focus-visible:ring-2 focus-visible:ring-[#FF4500]"
            />
          </div>

          {/* Cart */}
          <button
            type="button"
            onClick={openCart}
            aria-label={`Shopping cart — ${cartCount} item${cartCount !== 1 ? "s" : ""}`}
            title="View Shopping Basket"
            className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-gray-700 hover:text-gray-950 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
          >
            <ShoppingBagOutlinedIcon className="!text-[22px]" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#FF4500] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-xs" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </button>

          {/* Admin Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen((prev) => !prev)}
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="menu"
              aria-label="Admin and profile menu"
              title="Admin & Account Menu"
              className="h-10 sm:h-11 px-2.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center gap-2 cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
            >
              <div className="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                AD
              </div>
              <span className="hidden xl:inline text-xs font-bold text-gray-800 whitespace-nowrap">Admin</span>
              <KeyboardArrowDownIcon
                className={`!text-[16px] text-gray-500 transition-transform duration-150 ${
                  isProfileMenuOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Dropdown */}
            {isProfileMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200/90 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 divide-y divide-gray-100"
              >
                {/* User info */}
                <div className="px-4 py-3">
                  <div className="text-xs font-bold text-gray-900">Administrator</div>
                  <div className="text-[11px] text-gray-500 truncate mt-0.5">admin@accomarket.net</div>
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
                    <AdminPanelSettingsOutlinedIcon className="!text-[18px] text-[#FF4500]" aria-hidden="true" />
                    <span>Admin Command Center</span>
                  </Link>
                  <Link
                    href="/vault"
                    onClick={() => setIsProfileMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                  >
                    <LockOutlinedIcon className="!text-[18px] text-gray-500" aria-hidden="true" />
                    <span>Decrypted Escrow Vault</span>
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsProfileMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-50 hover:text-gray-950 transition-colors"
                  >
                    <ReceiptLongOutlinedIcon className="!text-[18px] text-gray-500" aria-hidden="true" />
                    <span>Checkout & Orders</span>
                  </Link>
                </div>

                {/* Session info */}
                <div className="py-1.5 px-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      showToast("Logged in as Verified Administrator", "info");
                    }}
                    role="menuitem"
                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Session Active (Demo Mode)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Log In */}
          <button
            type="button"
            onClick={() => showToast("Authentication is pre-configured for this demo", "info")}
            className="hidden sm:inline-flex items-center justify-center h-10 sm:h-11 px-4 text-xs sm:text-sm font-bold text-gray-700 hover:text-gray-950 rounded-xl hover:bg-gray-50 border border-gray-200 transition-colors cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
          >
            Log In
          </button>

          {/* Hamburger Menu Toggle (replaces Browse Now) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="navbar-menu"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl text-gray-700 hover:text-[#FF4500] hover:bg-orange-50/80 border border-gray-200 hover:border-orange-200 transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="!text-[22px]" />
            ) : (
              <MenuIcon className="!text-[22px]" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Menu Drawer */}
      {isMobileMenuOpen && (
        <div
          id="navbar-menu"
          ref={menuContainerRef}
          className="bg-white border-b border-gray-200/90 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 shadow-xl animate-in slide-in-from-top-2 duration-150"
        >
          <div className="max-w-[1240px] mx-auto space-y-4">
            {/* Mobile Search (shown only when top search is hidden) */}
            <div className="relative md:hidden">
              <label htmlFor="mobile-search" className="sr-only">Search accounts</label>
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 !text-[18px] pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="mobile-search"
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search accounts..."
                autoComplete="off"
                className="w-full h-11 pl-9 pr-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500] text-gray-900"
              />
            </div>

            {/* Menu Links Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5 text-sm font-bold text-gray-800">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobileMenu}
                  className="px-3.5 py-2.5 rounded-xl hover:bg-orange-50/70 hover:text-[#FF4500] transition-colors flex items-center justify-between border border-transparent hover:border-orange-100"
                >
                  <span>{label}</span>
                  <span className="text-gray-300 text-xs">→</span>
                </Link>
              ))}

              <Link
                href="/admin"
                onClick={closeMobileMenu}
                className="px-3.5 py-2.5 rounded-xl bg-orange-50/80 text-[#FF4500] border border-orange-200/80 flex items-center justify-between hover:bg-orange-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <AdminPanelSettingsOutlinedIcon className="!text-[18px]" />
                  <span>Admin</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase bg-[#FF4500] text-white px-1.5 py-0.5 rounded-md">
                  Panel
                </span>
              </Link>

              <Link
                href="/vault"
                onClick={closeMobileMenu}
                className="px-3.5 py-2.5 rounded-xl hover:bg-gray-50 text-gray-700 flex items-center justify-between border border-transparent hover:border-gray-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LockOutlinedIcon className="!text-[18px] text-gray-400" />
                  <span>Vault</span>
                </div>
                <span className="text-[11px] text-gray-400 font-normal">Escrow</span>
              </Link>
            </div>

            {/* Bottom Row */}
            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-gray-500 text-center sm:text-left">
                AccoMarket • Verified Reddit Accounts • Automated Instant Delivery
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();
                    showToast("Authentication is pre-configured for this demo", "info");
                  }}
                  className="flex-1 sm:flex-initial h-10 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  Log In
                </button>
                <Link
                  href="/#all-accounts"
                  onClick={closeMobileMenu}
                  className="flex-1 sm:flex-initial h-10 px-5 rounded-xl bg-[#FF4500] hover:bg-[#E03D00] text-white text-xs font-bold flex items-center justify-center shadow-xs transition-colors"
                >
                  All Accounts
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
