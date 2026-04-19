import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTab';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import WelcomeScreen from '../screens/Welcome';
import SettingsScreen from '../screens/Settings';
import LogoutScreen from '../screens/Logout';

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
    </RootStack.Navigator>
  );
}