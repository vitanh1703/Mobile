import React, { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, TextInput, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import DealCard from "../components/card/DealCard";
import CategoryCard from "../components/card/CategoryCard";
import ProductCard from "../components/card/ProductCard";

import { deals, clothingCategories, productItems } from "../data/shopData";
import { useTheme } from "../context/ThemeContext";

const HomeScreen = () => {
    const navigation = useNavigation();
    const { theme, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");

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
                        <TouchableOpacity onPress={toggleTheme}>
                            <Ionicons name={theme.icon} size={28} color={theme.text} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Favourite")} style={{ marginLeft: 12 }}>
                            <Ionicons name="heart-outline" size={28} color={theme.text} />
                        </TouchableOpacity>
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
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Khuyến mãi đặc biệt</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 10 }}>
                        {deals.map((deal, index) => {
                            const discountText = deal.type === 'FixedAmount' ? `-${deal.value / 1000}K` : `-${deal.value}%`;
                            return (
                                <DealCard
                                    key={index}
                                    code={deal.title}
                                    title="ƯU ĐÃI ĐẶC BIỆT"
                                    description={deal.description}
                                    discountText={discountText}
                                    onPress={() => console.log(`${deal.title} pressed`)}
                                />
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Categories */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Danh mục</Text>
                    <View style={styles.categoriesContainer}>
                        {clothingCategories.map((item) => (
                            <CategoryCard
                                key={item.id}
                                title={item.title}
                                image={item.image}
                                onPress={() => navigation.navigate("ShopByCate", {
                                    categoryId: item.id,
                                    categoryName: item.title,
                                    categoryImage: item.image,
                                })}
                            />
                        ))}
                    </View>
                </View>

                {/* Popular Products */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Sản phẩm phổ biến</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {productItems.map((item) => (
                            <ProductCard
                                key={item.id}
                                image={item.image}
                                discount={item.discount}
                                title={item.title}
                                brand={item.brand}
                                price={item.price}
                                rating={item.rating}
                                reviews={item.reviews}
                                onPress={() => navigation.navigate("ProductDetail")}
                            />
                        ))}
                    </ScrollView>
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
        marginTop: 20, 
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