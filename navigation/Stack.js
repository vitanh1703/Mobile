import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import CartScreen from '../screens/Cart';
import FavouritesScreen from '../screens/Favourites';
import ProductsScreen from '../screens/Products';
import PaymentScreen from '../screens/Payment';
import CheckoutScreen from '../screens/Checkout';
import WalletScreen from '../screens/Wallet';
import PromotionScreen from '../screens/Promotion';

const Stack = createStackNavigator();

export default function MainStack({ route }) {
  // Lấy params từ Drawer truyền xuống (nếu có, ví dụ như user info)
  const { user } = route?.params || {};

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} initialParams={{ user }} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Favourite" component={FavouritesScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Promotion" component={PromotionScreen} />
    </Stack.Navigator>
  );
}