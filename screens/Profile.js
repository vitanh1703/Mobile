import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Feather as Icon, MaterialIcons as MaterialIcon } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userApi, orderApi } from '../services/api';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user: initialUser } = route?.params || {};
  const { theme } = useTheme();

  const [user, setUser] = useState(initialUser || {});

  // Edit profile state
  const [fullName, setFullName] = useState(user?.fullName || `${user?.firstname || ''} ${user?.lastname || ''}`.trim());
  const [email, setEmail] = useState(user?.email || 'email@example.com');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const avatar = user?.avatarUrl || user?.AvatarUrl || user?.avatar_url || user?.avatar || 'https://i.pravatar.cc/150';

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        let currentUserId = user?.id || initialUser?.id;
        
        if (!currentUserId) {
          const userStr = await AsyncStorage.getItem('user');
          if (userStr) {
            const parsedUser = JSON.parse(userStr);
            currentUserId = parsedUser.id;
          }
        }

        if (!currentUserId) {
          setLoadingOrders(false);
          return;
        }

        // Kéo thông tin User mới nhất
        try {
          const latestUser = await userApi.getById(currentUserId);
          setUser((prev) => ({ ...prev, ...latestUser }));
          setFullName(latestUser.fullName || '');
          setEmail(latestUser.email || 'email@example.com');
          setPhone(latestUser.phone || '');
          setAddress(latestUser.address || '');
          await AsyncStorage.setItem('user', JSON.stringify(latestUser));
        } catch (error) {
          console.error("Lỗi khi tải thông tin user:", error);
        }

        // Kéo lịch sử mua hàng
        setLoadingOrders(true);
        try {
          const userOrders = await orderApi.getByUser(currentUserId);
          setOrders(Array.isArray(userOrders) ? userOrders : []);
        } catch (error) {
          console.error("Lỗi khi tải lịch sử mua hàng:", error);
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchData();
    }, [])
  );

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const res = await userApi.updateInfo(user.id, {
        FullName: fullName,
        Phone: phone,
        Address: address,
      });

      const updatedUser = res.user;

      // Update user state in the app and AsyncStorage
      const newUserState = { ...user, ...updatedUser };
      setUser(newUserState);
      setFullName(newUserState.fullName);
      setPhone(newUserState.phone);
      setAddress(newUserState.address);
      await AsyncStorage.setItem('user', JSON.stringify(newUserState));

      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      Alert.alert('Lỗi', error.response?.data?.message || 'Không thể cập nhật thông tin.');
    } finally {
      setLoading(false);
    }
  };

  // Sử dụng useMemo để ngăn việc tạo lại stylesheet không cần thiết khi re-render
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
    },
    headerRightBtn: {
      padding: 8,
    },
    profileHeader: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
    avatarContainer: { position: 'relative' },
    avatar: { width: 110, height: 110, borderRadius: 55, borderWidth: 2, borderColor: theme.background1 },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#000000', width: 34, height: 34, borderRadius: 17, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: theme.background },
    name: { fontSize: 24, fontWeight: 'bold', color: theme.text, marginTop: 15, textAlign: 'center' },
    joinedText: { fontSize: 14, color: theme.text1, marginTop: 4 },
    
    formContainer: { paddingHorizontal: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8, marginLeft: 4 },
    inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.background1, borderRadius: 12, paddingHorizontal: 15, backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2 },
    input: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, fontSize: 16, color: theme.text },
    
    saveButton: { backgroundColor: theme.text, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 15, marginBottom: 25 },
    saveButtonText: { color: theme.background, fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },

    // Order History
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 15, marginLeft: 4 },
    orderItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2,
      padding: 15,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.background1,
    },
    orderCode: { fontSize: 14, fontWeight: 'bold', color: theme.text, marginBottom: 4 },
    orderDate: { fontSize: 12, color: theme.text1 },
    orderTotal: { fontSize: 14, fontWeight: 'bold', color: '#EF4444', marginBottom: 4 },
    orderStatus: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      fontSize: 10,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      overflow: 'hidden',
      textAlign: 'center',
    },
  }), [theme]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return { backgroundColor: '#FEF3C7', color: '#92400E' };
      case 'Success':
        return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'Shipping':
        return { backgroundColor: '#DBEAFE', color: '#1E40AF' };
      case 'Cancel':
        return { backgroundColor: '#FEE2E2', color: '#991B1B' };
      default:
        return { backgroundColor: theme.background1, color: theme.text1 };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <TouchableOpacity style={styles.headerRightBtn} onPress={() => navigation.navigate('Settings')}>
          <Icon name="settings" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar & Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user.fullName || fullName || 'Khách hàng mới'}</Text>
          <Text style={styles.joinedText}>Thành viên H&Q Store</Text>
        </View>

        {/* Form Editable */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <View style={styles.inputBox}>
              <Icon name="user" size={20} color={theme.text1} />
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
                placeholderTextColor={theme.text1}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputBox}>
              <MaterialIcon name="email" size={20} color={theme.text1} />
              <TextInput
                style={[styles.input, { backgroundColor: theme.background1, color: theme.text1 }]}
                value={email}
                editable={false}
                placeholder="Nhập email"
                placeholderTextColor={theme.text1}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <View style={styles.inputBox}>
              <Icon name="phone" size={20} color={theme.text1} />
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                placeholderTextColor={theme.text1}
              />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ</Text>
            <View style={styles.inputBox}>
              <Icon name="map-pin" size={20} color={theme.text1} />
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Nhập địa chỉ"
                placeholderTextColor={theme.text1}
              />
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile} disabled={loading} activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <Text style={styles.saveButtonText}>LƯU</Text>
            )}
          </TouchableOpacity>

          {/* Order History */}
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Lịch sử mua hàng</Text>
            {loadingOrders ? (
              <ActivityIndicator color={theme.text} style={{ marginVertical: 20 }} />
            ) : orders.length === 0 ? (
              <Text style={{ color: theme.text1, textAlign: 'center', fontStyle: 'italic' }}>Chưa có đơn hàng nào.</Text>
            ) : (
              orders.map(order => {
                const statusStyle = getStatusStyle(order.status);
                const statusText = order.status === 'Pending' ? 'Chờ xử lý' : order.status === 'Success' ? 'Thành công' : order.status === 'Shipping' ? 'Đang giao' : order.status === 'Cancel' ? 'Đã hủy' : order.status;
                return (
                  <View key={order.id} style={styles.orderItem}>
                    <View>
                      <Text style={styles.orderCode}>{order.orderCode || `#${order.id}`}</Text>
                      <Text style={styles.orderDate}>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.orderTotal}>{(order.totalAmount || 0).toLocaleString('vi-VN')}đ</Text>
                      <Text style={[styles.orderStatus, { backgroundColor: statusStyle.backgroundColor, color: statusStyle.color }]}>
                        {statusText}
                      </Text>
                    </View>
                  </View>
                )
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;