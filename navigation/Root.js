import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTab';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import WelcomeScreen from '../screens/Welcome';
import SettingsScreen from '../screens/Settings';
import LogoutScreen from '../screens/Logout';
import ProductDetailScreen from '../screens/ProductDetail';
import WalletScreen from '../screens/Wallet';
import CartScreen from '../screens/Cart';
import PaymentScreen from '../screens/Payment';
import CheckoutScreen from '../screens/Checkout';
import PromotionScreen from '../screens/Promotion';
import NewsDetailScreen from '../screens/NewsDetail';

const RootStack = createStackNavigator();

export default function RootNavigator() {
  return (
    <RootStack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
      <RootStack.Screen name="App" component={BottomTabNavigator} />
      <RootStack.Screen name="Welcome" component={WelcomeScreen} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
      <RootStack.Screen name="Logout" component={LogoutScreen} />
      <RootStack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <RootStack.Screen name="Wallet" component={WalletScreen} />
      <RootStack.Screen name="Cart" component={CartScreen} />
      <RootStack.Screen name="Payment" component={PaymentScreen} />
      <RootStack.Screen name="Checkout" component={CheckoutScreen} />
      <RootStack.Screen name="Promotion" component={PromotionScreen} />
      <RootStack.Screen name="NewsDetail" component={NewsDetailScreen} />
    </RootStack.Navigator>
  );
}