import React, { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Feather as Icon } from '@expo/vector-icons';
import { Swipeable, ScrollView } from 'react-native-gesture-handler';
import ButtonGoBack from '../components/ButtonGoBack';
import { cartApi } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function CartScreen({ navigation }) {
  const { theme } = useTheme();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [])
  );

  const fetchCart = async () => {
    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) {
        setLoading(false);
        return;
      }
      const user = JSON.parse(userStr);
      const data = await cartApi.get(user.id);
      
      // Backend trả về object { cartId: ..., items: [...] }
      const items = data?.items || data?.Items || (Array.isArray(data) ? data : []);
      
      const formattedCart = items.map(item => ({
        id: item.id || item.Id,
        variantId: item.variantId || item.VariantId,
        name: item.productName || item.ProductName || 'Sản phẩm',
        desc: `Màu: ${item.color || item.Color || ''} - Size: ${item.size || item.Size || ''}`,
        price: item.price || item.Price || 0,
        qty: item.quantity || item.Quantity || 1,
        image: item.image || item.Image || 'https://via.placeholder.com/150',
        size: item.size || item.Size || 'M',
        color: item.color || item.Color || ''
      }));
      
      setCart(formattedCart);
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tăng/giảm số lượng
  const updateQty = async (id, delta) => {
    const itemIndex = cart.findIndex(i => i.id === id);
    if (itemIndex === -1) return;
    const item = cart[itemIndex];
    const newQty = (Number(item.qty) || 0) + delta;
    if (newQty < 1) return;

    const newCart = [...cart];
    newCart[itemIndex] = { ...item, qty: newQty };
    setCart(newCart);

    try {
      await cartApi.update(id, newQty);
    } catch (error) {
      newCart[itemIndex] = { ...item, qty: item.qty };
      setCart([...newCart]);
      Alert.alert("Lỗi", "Không thể cập nhật số lượng.");
    }
  };

  // Xử lý nhập số lượng
  const handleQtyInput = (id, text) => {
    if (/^\d*$/.test(text)) {
      setCart((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, qty: text } : item
        )
      );
    }
  };

  // Xử lý khi input mất focus để xác thực số lượng
  const handleQtyBlur = async (id, text) => {
    let num = parseInt(text, 10);
    if (isNaN(num) || num < 1) {
      removeItem(id);
    } else {
      try {
        await cartApi.update(id, num);
        fetchCart();
      } catch (error) {
        Alert.alert("Lỗi", "Không thể cập nhật số lượng.");
        fetchCart();
      }
    }
  };

  // Xoá sản phẩm khỏi giỏ hàng
  const removeItem = async (id) => {
    try {
      await cartApi.remove(id);
      setCart((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      Alert.alert("Lỗi", "Không thể xóa sản phẩm khỏi giỏ hàng.");
    }
  };

  // Tính tổng
  const orderAmount = cart.reduce((sum, item) => sum + item.price * (Number(item.qty) || 0), 0);
  const tax = orderAmount > 0 ? orderAmount * 0.08 : 0; // Tính thuế 8%
  const discount = 0;
  const total = orderAmount > 0 ? orderAmount + tax - discount : 0;

  // Styles
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: width * 0.05,
      paddingTop: 30,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 18,
    },
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.text,
      flex: 1,
      textAlign: 'center',
    },
    swipeableContainer: {
      marginBottom: 16,
    },
    cartItem: {
      backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2,
      borderRadius: 16,
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderWidth: 1,
      borderColor: theme.background1,
    },
    itemImg: {
      width: 80,
      height: 100,
      borderRadius: 12,
      marginRight: 15,
      resizeMode: 'cover',
    },
    itemInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    titleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    itemName: {
      fontWeight: 'bold',
      fontSize: 15,
      color: theme.text,
      flex: 1,
    },
    itemDesc: {
      color: theme.text1,
      fontSize: 12,
      marginTop: 4,
      marginBottom: 8,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemPrice: {
      color: '#FE552A',
      fontWeight: 'bold',
      fontSize: 16,
    },
    itemQtyBox: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    qtyBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.background1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    qtyInput: {
      width: 36,
      height: 28,
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 15,
      color: theme.text,
      padding: 0,
    },
    summary: {
      marginTop: 10,
      marginBottom: 18,
      backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.background1,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    summaryLabel: {
      color: theme.text1,
      fontSize: 14,
      fontWeight: '500',
    },
    summaryValue: {
      color: theme.text,
      fontWeight: 'bold',
      fontSize: 14,
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.background1,
      paddingTop: 16,
    },
    totalLabel: {
      fontWeight: 'bold',
      fontSize: 16,
      color: theme.text,
      textTransform: 'uppercase',
    },
    totalValue: {
      fontWeight: '900',
      fontSize: 18,
      color: '#FE552A',
    },
    checkoutBtn: {
      backgroundColor: theme.text,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 20,
    },
    checkoutText: {
      color: theme.background,
      fontWeight: 'bold',
      fontSize: 16,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    deleteAction: {
      backgroundColor: '#FF6B6B',
      justifyContent: 'center',
      alignItems: 'center',
      width: 70,
      borderRadius: 16,
      marginLeft: 10,
    },
  }), [theme, width]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerText}>Giỏ hàng</Text>
        <View style={{ width: 32 }} />
      </View>
      <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
        {cart.length} Món
      </Text>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.text} style={{ marginTop: 50 }} />
        ) : cart.length === 0 ? (
          <Text style={{ color: theme.text1 || '#888', textAlign: 'center', marginTop: 40, fontSize: 16 }}>
            Giỏ hàng của bạn đang trống.
          </Text>
        ) : (
          <View>
            {cart.map((item) => (
              <View key={item.id} style={styles.swipeableContainer}>
                <Swipeable
                  renderRightActions={() => (
                    <TouchableOpacity
                      style={styles.deleteAction}
                      onPress={() => removeItem(item.id)}
                    >
                      <Icon name="trash-2" size={24} color="#fff" />
                    </TouchableOpacity>
                  )}
                >
                  <View style={styles.cartItem}>
                    <Image
                      source={{ uri: item.image || 'https://via.placeholder.com/150' }}
                      style={styles.itemImg}
                    />
                    <View style={styles.itemInfo}>
                      <View style={styles.titleRow}>
                        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                      </View>
                      <Text style={styles.itemDesc} numberOfLines={1}>{item.desc || 'Không có mô tả'}</Text>
                      
                  <View style={styles.priceRow}>
                    <Text style={styles.itemPrice}>{Number(item.price).toLocaleString('vi-VN')} đ</Text>
                    <View style={styles.itemQtyBox}>
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, -1)}>
                        <Icon name="minus" size={16} color={theme.text} />
                      </TouchableOpacity>
                      <TextInput
                        style={styles.qtyInput}
                        value={item.qty === undefined ? '' : String(item.qty)}
                        keyboardType="number-pad"
                        onChangeText={(text) => handleQtyInput(item.id, text)}
                        onBlur={() => handleQtyBlur(item.id, String(item.qty))}
                        placeholderTextColor={theme.text1}
                      />
                      <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(item.id, 1)}>
                        <Icon name="plus" size={16} color={theme.text} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
                </Swipeable>
              </View>
            ))}

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tổng đơn hàng</Text>
                <Text style={styles.summaryValue}>{orderAmount.toLocaleString('vi-VN')} đ</Text>
              </View>
              <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Thuế (8%)</Text>
                <Text style={styles.summaryValue}>{tax.toLocaleString('vi-VN')} đ</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Giảm giá</Text>
                <Text style={styles.summaryValue}>-{discount.toLocaleString('vi-VN')} đ</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng cộng</Text>
                <Text style={styles.totalValue}>{total.toLocaleString('vi-VN')} đ</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              activeOpacity={0.8}
              onPress={() => {
                navigation.navigate('Checkout', {
                  selectedItems: cart.map(item => ({
                    id: item.id,
                    variantId: item.variantId || item.id,
                    productName: item.name,
                    size: item.size || 'M',
                    color: item.color || '',
                    quantity: Number(item.qty) || 1,
                    price: item.price,
                    total: item.price * (Number(item.qty) || 1),
                    image: item.image
                  })),
                  totalFromCart: orderAmount
                });
              }}
            >
              <Text style={styles.checkoutText}>Thanh toán ngay</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}