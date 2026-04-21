import { useEffect, useState } from "react";
import {
  authApi,
  productApi,
  cartApi,
  newsApi,
  servicesApi,
  promotionsApi,
  reviewApi,
  // type Product,
  // type NewsItem,
  // type ServiceItem,
  // type PromotionItem,
  // type Category,
  // type NewsTitle,
  // type Review,
} from "./api";
import { authController } from "./controller";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ================= AUTH =================
export const useAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
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
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  const register = async (registerData: any) => {
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
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Đăng ký thất bại");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    try {
      setLoading(true);

      const data = await authApi.googleLogin(idToken);

      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        await AsyncStorage.setItem("token", data.token);
      }

      return data;
    } catch (err: any) {
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

// ================= PRODUCTS =================
// export const useProducts = (categoryId?: number) => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchProducts = async (categoryId?: number) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await productApi.getAll(categoryId);
//       setProducts(data);
//     } catch (err: any) {
//       setError(err.message || "Không thể tải sản phẩm");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts(categoryId);
//   }, [categoryId]);

//   return { products, loading, error, refetch: fetchProducts };
// };

// ================= CART =================
export const useCart = () => {
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = async (variantId: number, quantity: number) => {
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
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Lỗi giỏ hàng");
    } finally {
      setIsAdding(false);
    }
  };

  return { addToCart, isAdding };
};

// ================= NEWS =================
// export const useNews = () => {
//   const [news, setNews] = useState<NewsItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchNews = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await newsApi.getAll();
//       setNews(data);
//     } catch (err: any) {
//       setError(err.message || "Không thể tải tin tức");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   return { news, loading, error, refetch: fetchNews };
// };

// // ================= SERVICES =================
// export const useServices = () => {
//   const [services, setServices] = useState<ServiceItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchServices = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await servicesApi.getAll();
//       setServices(data);
//     } catch (err: any) {
//       setError(err.message || "Không thể tải dịch vụ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchServices();
//   }, []);

//   return { services, loading, error, refetch: fetchServices };
// };

// // ================= PROMOTIONS =================
// export const usePromotions = () => {
//   const [promotions, setPromotions] = useState<PromotionItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPromotions = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await promotionsApi.getAll();
//       setPromotions(data);
//     } catch (err: any) {
//       setError(err.message || "Không thể tải khuyến mãi");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchPromotions();
//   }, []);

//   return { promotions, loading, error, refetch: fetchPromotions };
// };

// // ================= CATEGORIES =================
// export const useCategories = () => {
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchCategories = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await productApi.getCategories();
//       setCategories(data);
//     } catch (err: any) {
//       setError(err.message || "Không thể tải danh mục");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return { categories, loading, error, refetch: fetchCategories };
// };

// // ================= NEWS TITLES =================
// export const useNewsTitles = () => {
//   const [newsTitles, setNewsTitles] = useState<NewsTitle[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchNewsTitles = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await newsApi.getTitles();
//       setNewsTitles(data);
//     } catch (err: any) {
//       setError(err.message || "Không thể tải tiêu đề");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNewsTitles();
//   }, []);

//   return { newsTitles, loading, error, refetch: fetchNewsTitles };
// };

// // ================= REVIEWS =================
// export const useReviews = (productId?: number) => {
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchReviews = async (pId?: number) => {
//     if (!pId) return;

//     setLoading(true);
//     setError(null);
//     try {
//       const data = await reviewApi.getByProduct(pId);
//       setReviews(data);
//     } catch (err: any) {
//       setError(err.message || "Không thể tải đánh giá");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (productId) {
//       fetchReviews(productId);
//     }
//   }, [productId]);

  // return { reviews, loading, error, refetch: fetchReviews };
// };