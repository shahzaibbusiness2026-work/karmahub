"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Account, CartItem, OrderData, AdminActivityLog } from "@/types";
import { KARMA_ACCOUNTS } from "@/lib/data";

// ---------------------------------------------------------------------------
// Seed data — kept separate so the context stays focused on behaviour
// ---------------------------------------------------------------------------
const DEFAULT_ORDERS: OrderData[] = [
  {
    orderId: "AM-9842-1029",
    timestamp: "2026-09-13T04:15:00Z",
    account: KARMA_ACCOUNTS[0],
    quantity: 1,
    subtotal: 149.0,
    email: "lead-buyer@apexcapital.io",
    status: "locked",
    paymentMethod: "Credit Card (Stripe 256-bit)",
  },
  {
    orderId: "AM-7312-8840",
    timestamp: "2026-09-12T19:40:00Z",
    account: KARMA_ACCOUNTS[2],
    quantity: 1,
    subtotal: 299.0,
    email: "growth@blockscale.xyz",
    status: "released",
    paymentMethod: "USDT (Tether - TRC20)",
  },
  {
    orderId: "AM-5104-3321",
    timestamp: "2026-09-12T14:12:00Z",
    account: KARMA_ACCOUNTS[1],
    quantity: 2,
    subtotal: 178.0,
    email: "sarah.m@venturelab.co",
    status: "released",
    paymentMethod: "Credit Card (Visa •••• 4242)",
  },
  {
    orderId: "AM-2201-9044",
    timestamp: "2026-09-11T11:05:00Z",
    account: KARMA_ACCOUNTS[3],
    quantity: 1,
    subtotal: 69.0,
    email: "dan@cryptodao.eth",
    status: "disputed",
    paymentMethod: "USDC (Arbitrum)",
  },
];

const DEFAULT_LOGS: AdminActivityLog[] = [
  {
    id: "LOG-1",
    timestamp: "Just now",
    type: "order",
    message: "Order AM-9842-1029 placed via Credit Card ($149.00)",
    badge: "Escrow Locked",
  },
  {
    id: "LOG-2",
    timestamp: "1 hour ago",
    type: "escrow",
    message: "Escrow released for Order AM-7312-8840 ($299.00)",
    badge: "Completed",
  },
  {
    id: "LOG-3",
    timestamp: "3 hours ago",
    type: "security",
    message: "Automated OAuth shadowban bot audit completed (0 strikes)",
    badge: "Clean",
  },
];

// ---------------------------------------------------------------------------
// Local-storage helpers — always safe to call (SSR-safe)
// ---------------------------------------------------------------------------
function readStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded or private-browsing restrictions — fail silently
  }
}

// ---------------------------------------------------------------------------
// Context type
// ---------------------------------------------------------------------------
interface CartContextType {
  cart: CartItem[];
  addToCart: (accountId: string, qty?: number) => void;
  removeFromCart: (accountId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  proofAccount: Account | null;
  openProofModal: (accountId: string) => void;
  closeProofModal: () => void;
  toast: { message: string; type: "success" | "info" | "error" } | null;
  showToast: (message: string, type?: "success" | "info" | "error") => void;
  saveOrder: (order: OrderData) => void;
  getLastOrder: () => OrderData | null;
  // Inventory management
  accounts: Account[];
  addAccount: (acc: Account) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  // Order management
  orders: OrderData[];
  updateOrderStatus: (orderId: string, status: "locked" | "released" | "disputed") => void;
  logs: AdminActivityLog[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [proofAccount, setProofAccount] = useState<Account | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const [accounts, setAccounts] = useState<Account[]>(KARMA_ACCOUNTS);
  const [orders, setOrders] = useState<OrderData[]>(DEFAULT_ORDERS);
  const [logs, setLogs] = useState<AdminActivityLog[]>(DEFAULT_LOGS);

  // Ref to track the active toast dismiss timer so we can clear it on re-trigger
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from localStorage once on mount (client-only)
  useEffect(() => {
    const storedCart = readStorage<CartItem[]>("accomarket_cart");
    // FIXED: start with an empty cart — never pre-populate with fake items
    setCart(storedCart ?? []);

    const storedInventory = readStorage<Account[]>("accomarket_inventory");
    if (storedInventory) {
      // Merge persisted overrides with fresh seed data so bannerTheme,
      // subreddit and description always reflect the latest data.ts values.
      const merged = storedInventory.map((persisted) => {
        const fresh = KARMA_ACCOUNTS.find((k) => k.id === persisted.id);
        return fresh
          ? { ...fresh, ...persisted, bannerTheme: fresh.bannerTheme, subreddit: fresh.subreddit, description: fresh.description, badgeType: fresh.badgeType }
          : persisted;
      });
      const newItems = KARMA_ACCOUNTS.filter((k) => !storedInventory.some((p) => p.id === k.id));
      setAccounts([...merged, ...newItems]);
    }

    const storedOrders = readStorage<OrderData[]>("accomarket_all_orders");
    if (storedOrders) setOrders(storedOrders);
  }, []);

  // ---------------------------------------------------------------------------
  // Cart mutations
  // ---------------------------------------------------------------------------
  const persistCart = useCallback((updated: CartItem[]) => {
    setCart(updated);
    writeStorage("accomarket_cart", updated);
  }, []);

  const addToCart = useCallback(
    (accountId: string, qty = 1) => {
      const acc =
        accounts.find((a) => a.id === accountId) ??
        KARMA_ACCOUNTS.find((a) => a.id === accountId);
      if (!acc) return;

      setCart((prev) => {
        const existingIndex = prev.findIndex((i) => i.id === accountId);
        const updated =
          existingIndex > -1
            ? prev.map((item, i) =>
                i === existingIndex ? { ...item, quantity: item.quantity + qty } : item
              )
            : [...prev, { id: acc.id, title: acc.title, price: acc.price, quantity: qty }];
        writeStorage("accomarket_cart", updated);
        return updated;
      });

      showToast(`Added "${acc.title}" to your basket!`, "success");
    },
    [accounts] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const removeFromCart = useCallback((accountId: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== accountId);
      writeStorage("accomarket_cart", updated);
      return updated;
    });
  }, []);

  const clearCart = useCallback(() => {
    persistCart([]);
    showToast("Basket cleared", "info");
  }, [persistCart]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------------------------------------------------------------------------
  // Toast — UUID-based dismiss to avoid race conditions when same message fires twice
  // ---------------------------------------------------------------------------
  const showToast = useCallback(
    (message: string, type: "success" | "info" | "error" = "success") => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      setToast({ message, type });
      toastTimerRef.current = setTimeout(() => {
        setToast(null);
        toastTimerRef.current = null;
      }, 2800);
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ---------------------------------------------------------------------------
  // Cart drawer
  // ---------------------------------------------------------------------------
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  // ---------------------------------------------------------------------------
  // Proof modal
  // ---------------------------------------------------------------------------
  const openProofModal = useCallback(
    (accountId: string) => {
      const acc =
        accounts.find((a) => a.id === accountId) ??
        KARMA_ACCOUNTS.find((a) => a.id === accountId) ??
        KARMA_ACCOUNTS[0];
      setProofAccount(acc);
    },
    [accounts]
  );

  const closeProofModal = useCallback(() => setProofAccount(null), []);

  // ---------------------------------------------------------------------------
  // Orders
  // ---------------------------------------------------------------------------
  const saveOrder = useCallback(
    (order: OrderData) => {
      writeStorage("accomarket_last_order", order);
      setOrders((prev) => {
        const updated = [order, ...prev];
        writeStorage("accomarket_all_orders", updated);
        return updated;
      });
      setLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: "Just now",
          type: "order",
          message: `New Order ${order.orderId} placed for "${order.account.title}" ($${order.subtotal.toFixed(2)})`,
          badge: "Escrow Locked",
        },
        ...prev,
      ]);
    },
    []
  );

  const getLastOrder = useCallback((): OrderData | null => {
    return readStorage<OrderData>("accomarket_last_order") ?? orders[0] ?? null;
  }, [orders]);

  const updateOrderStatus = useCallback(
    (orderId: string, status: "locked" | "released" | "disputed") => {
      setOrders((prev) => {
        const updated = prev.map((o) => (o.orderId === orderId ? { ...o, status } : o));
        writeStorage("accomarket_all_orders", updated);
        return updated;
      });
      setLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: "Just now",
          type: "escrow",
          message: `Order ${orderId} escrow status changed to ${status.toUpperCase()}`,
          badge: status.toUpperCase(),
        },
        ...prev,
      ]);
      showToast(`Order ${orderId} marked as ${status.toUpperCase()}`, "success");
    },
    [showToast]
  );

  // ---------------------------------------------------------------------------
  // Inventory (admin)
  // ---------------------------------------------------------------------------
  const persistAccounts = useCallback((updated: Account[]) => {
    setAccounts(updated);
    writeStorage("accomarket_inventory", updated);
  }, []);

  const addAccount = useCallback(
    (newAcc: Account) => {
      setAccounts((prev) => {
        const updated = [newAcc, ...prev];
        writeStorage("accomarket_inventory", updated);
        return updated;
      });
      setLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: "Just now",
          type: "listing",
          message: `New listing created: "${newAcc.title}" (${newAcc.id}) at $${newAcc.price.toFixed(2)}`,
          badge: "New Listing",
        },
        ...prev,
      ]);
      showToast(`Listing "${newAcc.title}" created successfully!`, "success");
    },
    [showToast]
  );

  const updateAccount = useCallback(
    (id: string, updates: Partial<Account>) => {
      setAccounts((prev) => {
        const updated = prev.map((acc) => (acc.id === id ? { ...acc, ...updates } : acc));
        writeStorage("accomarket_inventory", updated);
        return updated;
      });
      showToast(`Listing ${id} updated!`, "success");
    },
    [showToast]
  );

  const deleteAccount = useCallback(
    (id: string) => {
      setAccounts((prev) => {
        const updated = prev.filter((acc) => acc.id !== id);
        writeStorage("accomarket_inventory", updated);
        return updated;
      });
      setLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: "Just now",
          type: "listing",
          message: `Listing removed: ${id}`,
          badge: "Deleted",
        },
        ...prev,
      ]);
      showToast(`Listing ${id} removed from inventory`, "info");
    },
    [showToast]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        openCart,
        closeCart,
        proofAccount,
        openProofModal,
        closeProofModal,
        toast,
        showToast,
        saveOrder,
        getLastOrder,
        accounts,
        addAccount,
        updateAccount,
        deleteAccount,
        orders,
        updateOrderStatus,
        logs,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
