import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import ButtonGoBack from '../components/ButtonGoBack';

const { width } = Dimensions.get('window');

// --- DỮ LIỆU TĨNH GIẢ LẬP ---
const mockWishlist = [
  {
    id: 1,
    productId: 12,
    name: 'AIRism Cotton Áo Thun',
    sku: 'VN-465185',
    color: 'Trắng',
    size: 'M',
    price: 230000,
    image: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/465185/item/vngoods_17_465185_3x4.jpg',
    description: 'Áo thun cotton AIRism mềm mại, thoáng mát, thấm hút mồ hôi tốt.',
  },
  {
    id: 2,
    productId: 2,
    name: 'AirSense Áo Khoác Wool-like',
    sku: 'VN-468671',
    color: 'Đen',
    size: 'L',
    price: 250000,
    image: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/468671/item/vngoods_05_468671_3x4.jpg',
    description: 'Áo khoác nhẹ, dễ di chuyển, phù hợp công sở.',
  },
];

const FavouritesScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { addToCart } = useCart();

  const [wishlistItems, setWishlistItems] = useState(mockWishlist);

  // Xoá khỏi danh sách yêu thích
  const handleRemoveFavorite = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    // Dùng Alert thay cho Toast trên Web
    Alert.alert('Thành công', 'Đã xóa khỏi danh sách yêu thích');
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
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
        {wishlistItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Danh sách yêu thích của bạn hiện đang trống.</Text>
            <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('Home')}>
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