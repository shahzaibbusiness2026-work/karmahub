"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { KARMA_ACCOUNTS } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";
import CheckIcon from "@mui/icons-material/Check";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const directId = searchParams.get("id");
  const directQty = parseInt(searchParams.get("qty") || "1", 10);
  const { cart, clearCart, saveOrder, showToast } = useCart();

  // Mode: Direct purchase of a specific account vs Cart checkout
  const isDirect = Boolean(directId);

  const directAccount = useMemo(() => {
    return KARMA_ACCOUNTS.find((a) => a.id === directId) || KARMA_ACCOUNTS[0];
  }, [directId]);

  // If direct, use single account; if not direct and cart has items, use cart
  const checkoutItems = useMemo(() => {
    if (isDirect) {
      return [
        {
          id: directAccount.id,
          title: directAccount.title,
          price: directAccount.price,
          quantity: directQty,
          sku: directAccount.sku,
          ageDisplay: directAccount.ageDisplay,
          karmaDisplay: directAccount.totalKarmaDisplay,
        },
      ];
    } else if (cart.length > 0) {
      return cart.map((item) => {
        const fullAcc = KARMA_ACCOUNTS.find((a) => a.id === item.id) || KARMA_ACCOUNTS[0];
        return {
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          sku: fullAcc.sku,
          ageDisplay: fullAcc.ageDisplay,
          karmaDisplay: fullAcc.totalKarmaDisplay,
        };
      });
    } else {
      // Fallback
      return [
        {
          id: KARMA_ACCOUNTS[0].id,
          title: KARMA_ACCOUNTS[0].title,
          price: KARMA_ACCOUNTS[0].price,
          quantity: 1,
          sku: KARMA_ACCOUNTS[0].sku,
          ageDisplay: KARMA_ACCOUNTS[0].ageDisplay,
          karmaDisplay: KARMA_ACCOUNTS[0].totalKarmaDisplay,
        },
      ];
    }
  }, [isDirect, directAccount, directQty, cart]);

  const subtotal = checkoutItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [paymentMode, setPaymentMode] = useState<"card" | "crypto">("card");
  const [email, setEmail] = useState("lead-buyer@accomarket.com");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderId = `AM-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const primaryAccount =
      KARMA_ACCOUNTS.find((a) => a.id === checkoutItems[0].id) || KARMA_ACCOUNTS[0];

    const orderData = {
      orderId,
      timestamp: new Date().toISOString(),
      account: primaryAccount,
      quantity: checkoutItems[0].quantity,
      subtotal,
      email,
    };

    saveOrder(orderData);
    if (!isDirect) {
      clearCart();
    }
    showToast("Escrow secured! Unlocking your delivery vault...", "success");

    setTimeout(() => {
      router.push(`/vault?id=${primaryAccount.id}&orderId=${orderId}`);
    }, 700);
  };

  return (
    <main className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full flex-1 space-y-6 sm:space-y-8">
      {/* 3-Step Escrow Stepper */}
      {/* Progress Stepper — horizontal scroll on xs so it never wraps awkwardly */}
      <div className="bg-white rounded-2xl px-4 py-3 sm:p-5 border border-gray-100 shadow-xs max-w-2xl mx-auto overflow-x-auto">
        <div className="flex items-center justify-between min-w-[280px] gap-2">
          <div className="flex items-center gap-1.5 text-green-600 shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-100 flex items-center justify-center font-bold text-xs">
              <CheckIcon className="!text-[14px] sm:!text-[16px]" />
            </div>
            <span className="text-[11px] sm:text-sm font-semibold whitespace-nowrap">1. Select</span>
          </div>
          <div className="flex-1 h-0.5 bg-green-200 min-w-[20px]" />
          <div className="flex items-center gap-1.5 text-[#FF4500] shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-100 flex items-center justify-center font-bold text-xs">
              2
            </div>
            <span className="text-[11px] sm:text-sm font-bold whitespace-nowrap">2. Payment</span>
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 min-w-[20px]" />
          <div className="flex items-center gap-1.5 text-gray-400 shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-100 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <span className="text-[11px] sm:text-sm font-medium whitespace-nowrap">3. Vault</span>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Form (Left 7 cols) & Order Summary (Right 5 cols) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">
        {/* Left Column: Delivery Email & Payment Form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Delivery Email Input */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MailOutlineIcon className="text-[#FF4500] !text-[20px]" />
                Delivery Email Address
              </h2>
              <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                Instant Dispatch
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Credentials and recovery verification passkeys will be encrypted and sent to this email upon payment confirmation.
            </p>
            <div className="relative">
              <label htmlFor="delivery-email" className="sr-only">
                Delivery Email Address
              </label>
              <input
                id="delivery-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-medium"
                placeholder="you@company.com"
                required
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CreditCardIcon className="text-[#FF4500] !text-[20px]" />
                Select Payment Method
              </h2>
              <span className="text-xs text-gray-400">Zero Processing Surcharge</span>
            </div>

            {/* Switcher Buttons */}
            <div className="grid grid-cols-2 p-1 bg-gray-100 rounded-xl gap-1" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={paymentMode === "card"}
                onClick={() => setPaymentMode("card")}
                className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMode === "card"
                    ? "text-gray-900 bg-white shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <CreditCardIcon className={`!text-[18px] ${paymentMode === "card" ? "text-[#FF4500]" : ""}`} />
                Credit / Debit Card
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={paymentMode === "crypto"}
                onClick={() => setPaymentMode("crypto")}
                className={`py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  paymentMode === "crypto"
                    ? "text-gray-900 bg-white shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <CurrencyBitcoinIcon className={`!text-[18px] ${paymentMode === "crypto" ? "text-[#FF4500]" : ""}`} />
                Crypto (USDT / USDC / BTC)
              </button>
            </div>

            {/* Card Form */}
            {paymentMode === "card" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="cardholder-name" className="text-xs font-bold text-gray-700">
                    Cardholder Name
                  </label>
                  <input
                    id="cardholder-name"
                    type="text"
                    defaultValue="Alex Mercer"
                    required
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="card-number" className="text-xs font-bold text-gray-700">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      id="card-number"
                      type="text"
                      defaultValue="4242 •••• •••• 4242"
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-mono"
                    />
                    <LockIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 !text-[18px]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="expiry-date" className="text-xs font-bold text-gray-700">
                      Expiry (MM/YY)
                    </label>
                    <input
                      id="expiry-date"
                      type="text"
                      defaultValue="12/28"
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="cvc-number" className="text-xs font-bold text-gray-700">
                      CVC / CVV
                    </label>
                    <input
                      id="cvc-number"
                      type="password"
                      defaultValue="888"
                      maxLength={4}
                      required
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#FF4500] font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Crypto Form */}
            {paymentMode === "crypto" && (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 text-xs space-y-1">
                  <span className="font-bold text-[#FF4500] block">Automated Multi-Chain Escrow</span>
                  <p className="text-gray-600">
                    Send exact amount. The smart contract validates transaction confirmation within 60 seconds.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="crypto-network" className="text-xs font-bold text-gray-700">
                    Select Network
                  </label>
                  <select
                    id="crypto-network"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF4500]"
                  >
                    <option>USDT (Tether - TRC20 / ERC20)</option>
                    <option>USDC (USD Coin - Polygon / Arbitrum)</option>
                    <option>Bitcoin (BTC)</option>
                    <option>Ethereum (ETH)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-700 block">Deposit Escrow Address</span>
                  <div className="p-3 bg-gray-100 rounded-xl font-mono text-xs text-gray-800 break-all select-all flex items-center justify-between">
                    <span>0x889F6B093cE7A7A0C7311B938210984187ac1</span>
                  </div>
                </div>
              </div>
            )}

            {/* Terms */}
            <div className="pt-3 border-t border-gray-100">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-600">
                <input
                  type="checkbox"
                  defaultChecked
                  required
                  className="mt-0.5 rounded text-[#FF4500] focus:ring-[#FF4500]"
                />
                <span>
                  I agree to the AccoMarket Escrow Terms, 48-hour inspection quarantine, and automated delivery guidelines.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-lg space-y-4 sm:space-y-5 lg:sticky lg:top-24">
            <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-gray-400">
                {checkoutItems.length} {checkoutItems.length === 1 ? "Asset" : "Assets"}
              </span>
            </h3>

            {/* Items List */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3.5 bg-gray-50 rounded-xl">
                  <div className="w-11 h-11 rounded-xl bg-orange-100 text-[#FF4500] flex items-center justify-center font-bold shrink-0">
                    <SmartToyIcon className="!text-[24px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-gray-900 truncate">{item.title}</h4>
                    <p className="text-xs text-gray-500">
                      {item.ageDisplay} • {item.karmaDisplay} Karma
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-gray-950">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-gray-400 block">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Line items */}
            <div className="space-y-2.5 text-xs pt-1">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Escrow Protection Fee</span>
                <span className="font-semibold text-green-600">FREE ($0.00)</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Automated Verification & PGP Key</span>
                <span className="font-semibold text-green-600">Included</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-base">
                <span className="font-bold text-gray-900">Total Due</span>
                <span className="text-2xl font-black text-[#FF4500]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#FF4500] hover:bg-[#E03D00] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
            >
              <ShieldIcon className="!text-[20px]" />
              <span>{isSubmitting ? "Locking Escrow & Dispatching..." : "Confirm & Unlock Vault"}</span>
            </button>

            {/* Trust note */}
            <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                <VerifiedUserIcon className="text-green-600 !text-[15px]" />
                <span>100% Satisfaction Escrow Safe</span>
              </div>
              <p className="leading-tight">
                If credentials do not match audited metrics, funds are refunded automatically within your 48-hour inspection window.
              </p>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFD]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#FF4500] focus-visible:outline-none rounded-xl">
            <div className="text-xl sm:text-2xl font-black tracking-tight flex items-center">
              <span className="text-gray-950">Acco</span>
              <span className="text-[#FF4500]">Market</span>
            </div>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-green-700 bg-green-50 px-2.5 sm:px-3 py-1.5 rounded-full border border-green-200">
            <LockIcon className="!text-[15px] sm:!text-[16px] shrink-0" />
            <span className="hidden xs:inline sm:inline">256-Bit Escrow</span>
            <span className="inline sm:hidden">Secure</span>
            <span className="hidden sm:inline">Encrypted Checkout</span>
          </div>
        </div>
      </header>

      <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading checkout session...</div>}>
        <CheckoutContent />
      </Suspense>

      <footer className="bg-gray-50 border-t border-gray-200/80 py-8 text-center text-xs text-gray-400 mt-16">
        © 2026 AccoMarket. Verified Reddit Accounts & Institutional Escrow Clearing.
      </footer>
    </div>
  );
}
