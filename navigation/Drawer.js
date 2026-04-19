import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainStack from './Stack';
import ProfileScreen from '../screens/Profile';
import CustomDrawerContent from '../components/CustomDrawerContent'; 
// import FavouritesScreen from '../screens/Favourites';
// import AddressesScreen from '../screens/Addresses';
// import OrderScreen from '../screens/Order';
// import WalletScreen from '../screens/Wallet';
// import PromotionScreen from '../screens/Promotion';
// import ChallengeScreen from '../screens/Challenge';
// import HelpScreen from '../screens/Help';
// import SettingScreen from '../screens/Setting';
// import TeamConditionScreen from '../screens/Team.Condition';
// import LogoutScreen from '../screens/Logout';
import { Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Drawer = createDrawerNavigator();

export default function AppDrawer({ route }) {
  const { theme } = useTheme();
  const { user } = route.params || {};

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme.background, // nền của drawer
        },
        drawerLabelStyle: {
          fontWeight: '500',
          color: theme.text, // màu chữ theo theme
        },
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} user={user} />}
    >
      <Drawer.Screen name="Main" component={MainStack} initialParams={{ user }} />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Image
              source={require('../assets/User.png')}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
            />
          ),
        }}
        initialParams={{ user }}
      />
      
      {/* Tạm thời ẩn các màn hình chưa có file để tránh lỗi ReferenceError
      <Drawer.Screen
        name="Favourite"
        component={FavouritesScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Image
              source={require('../assets/Heart.png')}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
            />
          ),
        }}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="Address"
        component={AddressesScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Image
              source={require('../assets/Location.png')}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
            />
          ),
        }}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="Orders & Reordering"
        component={OrderScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Image
              source={require('../assets/Work.png')}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
            />
          ),
        }}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="Wallet"
        component={WalletScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Image
              source={require('../assets/Wallet.png')}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
            />
          ),
        }}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="Promotion"
        component={PromotionScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Image
              source={require('../assets/Home - 2.png')}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
            />
          ),
        }}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="Challenge & Vouchers"
        component={ChallengeScreen}
        options={{
          drawerIcon: ({ size }) => (
            <Image
              source={require('../assets/Award.png')}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              resizeMode="cover"
            />
          ),
        }}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="Help center"
        component={HelpScreen}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingScreen}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="Terms & Condition/Privacy"
        component={TeamConditionScreen}
        initialParams={{ user }}
      />
      <Drawer.Screen
        name="Logout"
        component={LogoutScreen}
        initialParams={{ user }}
      />
      */}
    </Drawer.Navigator>
  );
}