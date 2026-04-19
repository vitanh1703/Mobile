import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Feather as Icon, MaterialIcons as MaterialIcon, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = route?.params || {};
  const { theme } = useTheme();

  // Sử dụng state gộp cho Tên để tránh lỗi khi gõ dấu cách
  const [fullName, setFullName] = useState(`${user?.firstname || 'New'} ${user?.lastname || 'User'}`.trim());
  const [email, setEmail] = useState(user?.email || 'email@example.com');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || 'N/A');
  const [isLoading, setIsLoading] = useState(false);

  const avatar = user?.avatar || 'https://i.pravatar.cc/150';

  const updateUserProfile = () => {
    setIsLoading(true);
    
    // Giả lập độ trễ mạng khi cập nhật dữ liệu tĩnh (1 giây)
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
    }, 1000);
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
    name: { fontSize: 24, fontWeight: 'bold', color: theme.text, marginTop: 15 },
    joinedText: { fontSize: 14, color: theme.text1, marginTop: 4 },
    
    walletCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.text, padding: 18, borderRadius: 16, marginHorizontal: 20, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 },
    walletInfo: { flex: 1, marginLeft: 15 },
    walletTitle: { fontSize: 13, color: theme.background, opacity: 0.8, marginBottom: 4 },
    walletBalance: { fontSize: 18, fontWeight: 'bold', color: theme.background },

    formContainer: { paddingHorizontal: 20 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8, marginLeft: 4 },
    inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.background1, borderRadius: 12, paddingHorizontal: 15, backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2 },
    input: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, fontSize: 16, color: theme.text },
    
    saveButton: { backgroundColor: theme.text, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 15, marginBottom: 25 },
    saveButtonText: { color: theme.background, fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
    
    socialTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 15, color: theme.text, marginLeft: 4 },
    socialCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.background1, borderRadius: 12, padding: 15, marginBottom: 12, backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2 },
    socialText: { fontSize: 16, color: theme.text, flex: 1, marginLeft: 15, fontWeight: '500' },
    connectText: { color: '#000000', fontWeight: 'bold', fontSize: 14 },
    connectedText: { color: '#0fc70f', fontWeight: 'bold', fontSize: 14 },
  }), [theme]);

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Avatar & Info */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn} activeOpacity={0.8}>
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{fullName || 'Khách hàng mới'}</Text>
          <Text style={styles.joinedText}>Thành viên H&Q Store</Text>
        </View>

      {/* Wallet Shortcut */}
      <TouchableOpacity style={styles.walletCard} activeOpacity={0.8} onPress={() => navigation.navigate('Wallet')}>
        <Icon name="credit-card" size={28} color={theme.background} />
        <View style={styles.walletInfo}>
          <Text style={styles.walletTitle}>Ví H&Q</Text>
          <Text style={styles.walletBalance}>1.250.000 đ</Text>
        </View>
        <Icon name="chevron-right" size={24} color={theme.background} />
      </TouchableOpacity>

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
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập email"
                keyboardType="email-address"
                autoCapitalize="none"
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
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
                placeholderTextColor={theme.text1}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={updateUserProfile} disabled={isLoading} activeOpacity={0.8}>
            {isLoading ? (
              <ActivityIndicator color={theme.background} />
            ) : (
              <Text style={styles.saveButtonText}>LƯU THAY ĐỔI</Text>
            )}
          </TouchableOpacity>

          {/* Social Accounts */}
          <Text style={styles.socialTitle}>Liên kết mạng xã hội</Text>
          <TouchableOpacity style={styles.socialCard} activeOpacity={0.7}>
            <FontAwesome name="facebook" size={24} color="#1877F2" />
            <Text style={styles.socialText}>Facebook</Text>
            <Text style={styles.connectText}>Liên kết</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.socialCard} activeOpacity={0.7}>
            <Image source={{ uri: "https://img.icons8.com/color/48/000000/google-logo.png" }} style={{ width: 24, height: 24 }} />
            <Text style={styles.socialText}>Google</Text>
            <Text style={styles.connectedText}>Đã liên kết</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;