"use client";

import {
  createContext,
  useContext,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CartItem, Category, Product, WishlistItem } from "@/app/lib/types";
import {
  addCartItem,
  addWishlistItem,
  getCart,
  getWishlist,
  getProfile,
  money,
  removeCartItem,
  removeWishlistItem,
  updateCartItem,
  getPublicCategories,
} from "@/app/lib/api";

type User = {
  id: number;
  email: string;
  is_admin?: boolean;
  is_staff?: boolean;
  is_superuser?: boolean;
} | null;


type StoreContextValue = {
  token: string | null;

  user: User;
  isAdmin: boolean;
  mounted: boolean;

  cartItems: CartItem[];
  categories: Category[];
  savedForLater: CartItem[];
  wishlistItems: WishlistItem[];
  recentlyViewed: Product[];

  cartCount: number;
  wishlistCount: number;
  subtotal: string;

  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isRecentlyViewedOpen: boolean;

  cartPulse: number;
  statusMessage: string | null;
  themeMode: "light" | "dark";

  quickViewProduct: Product | null;

  setCartTarget: (element: HTMLElement | null) => void;

  openCart: () => void;
  closeCart: () => void;

  openWishlist: () => void;
  closeWishlist: () => void;

  toggleRecentlyViewed: () => void;

  saveToken: (access: string, refresh?: string | null) => void;
  logout: () => void;

  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;

  addProductToCart: (
    product: Product,
    imageElement?: HTMLImageElement | null,
    quantity?: number
  ) => Promise<void>;
  quickAddProduct: (product: Product) => Promise<void>;

  changeQuantity: (itemId: number, quantity: number) => Promise<void>;
  deleteItem: (itemId: number) => Promise<void>;

  saveItemForLater: (itemId: number) => void;
  restoreSavedItem: (itemId: number) => Promise<void>;

  toggleWishlist: (product: Product) => Promise<void>;
  isWishlisted: (productId: number) => boolean;

  addRecentlyViewed: (product: Product) => void;

  setQuickViewProduct: (product: Product | null) => void;

  toggleThemeMode: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

/* ================= STORAGE KEYS ================= */

const SAVED_FOR_LATER_KEY = "girlhouse-saved-later";
const RECENTLY_VIEWED_KEY = "girlhouse-recently-viewed";
const THEME_MODE_KEY = "girlhouse-theme-mode";
const WISHLIST_KEY = "girlhouse-wishlist";

/* ================= HELPERS ================= */

type ApiError = {
  detail?: string;
  error?: string;
  message?: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "string") return error;
  if (error instanceof Error && error.message) return error.message;

  if (error && typeof error === "object") {
    const apiError = error as ApiError;
    return apiError.detail ?? apiError.error ?? apiError.message ?? fallback;
  }

  return fallback;
}

function readStoredValue<T>(key: string, fallback: T) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function moneySum(items: CartItem[]) {
  const total = items.reduce((sum, item) => {
    const price = Number(item.product.price);
    return sum + price * item.quantity;
  }, 0);

  return money(total);
}

function uniqueRecentProducts(items: Product[]) {
  const seen = new Set<number>();
  return items.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

/* ================= PROVIDER ================= */

export function StoreProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
  const access = localStorage.getItem("access");

  if (access) {
    setToken(access);
  }
}, []);

  const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

  const [user, setUser] = useState<User>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });

  const isAdmin = !!(user && (user.is_admin || user.is_staff || user.is_superuser));
  useEffect(() => {
  setMounted(true);
}, []);
 

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() =>
    readStoredValue(SAVED_FOR_LATER_KEY, [])
  );
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [guestWishlist, setGuestWishlist] = useState<WishlistItem[]>(() =>
  readStoredValue(WISHLIST_KEY, [])
);
useEffect(() => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(guestWishlist));
}, [guestWishlist]);

  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() =>
    readStoredValue(RECENTLY_VIEWED_KEY, [])
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isRecentlyViewedOpen, setIsRecentlyViewedOpen] = useState(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() =>
    readStoredValue(THEME_MODE_KEY, "light")
  );

  const [cartPulse, setCartPulse] = useState(0);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const cartTargetRef = useRef<HTMLElement | null>(null);

  function setCartTarget(el: HTMLElement | null) {
    cartTargetRef.current = el;
  }

  function clearAuthState(msg?: string) {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setCartItems([]);
    setWishlistItems([]);

    if (msg) setStatusMessage(msg);
  }

  /* ================= LOAD CART / WISHLIST ================= */

  async function refreshCart(activeToken?: string | null) {
    if (!activeToken) return;
    try {
      const items = await getCart(activeToken);
      setCartItems(items);
    } catch {
      setCartItems([]);
    }
  }

  async function refreshWishlist(activeToken?: string | null) {
    if (!activeToken) return;
    try {
      const items = await getWishlist(activeToken);
      setWishlistItems(items);
    } catch {
      setWishlistItems([]);
    }
  }

  /* ================= LOGIN TOKEN ================= */

async function fetchUser(access: string) {
  try {
    const data = await getProfile(access);

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  } catch {
    setUser(null);
  }
}
async function syncGuestWishlist(access: string) {
  const storedWishlist = readStoredValue<WishlistItem[]>(WISHLIST_KEY, []);

  if (storedWishlist.length === 0) return;

  try {
    for (const item of storedWishlist) {
      try {
        await addWishlistItem(access, item.product.id);
      } catch {
        console.log("Already exists:", item.product.id);
      }
    }

    await refreshWishlist(access);

    setGuestWishlist([]);
    localStorage.removeItem(WISHLIST_KEY);

  } catch (err) {
    console.error("Failed to sync guest wishlist", err);
  }
}

async function saveToken(access: string, refresh?: string | null) {
  localStorage.setItem("access", access);

  if (refresh) {
    localStorage.setItem("refresh", refresh);
  }

  setToken(access);

  await fetchUser(access);

  await syncGuestWishlist(access);

  await refreshCart(access);

  await refreshWishlist(access);
}
  function logout() {
    clearAuthState();
    setSavedForLater([]);
  }

  /* ================= ADMIN NAV HELPER ================= */

  useEffect(() => {
    if (!user) return;

  }, [user]);

  /* ================= VALUE ================= */

async function toggleWishlist(product: Product) {

 const exists = isWishlisted(product.id);

  if (!token) {
    setGuestWishlist((prev) => {
      if (exists) {
        return prev.filter((i) => i.product.id !== product.id);
      }

      return [
        ...prev,
        {
          id: product.id,
          product,
        },
      ];
    });

    return;
  }

  try {
    if (exists) {
      await removeWishlistItem(token, product.id);
      await refreshWishlist(token);
    } else {
      await addWishlistItem(token, product.id);
      await refreshWishlist(token);
    }
  } catch (err) {
    console.error(err);
  }
}
async function addProductToCart(
  product: Product,
  imageElement?: HTMLImageElement | null,
  quantity: number = 1
) {
  const activeToken = localStorage.getItem("access");

  if (!activeToken) {
    setStatusMessage("Please login first");
    return;
  }

  try {
    await addCartItem(
      activeToken,
      product.id,
      quantity
    );

    const updatedCart = await getCart(activeToken);

    setCartItems(updatedCart);

    setStatusMessage(`${product.name} added to cart`);

  } catch (error) {
    console.error("Cart error:", error);
    throw error;
  }
}
async function quickAddProduct(product: Product) {
  try {
    await addProductToCart(product, null, 1);

    setStatusMessage(`${product.name} added to cart`);

    setTimeout(() => {
      setStatusMessage(null);
    }, 2000);

  } catch (error) {
    console.error("Quick add failed:", error);

    setStatusMessage("Could not add product");
  }
}

function isWishlisted(productId: number) {
  if (token) {
    return wishlistItems.some((i) => i.product.id === productId);
  }

  return guestWishlist.some((i) => i.product.id === productId);
}
  const value: StoreContextValue = {
    token,
    user,
    isAdmin,
    mounted,

    cartItems,
    categories,
    savedForLater,
    wishlistItems: token ? wishlistItems : guestWishlist,
    recentlyViewed,

    cartCount: cartItems.reduce((s, i) => s + i.quantity, 0),
    wishlistCount: token
  ? wishlistItems.length
  : guestWishlist.length,
    subtotal: moneySum(cartItems),

    isCartOpen,
    isWishlistOpen,
    isRecentlyViewedOpen,

    cartPulse,
    statusMessage,
    themeMode,
    quickViewProduct,

    setCartTarget,

    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    

    openWishlist: () => setIsWishlistOpen(true),
    closeWishlist: () => setIsWishlistOpen(false),

    toggleRecentlyViewed: () =>
      setIsRecentlyViewedOpen((v) => !v),

    saveToken,
    logout,

    refreshCart: async () => {
      const t = localStorage.getItem("access");
      return refreshCart(t);
    },

    refreshWishlist: async () => {
      const t = localStorage.getItem("access");
      return refreshWishlist(t);
    },

   addProductToCart: async (
  product: Product,
  imageElement?: HTMLImageElement | null,
  quantity = 1
) => {

  const activeToken = localStorage.getItem("access");

  if (!activeToken) {
    setStatusMessage("Please login to add products to cart");

    setTimeout(() => {
      setStatusMessage(null);
    }, 2000);

    return;
  }

  try {

    await addCartItem(
      activeToken,
      product.id,
      quantity
    );
    await refreshCart(activeToken);

    setCartPulse((value) => value + 1);
    setStatusMessage(
      `${product.name} added to cart`
    );

    setTimeout(() => {
      setStatusMessage(null);
    }, 2000);


  } catch(error) {

    console.error(
      "Add product to cart failed:",
      error
    );


    setStatusMessage(
      "Could not add product"
    );
  }
},
    quickAddProduct,
    changeQuantity: async (itemId, quantity) => {
      const activeToken = localStorage.getItem("access");
      if (!activeToken) return;

      try {
        if (quantity <= 0) {
          await removeCartItem(activeToken, itemId);
          setStatusMessage("Item removed from your bag");
        } else {
          await updateCartItem(activeToken, itemId, quantity);
        }
        await refreshCart(activeToken);
      } catch (error) {
        setStatusMessage(getErrorMessage(error, "We could not update your bag."));
      }
    },
    deleteItem: async (itemId) => {
      const activeToken = localStorage.getItem("access");
      if (!activeToken) return;

      try {
        await removeCartItem(activeToken, itemId);
        await refreshCart(activeToken);
        setStatusMessage("Item removed from your bag");
      } catch (error) {
        setStatusMessage(getErrorMessage(error, "We could not remove this item."));
      }
    },

    saveItemForLater: () => {},
    restoreSavedItem: async () => {},

    addRecentlyViewed: (p) =>
      setRecentlyViewed((c) =>
        uniqueRecentProducts([p, ...c]).slice(0, 8)
      ),

    setQuickViewProduct,

    toggleWishlist,
    isWishlisted,

    toggleThemeMode: () =>
      setThemeMode((t) => (t === "light" ? "dark" : "light")),
  };


  return (
    <StoreContext.Provider value={value}>
      {children}

      <AnimatePresence>
        {statusMessage && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow"
          >
            {statusMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
