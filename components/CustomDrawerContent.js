import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function CustomDrawerContent(props) {
  const { user } = props;
  const { theme } = useTheme();

  const displayName = 
    (user?.firstname || '') + ' ' + (user?.lastname || '') || 'Khách hàng mới';
  const city = user?.city || 'Thành viên H&Q';
  const avatar = user?.avatar || 'https://i.pravatar.cc/150';

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ backgroundColor: theme.background, flex: 1 }}
    >
      <View style={[styles.header, { borderBottomColor: theme.background1 }]}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={[styles.name, { color: theme.text }]}>{displayName.trim() || 'Khách hàng mới'}</Text>
        <Text style={[styles.city, { color: theme.text1 }]}>{city}</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginVertical: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 10,
  },
  city: {
    fontSize: 14,
    marginTop: 4,
  },
});