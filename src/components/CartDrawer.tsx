"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VerifiedIcon from "@mui/icons-material/Verified";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, removeFromCart, clearCart, cartTotal } = useCart();

  // Trap focus inside the drawer when open
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      // Move focus into the drawer for keyboard/screen-reader users
      setTimeout(() => firstFocusRef.current?.focus(), 50);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Acquisition Basket"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      {/* Drawer panel — full-width on mobile, capped at md on larger screens */}
      <div className="h-full w-full sm:max-w-sm md:max-w-md bg-white shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF4500]">
              <ShoppingBagOutlinedIcon className="!text-[22px]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Your Basket</h2>
              <p className="text-xs text-gray-500">Secure Escrow Clearance</p>
            </div>
          </div>
          <button
            ref={firstFocusRef}
            onClick={closeCart}
            className="p-2 min-h-[44px] min-w-[44px] rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Close basket"
          >
            <CloseIcon className="!text-[20px]" />
          </button>
        </div>

        {/* Cart Items — scrollable middle section */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <div className="divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="py-16 text-center text-gray-500">
                <ShoppingBagOutlinedIcon className="!text-[48px] text-gray-300 mb-3" aria-hidden="true" />
                <p className="font-semibold text-gray-700">Your basket is empty</p>
                <p className="text-xs mt-1 text-gray-500">Browse verified Reddit accounts to begin.</p>
                <button
                  onClick={closeCart}
                  className="mt-5 min-h-[44px] px-5 py-2.5 bg-[#FF4500] hover:bg-[#E03D00] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Browse Accounts
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF4500] shrink-0">
                      <AccountCircleOutlinedIcon className="!text-[22px]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 text-sm truncate max-w-[140px] sm:max-w-[180px]">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-gray-900 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                      aria-label={`Remove ${item.title} from basket`}
                    >
                      <DeleteOutlineIcon className="!text-[18px]" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer — sticky at bottom */}
        {cart.length > 0 && (
          <div className="shrink-0 p-4 sm:p-6 border-t border-gray-100 space-y-3 bg-white">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Automated Escrow Protection</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <VerifiedIcon className="!text-[15px]" aria-hidden="true" /> 0% Fee
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-xl font-extrabold text-[#FF4500]">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={clearCart}
                className="min-h-[44px] px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-colors cursor-pointer"
              >
                Clear
              </button>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex-1 min-h-[44px] rounded-xl bg-[#FF4500] hover:bg-[#E03D00] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <span>Checkout</span>
                <ArrowForwardIcon className="!text-[18px]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
