import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import CartScreen from '../screens/Cart';

const Stack = createStackNavigator();

export default function MainStack({ route }) {
  // Lấy params từ Drawer truyền xuống (nếu có, ví dụ như user info)
  const { user } = route?.params || {};

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} initialParams={{ user }} />
      <Stack.Screen name="Cart" component={CartScreen} />
      {/* Sau này bạn có thể thêm ProductDetail vào đây */}
      {/* <Stack.Screen name="ProductDetail" component={ProductDetailScreen} /> */}
    </Stack.Navigator>
  );
}