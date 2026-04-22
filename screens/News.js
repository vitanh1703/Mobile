import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';
import NewsCard from '../components/card/NewsCard';
import { useNews } from '../services/hooks';

const NewsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { news, loading, error, refetch } = useNews();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất Cả');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  // Chuẩn hóa dữ liệu từ Backend
  const normalizedNews = useMemo(() => {
    if (!Array.isArray(news)) return [];
    return news.map(item => ({
      id: item.id || item.Id,
      category: item.category || item.Category || 'Khác',
      title: item.title || item.Title || '',
      date: item.publishDate ? new Date(item.publishDate).toLocaleDateString('vi-VN') : item.publish_date ? new Date(item.publish_date).toLocaleDateString('vi-VN') : '',
      image: item.imageUrl || item.ImageUrl || item.imgUrl || item.ImgUrl || item.img_url || item.image || 'https://via.placeholder.com/150',
      desc: item.description || item.Description || item.desc || ''
    }));
  }, [news]);

  // Lấy danh sách các category không trùng lặp
  const categories = useMemo(() => {
    const cats = new Set(normalizedNews.map(item => item.category));
    return ['Tất Cả', ...Array.from(cats)];
  }, [normalizedNews]);

  // Lọc tin tức theo search & category
  const filteredNews = useMemo(() => {
    return normalizedNews.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'Tất Cả' || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [normalizedNews, searchTerm, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / itemsPerPage));

  // Phân trang
  const paginatedNews = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredNews.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredNews, currentPage]);

  const handleCategoryPress = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1); // Reset page khi lọc
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderNewsItem = ({ item }) => (
    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('NewsDetail', { id: item.id })}>
      <NewsCard
        id={item.id}
        category={item.category}
        title={item.title}
        date={item.date}
        img={item.image}
        desc={item.desc}
      />
    </TouchableOpacity>
  );

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '900',
      color: theme.text,
      textTransform: 'uppercase',
      letterSpacing: -0.5,
      marginLeft: 15,
      flex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: theme.text,
      marginHorizontal: 20,
      paddingBottom: 8,
      marginBottom: 20,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: theme.text,
      fontWeight: '600',
      padding: 0,
    },
    filterContainer: {
      paddingHorizontal: 20,
      marginBottom: 25,
    },
    categoryPill: {
      paddingHorizontal: 24,
      paddingVertical: 10,
      borderRadius: 30,
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
      textTransform: 'uppercase',
      color: theme.text,
    },
    categoryTextSelected: {
      color: theme.background,
    },
    listContent: {
      paddingHorizontal: 20,
      paddingBottom: 100, // Đệm cho bottom tab
    },
    pagination: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingTop: 20,
      borderTopWidth: 1,
      borderTopColor: theme.background1,
    },
    pageInfo: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.text1,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginRight: 15,
    },
    pageBtn: {
      width: 36,
      height: 36,
      borderWidth: 1,
      borderColor: theme.background1,
      borderRadius: 10,
      marginLeft: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    pageBtnActive: {
      backgroundColor: theme.text,
      borderColor: theme.text,
    },
    pageBtnText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text,
    },
    pageBtnTextActive: {
      color: theme.background,
    },
    pageBtnDisabled: {
      opacity: 0.3,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text1,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 15,
    },
    clearFilterBtn: {
      borderBottomWidth: 1,
      borderBottomColor: theme.text,
      paddingBottom: 2,
    },
    clearFilterText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.text,
      textTransform: 'uppercase',
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme.mode === 'light' ? '#F5F5F5' : theme.background2,
      padding: 20,
      borderRadius: 12,
      marginTop: 30,
      marginBottom: 20,
    },
    statBox: {
      flex: 1,
      alignItems: 'center',
    },
    statNum: {
      fontSize: 24,
      fontWeight: '900',
      color: theme.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 9,
      fontWeight: 'bold',
      color: theme.text1,
      textTransform: 'uppercase',
      letterSpacing: 1,
      textAlign: 'center',
    },
  }), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle} numberOfLines={1}>Tin Tức & Sự Kiện</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.text1} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tin tức..."
          placeholderTextColor={theme.text1}
          value={searchTerm}
          onChangeText={(text) => {
            setSearchTerm(text);
            setCurrentPage(1);
          }}
        />
      </View>

      {/* Category Filter */}
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryPill, selectedCategory === item && styles.categoryPillSelected]}
              onPress={() => handleCategoryPress(item)}
              activeOpacity={0.8}
            >
              <Text style={[styles.categoryText, selectedCategory === item && styles.categoryTextSelected]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Danh sách bài viết */}
      <FlatList
        data={paginatedNews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNewsItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} tintColor={theme.text} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={theme.text} />
            ) : error ? (
              <>
                <Text style={styles.emptyText}>Lỗi tải tin tức</Text>
                <TouchableOpacity onPress={refetch} style={styles.clearFilterBtn}>
                   <Text style={styles.clearFilterText}>Thử lại</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.emptyText}>Không tìm thấy tin tức</Text>
                <TouchableOpacity 
                  onPress={() => { setSearchTerm(''); setSelectedCategory('Tất Cả'); setCurrentPage(1); }} 
                  style={styles.clearFilterBtn}
                >
                  <Text style={styles.clearFilterText}>Xóa bộ lọc</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        }
        ListFooterComponent={
          <>
            {filteredNews.length > 0 && (
              <View style={styles.pagination}>
                <Text style={styles.pageInfo}>Trang {currentPage} / {totalPages}</Text>
                
                <TouchableOpacity
                  style={[styles.pageBtn, currentPage === 1 && styles.pageBtnDisabled]}
                  disabled={currentPage === 1}
                  onPress={() => handlePageChange(currentPage - 1)}
                >
                  <Ionicons name="chevron-back" size={16} color={theme.text} />
                </TouchableOpacity>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const page = i + 1;
                  const isActive = page === currentPage;
                  return (
                    <TouchableOpacity
                      key={page}
                      style={[styles.pageBtn, isActive && styles.pageBtnActive]}
                      onPress={() => handlePageChange(page)}
                    >
                      <Text style={[styles.pageBtnText, isActive && styles.pageBtnTextActive]}>{page}</Text>
                    </TouchableOpacity>
                  )
                })}

                <TouchableOpacity
                  style={[styles.pageBtn, currentPage === totalPages && styles.pageBtnDisabled]}
                  disabled={currentPage === totalPages}
                  onPress={() => handlePageChange(currentPage + 1)}
                >
                  <Ionicons name="chevron-forward" size={16} color={theme.text} />
                </TouchableOpacity>
              </View>
            )}

            {/* Stats Block ở cuối */}
            <View style={styles.statsContainer}>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{filteredNews.length}</Text>
                <Text style={styles.statLabel}>Tin tức{'\n'}tìm thấy</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{totalPages}</Text>
                <Text style={styles.statLabel}>Số trang</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNum}>{normalizedNews.length}</Text>
                <Text style={styles.statLabel}>Tổng cộng</Text>
              </View>
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

export default NewsScreen;