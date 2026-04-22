import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../services/hooks';

export default function LogoutScreen() {
  const navigation = useNavigation();
  const { logout } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        // Call API logout
        await logout();

        // Reset toàn bộ navigation stack
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } catch (error) {
        console.error('Lỗi đăng xuất:', error.message);
        // Vẫn điều hướng về Login ngay cả khi có lỗi
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    };

    handleLogout();
  }, [logout, navigation]);

  return null; // Không cần UI
}