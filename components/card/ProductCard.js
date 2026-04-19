import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const ProductCard = ({ image, discount, title, brand, price, rating, reviews, onPress, containerStyle }) => {
  const { theme } = useTheme();
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <TouchableOpacity 
      style={[styles.card, containerStyle]} 
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={[styles.imageContainer, { backgroundColor: theme.background1, borderColor: theme.background1 }]}>
        <Image source={image} style={styles.image} />
        
        {/* Nút Yêu thích */}
        <TouchableOpacity 
          style={styles.heartBtn} 
          onPress={toggleFavorite}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={16} 
            color={isFavorite ? "#EF4444" : "#000"} 
          />
        </TouchableOpacity>

        {/* Badge Khuyến mãi */}
        {discount ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{discount}</Text>
          </View>
        ) : null}
      </View>

      {/* Phần thông tin */}
      <View style={styles.info}>
        <View style={styles.textContainer}>
          <Text style={[styles.brand, { color: theme.text1 }]}>{brand || 'H&Q'}</Text>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>{title}</Text>
        </View>
        <Text style={[styles.price, { color: theme.text }]}>{price?.toLocaleString('vi-VN')}đ</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.42,
    marginBottom: 20,
    marginRight: 15,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FE552A',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 2,
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  brand: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    lineHeight: 14,
  },
  price: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default ProductCard;