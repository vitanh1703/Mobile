import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import ButtonGoBack from "../components/ButtonGoBack";
import { wishlistApi } from "../services/api";
import ProductCard from "../components/card/ProductCard";
import { useCategories, useProducts } from "../services/hooks";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 60) / 2; // 2 columns with 20px padding on sides and 20px between

const ProductsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { searchQuery, categoryId, categoryName } = route?.params || {};

  const { categories } = useCategories();

  const [wishlist, setWishlist] = useState([]);
  useFocusEffect(
    useCallback(() => {
      wishlistApi.getAll().then(data => setWishlist(data)).catch(() => {});
    }, [])
  );

  const handleFavoriteToggle = useCallback((variantId, isFav) => {
    setWishlist(prev => {
      if (isFav) return [...prev, { variantId }];
      return prev.filter(w => w.variantId !== variantId);
    });
  }, []);

  const normalizedCategories = useMemo(() => {
    const list = Array.isArray(categories) ? categories : [];
    return list
      .map((c) => {
        const id = c?.id ?? c?.Id;
        const name = c?.name ?? c?.Name;
        if (id == null || !name) return null;
        return { id, name: String(name) };
      })
      .filter(Boolean);
  }, [categories]);

  const allCategories = useMemo(
    () => [{ id: null, name: "Tất cả" }, ...normalizedCategories],
    [normalizedCategories]
  );

  const [selectedCategory, setSelectedCategory] = useState({
    id: categoryId ?? null,
    name: categoryName || "Tất cả",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setSelectedCategory({
      id: categoryId ?? null,
      name: categoryName || "Tất cả",
    });
    setCurrentPage(1);
  }, [categoryId, categoryName]);

  useEffect(() => {
    if (
      selectedCategory.id == null &&
      selectedCategory.name !== "Tất cả" &&
      normalizedCategories.length
    ) {
      const found = normalizedCategories.find(
        (c) => c.name === selectedCategory.name
      );
      if (found) setSelectedCategory(found);
    }
  }, [normalizedCategories, selectedCategory.id, selectedCategory.name]);

  const { products, loading: productsLoading, error: productsError } = useProducts(
    selectedCategory.id ?? undefined
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory.id, searchQuery]);

  const filteredProducts = useMemo(() => {
    let result = Array.isArray(products) ? products : [];

    if (selectedCategory.id != null) {
      result = result.filter(
        (p) => (p?.categoryId ?? p?.CategoryId) === selectedCategory.id
      );
    }

    if (searchQuery) {
      const lowerQuery = String(searchQuery).toLowerCase();
      result = result.filter((p) =>
        String(p?.name || "").toLowerCase().includes(lowerQuery)
      );
    }

    return result;
  }, [products, selectedCategory.id, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleCategoryPress = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const renderProduct = ({ item }) => {
    const id = item?.id ?? item?.Id;
    const imageUrl = item?.imageUrl ?? item?.ImageUrl;
    const name = item?.name ?? item?.Name;
    const brandText = item?.brandText ?? item?.BrandText ?? "H&Q";
    const minPrice = item?.minPrice ?? item?.MinPrice ?? 0;
    const variants = item?.variants ?? item?.Variants;
    const variantId = Array.isArray(variants) && variants.length > 0 ? (variants[0]?.id ?? variants[0]?.Id) : null;
    const isFav = wishlist.some((w) => w.variantId === variantId);

    return (
      <ProductCard
        image={imageUrl ? { uri: imageUrl } : require("../assets/logo.png")}
        title={name}
        brand={brandText}
        price={Number(minPrice) || 0}
        onPress={() => navigation.navigate("ProductDetail", { id })}
        containerStyle={{ width: ITEM_WIDTH, marginRight: 0 }}
        variantId={variantId}
        initialFavorite={isFav}
        onFavoriteToggle={handleFavoriteToggle}
      />
    );
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 50,
          paddingBottom: 20,
        },
        headerTitle: {
          fontSize: 22,
          fontWeight: "900",
          color: theme.text,
          textTransform: "uppercase",
          fontStyle: "italic",
          letterSpacing: 1,
        },
        subHeader: {
          fontSize: 10,
          color: theme.text1,
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: 2,
          marginBottom: 2,
        },
        filterContainer: {
          paddingHorizontal: 20,
          marginBottom: 15,
        },
        categoryPill: {
          paddingHorizontal: 18,
          paddingVertical: 10,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: theme.background1,
          marginRight: 10,
          backgroundColor: theme.background,
        },
        categoryPillSelected: {
          backgroundColor: theme.text,
          borderColor: theme.text,
        },
        categoryText: {
          fontSize: 12,
          fontWeight: "bold",
          color: theme.text,
        },
        categoryTextSelected: {
          color: theme.background,
        },
        listContent: {
          paddingHorizontal: 20,
          paddingBottom: 100,
        },
        row: {
          justifyContent: "space-between",
          marginBottom: 20,
        },
        pagination: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 10,
          marginBottom: 20,
        },
        pageBtn: {
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: theme.background1,
          backgroundColor: theme.background,
        },
        pageBtnDisabled: {
          opacity: 0.4,
        },
        pageBtnText: {
          fontSize: 10,
          fontWeight: "900",
          textTransform: "uppercase",
          color: theme.text,
          letterSpacing: 1,
        },
        pageInfo: {
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: theme.text,
          marginHorizontal: 10,
        },
        pageInfoText: {
          fontSize: 10,
          fontWeight: "900",
          textTransform: "uppercase",
          color: theme.background,
          letterSpacing: 1,
        },
        emptyContainer: {
          alignItems: "center",
          justifyContent: "center",
          marginTop: 60,
        },
        emptyText: {
          fontSize: 11,
          fontWeight: "900",
          color: theme.text1,
          textTransform: "uppercase",
          letterSpacing: 1.5,
          marginBottom: 6,
        },
        emptySubText: {
          fontSize: 11,
          color: theme.text1,
        },
      }),
    [theme]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack />
        <View style={{ alignItems: "center" }}>
          <Text style={styles.subHeader}>
            {searchQuery ? `KẾT QUẢ TÌM KIẾM: ${searchQuery}` : "HOME / SHOP"}
          </Text>
          <Text style={styles.headerTitle}>SẢN PHẨM</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          data={allCategories}
          keyExtractor={(item, index) => String(item?.id ?? `cat-${index}`)}
          renderItem={({ item }) => {
            const isSelected = selectedCategory.id === item.id;

            return (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  isSelected && styles.categoryPillSelected,
                ]}
                onPress={() => handleCategoryPress(item)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <FlatList
        data={paginatedProducts}
        keyExtractor={(item, index) => String(item?.id ?? item?.Id ?? index)}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {productsLoading ? (
              <ActivityIndicator color={theme.text} />
            ) : (
              <>
                <Text style={styles.emptyText}>
                  {productsError
                    ? "Không tải được sản phẩm"
                    : "Không có sản phẩm phù hợp"}
                </Text>
                <Text style={styles.emptySubText}>
                  {productsError
                    ? "Vui lòng kiểm tra kết nối / server."
                    : "Vui lòng thử lại với các bộ lọc khác"}
                </Text>
              </>
            )}
          </View>
        }
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  currentPage === 1 && styles.pageBtnDisabled,
                ]}
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <Text style={styles.pageBtnText}>Trước</Text>
              </TouchableOpacity>

              <View style={styles.pageInfo}>
                <Text style={styles.pageInfoText}>
                  Trang {currentPage}/{totalPages}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  currentPage === totalPages && styles.pageBtnDisabled,
                ]}
                disabled={currentPage === totalPages}
                onPress={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
              >
                <Text style={styles.pageBtnText}>Sau</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default ProductsScreen;
