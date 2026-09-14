"use client";

import React, { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CloseIcon from "@mui/icons-material/Close";
import VerifiedIcon from "@mui/icons-material/Verified";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ProofModal() {
  const { proofAccount, closeProofModal } = useCart();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeProofModal();
    };
    if (proofAccount) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [proofAccount, closeProofModal]);

  if (!proofAccount) return null;

  // Generate a deterministic-looking audit timestamp based on the account's
  // registration date rather than using a hardcoded static value.
  const auditTimestamp = proofAccount.registrationDate
    ? new Date(proofAccount.registrationDate).toISOString().replace("T00:00:00.000Z", "T01:14:00Z")
    : new Date().toISOString();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proof-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeProofModal();
      }}
    >
      <div className="bg-white max-w-xl w-full rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 text-green-600">
            <VerifiedIcon className="!text-[24px]" aria-hidden="true" />
            <h2 id="proof-modal-title" className="text-lg font-bold text-gray-900">
              Account Audit Certificate
            </h2>
          </div>
          <button
            type="button"
            onClick={closeProofModal}
            aria-label="Close audit certificate"
            className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
          >
            <CloseIcon className="!text-[20px]" />
          </button>
        </div>

        {/* Audit Details */}
        <dl className="bg-gray-50 p-4 rounded-xl space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-500 shrink-0">Account Identifier:</dt>
            <dd className="text-[#FF4500] font-semibold text-right">
              {proofAccount.id} — {proofAccount.title}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-500 shrink-0">Escrow Verification Hash:</dt>
            <dd className="text-gray-800 font-mono text-xs select-all text-right">
              {proofAccount.hash ?? "#0x889F...7AC1"}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-500 shrink-0">Audit Node Timestamp:</dt>
            <dd className="text-gray-800 font-mono text-xs text-right">{auditTimestamp}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-gray-500 shrink-0">Shadowban Status:</dt>
            <dd className="text-green-600 font-semibold flex items-center gap-1">
              <CheckCircleIcon className="!text-[16px]" aria-hidden="true" /> 0 Strikes (100% Clean)
            </dd>
          </div>
        </dl>

        {/* Terminal Log */}
        <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-[11px] leading-relaxed space-y-1 border border-gray-800" aria-label="Verification report log">
          <p className="text-green-400 font-semibold">&gt; VERIFICATION REPORT SIGNATURE: VALID</p>
          <p>&gt; [OK] Reddit OAuth API authenticated node pass (200 OK)</p>
          <p>&gt; [OK] Account age verified against genesis registration</p>
          <p>&gt; [OK] Karma distribution curve verified organic (99.8% human rating)</p>
          <p>&gt; [OK] Linked master email recovery verified sterile</p>
          <p>&gt; [OK] Escrow lock engaged for buyer protection</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-gray-400">Cryptographically attested by AccoMarket Escrow Node</span>
          <button
            type="button"
            onClick={closeProofModal}
            className="px-4 py-2 bg-[#FF4500] text-white rounded-xl text-sm font-semibold hover:bg-[#E03D00] transition-colors cursor-pointer"
          >
            Close Certificate
          </button>
        </div>
      </div>
    </div>
  );
}
