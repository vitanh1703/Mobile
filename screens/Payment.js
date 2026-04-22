import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();

  const [timeLeft, setTimeLeft] = useState(600); 

  const { 
    checkoutData = {
        orderCode: 'ORD123456',
        items: [
            { id: 1, productName: 'Sản phẩm mẫu', size: 'M', color: '', quantity: 1, total: 200000, image: 'https://via.placeholder.com/150' }
        ]
    }, 
    totalAmount = 200000, 
    form = { fullName: 'Nguyễn Văn A', email: 'test@gmail.com', phone: '0123456789', address: 'Hà Nội' } 
  } = route.params || {};

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
  };

  const bookingId = checkoutData?.orderCode || checkoutData?.id?.toString() || "ORD12345";
  const bankAccount = "8860382942";
  const accountName = "DIEM VIET ANH";
  const bankId = "BIDV";
  
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${bankAccount}-compact2.png?amount=${totalAmount}&addInfo=${bookingId}%20${form.phone}&accountName=${encodeURIComponent(accountName)}`;

  const copyToClipboard = () => {
    Alert.alert("Thành công", "Đã sao chép số tài khoản!");
  };

  const handleFinish = () => {
    Alert.alert("Cảm ơn bạn!", "Đơn hàng sẽ được xử lý sau khi chúng tôi xác nhận thanh toán.", [
        { 
          text: "Về trang chủ", 
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'App' }]
          }) 
        }
    ]);
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text, textTransform: 'uppercase' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
    timerBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, alignSelf: 'center', marginBottom: 5 },
    timerText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16, marginLeft: 6 },
    warningText: { textAlign: 'center', color: theme.text1, fontSize: 12, marginBottom: 20 },
    card: { backgroundColor: theme.mode === 'light' ? '#fff' : theme.background2, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: theme.background1, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: theme.text, textTransform: 'uppercase', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: theme.background1, paddingBottom: 10 },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    label: { color: theme.text1, fontSize: 14 },
    valueBold: { fontWeight: 'bold', fontSize: 16, color: theme.text },
    itemRow: { flexDirection: 'row', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: theme.background1, paddingBottom: 15 },
    itemImage: { width: 60, height: 80, borderRadius: 8, marginRight: 15 },
    itemInfo: { flex: 1, justifyContent: 'center' },
    itemName: { fontWeight: 'bold', color: theme.text, fontSize: 14, marginBottom: 6 },
    itemMeta: { color: theme.text1, fontSize: 12, marginBottom: 6 },
    itemPrice: { fontWeight: 'bold', color: theme.text, fontSize: 14 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
    totalLabel: { fontWeight: 'bold', color: theme.text, fontSize: 16 },
    totalValue: { fontWeight: '900', color: '#EF4444', fontSize: 20 },
    infoRow: { flexDirection: 'row', marginBottom: 10 },
    infoLabel: { width: 100, color: theme.text1, fontSize: 14 },
    infoValue: { flex: 1, fontWeight: '500', color: theme.text, fontSize: 14 },
    qrContainer: { alignItems: 'center', marginBottom: 20 },
    qrImageWrapper: { padding: 10, backgroundColor: '#fff', borderRadius: 16, borderWidth: 2, borderColor: '#000' },
    qrImage: { width: 200, height: 200, resizeMode: 'contain' },
    bankInfoBox: { backgroundColor: theme.mode === 'light' ? '#F9FAFB' : theme.background, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: theme.background1, marginBottom: 20 },
    bankRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    bankRowDivider: { borderTopWidth: 1, borderTopColor: theme.background1, paddingTop: 12, alignItems: 'flex-start' },
    bankLabel: { color: theme.text1, fontSize: 13 },
    bankValue: { fontWeight: 'bold', color: theme.text, fontSize: 14 },
    bankContentValue: { fontWeight: 'bold', color: theme.text, fontSize: 14, flex: 1, textAlign: 'right', marginLeft: 20 },
    copyBtn: { marginLeft: 8, padding: 4 },
    finishBtn: { backgroundColor: theme.text, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 12, marginTop: 10 },
    finishBtnText: { color: theme.background, fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase', letterSpacing: 1, marginLeft: 8 }
  }), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.timerBox}>
          <Feather name="clock" size={18} color="#EF4444" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
        <Text style={styles.warningText}>Đơn hàng sẽ tự động hủy nếu không thanh toán trong thời gian quy định.</Text>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin đơn hàng</Text>
            <View style={styles.rowBetween}>
                <Text style={styles.label}>Mã đơn hàng</Text>
                <Text style={styles.valueBold}>{bookingId}</Text>
            </View>

            {checkoutData?.items?.map((item, index) => (
                <View key={item.id || index} style={styles.itemRow}>
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemName} numberOfLines={2}>{item.productName}</Text>
                        <Text style={styles.itemMeta}>
                            Size: {item.size} {item.color ? ` | Màu: ${item.color}` : ''} | SL: {item.quantity}
                        </Text>
                        <Text style={styles.itemPrice}>{(item.total || 0).toLocaleString('vi-VN')} đ</Text>
                    </View>
                </View>
            ))}

            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                <Text style={styles.totalValue}>{totalAmount.toLocaleString('vi-VN')} đ</Text>
            </View>
        </View>

        <View style={styles.card}>
            <Text style={styles.cardTitle}>Thông tin nhận hàng</Text>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Người nhận</Text>
                <Text style={styles.infoValue}>{form.fullName}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Số điện thoại</Text>
                <Text style={styles.infoValue}>{form.phone}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{form.email}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Địa chỉ</Text>
                <Text style={styles.infoValue}>{form.address}</Text>
            </View>
        </View>

        <View style={styles.card}>
            <Text style={[styles.cardTitle, { textAlign: 'center', borderBottomWidth: 0 }]}>Quét mã QR để thanh toán</Text>
            
            <View style={styles.qrContainer}>
                <View style={styles.qrImageWrapper}>
                    <Image source={{ uri: qrUrl }} style={styles.qrImage} />
                </View>
            </View>

            <View style={styles.bankInfoBox}>
                <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Ngân hàng</Text>
                    <Text style={styles.bankValue}>{bankId}</Text>
                </View>
                <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Số tài khoản</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={[styles.bankValue, { fontSize: 16 }]}>{bankAccount}</Text>
                        <TouchableOpacity onPress={copyToClipboard} style={styles.copyBtn}>
                            <Feather name="copy" size={16} color="#2563EB" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Chủ tài khoản</Text>
                    <Text style={styles.bankValue}>{accountName}</Text>
                </View>
                <View style={styles.bankRow}>
                    <Text style={styles.bankLabel}>Số tiền</Text>
                    <Text style={styles.bankValue}>{totalAmount.toLocaleString('vi-VN')} VNĐ</Text>
                </View>
                <View style={[styles.bankRow, styles.bankRowDivider]}>
                    <Text style={styles.bankLabel}>Nội dung CK</Text>
                    <Text style={styles.bankContentValue}>{bookingId} {form.phone}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.finishBtn} onPress={handleFinish} activeOpacity={0.8}>
                <Feather name="shopping-bag" size={20} color={theme.background} />
                <Text style={styles.finishBtnText}>Tôi đã thanh toán</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentScreen;