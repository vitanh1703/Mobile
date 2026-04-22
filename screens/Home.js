import React, { useMemo, useState, useEffect } from "react";
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Image, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

import DealCard from "../components/card/DealCard";
import CategoryCard from "../components/card/CategoryCard";
import ProductCard from "../components/card/ProductCard";

import { useTheme } from "../context/ThemeContext";
import { useCategories, useProducts, usePromotions } from "../services/hooks";
import { clothingCategories } from "../data/shopData";

const HomeScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    
    const { promotions, loading: promoLoading, error: promoError } = usePromotions();
    const { categories, loading: catLoading, error: catError } = useCategories();
    const { products, loading: productsLoading, error: productsError } = useProducts(undefined);
    const dealsToRender = promotions?.length ? promotions.slice(0, 5) : [];

    const categoriesToRender = useMemo(() => {
        const list = Array.isArray(categories) && categories.length ? categories : [];
        if (!list || list.length === 0) return [];

        return list
            .map((c, index) => {
                const id = c?.id ?? c?.Id;
                const name = c?.name ?? c?.Name;
                if (id == null || !name) return null;

                const matchedCategory = clothingCategories.find(item => item.id === id || item.title.toLowerCase() === name.toLowerCase());
                const fallbackIcons = [
                    { uri: 'https://img.icons8.com/fluency/200/jacket.png' },
                    { uri: 'https://img.icons8.com/fluency/200/t-shirt.png' },
                    { uri: 'https://img.icons8.com/fluency/200/jeans.png' },
                    { uri: 'https://img.icons8.com/fluency/200/scarf.png' }
                ];

                return {
                    id,
                    title: name,
                    image: matchedCategory?.image || fallbackIcons[index % fallbackIcons.length],
                };
            })
            .filter(Boolean);
    }, [categories]);

    const popularProducts = useMemo(() => {
        if (!Array.isArray(products) || products.length === 0) return [];
        return products.slice(0, 10);
    }, [products]);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigation.navigate("Products", { searchQuery: searchQuery.trim() });
        } else {
            navigation.navigate("Products");
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
            <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <View>
                            <Image 
                                source={require("../assets/logo.png")} 
                                style={{ width: 36, height: 36 }} 
                                resizeMode="contain" 
                            />
                        </View>
                        <Text style={[styles.title, { color: theme.text }]}>H&Q Store</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.cart} onPress={() => navigation.navigate("Cart")}>
                            <Ionicons name="bag-handle-outline" size={20} color={'#fff'} style={{ padding: 5 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <View style={styles.search}>
                        <TextInput
                            style={[styles.searchInput, { color: theme.text }]}
                            placeholder="Tìm kiếm sản phẩm..."
                            placeholderTextColor={'rgba(133, 137, 150, 1)'}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                        <TouchableOpacity onPress={handleSearch}>
                            <Ionicons name="search-outline" size={22} color={'rgba(133, 137, 150, 1)'} style={{ padding: 10 }} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Deals */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                        <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 0 }]}>Khuyến mãi đặc biệt</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("Promotion")}>
                            <Text style={{ color: theme.text1, fontSize: 13, fontWeight: '600' }}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
                        {promoLoading ? (
                            <View style={{ height: 120, justifyContent: 'center', paddingHorizontal: 20 }}>
                                <ActivityIndicator color={theme.text} size="small" />
                            </View>
                        ) : promoError ? (
                            <Text style={{ color: '#ff0000', fontSize: 12, padding: 10 }}>Lỗi tải khuyến mãi</Text>
                        ) : promotions?.length > 0 ? (
                            promotions.slice(0, 5).map((deal, index) => {
                                const discountText = deal.type === 'FixedAmount' ? `-${deal.value / 1000}K` : `-${deal.value}%`;
                                return (
                                    <DealCard
                                        key={deal.id || index}
                                        code={deal.title}
                                        title="ƯU ĐÃI ĐẶC BIỆC"
                                        description={deal.description}
                                        discountText={discountText}
                                        onPress={() => console.log(`${deal.title} pressed`)}
                                    />
                                );
                            })
                        ) : (
                            <Text style={{ color: theme.text1, fontSize: 12, padding: 10 }}>Không có khuyến mãi</Text>
                        )}
                    </ScrollView>
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Danh mục</Text>
                    {catLoading ? (
                        <View style={{ height: 100, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color={theme.text} />
                        </View>
                    ) : catError ? (
                        <Text style={{ color: '#ff0000', fontSize: 12, textAlign: 'center' }}>Lỗi tải danh mục</Text>
                    ) : categoriesToRender?.length > 0 ? (
                        <View style={styles.categoriesContainer}>
                            {categoriesToRender.map((item) => (
                                <CategoryCard
                                    key={item.id}
                                    title={item.title}
                                    image={item.image}
                                    onPress={() => navigation.navigate("Products", {
                                        categoryId: item.id,
                                        categoryName: item.title,
                                    })}
                                />
                            ))}
                        </View>
                    ) : (
                        <Text style={{ color: theme.text1, fontSize: 12, textAlign: 'center' }}>Không có danh mục</Text>
                    )}
                </View>

                {/* Popular Products */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Sản phẩm phổ biến</Text>
                    {productsLoading ? (
                        <View style={{ height: 220, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator color={theme.text} />
                        </View>
                    ) : productsError ? (
                        <Text style={{ color: '#ff0000', fontSize: 12, textAlign: 'center', paddingVertical: 20 }}>Lỗi tải sản phẩm</Text>
                    ) : popularProducts?.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {popularProducts.map((item) => {
                                const id = item?.id ?? item?.Id;
                                const title = item?.name ?? item?.Name;
                                const brand = item?.brandText ?? item?.BrandText ?? "H&Q";

                                const variants = item?.variants ?? item?.Variants;
                                const minVariantPrice =
                                    Array.isArray(variants) && variants.length
                                        ? Math.min(
                                              ...variants
                                                  .map((v) => Number(v?.price ?? v?.Price ?? 0))
                                                  .filter((n) => Number.isFinite(n) && n > 0)
                                          )
                                        : 0;
                                const price = item?.minPrice ?? item?.price ?? minVariantPrice;

                                const rawImageUrl = item?.imageUrl ?? item?.ImageUrl;
                                const image = rawImageUrl
                                    ? { uri: rawImageUrl }
                                    : require("../assets/logo.png");

                                return (
                                    <ProductCard
                                        key={id}
                                        image={image}
                                        title={title}
                                        brand={brand}
                                        price={Number(price) || 0}
                                        onPress={() => navigation.navigate("ProductDetail", { id })}
                                    />
                                );
                            })}
                        </ScrollView>
                    ) : (
                        <Text style={{ color: theme.text1, fontSize: 12, textAlign: 'center', paddingVertical: 20 }}>Không có sản phẩm</Text>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },
    container: { 
        flex: 1, 
        paddingHorizontal: 20 },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingTop: 50, 
        marginBottom: 20 
    },
    titleContainer: { 
        flexDirection: 'row', 
        alignItems: 'center' 
    },
    title: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginLeft: 10 
    },
    cart: { 
        backgroundColor: '#000000', 
        borderRadius: 5, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginLeft: 10 
    },
    searchContainer: { 
        marginBottom: 20 
    },
    search: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        borderRadius: 10, 
        borderColor: '#C6C8CD', 
        borderWidth: 1, 
        height: 45, 
        paddingHorizontal: 10 
    },
    searchInput: { 
        flex: 1, 
        fontSize: 14, 
        paddingHorizontal: 5 
    },
    section: { 
        marginBottom: 25 
    },
    sectionTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 15 
    },
    categoriesContainer: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between' 
    },
});

export default HomeScreen;
