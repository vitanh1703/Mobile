import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

const ProductCard = ({ image, discount, title, brand, price, rating, reviews, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.background2, borderColor: theme.background1 }]} 
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} />
        {discount ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{discount}</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.info}>
        <Text style={[styles.brand, { color: theme.text1 }]}>{brand}</Text>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{title}</Text>
        <Text style={styles.price}>{price.toLocaleString('vi-VN')} đ</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={[styles.rating, { color: theme.text }]}>{rating}</Text>
          <Text style={[styles.reviews, { color: theme.text1 }]}>({reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.42,
    borderRadius: 10,
    marginRight: 15,
    marginBottom: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 3 / 4,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FE552A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  info: {
    padding: 12,
  },
  brand: { fontSize: 12 },
  title: { fontSize: 14, fontWeight: 'bold', marginVertical: 4 },
  price: { fontSize: 16, color: '#FE552A', fontWeight: 'bold' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  rating: { fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  reviews: { fontSize: 12, marginLeft: 4 },
});

export default ProductCard;