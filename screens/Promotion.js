import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { usePromotions } from '../services/hooks';
import ButtonGoBack from '../components/ButtonGoBack';

const PromotionScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { promotions, loading, error, refetch } = usePromotions();
  const voucherList = promotions || [];

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const handleCopyCode = (code) => {
    Alert.alert('Thành công', `Đã sao chép mã: ${code}`);
  };

  const renderVoucher = ({ item }) => {
    const discountText = item.type === 'FixedAmount' 
        ? `${item.value / 1000}K` 
        : `${item.value}%`;

    return (
      <View style={styles.voucherCard}>
        <View style={styles.voucherLeft}>
          <Text style={styles.discountText}>{discountText}</Text>
          <Text style={styles.discountType}>GIẢM GIÁ</Text>
        </View>
        <View style={styles.dashedLineContainer}>
            {Array.from({ length: 15 }).map((_, i) => (
                <View key={i} style={styles.dash} />
            ))}
        </View>

        <View style={styles.voucherRight}>
          <Text style={styles.voucherTitle}>{item.title}</Text>
          <Text style={styles.voucherDesc}>{item.description}</Text>
          
          <View style={styles.actionRow}>
            <TouchableOpacity onPress={() => handleCopyCode(item.title)}>
                <Text style={styles.codeText}>Sao chép mã</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.useBtn} onPress={() => navigation.navigate('Cart')}>
              <Text style={styles.useBtnText}>Dùng ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.text} />
          <Text style={{ marginTop: 10, color: theme.text1 }}>Đang tải mã giảm giá...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={{ marginTop: 50, alignItems: 'center' }}>
          <Text style={{ color: '#EF4444', marginBottom: 10 }}>Lỗi tải dữ liệu</Text>
          <TouchableOpacity onPress={refetch} style={{ padding: 10, backgroundColor: theme.text, borderRadius: 8 }}>
            <Text style={{ color: theme.background }}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={{ marginTop: 50, alignItems: 'center' }}>
        <Text style={{ color: theme.text1 }}>Hiện tại chưa có mã giảm giá nào.</Text>
      </View>
    );
  };

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text, textTransform: 'uppercase' },
    listContent: { padding: 20, paddingBottom: 40 },
    
    voucherCard: { flexDirection: 'row', backgroundColor: theme.mode === 'light' ? '#fff' : theme.background2, borderRadius: 12, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, borderWidth: 1, borderColor: theme.background1 },
    
    voucherLeft: { backgroundColor: theme.text, width: 100, justifyContent: 'center', alignItems: 'center', padding: 15, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 },
    discountText: { color: theme.background, fontSize: 24, fontWeight: '900' },
    discountType: { color: theme.background, fontSize: 11, fontWeight: 'bold', marginTop: 4, opacity: 0.9 },
    
    dashedLineContainer: { width: 2, paddingVertical: 10, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: theme.text },
    dash: { width: 2, height: 4, backgroundColor: theme.background },
    
    voucherRight: { flex: 1, padding: 16, justifyContent: 'center', borderTopRightRadius: 12, borderBottomRightRadius: 12 },
    voucherTitle: { fontSize: 16, fontWeight: 'bold', color: theme.text, marginBottom: 6 },
    voucherDesc: { fontSize: 13, color: theme.text1, marginBottom: 15, lineHeight: 18 },
    
    actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    codeText: { fontSize: 12, fontWeight: 'bold', color: theme.text, textDecorationLine: 'underline' },
    
    useBtn: { backgroundColor: '#EF4444', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
    useBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
  }), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle}>Mã giảm giá</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={voucherList}
        keyExtractor={(item, index) => (item?.id != null ? item.id.toString() : index.toString())}
        renderItem={renderVoucher}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} colors={[theme.text]} tintColor={theme.text} />
        }
      />
    </View>
  );
};

export default PromotionScreen;