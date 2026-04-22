import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import ButtonGoBack from '../components/ButtonGoBack';
import { productItems } from '../data/shopData';
import { productApi } from '../services/api';

const { width } = Dimensions.get('window');

// --- DỮ LIỆU TĨNH (STATIC MOCK DATA) ---
const mockProduct = {
  id: 1,
  name: 'AIRism Cotton Áo Thun',
  brandText: 'H&Q Store',
  description: 'Áo thun cotton AIRism mềm mại, thoáng mát, thấm hút mồ hôi tốt. Thiết kế basic dễ phối đồ, phù hợp mặc hàng ngày.',
  imageUrl: 'https://image.uniqlo.com/UQ/ST3/vn/imagesgoods/465185/item/vngoods_17_465185_3x4.jpg',
  variants: [
    { id: 101, color: 'Trắng', size: 'S', price: 230000, stockQuantity: 10 },
    { id: 102, color: 'Trắng', size: 'M', price: 230000, stockQuantity: 5 },
    { id: 103, color: 'Trắng', size: 'L', price: 230000, stockQuantity: 0 }, // Hết hàng
    { id: 104, color: 'Đen', size: 'M', price: 250000, stockQuantity: 2 },
    { id: 105, color: 'Đen', size: 'L', price: 250000, stockQuantity: 8 },
  ],
};

const mockReviewsData = {
  averageRating: 4.8,
  totalReviews: 24,
  reviews: [
    { id: 1, userName: 'Nguyễn Văn A', rating: 5, comment: 'Áo mặc rất mát, vải đẹp. Sẽ ủng hộ shop thêm!', createdAt: '2024-03-15T00:00:00.000Z' },
    { id: 2, userName: 'Trần Thị B', rating: 4, comment: 'Form hơi rộng so với size bình thường, nhưng chất lượng tốt.', createdAt: '2024-03-10T00:00:00.000Z' },
  ],
};

const buildFallbackProduct = (id) => {
  const item = productItems.find((p) => p.id === id);
  if (item) {
    return {
      id: item.id,
      name: item.title,
      brandText: item.brand || 'H&Q Store',
      description: 'Mô tả chi tiết sản phẩm. Thiết kế basic dễ phối đồ, phù hợp mặc hàng ngày.',
      imageUrl: item.image?.uri,
      variants: [
        { id: parseInt(`${item.id}101`), color: 'Trắng', size: 'S', price: item.price, stockQuantity: 10 },
        { id: parseInt(`${item.id}102`), color: 'Trắng', size: 'M', price: item.price, stockQuantity: 5 },
        { id: parseInt(`${item.id}103`), color: 'Trắng', size: 'L', price: item.price, stockQuantity: 0 },
        { id: parseInt(`${item.id}104`), color: 'Đen', size: 'M', price: item.price, stockQuantity: 2 },
        { id: parseInt(`${item.id}105`), color: 'Đen', size: 'L', price: item.price, stockQuantity: 8 },
      ],
    };
  }
  return mockProduct;
};

const normalizeReviewSummary = (raw) => {
  if (!raw || typeof raw !== 'object') return mockReviewsData;

  const averageRating = Number(raw.averageRating ?? raw.AverageRating ?? 0);
  const totalReviews = Number(raw.totalReviews ?? raw.TotalReviews ?? 0);
  const list = Array.isArray(raw.reviews ?? raw.Reviews) ? (raw.reviews ?? raw.Reviews) : [];

  const reviews = list
    .map((r) => {
      if (!r || typeof r !== 'object') return null;
      const rating = Number(r.rating ?? r.Rating ?? 0);
      return {
        id: r.id ?? r.Id,
        userName: r.userName ?? r.UserName ?? 'Ẩn danh',
        rating: Number.isFinite(rating) ? rating : 0,
        comment: r.comment ?? r.Comment ?? '',
        createdAt: r.createdAt ?? r.CreatedAt ?? new Date().toISOString(),
      };
    })
    .filter(Boolean);

  return {
    averageRating: Number.isFinite(averageRating) ? averageRating : 0,
    totalReviews: Number.isFinite(totalReviews) ? totalReviews : reviews.length,
    reviews,
  };
};

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { id } = route.params || {};

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fallbackProduct = useMemo(() => buildFallbackProduct(id), [id]);
  const [product, setProduct] = useState(fallbackProduct);
  const [reviewsData, setReviewsData] = useState(mockReviewsData);

  useEffect(() => {
    // reset lựa chọn khi đổi sản phẩm
    setSelectedColor(null);
    setSelectedSize(null);
    setQuantity(1);
  }, [id]);

  useEffect(() => {
    let mounted = true;

    const fetchDetail = async () => {
      if (!id) return;
      try {
        const detail = await productApi.getById(id, fallbackProduct);
        if (mounted && detail) {
          setProduct(detail);
        }
      } catch (e) {
        // giữ fallback, không đổi UI
      }
    };

    fetchDetail();
    return () => {
      mounted = false;
    };
  }, [id, fallbackProduct]);

  useEffect(() => {
    let mounted = true;

    const fetchReviews = async () => {
      if (!id) return;
      try {
        const summary = await productApi.getReviewSummary(id);
        const normalized = normalizeReviewSummary(summary);
        if (mounted) setReviewsData(normalized);
      } catch (e) {
        // giữ mock, không đổi UI
      }
    };

    fetchReviews();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Xử lý logic lọc màu sắc và kích cỡ
  const availableColors = Array.from(new Set(product.variants.map((v) => v.color)));
  const allSizes = Array.from(new Set(product.variants.map((v) => v.size)));

  const availableSizes = selectedColor
    ? product.variants.filter((v) => v.color === selectedColor).map((v) => v.size)
    : allSizes;

  const selectedVariant = selectedColor && selectedSize
    ? product.variants.find((v) => v.color === selectedColor && v.size === selectedSize)
    : null;

  const currentPrice = selectedVariant ? selectedVariant.price : product.variants[0].price;

  // Xử lý thay đổi số lượng
  const handleQuantity = (type) => {
    if (type === 'plus') {
      const maxStock = selectedVariant ? selectedVariant.stockQuantity : 99;
      if (quantity < maxStock) setQuantity((q) => q + 1);
      else if (selectedVariant && quantity >= maxStock) Alert.alert("Thông báo", "Đã đạt giới hạn tồn kho!");
    } else if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  // Thêm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      Alert.alert('Lỗi', 'Vui lòng chọn màu sắc và kích cỡ!');
      return;
    }
    if (!selectedVariant || selectedVariant.stockQuantity < 1) {
      Alert.alert('Lỗi', 'Sản phẩm này hiện đang hết hàng!');
      return;
    }

    addToCart({
      id: selectedVariant.id, // Dùng ID của biến thể
      name: `${product.name} - ${selectedColor} / ${selectedSize}`,
      desc: product.brandText,
      price: selectedVariant.price,
      image: product.imageUrl,
      qty: quantity,
    });

    Alert.alert('Thành công', 'Đã thêm vào giỏ hàng!', [
      { text: 'Tiếp tục mua sắm' },
      { text: 'Đến giỏ hàng', onPress: () => navigation.navigate('Cart') }
    ]);
  };

  // Mua ngay
  const handleBuyNow = () => {
    if (!selectedColor || !selectedSize) {
      Alert.alert('Lỗi', 'Vui lòng chọn màu sắc và kích cỡ!');
      return;
    }
    if (!selectedVariant || selectedVariant.stockQuantity < 1) {
      Alert.alert('Lỗi', 'Sản phẩm này hiện đang hết hàng!');
      return;
    }

    const itemToBuy = {
      id: selectedVariant.id,
      productName: product.name,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      price: selectedVariant.price,
      total: selectedVariant.price * quantity,
      image: product.imageUrl
    };

    navigation.navigate('Checkout', {
      selectedItems: [itemToBuy],
      totalFromCart: itemToBuy.total
    });
  };

  // Hàm vẽ ngôi sao
  const renderStars = (rating) => {
    const stars = [];
    const rounded = Math.round(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rounded ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return stars;
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: theme.background 
    },
    header: { 
        position: 'absolute', 
        top: 15, 
        left: 20, 
        zIndex: 10 
    },
    image: { 
        width: '100%', 
        height: (width * 4) / 3, 
        resizeMode: 'contain' 
    },
    content: { 
        padding: 20, 
        borderTopLeftRadius: 30, 
        borderTopRightRadius: 30, 
        backgroundColor: theme.background, 
        marginTop: -30 
    },
    titleRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start' 
    },
    title: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        color: theme.text, 
        flex: 1, 
        marginRight: 10 
    },
    price: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#FE552A' 
    },
    brand: { 
        fontSize: 14, 
        color: theme.text1, 
        marginTop: 4, 
        marginBottom: 12 
    },
    ratingRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 16 
    },
    ratingText: { 
        fontWeight: 'bold', 
        color: theme.text, 
        marginLeft: 6 
    },
    reviewText: { 
        color: theme.text1, 
        marginLeft: 4, 
        fontSize: 13 
    },
    description: { 
        fontSize: 14, 
        color: theme.text, 
        lineHeight: 22, 
        marginBottom: 20 
    },
    sectionTitle: { 
        fontSize: 16, 
        fontWeight: 'bold', 
        color: theme.text, 
        marginBottom: 10 
    },
    optionsRow: { 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        marginBottom: 20 
    },
    optionBtn: { 
        paddingVertical: 8, 
        paddingHorizontal: 16, 
        borderRadius: 8, 
        borderWidth: 1, 
        marginRight: 10, 
        marginBottom: 10 
    },
    optionText: { 
        fontWeight: 'bold', 
        fontSize: 14 
    },
    qtyRow: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 30 
    },
    qtyBtn: { 
        width: 36, 
        height: 36, 
        borderRadius: 18, 
        backgroundColor: theme.background1, 
        alignItems: 'center', 
        justifyContent: 'center' 
    },
    qtyText: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: theme.text, 
        marginHorizontal: 20 
    },
    bottomBar: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderTopColor: theme.background1,
    },
    actionBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 5,
    },
    btnOutline: {
      backgroundColor: theme.background,
      borderWidth: 1,
      borderColor: theme.text,
    },
    btnSolid: {
      backgroundColor: theme.text,
    },
    btnText: {
      fontWeight: 'bold',
      fontSize: 15,
      textTransform: 'uppercase',
    },
    divider: { 
        height: 1, 
        backgroundColor: theme.background1, 
        marginBottom: 20 
    },
    reviewItem: { 
        marginBottom: 20, 
        paddingBottom: 20, 
        borderBottomWidth: 1, 
        borderBottomColor: theme.background1 
    },
    reviewHeader: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 6 
    },
    reviewAuthor: { 
        fontWeight: 'bold', 
        color: theme.text 
    },
    reviewDate: { 
        fontSize: 12, 
        color: theme.text1 
    },
    reviewComment: { 
        color: theme.text, 
        marginTop: 8, 
        lineHeight: 20 
    },
  }), [theme, width]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Nút quay lại chồng lên ảnh */}
      <View style={styles.header}>
        <ButtonGoBack />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.imageUrl }} style={styles.image} />
        
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{currentPrice.toLocaleString('vi-VN')}đ</Text>
          </View>
          <Text style={styles.brand}>{product.brandText}</Text>

          <View style={styles.ratingRow}>
            {renderStars(reviewsData.averageRating)}
            <Text style={styles.ratingText}>{reviewsData.averageRating.toFixed(1)}</Text>
            <Text style={styles.reviewText}>({reviewsData.totalReviews} đánh giá)</Text>
          </View>

          <Text style={styles.description}>{product.description}</Text>

          {/* Phân loại Màu sắc */}
          <Text style={styles.sectionTitle}>Màu sắc</Text>
          <View style={styles.optionsRow}>
            {availableColors.map((color) => {
              const isSelected = selectedColor === color;
              return (
                <TouchableOpacity
                  key={color}
                  onPress={() => {
                    setSelectedColor(color);
                    if (selectedSize && !product.variants.some((v) => v.color === color && v.size === selectedSize)) {
                      setSelectedSize(null); // Xóa size nếu màu mới không có size cũ
                    }
                  }}
                  style={[
                    styles.optionBtn,
                    {
                      backgroundColor: isSelected ? theme.text : theme.background,
                      borderColor: isSelected ? theme.text : theme.background1
                    }
                  ]}
                >
                  <Text style={[styles.optionText, { color: isSelected ? theme.background : theme.text }]}>
                    {color}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Phân loại Kích cỡ */}
          <Text style={styles.sectionTitle}>Kích cỡ</Text>
          <View style={styles.optionsRow}>
            {allSizes.map((size) => {
              const isAvailable = !selectedColor || availableSizes.includes(size);
              const isSelected = selectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  disabled={!isAvailable}
                  onPress={() => isAvailable && setSelectedSize(size)}
                  style={[
                    styles.optionBtn,
                    {
                      backgroundColor: isSelected ? theme.text : theme.background,
                      borderColor: isSelected ? theme.text : theme.background1,
                      opacity: isAvailable ? 1 : 0.4
                    }
                  ]}
                >
                  <Text style={[styles.optionText, { color: isSelected ? theme.background : theme.text }]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Chọn số lượng */}
          <View style={styles.qtyRow}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQuantity('minus')}>
              <Ionicons name="remove" size={20} color={theme.text} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => handleQuantity('plus')}>
              <Ionicons name="add" size={20} color={theme.text} />
            </TouchableOpacity>
            {selectedVariant && (
              <Text style={{ marginLeft: 'auto', color: theme.text1, fontSize: 13 }}>
                Kho: {selectedVariant.stockQuantity}
              </Text>
            )}
          </View>

          {/* Phần đánh giá */}
          <View style={styles.divider} />
          <Text style={[styles.sectionTitle, { fontSize: 18 }]}>Đánh giá sản phẩm</Text>
          
          {reviewsData.reviews.length === 0 ? (
            <Text style={{ color: theme.text1 }}>Chưa có đánh giá nào.</Text>
          ) : (
            reviewsData.reviews.map((review) => {
              const date = new Date(review.createdAt);
              const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
              
              return (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewAuthor}>{review.userName}</Text>
                    <Text style={styles.reviewDate}>{formattedDate}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>{renderStars(review.rating)}</View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                </View>
              );
            })
          )}
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* Thanh công cụ dưới cùng */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.actionBtn, styles.btnOutline]} onPress={handleAddToCart} activeOpacity={0.8}>
          <Text style={[styles.btnText, { color: theme.text }]}>Thêm vào giỏ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.btnSolid]} onPress={handleBuyNow} activeOpacity={0.8}>
          <Text style={[styles.btnText, { color: theme.background }]}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;