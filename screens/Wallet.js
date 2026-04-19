import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';

const mockTransactions = [
  { id: '1', type: 'deposit', amount: 500000, title: 'Nạp tiền từ ngân hàng', date: '19/04/2026 10:30', isPositive: true },
  { id: '2', type: 'payment', amount: -250000, title: 'Thanh toán đơn hàng ORD-123456', date: '18/04/2026 15:45', isPositive: false },
  { id: '3', type: 'refund', amount: 100000, title: 'Hoàn tiền đơn hàng ORD-098765', date: '15/04/2026 09:12', isPositive: true },
  { id: '4', type: 'withdraw', amount: -200000, title: 'Rút tiền về ngân hàng', date: '10/04/2026 14:20', isPositive: false },
];

const WalletScreen = () => {
  const { theme } = useTheme();

  const balance = 1250000;

  const styles = useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: theme.text, textTransform: 'uppercase' },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

    card: { backgroundColor: theme.text, borderRadius: 16, padding: 24, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    cardLabel: { color: theme.background, fontSize: 14, opacity: 0.8, marginBottom: 8 },
    cardBalance: { color: theme.background, fontSize: 32, fontWeight: '900', marginBottom: 20 },
    cardActions: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 20 },
    actionBtn: { alignItems: 'center', flex: 1 },
    actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    actionText: { color: theme.background, fontSize: 12, fontWeight: '600' },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 15 },

    txItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: theme.background1 },
    txIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    txInfo: { flex: 1 },
    txTitle: { fontSize: 14, fontWeight: 'bold', color: theme.text, marginBottom: 4 },
    txDate: { fontSize: 12, color: theme.text1 },
    txAmount: { fontSize: 15, fontWeight: 'bold' },
  }), [theme]);

  const renderTxIcon = (type) => {
    switch(type) {
        case 'deposit': return <Feather name="arrow-down-left" size={20} color="#10B981" />;
        case 'payment': return <Feather name="shopping-bag" size={20} color="#EF4444" />;
        case 'refund': return <Feather name="refresh-cw" size={20} color="#10B981" />;
        case 'withdraw': return <Feather name="arrow-up-right" size={20} color="#F59E0B" />;
        default: return <Feather name="dollar-sign" size={20} color={theme.text} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle}>Ví H&Q</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Wallet Card */}
        <View style={styles.card}>
            <Text style={styles.cardLabel}>Số dư hiện tại</Text>
            <Text style={styles.cardBalance}>{balance.toLocaleString('vi-VN')} đ</Text>
            <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn}>
                    <View style={styles.actionIcon}><Feather name="plus" size={20} color={theme.background} /></View>
                    <Text style={styles.actionText}>Nạp tiền</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <View style={styles.actionIcon}><Feather name="arrow-up-right" size={20} color={theme.background} /></View>
                    <Text style={styles.actionText}>Rút tiền</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                    <View style={styles.actionIcon}><Feather name="send" size={20} color={theme.background} /></View>
                    <Text style={styles.actionText}>Chuyển</Text>
                </TouchableOpacity>
            </View>
        </View>

        {/* Transactions */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
            <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Lịch sử giao dịch</Text>
            <TouchableOpacity>
              <Text style={{ color: theme.text1, fontSize: 13 }}>Xem tất cả</Text>
            </TouchableOpacity>
        </View>

        {mockTransactions.map((tx) => (
            <View key={tx.id} style={styles.txItem}>
                <View style={[
                  styles.txIconWrap, 
                  { backgroundColor: tx.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)' }
                ]}>
                    {renderTxIcon(tx.type)}
                </View>
                <View style={styles.txInfo}>
                    <Text style={styles.txTitle} numberOfLines={1}>{tx.title}</Text>
                    <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text style={[styles.txAmount, { color: tx.isPositive ? '#10B981' : theme.text }]}>
                    {tx.isPositive ? '+' : ''}{tx.amount.toLocaleString('vi-VN')} đ
                </Text>
            </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;