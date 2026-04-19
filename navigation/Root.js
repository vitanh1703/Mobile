import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppDrawer from './Drawer';
import LoginScreen from '../screens/Login';
// import AuthScreen from '../screens/Auth';
import WelcomeScreen from '../screens/Welcome';

const RootStack = createStackNavigator();

export default function RootNavigator() {
  return (
    <RootStack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      {/* <RootStack.Screen name="Auth" component={AuthScreen} /> */}
      <RootStack.Screen name="App" component={AppDrawer} />
      <RootStack.Screen name="Welcome" component={WelcomeScreen} />
    </RootStack.Navigator>
  );
}