import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();

  // Lấy dữ liệu từ màn hình Giỏ hàng truyền sang
  const { selectedItems = [], totalFromCart = 0 } = route.params || {};

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('bank'); // bank | vnpay | cod

  const shippingCost = 0;
  const totalAfterDiscount = Math.max(0, totalFromCart - discountAmount + shippingCost);

  // Hàm giả lập áp dụng mã giảm giá
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã giảm giá.');
      return;
    }
    
    // Giả lập logic kiểm tra mã
    if (code === 'WELCOME2026') {
      setDiscountAmount(50000);
      Alert.alert('Thành công', 'Áp dụng mã giảm giá 50.000đ thành công!');
    } else if (code === 'FREESHIP') {
      setDiscountAmount(30000);
      Alert.alert('Thành công', 'Áp dụng mã giảm giá 30.000đ thành công!');
    } else {
      setDiscountAmount(0);
      Alert.alert('Lỗi', 'Mã giảm giá không hợp lệ hoặc đã hết hạn.');
    }
  };

  // Hàm xử lý khi nhấn "Hoàn tất thanh toán"
  const handlePlaceOrder = () => {
    if (!selectedItems || selectedItems.length === 0) {
      Alert.alert('Lỗi', 'Không có sản phẩm nào để thanh toán.');
      return;
    }

    if (!form.fullName || !form.email || !form.phone || !form.address) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    const orderCode = 'ORD-' + Math.floor(Math.random() * 1000000);

    if (paymentMethod === 'bank') {
      // Chuyển sang màn hình quét QR thanh toán
      navigation.navigate('Payment', {
        checkoutData: {
          orderCode: orderCode,
          id: orderCode,
          items: selectedItems
        },
        totalAmount: totalAfterDiscount,
        form
      });
    } else if (paymentMethod === 'cod') {
      // Thanh toán khi nhận hàng
      Alert.alert('Thành công', `Đã tạo đơn hàng thành công! Mã đơn: ${orderCode}. Cảm ơn bạn.`, [
        { text: 'Về trang chủ', onPress: () => navigation.navigate('HomeTab') }
      ]);
    } else {
      // VNPay (chưa hỗ trợ thực tế trong bản demo này)
      Alert.alert('Thông báo', 'Phương thức thanh toán VNPay đang được phát triển, vui lòng chọn phương thức khác!');
    }
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text, textTransform: 'uppercase' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginTop: 20, marginBottom: 15 },
    card: { backgroundColor: theme.mode === 'light' ? '#fff' : theme.background2, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: theme.background1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 13, fontWeight: '600', color: theme.text, marginBottom: 8 },
    required: { color: '#EF4444' },
    input: { borderWidth: 1, borderColor: theme.background1, borderRadius: 10, padding: 12, fontSize: 15, color: theme.text, backgroundColor: theme.mode === 'light' ? '#F9FAFB' : theme.background },
    
    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
    itemImage: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
    itemInfo: { flex: 1 },
    itemName: { fontWeight: 'bold', color: theme.text, fontSize: 14, marginBottom: 4 },
    itemMeta: { color: theme.text1, fontSize: 12, marginBottom: 4 },
    itemPriceWrap: { alignItems: 'flex-end' },
    itemPrice: { fontWeight: 'bold', color: theme.text, fontSize: 14 },
    itemUnit: { color: theme.text1, fontSize: 11 },

    promoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    promoInput: { flex: 1, borderWidth: 1, borderColor: theme.background1, borderRadius: 10, padding: 12, fontSize: 14, color: theme.text, backgroundColor: theme.mode === 'light' ? '#F9FAFB' : theme.background },
    promoBtn: { backgroundColor: theme.text, paddingHorizontal: 20, paddingVertical: 14, borderRadius: 10, justifyContent: 'center' },
    promoBtnText: { color: theme.background, fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
    promoActiveBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ECFDF5', borderColor: '#A7F3D0', borderWidth: 1, padding: 12, borderRadius: 10, marginTop: 10 },
    promoActiveText: { color: '#065F46', fontWeight: 'bold', fontSize: 13 },
    
    paymentOption: { flexDirection: 'row', alignItems: 'center', padding: 15, borderWidth: 1, borderColor: theme.background1, borderRadius: 12, marginBottom: 10 },
    paymentOptionActive: { borderColor: theme.text, backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2 },
    paymentTextWrap: { flex: 1, marginLeft: 15 },
    paymentTitle: { fontSize: 15, fontWeight: 'bold', color: theme.text },
    paymentDesc: { fontSize: 12, color: theme.text1, marginTop: 4 },

    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    summaryLabel: { color: theme.text1, fontSize: 14 },
    summaryValue: { color: theme.text, fontSize: 14, fontWeight: '600' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: theme.background1 },
    totalLabel: { fontWeight: 'bold', color: theme.text, fontSize: 16, textTransform: 'uppercase' },
    totalValue: { fontWeight: '900', color: '#EF4444', fontSize: 20 },

    checkoutBtn: { backgroundColor: theme.text, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 20 },
    checkoutText: { color: theme.background, fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 },
  }), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Thông tin người đặt */}
        <Text style={styles.sectionTitle}>Thông tin người đặt</Text>
        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} value={form.fullName} onChangeText={t => setForm({...form, fullName: t})} placeholder="Nhập họ và tên" placeholderTextColor={theme.text1} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} value={form.email} onChangeText={t => setForm({...form, email: t})} placeholder="Nhập địa chỉ email" keyboardType="email-address" placeholderTextColor={theme.text1} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} value={form.phone} onChangeText={t => setForm({...form, phone: t})} placeholder="Nhập số điện thoại" keyboardType="phone-pad" placeholderTextColor={theme.text1} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ giao hàng <Text style={styles.required}>*</Text></Text>
            <TextInput style={styles.input} value={form.address} onChangeText={t => setForm({...form, address: t})} placeholder="Nhập địa chỉ nhận hàng chi tiết" placeholderTextColor={theme.text1} />
          </View>
        </View>

        {/* Sản phẩm trong đơn */}
        <Text style={styles.sectionTitle}>Sản phẩm trong đơn</Text>
        <View style={styles.card}>
          {selectedItems.map((item, index) => (
            <View key={item.id || index} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.productName}</Text>
                <Text style={styles.itemMeta}>Size: {item.size} | SL: {item.quantity}</Text>
              </View>
              <View style={styles.itemPriceWrap}>
                <Text style={styles.itemPrice}>{(item.total || 0).toLocaleString('vi-VN')}đ</Text>
                <Text style={styles.itemUnit}>{(item.price || 0).toLocaleString('vi-VN')}đ / cái</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Mã giảm giá */}
        <Text style={styles.sectionTitle}>Mã giảm giá</Text>
        <View style={styles.card}>
          <View style={styles.promoRow}>
            <TextInput
              style={styles.promoInput}
              placeholder="Nhập mã giảm giá..."
              placeholderTextColor={theme.text1}
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity style={styles.promoBtn} onPress={handleApplyPromo} activeOpacity={0.8}>
              <Text style={styles.promoBtnText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>
          {discountAmount > 0 && (
             <View style={styles.promoActiveBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Feather name="check-circle" size={16} color="#065F46" style={{ marginRight: 6 }} />
                  <Text style={styles.promoActiveText}>Đã giảm {discountAmount.toLocaleString('vi-VN')}đ</Text>
                </View>
                <TouchableOpacity onPress={() => { setDiscountAmount(0); setPromoCode(''); }}>
                   <Feather name="x" size={18} color="#065F46" />
                </TouchableOpacity>
             </View>
          )}
        </View>

        {/* Phương thức thanh toán */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={styles.card}>
          <TouchableOpacity style={[styles.paymentOption, paymentMethod === 'bank' && styles.paymentOptionActive]} onPress={() => setPaymentMethod('bank')} activeOpacity={0.8}>
            <Feather name="credit-card" size={24} color={paymentMethod === 'bank' ? theme.text : theme.text1} />
            <View style={styles.paymentTextWrap}>
              <Text style={styles.paymentTitle}>Chuyển khoản (Mã QR)</Text>
              <Text style={styles.paymentDesc}>Quét mã QR qua ứng dụng ngân hàng</Text>
            </View>
            <Feather name={paymentMethod === 'bank' ? "check-circle" : "circle"} size={20} color={paymentMethod === 'bank' ? "#10B981" : theme.background1} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.paymentOption, paymentMethod === 'vnpay' && styles.paymentOptionActive]} onPress={() => setPaymentMethod('vnpay')} activeOpacity={0.8}>
            <Feather name="smartphone" size={24} color={paymentMethod === 'vnpay' ? theme.text : theme.text1} />
            <View style={styles.paymentTextWrap}>
              <Text style={styles.paymentTitle}>Thanh toán VNPay</Text>
              <Text style={styles.paymentDesc}>Cổng thanh toán an toàn VNPay</Text>
            </View>
            <Feather name={paymentMethod === 'vnpay' ? "check-circle" : "circle"} size={20} color={paymentMethod === 'vnpay' ? "#10B981" : theme.background1} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.paymentOption, paymentMethod === 'cod' && styles.paymentOptionActive]} onPress={() => setPaymentMethod('cod')} activeOpacity={0.8}>
            <Feather name="truck" size={24} color={paymentMethod === 'cod' ? theme.text : theme.text1} />
            <View style={styles.paymentTextWrap}>
              <Text style={styles.paymentTitle}>Thanh toán khi nhận hàng</Text>
              <Text style={styles.paymentDesc}>Thanh toán trực tiếp cho shipper</Text>
            </View>
            <Feather name={paymentMethod === 'cod' ? "check-circle" : "circle"} size={20} color={paymentMethod === 'cod' ? "#10B981" : theme.background1} />
          </TouchableOpacity>
        </View>

        {/* Tổng đơn hàng */}
        <View style={styles.card}>
          <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Tổng đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tạm tính</Text>
            <Text style={styles.summaryValue}>{totalFromCart.toLocaleString('vi-VN')}đ</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí vận chuyển</Text>
            <Text style={styles.summaryValue}>{shippingCost === 0 ? 'Miễn phí' : `${shippingCost.toLocaleString('vi-VN')}đ`}</Text>
          </View>
          {discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: '#10B981' }]}>Giảm giá</Text>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>-{discountAmount.toLocaleString('vi-VN')}đ</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Thanh toán</Text>
            <Text style={styles.totalValue}>{totalAfterDiscount.toLocaleString('vi-VN')}đ</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutBtn} onPress={handlePlaceOrder} activeOpacity={0.8}>
          <Text style={styles.checkoutText}>Hoàn tất đơn hàng</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;