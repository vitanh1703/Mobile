import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import MainStack from './Stack'; 
import ProfileScreen from '../screens/Profile'; 
import ProductsScreen from '../screens/Products';
import NewsScreen from '../screens/News';

const DummyScreen = () => <View style={{ flex: 1 }} />;

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 5;

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme();
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * TAB_WIDTH,
      useNativeDriver: true,
      bounciness: 8, 
    }).start();
  }, [state.index]);

  return (
    <View style={[styles.tabBarContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.tabBar, { backgroundColor: theme.background2 }]}>
        <Animated.View style={[styles.indicatorContainer, { transform: [{ translateX }] }]}>
          <View style={[styles.indicator, {
            borderColor: theme.background,
            backgroundColor: theme.background2
          }]} />
        </Animated.View>

        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const clr = '#000'; 
          const iconName = ['home', 'grid', 'file-text', 'user', 'settings'][index];

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              onPress={onPress}
              style={styles.tabItem}
            >
              <Animated.View style={[
                styles.iconContainer,
                isFocused && {
                  backgroundColor: clr,
                  transform: [{ translateY: -25 }], 
                  shadowColor: clr, 
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.8,
                  shadowRadius: 10,
                  elevation: 10,
                }
              ]}>
                <Feather name={iconName} size={22} color={isFocused ? '#fff' : theme.text1} />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function BottomTabNavigator({ route }) {
  const { user } = route?.params || {};
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={MainStack} initialParams={{ user }} />
      <Tab.Screen name="ProductsTab" component={ProductsScreen} initialParams={{ user }} />
      <Tab.Screen name="NewsTab" component={NewsScreen} initialParams={{ user }} />
      <Tab.Screen name="ProfileTab" component={ProfileScreen} initialParams={{ user }} />
      <Tab.Screen name="SettingsTab" component={DummyScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    justifyContent: 'flex-end',
  },
  tabBar: {
    height: 60,
    flexDirection: 'row',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  indicatorContainer: {
    position: 'absolute',
    top: -26,
    width: TAB_WIDTH,
    alignItems: 'center',
    zIndex: 1,
  },
  indicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 6,
  },
});