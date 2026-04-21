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
  login: async (loginData: any) => {
    const response = await apiClient.post("/Auth/login", {
      Email: loginData.email,
      Password: loginData.password,
    });
    return response.data;
  },

  register: async (formData: any) => {
    const response = await apiClient.post("/Auth/register", formData);
    return response.data;
  },

  googleLogin: async (idToken: string) => {
    const response = await apiClient.post("/Auth/google-login", {
      token: idToken,
    });
    return response.data;
  },
};

// ================= PRODUCT =================
export const productApi = {
  getAll: async (categoryId?: number) => {
    const response = await apiClient.get("/Products", {
      params: categoryId ? { category: categoryId } : undefined,
    });
    return response.data;
  },

  getByCategory: async (categoryId: number) => {
    return productApi.getAll(categoryId);
  },

  getReviewSummary: async (productId: number) => {
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
  add: async (data: any) => {
    const response = await apiClient.post("/Cart/add", data);
    return response.data;
  },

  remove: async (cartItemId: number) => {
    const response = await apiClient.delete(`/Cart/remove/${cartItemId}`);
    return response.data;
  },

  getCheckout: async (userId: number) => {
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
export const promotionsApi = {
  getAll: async () => {
    const response = await apiClient.get("/Promotions");
    return response.data;
  },

  validateCode: async (code: string) => {
    const response = await apiClient.get(
      `/Promotions/validate/${encodeURIComponent(code)}`
    );
    return response.data;
  },
};

// ================= REVIEW =================
export const reviewApi = {
  getAll: async () => {
    const response = await apiClient.get("/Reviews");
    return response.data;
  },

  getByProduct: async (productId: number) => {
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