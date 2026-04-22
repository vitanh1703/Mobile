import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import ButtonGoBack from '../components/ButtonGoBack';
import { wishlistApi } from '../services/api';

const { width } = Dimensions.get('window');

const FavouritesScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { addToCart } = useCart();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchWishlist();
    }, [])
  );

  const fetchWishlist = async () => {
    try {
      const data = await wishlistApi.getAll();
      // Map kết quả API về đúng format của UI hiện tại
      const formattedData = data.map(item => ({
        id: item.id,
        variantId: item.variantId || item.variant?.id,
        productId: item.variant?.productId || item.productId,
        name: item.variant?.product?.name || item.name || 'Sản phẩm',
        sku: item.variant?.sku || item.sku || 'N/A',
        color: item.variant?.color || item.color || '',
        size: item.variant?.size || item.size || '',
        price: item.variant?.price || item.price || 0,
        image: item.variant?.product?.imageUrl || item.image || 'https://via.placeholder.com/150',
      }));
      setWishlistItems(formattedData);
    } catch (error) {
      console.log('Lỗi khi tải danh sách yêu thích:', error);
    } finally {
      setLoading(false);
    }
  };

  // Xoá khỏi danh sách yêu thích
  const handleRemoveFavorite = async (id) => {
    try {
      await wishlistApi.remove(id);
      setWishlistItems((prev) => prev.filter((item) => item.id !== id));
      Alert.alert('Thành công', 'Đã xóa khỏi danh sách yêu thích');
    } catch (error) {
      console.log('Lỗi khi xoá yêu thích:', error);
      Alert.alert('Lỗi', 'Không thể xoá khỏi danh sách yêu thích!');
    }
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = (item) => {
    addToCart({
      id: item.variantId || item.id,
      name: `${item.name} - ${item.color} / ${item.size}`,
      desc: `SKU: ${item.sku}`,
      price: item.price,
      image: item.image,
      qty: 1,
    });
    Alert.alert('Thành công', `Đã thêm "${item.name}" vào giỏ hàng!`);
  };

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
      paddingBottom: 10,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
      textTransform: 'uppercase',
      fontStyle: 'italic',
    },
    subHeader: {
      fontSize: 12,
      color: theme.text1,
      paddingHorizontal: 20,
      marginBottom: 20,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 80,
    },
    emptyText: {
      color: theme.text1,
      fontStyle: 'italic',
      marginBottom: 20,
    },
    exploreBtn: {
      backgroundColor: theme.text,
      paddingHorizontal: 30,
      paddingVertical: 12,
      borderRadius: 30,
    },
    exploreBtnText: {
      color: theme.background,
      fontWeight: 'bold',
      textTransform: 'uppercase',
    },
    card: {
      flexDirection: 'row',
      backgroundColor: theme.background2,
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.background1,
      overflow: 'hidden',
    },
    image: {
      width: 120,
      height: 150,
      resizeMode: 'cover',
    },
    info: {
      flex: 1,
      padding: 12,
      justifyContent: 'space-between',
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    title: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.text,
      flex: 1,
      textTransform: 'uppercase',
    },
    variants: {
      fontSize: 11,
      color: theme.text1,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginTop: 6,
    },
    price: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.text,
      fontStyle: 'italic',
      marginTop: 8,
    },
    cartBtn: {
      backgroundColor: theme.text,
      paddingVertical: 10,
      borderRadius: 30,
      alignItems: 'center',
      marginTop: 10,
    },
    cartBtnText: {
      color: theme.background,
      fontSize: 10,
      fontWeight: '900',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle}>Yêu thích</Text>
        <View style={{ width: 40 }} />
      </View>
      <Text style={styles.subHeader}>Bạn đang có {wishlistItems.length} món đồ</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <ActivityIndicator size="large" color={theme.text} />
          </View>
        ) : wishlistItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Danh sách yêu thích của bạn hiện đang trống.</Text>
            <TouchableOpacity 
              style={styles.exploreBtn} 
              activeOpacity={0.8} 
              onPress={() => navigation.navigate('ProductsTab', { categoryId: null, categoryName: 'Tất cả' })}
            >
              <Text style={styles.exploreBtnText}>Khám phá sản phẩm</Text>
            </TouchableOpacity>
          </View>
        ) : (
          wishlistItems.map((item) => (
            <View key={item.id} style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { id: item.productId })}>
                <Image source={{ uri: item.image }} style={styles.image} />
              </TouchableOpacity>
              
              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('ProductDetail', { id: item.productId })}>
                    <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveFavorite(item.id)} style={{ paddingLeft: 10 }}>
                    <Ionicons name="heart" size={22} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>

                <View>
                  <Text style={styles.variants}>SKU: {item.sku}</Text>
                  <Text style={styles.variants}>MÀU: {item.color}  |  SIZE: {item.size}</Text>
                  <Text style={styles.price}>{item.price.toLocaleString('vi-VN')} VND</Text>
                </View>

                <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(item)} activeOpacity={0.8}>
                  <Text style={styles.cartBtnText}>THÊM VÀO GIỎ HÀNG</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default FavouritesScreen;