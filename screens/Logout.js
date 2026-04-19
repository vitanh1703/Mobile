import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function LogoutScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Xoá token hoặc session nếu có
    // AsyncStorage.removeItem('token');

    // Reset toàn bộ navigation stack
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, []);

  return null; // Không cần UI
}