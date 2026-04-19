import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import CartScreen from '../screens/Cart';
import ProductDetailScreen from '../screens/ProductDetail';
import FavouritesScreen from '../screens/Favourites';

const Stack = createStackNavigator();

export default function MainStack({ route }) {
  // Lấy params từ Drawer truyền xuống (nếu có, ví dụ như user info)
  const { user } = route?.params || {};

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} initialParams={{ user }} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Favourite" component={FavouritesScreen} />
    </Stack.Navigator>
  );
}