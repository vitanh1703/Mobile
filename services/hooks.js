import { useEffect, useState } from "react";
import {
  authApi,
  productApi,
  cartApi,
  newsApi,
  servicesApi,
  promotionsApi,
  reviewApi,
} from "./api";
import { authController } from "./controller";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ================= AUTH =================
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const validation = authController.validateLogin(email, password);
    if (!validation.success) throw new Error(validation.message);

    try {
      setLoading(true);

      const data = await authApi.login({ email, password });

      // lưu user + token
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
      }

      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData) => {
    const validation = authController.validateRegister(registerData);
    if (!validation.success) throw new Error(validation.message);

    try {
      setLoading(true);

      const formattedData = {
        Email: registerData.email,
        Password: registerData.password,
        FullName: `${registerData.name} ${registerData.lastname}`,
        Role: "Customer",
        Status: true,
      };

      return await authApi.register(formattedData);
    } catch (err) {
      throw new Error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken) => {
    try {
      setLoading(true);

      const data = await authApi.googleLogin(idToken);

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
      }

      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Google login thất bại");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
  };

  return { login, register, loginWithGoogle, logout, loading };
};

//================= PRODUCTS =================
export const useProducts = (categoryId) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async (cId) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all products from API, filter client-side if categoryId provided
      const allData = await productApi.getAll();
      let filtered = Array.isArray(allData) ? allData : [];
      
      if (cId != null) {
        filtered = filtered.filter(
          (p) => (p?.categoryId ?? p?.CategoryId) === cId
        );
      }
      
      setProducts(filtered);
    } catch (err) {
      setError(err.message || "Không thể tải sản phẩm");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(categoryId);
  }, [categoryId]);

  return { products, loading, error, refetch: fetchProducts };
};

// ================= CART =================
export const useCart = () => {
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = async (variantId, quantity) => {
    const userStr = await AsyncStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;

    if (!user) {
      throw new Error("Vui lòng đăng nhập");
    }

    setIsAdding(true);
    try {
      return await cartApi.add({
        userId: user.id,
        variantId,
        quantity,
      });
    } catch (err) {
      throw new Error(err.response?.data?.message || "Lỗi giỏ hàng");
    } finally {
      setIsAdding(false);
    }
  };

  return { addToCart, isAdding };
};

// ================= NEWS =================
export const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsApi.getAll();
      setNews(data);
    } catch (err) {
      setError(err.message || "Không thể tải tin tức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return { news, loading, error, refetch: fetchNews };
};

// // ================= SERVICES =================
export const useServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (err) {
      setError(err.message || "Không thể tải dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, loading, error, refetch: fetchServices };
};

// // ================= PROMOTIONS =================
export const usePromotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await promotionsApi.getAll();
      setPromotions(data);
    } catch (err) {
      setError(err.message || "Không thể tải khuyến mãi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  return { promotions, loading, error, refetch: fetchPromotions };
};

// // ================= CATEGORIES =================
export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productApi.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
};

// // ================= NEWS TITLES =================
export const useNewsTitles = () => {
  const [newsTitles, setNewsTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewsTitles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsApi.getTitles();
      setNewsTitles(data);
    } catch (err) {
      setError(err.message || "Không thể tải tiêu đề");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsTitles();
  }, []);

  return { newsTitles, loading, error, refetch: fetchNewsTitles };
};

// // ================= REVIEWS =================
export const useReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async (pId) => {
    if (!pId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await reviewApi.getByProduct(pId);
      setReviews(data);
    } catch (err) {
      setError(err.message || "Không thể tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews(productId);
    }
  }, [productId]);

  return { reviews, loading, error, refetch: fetchReviews };
};
