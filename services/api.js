import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 BASE URL (máy thật)
const API_BASE = "http://172.20.10.2:5257/api";

// ✅ Tạo axios instance
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Tự động gắn token vào header
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= AUTH =================
export const authApi = {
  login: async (loginData) => {
    const response = await apiClient.post("/Auth/login", {
      Email: loginData.email,
      Password: loginData.password,
    });
    return response.data;
  },

  register: async (formData) => {
    const response = await apiClient.post("/Auth/register", formData);
    return response.data;
  },

  googleLogin: async (idToken) => {
    const response = await apiClient.post("/Auth/google-login", {
      token: idToken,
    });
    return response.data;
  },
};

// ================= PRODUCT =================
const computeMinPrice = (variants) => {
  if (!Array.isArray(variants) || variants.length === 0) return 0;
  const prices = variants
    .map((v) => Number(v?.price ?? v?.Price ?? 0))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (!prices.length) return 0;
  return Math.min(...prices);
};

const normalizeProduct = (raw, fallback) => {
  if (!raw || typeof raw !== "object") return fallback;

  const id = raw.id ?? raw.Id ?? fallback?.id;
  const name = raw.name ?? raw.Name ?? fallback?.name;
  const brandText = raw.brandText ?? raw.BrandText ?? fallback?.brandText;
  const description = raw.description ?? raw.Description ?? fallback?.description;
  const imageUrl = raw.imageUrl ?? raw.ImageUrl ?? fallback?.imageUrl;
  const categoryId = raw.categoryId ?? raw.CategoryId ?? fallback?.categoryId;

  const rawVariants = raw.variants ?? raw.Variants;
  const variants = Array.isArray(rawVariants)
    ? rawVariants
        .map((v) => {
          if (!v || typeof v !== "object") return null;
          const variantId = v.id ?? v.Id;
          const color = v.color ?? v.Color;
          const size = v.size ?? v.Size;
          const price = Number(v.price ?? v.Price ?? 0);
          const stockQuantity = Number(v.stockQuantity ?? v.StockQuantity ?? 0);
          return {
            id: variantId,
            color,
            size,
            price: Number.isFinite(price) ? price : 0,
            stockQuantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
            sku: v.sku ?? v.Sku,
          };
        })
        .filter((v) => v && v.id != null && v.color && v.size)
    : null;

  const safeVariants = variants && variants.length ? variants : fallback?.variants || [];

  return {
    id,
    name,
brandText,
    description,
    imageUrl,
    categoryId,
    variants: safeVariants,
    minPrice: computeMinPrice(safeVariants),
    _raw: raw,
  };
};

export const productApi = {
  getAll: async (categoryId) => {
    const response = await apiClient.get("/Products", {
      params: categoryId ? { category: categoryId } : undefined,
    });
    const list = Array.isArray(response.data) ? response.data : [];
    return list.map((p) => normalizeProduct(p)).filter((p) => p && p.id != null);
  },

  getById: async (productId, fallback) => {
    const response = await apiClient.get(`/Products/${productId}`);
    return normalizeProduct(response.data, fallback);
  },

  getByCategory: async (categoryId) => {
    return productApi.getAll(categoryId);
  },

  getReviewSummary: async (productId) => {
    const response = await apiClient.get(`/Products/${productId}/reviews`);
    return response.data;
  },

  getCategories: async () => {
    const response = await apiClient.get("/Products/categories");
    return response.data;
  },
};

// ================= CART =================
export const cartApi = {
  // ================= ADD =================
  add: async (data) => {
    const response = await apiClient.post("/Cart/add", data);
    return response.data;
  },

  // ================= GET CART (FIX LỖI CỦA BẠN) =================
  get: async (userId) => {
    const response = await apiClient.get(`/Cart/${userId}`);
    return response.data;
  },

  // ================= UPDATE QTY =================
  update: async (cartItemId, quantity) => {
    const response = await apiClient.put(`/Cart/update/${cartItemId}`, {
      quantity,
  });
    return response.data;
  },

  // ================= REMOVE =================
  remove: async (cartItemId) => {
    const response = await apiClient.delete(`/Cart/remove/${cartItemId}`);
    return response.data;
  },

  // ================= CHECKOUT =================
  getCheckout: async (userId) => {
    const response = await apiClient.get(`/Cart/checkout/${userId}`);
    return response.data;
  },
};

// ================= NEWS =================
export const newsApi = {
  getAll: async () => {
    const response = await apiClient.get("/News");
    return response.data;
  },
};

// ================= SERVICES =================
export const servicesApi = {
  getAll: async () => {
    const response = await apiClient.get("/Services");
    return response.data;
  },
};

// ================= PROMOTION =================
const normalizePromotion = (raw) => {
  if (!raw || typeof raw !== "object") return null;

  const id = raw.id ?? raw.Id;
  const title = raw.title ?? raw.code ?? raw.Code;
  const description = raw.description ?? raw.Description ?? "";

  const rawType = raw.type ?? raw.discountType ?? raw.DiscountType;
  const typeStr = rawType != null ? String(rawType) : "";
  const type = /percent/i.test(typeStr)
    ? "Percentage"
    : /fixed|amount|money|vnd|đ/i.test(typeStr)
      ? "FixedAmount"
      : typeStr || "FixedAmount";

  const rawValue = raw.value ?? raw.discountValue ?? raw.DiscountValue;
  let value = Number(rawValue);
  if (!Number.isFinite(value)) value = 0;

  // Nếu backend lưu % dạng 0.2 thay vì 20
  if (type === "Percentage" && value > 0 && value <= 1) {
    value = value * 100;
  }

  if (!title) return null;

  return {
    id,
    title,
    description,
    type,
    value,
    // giữ thêm field gốc nếu cần debug
    _raw: raw,
  };
};

export const promotionsApi = {
  getAll: async () => {
const response = await apiClient.get("/Promotions");

    const list = Array.isArray(response.data) ? response.data : [];
    return list.map(normalizePromotion).filter(Boolean);
  },

  validateCode: async (code) => {
    const response = await apiClient.get(
      `/Promotions/validate/${encodeURIComponent(code)}`
    );

    // Endpoint validate trả về object 1 mã
    return normalizePromotion(response.data) || response.data;
  },
};

// ================= REVIEW =================
export const reviewApi = {
  getAll: async () => {
    const response = await apiClient.get("/Reviews");
    return response.data;
  },

  getByProduct: async (productId) => {
    const response = await apiClient.get(`/Reviews/product/${productId}`);
    return response.data;
  },
};

// ================= SUPPLIER =================
export const supplierApi = {
  getAll: async () => {
    try {
      const response = await apiClient.get("/Suppliers");
      return response.data;
    } catch (error) {
      console.log("Supplier API lỗi");
      return [];
    }
  },
};