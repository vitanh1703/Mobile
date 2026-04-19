import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

const NewsCard = ({ id, category, title, date, img, desc }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => id && navigation.navigate('NewsDetail', { id })}
    >
      {/* Image Container */}
      <View style={[styles.imageContainer, { backgroundColor: theme.background1 }]}>
        <Image source={{ uri: img }} style={styles.image} />
        
        {/* Date Badge */}
        <View style={styles.dateBadge}>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>
      
      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.category, { color: theme.text1 }]}>{category}</Text>
        
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {title}
        </Text>
        
        {desc ? (
          <Text style={[styles.desc, { color: theme.text1 }]} numberOfLines={2}>
            {desc}
          </Text>
        ) : null}
        
        {/* Read More Button */}
        <View style={styles.readMoreContainer}>
          <Text style={[styles.readMoreText, { color: theme.text }]}>Đọc thêm</Text>
          <Ionicons name="arrow-forward" size={14} color={theme.text} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  imageContainer: {
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dateBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomLeftRadius: 12,
  },
  dateText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  content: {
    paddingHorizontal: 2,
  },
  category: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '900', textTransform: 'uppercase', marginBottom: 6, lineHeight: 22 },
  desc: { fontSize: 12, fontWeight: '500', textTransform: 'uppercase', lineHeight: 18, marginBottom: 12, opacity: 0.8 },
  readMoreContainer: { flexDirection: 'row', alignItems: 'center' },
  readMoreText: { fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.5, marginRight: 6 },
});

export default NewsCard;