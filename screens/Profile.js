import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Feather as Icon, MaterialIcons as MaterialIcon, FontAwesome } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';

const { width, height } = Dimensions.get('window');

const ProfileScreen = ({ route }) => {
  const { user } = route?.params || {};
  const { theme } = useTheme();

  // Sử dụng state gộp cho Tên để tránh lỗi khi gõ dấu cách
  const [fullName, setFullName] = useState(`${user?.firstname || 'New'} ${user?.lastname || 'User'}`.trim());
  const [email, setEmail] = useState(user?.email || 'email@example.com');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || 'N/A');
  const [isLoading, setIsLoading] = useState(false);

  const avatar = user?.avatar || 'https://i.pravatar.cc/150';

  const updateUserProfile = () => {
    setIsLoading(true);
    
    // Giả lập độ trễ mạng khi cập nhật dữ liệu tĩnh (1 giây)
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Profile updated successfully!');
    }, 1000);
  };

  // Sử dụng useMemo để ngăn việc tạo lại stylesheet không cần thiết khi re-render
  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      padding: width * 0.05,
      paddingTop: 40,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginBottom: 8,
    },
    avatar: {
      width: width * 0.15,
      height: width * 0.15,
      borderRadius: (width * 0.18) / 2,
      borderWidth: 3,
      borderColor: '#FF6B6B',
      marginRight: 40,
    },
    divider: {
      width: 1,
      height: 50,
      backgroundColor: 'rgba(238, 238, 243, 1)',
      marginLeft: 10,
    },
    joinedBox: {
      justifyContent: 'center',
    },
    joinedText: {
      color: theme.subText || '#888',
      fontSize: 14,
    },
    joinedTime: {
      color: theme.text,
      fontWeight: 'bold',
      fontSize: 15,
    },
    name: {
      fontSize: 22,
      fontWeight: '600',
      color: theme.text,
      marginTop: 8,
    },
    lastname: {
      fontSize: 22,
      color: theme.subText || '#bbb',
      marginBottom: 16,
    },
    card: {
      backgroundColor: theme.background1 || '#fafafa',
      borderRadius: 16,
      padding: 12,
      marginBottom: 10,
      elevation: 1,
      height: height * 0.11,
    },
    cardLabel: {
      color: theme.subText || '#bbb',
      fontSize: 13,
      marginBottom: 4,
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardContent: {
      flex: 1,
      marginLeft: 12,
    },
    input: {
      color: theme.text,
      fontWeight: 'bold',
      fontSize: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.subText || '#bbb',
      paddingVertical: 4,
    },
    socialTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 18,
      marginBottom: 8,
      color: theme.text,
    },
    socialCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.background1 || '#fafafa',
      borderRadius: 16,
      paddingVertical: 30,
      paddingHorizontal: 12,
      marginBottom: 10,
    },
    socialText: {
      fontSize: 15,
      color: theme.text,
      textAlign: 'center',
      flex: 1,
    },
    connectText: {
      color: 'rgba(254, 85, 42, 1)',
      fontWeight: 'bold',
    },
    connectedText: {
      color: 'rgba(96, 199, 162, 1)',
      fontWeight: 'bold',
      marginRight: 8,
    },
    saveButton: {
      backgroundColor: '#FF6B6B',
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 20,
    },
    saveButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  }), [theme, width, height]);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Avatar & Info */}
      <View style={styles.profileInfo}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <View style={styles.divider} />
        <View style={styles.joinedBox}>
          <Text style={styles.joinedText}>Joined</Text>
          <Text style={styles.joinedTime}>9 mon ago</Text>
        </View>
      </View>
      <Text style={styles.name}>{fullName.split(' ')[0] || 'New'}</Text>
      <Text style={styles.lastname}>{fullName.split(' ').slice(1).join(' ') || 'User'}</Text>

      {/* Editable Info Cards */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Name</Text>
        <View style={styles.cardRow}>
          <Icon name="user" size={20} color={theme.text} />
          <View style={styles.cardContent}>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter full name"
              placeholderTextColor={theme.subText || '#bbb'}
            />
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Email</Text>
        <View style={styles.cardRow}>
          <MaterialIcon name="email" size={20} color={theme.text} />
          <View style={styles.cardContent}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={theme.subText || '#bbb'}
            />
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Mobile Number</Text>
        <View style={styles.cardRow}>
          <Icon name="phone" size={20} color={theme.text} />
          <View style={styles.cardContent}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                placeholderTextColor={theme.subText || '#bbb'}
              />
            </View>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={updateUserProfile} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Social Accounts */}
      <Text style={styles.socialTitle}>Social Accounts</Text>
      <View style={styles.socialCard}>
        <FontAwesome name="facebook" size={24} color={theme.text} style={{ marginLeft: 15 }} />
        <Text style={styles.socialText}>Facebook</Text>
        <TouchableOpacity>
          <Text style={styles.connectText}>Connect</Text>
        </TouchableOpacity>
        <View style={{ width: 24, height: 24 }} />
      </View>
      <View style={styles.socialCard}>
        <FontAwesome name="google" size={24} color={theme.text} style={{ marginLeft: 15 }} />
        <Text style={styles.socialText}>Google</Text>
        <Text style={styles.connectedText}>Connected</Text>
        <TouchableOpacity>
          <MaterialIcon name="close" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>
      
      {/* Bottom padding */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

export default ProfileScreen;