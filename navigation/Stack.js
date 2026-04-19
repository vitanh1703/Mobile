import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/Home';
import FavouritesScreen from '../screens/Favourites';
import ProductsScreen from '../screens/Products';
import NewsScreen from '../screens/News';
import ProfileScreen from '../screens/Profile';

const Stack = createStackNavigator();

export default function MainStack({ route }) {
  const { user } = route?.params || {};

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} initialParams={{ user }} />
      <Stack.Screen name="Favourite" component={FavouritesScreen} />
      <Stack.Screen name="Products" component={ProductsScreen} />
      <Stack.Screen name="News" component={NewsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}