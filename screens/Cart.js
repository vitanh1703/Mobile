import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { cartApi } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather as Icon } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import ButtonGoBack from '../components/ButtonGoBack';

const { width } = Dimensions.get('window');

export default function CartScreen({ navigation }) {
  const { theme } = useTheme();
  const { cart = [], setCart } = useCart();
  const [loading, setLoading] = useState(true);

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (!userStr) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(userStr);
        const data = await cartApi.get(user.id);

        const items = data?.items || [];

        const mapped = items.map((item) => ({
          id: item.id ?? item.Id,
          name: item.productName,
          qty: item.quantity,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color,
          desc: `${item.size || ''} ${item.color || ''}`,
        }));

        setCart(mapped);
      } catch (err) {
        console.log('Cart load error:', err);
        setCart([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  /* ================= UPDATE QTY ================= */
  const updateQty = async (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    const newQty = (Number(item.qty) || 0) + delta;

    if (newQty <= 0) {
      return removeItem(id);
    }

    try {
      await cartApi.update(id, newQty);

      setCart((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, qty: newQty } : i
        )
      );
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể cập nhật số lượng');
    }
  };

  /* ================= INPUT ================= */
  const handleQtyInput = (id, text) => {
    if (/^\d*$/.test(text)) {
      setCart((prev) =>
        prev.map((i) =>
          i.id === id
            ? { ...i, qty: text === '' ? '' : Number(text) }
            : i
        )
      );
    }
  };

  const handleQtyBlur = async (id, text) => {
    const num = parseInt(text, 10);

    if (!text || text === '' || isNaN(num) || num < 1) {
      return removeItem(id);
    }

    try {
      await cartApi.update(id, num);

      setCart((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, qty: num } : i
        )
      );
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể đồng bộ số lượng');
    }
  };

  /* ================= REMOVE ================= */
  const removeItem = async (id) => {
    try {
      await cartApi.remove(id);
      setCart((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể xoá sản phẩm');
    }
  };

  /* ================= TOTAL ================= */
  const orderAmount = cart.reduce(
    (s, i) => s + i.price * (Number(i.qty) || 0),
    0
  );

  const tax = orderAmount > 0 ? 3 : 0;
  const discount = 0;
  const total = orderAmount + tax - discount;

  /* ================= STYLE ================= */
  const styles = useMemo(
    () =>
      StyleSheet.create({
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

        cartItem: {
          backgroundColor:
            theme.mode === 'light'
              ? '#F8F9FA'
              : theme.background2,
          borderRadius: 16,
          flexDirection: 'row',
          padding: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: theme.background1,
        },

        itemImg: {
          width: 80,
          height: 100,
          borderRadius: 12,
          marginRight: 15,
        },

        itemName: {
          fontWeight: 'bold',
          fontSize: 15,
          color: theme.text,
        },

        itemDesc: {
          color: theme.text1,
          fontSize: 12,
          marginBottom: 8,
        },

        priceRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },

        itemPrice: {
          color: '#FE552A',
          fontWeight: 'bold',
        },

        qtyBox: {
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
          width: 40,
          textAlign: 'center',
          color: theme.text,
        },

        checkoutBtn: {
          backgroundColor: theme.text,
          padding: 16,
          borderRadius: 12,
          alignItems: 'center',
          marginTop: 15,
        },

        checkoutText: {
          color: theme.background,
          fontWeight: 'bold',
        },

        deleteAction: {
          backgroundColor: '#FF6B6B',
          justifyContent: 'center',
          alignItems: 'center',
          width: 70,
          borderRadius: 16,
          marginLeft: 10,
        },
      }),
    [theme]
  );

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={theme.text}
        style={{ marginTop: 50 }}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerText}>Giỏ hàng</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {cart.length === 0 ? (
          <Text style={{ textAlign: 'center', color: theme.text1 }}>
            Giỏ hàng trống
          </Text>
        ) : (
          <>
            {cart.map((item) => (
              <Swipeable
                key={item.id}
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
                  <Image source={{ uri: item.image }} style={styles.itemImg} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDesc}>{item.desc}</Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.itemPrice}>
                        {Number(item.price).toLocaleString()}đ
                      </Text>

                      <View style={styles.qtyBox}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQty(item.id, -1)}
                        >
                          <Icon name="minus" size={16} />
                        </TouchableOpacity>

                        <TextInput
                          style={styles.qtyInput}
                          value={String(item.qty)}
                          keyboardType="number-pad"
                          onChangeText={(t) =>
                            handleQtyInput(item.id, t)
                          }
                          onBlur={() =>
                            handleQtyBlur(item.id, item.qty)
                          }
                        />

                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => updateQty(item.id, 1)}
                        >
                          <Icon name="plus" size={16} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Swipeable>
            ))}

            {/* TOTAL */}
            <Text style={{ color: theme.text, marginTop: 10 }}>
              Tổng: {total.toLocaleString()}đ
            </Text>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() =>
                navigation.navigate('Checkout', {
                  selectedItems: cart,
                  totalFromCart: total,
                })
              }
            >
              <Text style={styles.checkoutText}>Thanh toán</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}