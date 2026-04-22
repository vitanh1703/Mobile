import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView, Modal, TextInput, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userApi } from '../services/api';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  const isDarkMode = theme.mode === 'dark';

  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
    }
    if (newPassword !== confirmNewPassword) {
      return Alert.alert('Lỗi', 'Mật khẩu mới không khớp!');
    }
    if (newPassword.length < 6) {
      return Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
    }

    setLoading(true);
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (!userStr) throw new Error('Vui lòng đăng nhập lại!');
      const user = JSON.parse(userStr);

      await userApi.updatePassword(user.id, {
        CurrentPassword: currentPassword,
        NewPassword: newPassword,
      });

      Alert.alert('Thành công', 'Cập nhật mật khẩu thành công!');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (error) {
      console.error("Lỗi khi đổi mật khẩu:", error);
      Alert.alert('Lỗi', error.response?.data?.message || error.message || 'Đổi mật khẩu thất bại!');
    } finally {
      setLoading(false);
    }
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
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.background1,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text1,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 15,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.background1,
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 15,
      fontWeight: '500',
    },
    logoutBtn: {
      marginTop: 20,
      paddingVertical: 15,
      backgroundColor: '#000000',
      borderRadius: 12,
      alignItems: 'center',
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    // Modal
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    modalContent: {
      width: width * 0.9,
      backgroundColor: theme.background,
      borderRadius: 16,
      padding: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    inputGroup: { marginBottom: 15 },
    label: { fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 8, marginLeft: 4 },
    inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.background1, borderRadius: 12, paddingHorizontal: 15, backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2 },
    input: { flex: 1, paddingVertical: 14, paddingHorizontal: 10, fontSize: 16, color: theme.text },
    modalButton: {
      backgroundColor: theme.text,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 10,
    },
    modalButtonText: {
      color: theme.background,
      fontWeight: 'bold',
      fontSize: 15,
    },
    modalCloseButton: {
      position: 'absolute',
      top: 10,
      right: 10,
      padding: 5,
      zIndex: 10,
    }
  }), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <TouchableOpacity style={styles.item} onPress={() => setShowChangePassword(true)}>
            <View style={styles.itemLeft}>
              <Icon name="lock" size={22} color={theme.text} />
              <Text style={styles.itemText}>Đổi mật khẩu</Text>
            </View>
            <Icon name="chevron-right" size={22} color={theme.text1} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt chung</Text>
          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <View style={styles.itemLeft}>
              <Icon name="globe" size={22} color={theme.text} />
              <Text style={styles.itemText}>Ngôn ngữ</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: theme.text1, marginRight: 10 }}>Tiếng Việt</Text>
              <Icon name="chevron-right" size={22} color={theme.text1} />
            </View>
          </TouchableOpacity>

          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name={isDarkMode ? "moon" : "sun"} size={22} color={theme.text} />
              <Text style={styles.itemText}>Chế độ tối (Dark Mode)</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.background1, true: theme.text }}
              thumbColor={theme.background}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('Logout')}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showChangePassword}
        onRequestClose={() => setShowChangePassword(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowChangePassword(false)}>
              <Icon name="x" size={24} color={theme.text} />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Đổi mật khẩu</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu hiện tại</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  placeholder="Nhập mật khẩu hiện tại"
                  placeholderTextColor={theme.text1}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mật khẩu mới</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor={theme.text1}
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.input}
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  secureTextEntry
                  placeholder="Nhập lại mật khẩu mới"
                  placeholderTextColor={theme.text1}
                />
              </View>
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword} disabled={loading}>
              {loading ? <ActivityIndicator color={theme.background} /> : <Text style={styles.modalButtonText}>XÁC NHẬN</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;