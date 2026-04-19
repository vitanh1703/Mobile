import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useTheme();

  const isDarkMode = theme.mode === 'dark';

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.background1,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    content: {
      padding: 20,
    },
    section: {
      marginBottom: 30,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.text1,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 15,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.background1,
    },
    itemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    itemText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 15,
      fontWeight: '500',
    },
    logoutBtn: {
      marginTop: 20,
      paddingVertical: 15,
      backgroundColor: '#000000',
      borderRadius: 12,
      alignItems: 'center',
    },
    logoutText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    }
  }), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle}>Cài đặt</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tài khoản</Text>
          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <View style={styles.itemLeft}>
              <Icon name="lock" size={22} color={theme.text} />
              <Text style={styles.itemText}>Đổi mật khẩu</Text>
            </View>
            <Icon name="chevron-right" size={22} color={theme.text1} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt chung</Text>
          <TouchableOpacity style={styles.item} onPress={() => {}}>
            <View style={styles.itemLeft}>
              <Icon name="globe" size={22} color={theme.text} />
              <Text style={styles.itemText}>Ngôn ngữ</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: theme.text1, marginRight: 10 }}>Tiếng Việt</Text>
              <Icon name="chevron-right" size={22} color={theme.text1} />
            </View>
          </TouchableOpacity>

          <View style={styles.item}>
            <View style={styles.itemLeft}>
              <Icon name={isDarkMode ? "moon" : "sun"} size={22} color={theme.text} />
              <Text style={styles.itemText}>Chế độ tối (Dark Mode)</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.background1, true: theme.text }}
              thumbColor={theme.background}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('Logout')}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;