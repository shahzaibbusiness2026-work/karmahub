import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import KeyIcon from "@mui/icons-material/Key";

const STEPS = [
  {
    step: "01",
    icon: <SearchIcon className="!text-[28px]" />,
    title: "Browse & Select",
    description:
      "Filter by age, karma, price or niche. Every account includes a full audit certificate and shadowban report.",
    color: "bg-orange-50 text-[#FF4500] border-orange-100",
  },
  {
    step: "02",
    icon: <LockOutlinedIcon className="!text-[28px]" />,
    title: "Secure Checkout",
    description:
      "Pay via card or crypto. Your funds are held in automated escrow — never released until you approve the transfer.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    step: "03",
    icon: <VerifiedUserOutlinedIcon className="!text-[28px]" />,
    title: "48-Hour Inspection",
    description:
      "Log in and verify the account. Check the karma, history and email. Raise a dispute within 48 hours if anything is off.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    step: "04",
    icon: <KeyIcon className="!text-[28px]" />,
    title: "Credentials Released",
    description:
      "Once you approve, full credentials appear in your encrypted Vault. Escrow is released and the account is yours.",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
] as const;

export default function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-heading" className="space-y-6">
      <div className="text-center">
        <h2 id="how-it-works-heading" className="text-xl sm:text-2xl font-black text-gray-950 tracking-tight">
          How It Works
        </h2>
        <p className="text-sm text-gray-500 mt-1.5 max-w-lg mx-auto">
          From browsing to owning a verified account — four simple steps, fully protected by escrow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map(({ step, icon, title, description, color }) => (
          <div
            key={step}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl ${color} border flex items-center justify-center shrink-0`}>
                {icon}
              </div>
              <span className="text-3xl font-black text-gray-100 select-none">{step}</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
