'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { KARMA_ACCOUNTS } from '@/lib/data';
import { Account } from '@/types';
import { useCart } from '@/context/CartContext';
import VerifiedIcon from '@mui/icons-material/Verified';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ShieldIcon from '@mui/icons-material/Shield';
import LockIcon from '@mui/icons-material/Lock';
import DownloadIcon from '@mui/icons-material/Download';
import TimerIcon from '@mui/icons-material/Timer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function VaultContent() {
  const searchParams = useSearchParams();
  const { getLastOrder, showToast } = useCart();
  const lastOrder = getLastOrder();

  const accountId =
    searchParams.get('id') || lastOrder?.account?.id || 'RDT-A492';
  const orderId =
    searchParams.get('orderId') || searchParams.get('order') || lastOrder?.orderId || 'AM-9842-1029';

  const account: Account =
    KARMA_ACCOUNTS.find((a: Account) => a.id === accountId) || KARMA_ACCOUNTS[0];

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showRedditPass, setShowRedditPass] = useState(false);
  const [showEmailPass, setShowEmailPass] = useState(false);
  const [checklist, setChecklist] = useState({
    login: false,
    pwReset: false,
    twoFa: false,
    revokeApps: false,
  });

  // 48 hour countdown
  const [timeLeft, setTimeLeft] = useState({
    hours: 47,
    minutes: 58,
    seconds: 42,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text: string, field: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      showToast(`Copied ${field} to clipboard!`, 'info');
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const toggleChecklist = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allCompleted = Object.values(checklist).every(Boolean);

  const credentials = {
    username: account.vaultUsername || `u/${account.id.toLowerCase()}`,
    redditPassword: account.vaultPasskey || `Karm@Hub#${account.id}!99x`,
    email: account.vaultEmail || `${account.id.toLowerCase()}.sterile.transfer@accomarket.net`,
    emailPassword: `M@ilSecured#2026_${account.id}`,
    backupCodes: ['4829-1092', '9041-3829', '1182-4920', '7732-8491', '3391-0029', '6620-1944'],
  };

  const handleDownloadProof = () => {
    const certificate = {
      certificate_id: `CERT-ESCROW-${account.id}-${Date.now()}`,
      order_id: orderId,
      account_handle: credentials.username,
      platform: 'Reddit Inc. Transfer Service',
      audit_status: 'CLEARED_STERILE',
      escrow_hash: account.hash,
      timestamp: new Date().toISOString(),
      guarantee: '48-Hour AccoMarket Escrow Inspection Guarantee',
    };
    const blob = new Blob([JSON.stringify(certificate, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AccoMarket_Certificate_${account.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Audit Certificate downloaded!', 'success');
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-16 sm:pb-20 pt-6 sm:pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-neutral-600 hover:text-[#FF4500] transition"
          >
            <ArrowBackIcon className="text-base mr-1.5" /> Back to Marketplace
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Escrow Unlocked & Active
          </div>
        </div>

        {/* Vault Banner */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xl mb-6 sm:mb-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-[#FF4500]/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="flex flex-col gap-5 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldIcon className="text-[#FF4500]" aria-hidden="true" />
                <span className="text-xs font-bold tracking-wider uppercase text-neutral-400">
                  Secure Delivery Vault
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight">{account.title}</h1>
              <p className="text-neutral-400 text-xs sm:text-sm mt-1 leading-relaxed">
                Order: <span className="font-mono text-white font-semibold">{orderId}</span> &bull; Asset:{' '}
                <span className="font-mono text-[#FF4500]">{account.id}</span>
              </p>
            </div>

            {/* Countdown Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-3 sm:p-4 flex items-center gap-3 self-start">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF4500]/20 flex items-center justify-center text-[#FF4500] shrink-0">
                <TimerIcon aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-neutral-300 font-medium">Inspection Window</p>
                <p className="text-base sm:text-lg font-mono font-bold text-white">
                  {String(timeLeft.hours).padStart(2, '0')}:
                  {String(timeLeft.minutes).padStart(2, '0')}:
                  {String(timeLeft.seconds).padStart(2, '0')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notice Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3">
          <WarningAmberIcon className="text-amber-600 mt-0.5" />
          <div className="text-xs sm:text-sm text-amber-900 leading-relaxed">
            <span className="font-bold">Security Notice:</span> These credentials have been cryptographically transferred to you. Please follow the checklist below to transfer the account to your own private security environment. Your funds remain locked safely in escrow until you approve or 48 hours lapse.
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-lg font-extrabold text-neutral-900 mb-6 flex items-center gap-2">
            <LockIcon className="text-[#FF4500] text-xl" /> Decrypted Asset Credentials
          </h2>

          <div className="space-y-4">
            {/* Username */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase text-neutral-500 block mb-1">
                  Reddit Username
                </span>
                <span className="font-mono font-bold text-neutral-900 text-base sm:text-lg break-all">
                  {credentials.username}
                </span>
              </div>
              <button
                onClick={() => handleCopy(credentials.username, 'Username')}
                aria-label="Copy Reddit Username"
                className="min-h-[44px] self-start sm:self-auto px-3 py-2 text-xs font-bold rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 transition flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                {copiedField === 'Username' ? (
                  <>
                    <CheckIcon className="text-emerald-600 text-sm" /> Copied
                  </>
                ) : (
                  <>
                    <ContentCopyIcon className="text-neutral-600 text-sm" /> Copy
                  </>
                )}
              </button>
            </div>

            {/* Reddit Password */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase text-neutral-500 block mb-1">
                  Reddit Master Password
                </span>
                <span className="font-mono font-bold text-neutral-900 text-base sm:text-lg">
                  {showRedditPass ? credentials.redditPassword : '••••••••••••••••'}
                </span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setShowRedditPass(!showRedditPass)}
                  aria-label={showRedditPass ? 'Hide password' : 'Show password'}
                  className="min-h-[44px] min-w-[44px] p-2 text-neutral-500 hover:text-neutral-800 transition rounded-xl border border-neutral-200 bg-white shadow-sm cursor-pointer flex items-center justify-center"
                  title={showRedditPass ? 'Hide password' : 'Show password'}
                >
                  {showRedditPass ? <VisibilityOffIcon className="text-base" /> : <VisibilityIcon className="text-base" />}
                </button>
                <button
                  onClick={() => handleCopy(credentials.redditPassword, 'Reddit Password')}
                  aria-label="Copy Reddit Password"
                  className="min-h-[44px] px-3 py-2 text-xs font-bold rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copiedField === 'Reddit Password' ? (
                    <>
                      <CheckIcon className="text-emerald-600 text-sm" /> Copied
                    </>
                  ) : (
                    <>
                      <ContentCopyIcon className="text-neutral-600 text-sm" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sterile Gmail */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase text-neutral-500 block mb-1">
                  Original Sterile Email (Full Ownership)
                </span>
                <span className="font-mono font-bold text-neutral-900 text-xs sm:text-sm break-all">
                  {credentials.email}
                </span>
              </div>
              <button
                onClick={() => handleCopy(credentials.email, 'Email Address')}
                aria-label="Copy Email Address"
                className="min-h-[44px] self-start sm:self-auto px-3 py-2 text-xs font-bold rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 transition flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0"
              >
                {copiedField === 'Email Address' ? (
                  <>
                    <CheckIcon className="text-emerald-600 text-sm" /> Copied
                  </>
                ) : (
                  <>
                    <ContentCopyIcon className="text-neutral-600 text-sm" /> Copy
                  </>
                )}
              </button>
            </div>

            {/* Sterile Email Password */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="text-xs font-semibold uppercase text-neutral-500 block mb-1">
                  Email Account Password
                </span>
                <span className="font-mono font-bold text-neutral-900 text-base sm:text-lg">
                  {showEmailPass ? credentials.emailPassword : '••••••••••••••••'}
                </span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  onClick={() => setShowEmailPass(!showEmailPass)}
                  aria-label={showEmailPass ? 'Hide email password' : 'Show email password'}
                  className="min-h-[44px] min-w-[44px] p-2 text-neutral-500 hover:text-neutral-800 transition rounded-xl border border-neutral-200 bg-white shadow-sm cursor-pointer flex items-center justify-center"
                  title={showEmailPass ? 'Hide password' : 'Show password'}
                >
                  {showEmailPass ? <VisibilityOffIcon className="text-base" /> : <VisibilityIcon className="text-base" />}
                </button>
                <button
                  onClick={() => handleCopy(credentials.emailPassword, 'Email Password')}
                  aria-label="Copy Email Password"
                  className="min-h-[44px] px-3 py-2 text-xs font-bold rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copiedField === 'Email Password' ? (
                    <>
                      <CheckIcon className="text-emerald-600 text-sm" /> Copied
                    </>
                  ) : (
                    <>
                      <ContentCopyIcon className="text-neutral-600 text-sm" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Backup Codes */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase text-neutral-500">
                  Reddit 2FA Emergency Backup Codes (6 Available)
                </span>
                <button
                  onClick={() => handleCopy(credentials.backupCodes.join(', '), 'Backup Codes')}
                  aria-label="Copy Backup Codes"
                  className="px-3 py-1.5 text-xs font-bold rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copiedField === 'Backup Codes' ? (
                    <>
                      <CheckIcon className="text-emerald-600 text-xs" /> Copied All
                    </>
                  ) : (
                    <>
                      <ContentCopyIcon className="text-neutral-600 text-xs" /> Copy All
                    </>
                  )}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {credentials.backupCodes.map((code, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-white rounded-lg border border-neutral-200 font-mono text-xs font-bold text-center text-neutral-700"
                  >
                    {code}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Security Checklist */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900">Post-Acquisition Security Checklist</h2>
              <p className="text-xs sm:text-sm text-neutral-500">
                Complete these 4 steps immediately to lock down the asset permanently to your ownership.
              </p>
            </div>
            {allCompleted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                <DoneAllIcon className="text-sm" /> Fully Secured
              </span>
            )}
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'login',
                title: 'Step 1: Test Login in Incognito / Dedicated Browser Profile',
                desc: 'Sign in at reddit.com using the provided credentials. Confirm username and karma status.',
              },
              {
                id: 'pwReset',
                title: 'Step 2: Change Reddit Password & Sterile Email Password',
                desc: 'Navigate to Account Settings > Password. Set a new unique password and save it in your password manager.',
              },
              {
                id: 'twoFa',
                title: 'Step 3: Enable Two-Factor Authentication (2FA)',
                desc: 'Scan the QR code with Google Authenticator or 1Password to activate 2FA and generate new backup codes.',
              },
              {
                id: 'revokeApps',
                title: 'Step 4: Revoke Third-Party Connected Applications',
                desc: 'Visit reddit.com/prefs/apps and remove any old legacy API scripts or tokens.',
              },
            ].map((step) => {
              const isDone = checklist[step.id as keyof typeof checklist];
              return (
                <div
                  key={step.id}
                  onClick={() => toggleChecklist(step.id as keyof typeof checklist)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-4 ${
                    isDone
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-neutral-50/50 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center mt-0.5 text-sm transition ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : 'border border-neutral-300 bg-white text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`text-sm font-bold ${
                        isDone ? 'text-emerald-950 line-through opacity-80' : 'text-neutral-900'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cryptographic Proof & Escrow Release */}
        <div className="bg-white rounded-3xl border border-neutral-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center gap-2">
              <VerifiedIcon className="text-emerald-600 text-lg" /> Escrow Cryptographic Certificate
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Hash: <span className="font-mono text-neutral-800">{account.hash}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleDownloadProof}
              className="flex-1 sm:flex-none px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <DownloadIcon className="text-base" /> Download Certificate
            </button>
            <button
              onClick={() => showToast('Escrow funds released to seller! Ownership certified.', 'success')}
              className="flex-1 sm:flex-none px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              Release Escrow Early
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VaultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-neutral-500 font-medium">
          Loading Credential Vault...
        </div>
      }
    >
      <VaultContent />
    </Suspense>
  );
}
