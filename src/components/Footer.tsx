import React from "react";
import Link from "next/link";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const FOOTER_LINKS = [
  {
    heading: "Marketplace",
    links: [
      { label: "Featured Accounts", href: "/#featured-listings" },
      { label: "All Inventory", href: "/#all-accounts" },
      { label: "Escrow Checkout", href: "/checkout" },
      { label: "Digital Vault", href: "/vault" },
    ],
  },
  {
    heading: "Platforms",
    links: [
      { label: "Reddit Accounts (1,200+)", href: "/" },
      { label: "Instagram Profiles (800+)", href: "/" },
      { label: "X / Twitter Handles (600+)", href: "/" },
      { label: "TikTok Channels (450+)", href: "/" },
    ],
  },
] as const;

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200/80 mt-12 sm:mt-16 pt-10 pb-8 sm:py-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main grid — stacks to 2 columns on mobile, 4 on md+ */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand Column — spans full width on the smallest breakpoint */}
          <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF4500] flex items-center justify-center text-white shrink-0">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white" aria-hidden="true">
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
              <div className="text-xl font-black tracking-tight leading-none">
                <span className="text-gray-950">Acco</span>
                <span className="text-[#FF4500]">Market</span>
              </div>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-[240px]">
              The trusted digital marketplace for verified high-authority social media assets and Reddit profiles.
              Protected by automated escrow.
            </p>
          </div>

          {/* Dynamic link columns */}
          {FOOTER_LINKS.map(({ heading, links }) => (
            <div key={heading} className="space-y-3">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{heading}</h3>
              <ul className="space-y-2 text-xs text-gray-600">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="hover:text-[#FF4500] transition-colors focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none rounded"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Escrow Trust Card */}
          <div className="col-span-2 sm:col-span-1 space-y-3">
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Escrow Security</h3>
            <div className="p-3.5 bg-white rounded-xl border border-gray-200 text-xs space-y-1.5 text-gray-600">
              <div className="flex items-center gap-1.5 text-green-600 font-semibold">
                <VerifiedUserIcon className="!text-[16px]" aria-hidden="true" />
                <span>100% Escrow Guarantee</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                All assets held in cold quarantine until buyer inspection approval.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <div className="text-center sm:text-left">
            © 2026 AccoMarket. All rights reserved. Fast, secure, verified account transfers.
          </div>
          <nav aria-label="Legal links" className="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-1">
            <Link href="/" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-gray-600 transition-colors">Dispute Protection</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
