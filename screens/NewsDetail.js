import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import ButtonGoBack from '../components/ButtonGoBack';
import { useNews } from '../services/hooks';

const NewsDetailScreen = () => {
  const route = useRoute();
  const { theme } = useTheme();
  const { id } = route.params || {};

  const { news, loading } = useNews();

  // Tìm bài viết theo ID từ backend
  const newsItem = useMemo(() => {
    const rawItem = news?.find(item => (item.id || item.Id) === id);
    if (!rawItem) return null;
    
    return {
      id: rawItem.id || rawItem.Id,
      category: rawItem.category || rawItem.Category || 'Khác',
      title: rawItem.title || rawItem.Title || '',
      date: rawItem.publishDate ? new Date(rawItem.publishDate).toLocaleDateString('vi-VN') : rawItem.publish_date ? new Date(rawItem.publish_date).toLocaleDateString('vi-VN') : '',
      image: rawItem.imageUrl || rawItem.ImageUrl || rawItem.imgUrl || rawItem.ImgUrl || rawItem.img_url || rawItem.image || 'https://via.placeholder.com/150',
      desc: rawItem.description || rawItem.Description || rawItem.desc || '',
      content: rawItem.content || rawItem.Content || ''
    };
  }, [id, news]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 50,
      paddingBottom: 15,
      backgroundColor: theme.mode === 'light' ? '#F5F5F5' : theme.background2,
      borderBottomWidth: 1,
      borderBottomColor: theme.background1,
    },
    headerText: {
      fontSize: 12,
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      color: theme.text1,
      marginLeft: 15,
    },
    notFoundContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notFoundText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.text1,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 80,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    metaText: {
      fontSize: 11,
      fontWeight: 'bold',
      color: theme.text1,
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginLeft: 6,
    },
    metaDivider: {
      marginHorizontal: 12,
      color: theme.text1,
    },
    title: {
      fontSize: 28,
      fontWeight: '900',
      color: theme.text,
      textTransform: 'uppercase',
      lineHeight: 36,
      marginBottom: 20,
    },
    descContainer: {
      borderLeftWidth: 4,
      borderLeftColor: theme.text,
      paddingLeft: 16,
      marginBottom: 30,
    },
    descText: {
      fontSize: 16,
      fontStyle: 'italic',
      color: theme.text1,
      lineHeight: 24,
    },
    image: {
      width: '100%',
      height: 220,
      borderRadius: 12,
      resizeMode: 'cover',
      marginBottom: 30,
      backgroundColor: theme.background1,
    },
    placeholderText: {
      fontSize: 15,
      color: theme.text1,
      fontStyle: 'italic',
      lineHeight: 24,
    },
  }), [theme]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <ButtonGoBack />
          <Text style={styles.headerText}>Đang tải...</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.text} />
        </View>
      </SafeAreaView>
    );
  }

  if (!newsItem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <ButtonGoBack />
          <Text style={styles.headerText}>Trở lại</Text>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Không tìm thấy tin tức</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ButtonGoBack />
        <Text style={styles.headerText}>Trở lại</Text>
      </View>

      {/* Nội dung chi tiết */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="pricetag" size={14} color="#EF4444" />
            <Text style={[styles.metaText, { color: '#EF4444' }]}>{newsItem.category}</Text>
          </View>
          <Text style={styles.metaDivider}>|</Text>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={theme.text1} />
            <Text style={styles.metaText}>{newsItem.date}</Text>
          </View>
        </View>

        <Text style={styles.title}>{newsItem.title}</Text>

        <View style={styles.descContainer}>
          <Text style={styles.descText}>{newsItem.desc}</Text>
        </View>

        <Image source={{ uri: newsItem.image }} style={styles.image} />

        <View>
          {newsItem.content ? (
            <Text style={{ fontSize: 16, color: theme.text, lineHeight: 26 }}>{newsItem.content}</Text>
          ) : (
            <Text style={styles.placeholderText}>Nội dung chi tiết của bài viết đang được cập nhật...</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetailScreen;