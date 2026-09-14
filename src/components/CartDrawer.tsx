"use client";

import React, { useEffect } from "react";
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      // Reset to default — using "" removes the inline style entirely
      // rather than forcing "auto" which overrides parent styles
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs transition-opacity flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Acquisition Basket"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      <div className="h-full w-full max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-250">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF4500]">
                <ShoppingBagOutlinedIcon className="!text-[22px]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Your Basket</h3>
                <p className="text-xs text-gray-500">Secure Escrow Clearance</p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              aria-label="Close basket"
            >
              <CloseIcon className="!text-[20px]" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="divide-y divide-gray-100 my-4">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                <ShoppingBagOutlinedIcon className="!text-[44px] text-gray-300 mb-2" />
                <p className="font-medium text-gray-700">Your basket is empty</p>
                <p className="text-xs mt-1">Browse verified Reddit accounts to begin.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[#FF4500]">
                      <AccountCircleOutlinedIcon className="!text-[22px]" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500">
                        ${item.price.toFixed(2)} × {item.quantity} • Instant Delivery
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                      title="Remove item"
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

        {/* Footer */}
        {cart.length > 0 && (
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Automated Escrow Protection</span>
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <VerifiedIcon className="!text-[15px]" /> 0% Fee Included
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-gray-900">Basket Total</span>
              <span className="text-xl font-extrabold text-[#FF4500]">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={clearCart}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition-colors cursor-pointer"
              >
                Clear
              </button>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex-1 h-11 rounded-xl bg-[#FF4500] hover:bg-[#E03D00] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <ArrowForwardIcon className="!text-[18px]" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
