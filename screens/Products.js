import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';
import ProductCard from '../components/card/ProductCard';
import { productItems, clothingCategories } from '../data/shopData';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2; // 2 columns with 20px padding on sides and 20px between

const allCategories = ['Tất cả', ...clothingCategories.map(c => c.title)];

const ProductsScreen = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { searchQuery } = route?.params || {};
  
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Lọc sản phẩm theo danh mục & từ khóa tìm kiếm
  const filteredProducts = useMemo(() => {
    let result = productItems;
    if (selectedCategory !== 'Tất cả') {
      const category = clothingCategories.find(c => c.title === selectedCategory);
      if (category) {
        result = result.filter(item => item.category_id === category.id);
      }
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(item => item.title.toLowerCase().includes(lowerQuery));
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  
  // Lọc sản phẩm theo trang (Pagination)
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleCategoryPress = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1); // Reset về trang 1 khi đổi bộ lọc
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      image={item.image}
      title={item.title}
      brand={item.brand || "H&Q"}
      price={item.price}
      rating={item.rating}
      discount={item.discount}
      onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
      containerStyle={{ width: ITEM_WIDTH, marginRight: 0 }}
    />
  );

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.text,
      textTransform: 'uppercase',
      fontStyle: 'italic',
      letterSpacing: 1,
    },
    subHeader: {
      fontSize: 10,
      color: theme.text1,
      fontWeight: 'bold',
      textTransform: 'uppercase',
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
      fontWeight: 'bold',
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
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
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
      fontWeight: '900',
      textTransform: 'uppercase',
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
      fontWeight: '900',
      textTransform: 'uppercase',
      color: theme.background,
      letterSpacing: 1,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 60,
    },
    emptyText: {
      fontSize: 11,
      fontWeight: '900',
      color: theme.text1,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 6,
    },
    emptySubText: {
      fontSize: 11,
      color: theme.text1,
    }
  }), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack />
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.subHeader}>{searchQuery ? `KẾT QUẢ TÌM KIẾM: ${searchQuery}` : 'HOME / SHOP'}</Text>
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
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryPill,
                selectedCategory === item && styles.categoryPillSelected
              ]}
              onPress={() => handleCategoryPress(item)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item && styles.categoryTextSelected
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={paginatedProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có sản phẩm phù hợp</Text>
            <Text style={styles.emptySubText}>Vui lòng thử lại với các bộ lọc khác</Text>
          </View>
        }
        ListFooterComponent={
          totalPages > 1 ? (
            <View style={styles.pagination}>
              <TouchableOpacity 
                style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                disabled={currentPage === 1}
                onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                <Text style={styles.pageBtnText}>Trước</Text>
              </TouchableOpacity>
              
              <View style={styles.pageInfo}>
                <Text style={styles.pageInfoText}>Trang {currentPage}/{totalPages}</Text>
              </View>

              <TouchableOpacity 
                style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                disabled={currentPage === totalPages}
                onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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