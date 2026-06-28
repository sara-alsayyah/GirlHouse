import type {
  Address,
  CartItem,
  City,
  Order,
  PaginatedResponse,
  Product,
  Review,
  UserProfile,
  WishlistItem,
} from "@/app/lib/types";
import type { AdminCategory, CategoriesStats } from "../admin/types/categories";
import type { AdminCustomer, CustomersStats } from "../admin/types/customers";
import type { DashboardData, RecentOrder, SalesDataPoint, TopProduct } from "../admin/types/dashboard";
import type { AdminOrder, OrdersStats } from "../admin/types/orders";
import type { AdminProduct, AdminUpdateProductPayload } from "../admin/types/products";
import type { ReportsData } from "../admin/types/reports";
import type { AdminReview, ReviewsStats } from "../admin/types/reviews";
import type { AdminSettingsData } from "../admin/types/settings";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8001/api";

type RequestOptions = RequestInit & {
  token?: string | null;
  _retried?: boolean;
};

async function refreshAccessToken() {
  if (typeof window === "undefined") return null;

  const refresh = window.localStorage.getItem("refresh");
  if (!refresh) return null;

  const response = await fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });

  if (!response.ok) {
    window.localStorage.removeItem("access");
    window.localStorage.removeItem("refresh");
    return null;
  }

  const payload = (await response.json()) as { access?: string };
  if (!payload.access) return null;

  window.localStorage.setItem("access", payload.access);
  return payload.access;
}

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (response.status === 401 && options.token && !options._retried) {
    const nextAccessToken = await refreshAccessToken();

    if (nextAccessToken) {
      return apiFetch<T>(path, {
        ...options,
        token: nextAccessToken,
        _retried: true,
      });
    }
  }

  if (!response.ok) {
    throw payload;
  }

  return payload as T;
}

export function getStoredAccessToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("access");
}

export function getApiErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (!error || typeof error !== "object") return "Something went wrong. Please try again.";

  const payload = error as Record<string, unknown>;
  const detail = payload.detail ?? payload.error ?? payload.message;
  if (typeof detail === "string") return detail;

  const fieldMessages = Object.entries(payload)
    .map(([field, value]) => {
      if (Array.isArray(value)) return `${field}: ${value.join(", ")}`;
      if (typeof value === "string") return `${field}: ${value}`;
      return null;
    })
    .filter(Boolean);

  return fieldMessages.length ? fieldMessages.join(" ") : "Something went wrong. Please try again.";
}

export function resolveMediaUrl(image?: string | null) {
  if (!image) return null;
  if (image.startsWith("http")) return image;
  const origin = API_BASE.replace(/\/api$/, "");
  return `${origin}${image}`;
}

export function money(value: string | number) {
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isNaN(numeric) ? 0 : numeric);
}

export function asArray<T>(payload: PaginatedResponse<T> | T[]) {
  return Array.isArray(payload) ? payload : payload.results;
}

export async function getProducts(query = "") {
  const normalizedQuery = query.startsWith("?") ? query.slice(1) : query;
  const q = normalizedQuery ? `?${normalizedQuery}` : "";
  return apiFetch<PaginatedResponse<Product> | Product[]>(
    `/products/${q}`
  );
}

export async function getProduct(slug: string) {
  return apiFetch<Product>(`/products/slug/${slug}/`);
}

export async function getReviews(productId: number) {
  return apiFetch<Review[]>(`/products/${productId}/reviews/`);
}

export async function getWishlist(token?: string | null) {
  return apiFetch<WishlistItem[]>("/products/wishlist/", {
    token: token ?? getStoredAccessToken(),
  });
}

export async function addWishlistItem(token: string | null, productId: number) {
  return apiFetch<{ message: string }>("/products/wishlist/add/", {
    method: "POST",
    token,
    body: JSON.stringify({ product_id: productId }),
  });
}

export async function removeWishlistItem(token: string | null, productId: number) {
  return apiFetch<{ message: string }>(
    `/products/wishlist/remove/${productId}/`,
    {
      method: "DELETE",
      token,
    },
  );
}

export async function login(email: string, password: string) {
  return apiFetch<{ access: string; refresh: string }>("/token/", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(payload: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}) {
  return apiFetch<{ message: string }>("/users/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function requestPasswordReset(email: string) {
  return apiFetch<{ message: string }>("/users/password-reset/", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function confirmPasswordReset(payload: {
  uid: string;
  token: string;
  new_password: string;
}) {
  return apiFetch<{ message: string }>("/users/password-reset/confirm/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCart(token: string) {
  return apiFetch<CartItem[]>("/cart/", { token });
}

export async function addCartItem(token: string, productId: number, quantity = 1) {
  return apiFetch<{ message: string }>("/cart/add/", {
    method: "POST",
    token,
    body: JSON.stringify({
      product_id: Number(productId),
      quantity: Number(quantity),
    }),
  });
}

export async function updateCartItem(token: string, itemId: number, quantity: number) {
  return apiFetch<{ message: string }>(`/cart/update/${itemId}/`, {
    method: "PUT",
    token,
    body: JSON.stringify({ quantity }),
  });
}

export async function removeCartItem(token: string, itemId: number) {
  return apiFetch<{ message: string }>(`/cart/remove/${itemId}/`, {
    method: "DELETE",
    token,
  });
}

export async function getProfile(token: string) {
  return apiFetch<UserProfile>("/users/profile/", { token });
}

export async function updateProfile(token: string, payload: Partial<UserProfile>) {
  return apiFetch<UserProfile>("/users/profile/", {
    method: "PUT",
    token,
    body: JSON.stringify(payload),
  });
}

export async function getAddresses(token: string) {
  return apiFetch<Address[]>("/users/addresses/", { token });
}

export async function getCities() {
  return apiFetch<City[]>("/cities/");
}

export async function addAddress(
  token: string,
  payload: { full_name: string; phone: string; city: number; street: string },
) {
  return apiFetch<{ message: string }>("/users/addresses/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function checkout(
  token: string,
  addressId: number,
  coupon?: string,
  paymentMethod = "cod",
) {
  return apiFetch<{ message: string }>("/orders/checkout/", {
    method: "POST",
    token,
    body: JSON.stringify({
      address_id: addressId,
      coupon,
      payment_method: paymentMethod,
    }),
  });
}

export async function getOrders(token: string) {
  return apiFetch<Order[]>("/orders/", { token });
}

export async function sendContact(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return apiFetch<{ message: string }>("/contact/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
// =======================
// ADMIN PRODUCTS API
// =======================
export async function getHeroSlides() {
  const res = await fetch("/api/dashboard/hero-slides/");
  if (!res.ok) throw new Error("Failed to load hero slides");
  return res.json();
}

export async function adminGetProducts(token: string) {
  return apiFetch<PaginatedResponse<AdminProduct> | AdminProduct[]>(
    "/admin/products/products/",
    { token }
  );
}

export async function adminGetProduct(token: string, id: number) {
  return apiFetch<AdminProduct>(
    `/admin/products/products/${id}/`,
    { token }
  );
}

export async function createProduct(
  token: string,
  payload: AdminUpdateProductPayload
) {
  return apiFetch<AdminProduct>(
    "/admin/products/products/",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload),
    }
  );
}
export async function updateProduct(
  token: string,
  id: number,
  payload: AdminUpdateProductPayload
) {
  return apiFetch<AdminProduct>(
    `/admin/products/products/${id}/`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteProduct(token: string, id: number) {
  return apiFetch<{ message: string }>(
    `/admin/products/products/${id}/`,
    {
      method: "DELETE",
      token,
    }
  );
}

export async function adminGetCategories(token: string) {
  return apiFetch<PaginatedResponse<AdminCategory> | AdminCategory[]>(
    "/admin/products/categories/",
    { token }
  );
}

export async function createCategory(token: string, payload: Pick<AdminCategory, "name">) {
  return apiFetch<AdminCategory>("/admin/products/categories/", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(token: string, id: number, payload: Pick<AdminCategory, "name">) {
  return apiFetch<AdminCategory>(`/admin/products/categories/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(token: string, id: number) {
  return apiFetch<{ message: string }>(`/admin/products/categories/${id}/`, {
    method: "DELETE",
    token,
  });
}

export async function adminGetOrders(token: string) {
  return apiFetch<PaginatedResponse<AdminOrder> | AdminOrder[]>("/admin/orders/", { token });
}

export async function updateOrderStatus(token: string, id: number, status: AdminOrder["status"]) {
  return apiFetch<{ message: string }>(`/admin/orders/${id}/status/`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

export async function cancelOrder(token: string, id: number) {
  return apiFetch<{ message: string }>(`/admin/orders/${id}/cancel/`, {
    method: "DELETE",
    token,
  });
}

export async function adminGetCustomers(token: string) {
  return apiFetch<PaginatedResponse<AdminCustomer> | AdminCustomer[]>("/admin/users/customers/", { token });
}

export async function updateCustomerStatus(token: string, id: number, is_active: boolean) {
  return apiFetch<AdminCustomer>(`/admin/users/customers/${id}/`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ is_active }),
  });
}

export async function adminGetReviews(token: string) {
  return apiFetch<PaginatedResponse<AdminReview> | AdminReview[]>("/admin/products/reviews/", { token });
}

export async function adminGetSettings(token: string) {
  return apiFetch<AdminSettingsData>("/admin/core/settings/", { token });
}

type RawDashboard = {
  total_revenue: string | number;
  total_orders: number;
  total_customers: number;
  total_products: number;
  recent_orders?: Record<string, unknown>[];
  top_products?: Record<string, unknown>[]; 
  monthly_revenue?: Record<string, unknown>[];
};

function numberValue(value: unknown) {
  const numeric = typeof value === "number" ? value : Number.parseFloat(String(value ?? 0));
  return Number.isNaN(numeric) ? 0 : numeric;
}

function normalizeAdminOrder(order: Record<string, unknown>): AdminOrder {
  return {
    id: numberValue(order.id),
    order_number: String(order.order_number ?? order.id ?? ""),
    customer_email: String(order.customer ?? order.customer_email ?? ""),
    items_count: numberValue(order.items_count ?? order.items_count_value),
    total_price: numberValue(order.total_price ?? order.total_price_value),
    status: String(order.status ?? order.status_value ?? "pending") as AdminOrder["status"],
    payment_method: String(order.payment_method ?? "cod") as AdminOrder["payment_method"],
    created_at: String(order.created_at ?? order.created_at_value ?? new Date().toISOString()),
  };
}

export async function adminGetDashboard(token: string): Promise<DashboardData> {
  const data = await apiFetch<RawDashboard>("/admin/dashboard/", { token });
  const recentOrders = (data.recent_orders ?? []).map(normalizeAdminOrder) as RecentOrder[];
  const salesData = (data.monthly_revenue ?? []).map((point) => {
    const date = new Date(String(point.month ?? ""));
    const day = Number.isNaN(date.getTime())
      ? String(point.month ?? "")
      : date.toLocaleString("en-US", { month: "short" });

    return {
      day,
      sales: numberValue(point.revenue),
      revenue: numberValue(point.revenue),
      orders: numberValue(point.orders),
    } satisfies SalesDataPoint;
  });
const topProducts = (data.top_products ?? []).map((product) => ({
  id: numberValue(product.pid ?? product.product_id ?? product.id),
  name: String(product.name ?? ""),
  image: resolveMediaUrl(product.image ? `/media/${product.image}` : null),
  price: numberValue(product.price),
  stock: numberValue(product.stock),
  total_sold: numberValue(product.total_sold),
})) as TopProduct[];

  return {
    stats: [
      { title: "Total Sales", value: money(data.total_revenue) },
      { title: "Orders", value: data.total_orders },
      { title: "Customers", value: data.total_customers },
      { title: "Products", value: data.total_products },
    ],
    salesData,
    topProducts,
    recentOrders,
  };
}

export async function adminGetReports(token: string): Promise<ReportsData> {
  const [dashboard, analytics] = await Promise.all([
    adminGetDashboard(token),
    apiFetch<{ total_sales: number; total_orders: number; top_products: { product_id: number; name: string; total_sold: number }[] }>("/admin/analytics/", { token }),
  ]);

  return {
    stats: [
      { title: "Total Revenue", value: numberValue(analytics.total_sales) },
      { title: "Total Orders", value: numberValue(analytics.total_orders) },
      { title: "Customers", value: numberValue(dashboard.stats[2].value) },
      { title: "Products Sold", value: analytics.top_products.reduce((sum, product) => sum + numberValue(product.total_sold), 0) },
    ],
    revenueChart: dashboard.salesData.map((point) => ({
      month: point.day,
      revenue: point.revenue,
    })),
    topProducts: analytics.top_products.map((product) => ({
      id: product.product_id,
      name: product.name,
      total_sold: product.total_sold,
      revenue: 0,
    })),
    categoryRevenue: [],
  };
}

export function getProductsStats(products: AdminProduct[], categories: AdminCategory[]) {
  return {
    total_products: products.length,
    low_stock_products: products.filter((product) => product.stock > 0 && product.stock <= 5).length,
    out_of_stock_products: products.filter((product) => product.stock === 0).length,
    categories_count: categories.length,
  };
}

export function getCategoriesStats(categories: AdminCategory[], products: AdminProduct[]): CategoriesStats {
  return {
    total_categories: categories.length,
    total_products: products.length,
    largest_category_products: Math.max(0, ...categories.map((category) => category.products_count ?? 0)),
  };
}

export function getOrdersStats(orders: AdminOrder[]): OrdersStats {
  return {
    total_orders: orders.length,
    pending_orders: orders.filter((order) => order.status === "pending" || order.status === "processing").length,
    shipped_orders: orders.filter((order) => order.status === "shipped").length,
    delivered_orders: orders.filter((order) => order.status === "delivered").length,
  };
}

export function getCustomersStats(customers: AdminCustomer[]): CustomersStats {
  return {
    total_customers: customers.filter((customer) => !customer.is_staff).length,
    active_customers: customers.filter((customer) => customer.is_active).length,
    admins: customers.filter((customer) => customer.is_staff).length,
    total_revenue: customers.reduce((sum, customer) => sum + numberValue(customer.total_spent), 0),
  };
}

export function getReviewsStats(reviews: AdminReview[]): ReviewsStats {
  const total = reviews.length;
  const ratingTotal = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    total_reviews: total,
    average_rating: total ? Number((ratingTotal / total).toFixed(1)) : 0,
    five_star_reviews: reviews.filter((review) => review.rating === 5).length,
    one_star_reviews: reviews.filter((review) => review.rating === 1).length,
  };
}
