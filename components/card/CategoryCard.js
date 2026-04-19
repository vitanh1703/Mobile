import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const CategoryCard = ({ title, image, onPress }) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.6}>
      <View style={[
        styles.imageContainer, 
        { 
          backgroundColor: theme.mode === 'light' ? '#F8F9FA' : theme.background2,
          borderColor: theme.background1
        }
      ]}>
        <Image source={image} style={styles.image} />
      </View>
      <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: (width - 40) / 4, // Tăng nhẹ không gian cho mỗi thẻ
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 32, // Tròn hoàn hảo
    borderWidth: 1, // Viền mỏng tinh tế
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000000', // Đổ bóng nhẹ hơi hướng màu cam chủ đạo
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4, 
  },
  image: {
    width: 38,
    height: 38,
    resizeMode: 'contain', 
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});

export default CategoryCard;