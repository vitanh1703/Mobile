import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const DealCard = ({ title, description, onPress }) => {
    const { theme } = useTheme();
    
    return (
        <TouchableOpacity 
            style={[styles.card, { backgroundColor: theme.background1 || '#fff' }]} 
            onPress={onPress}
            activeOpacity={0.8}
        >
            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: theme.text1 || '#000' }]} numberOfLines={1}>
                    {title}
                </Text>
                {description && (
                    <Text style={[styles.description, { color: theme.text2 || '#666' }]} numberOfLines={2}>
                        {description}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 150,
        height: 100, // Thu nhỏ chiều cao vì không còn ảnh
        borderRadius: 16,
        padding: 12,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4, // Đổ bóng cho Android
        justifyContent: 'center', // Căn giữa nội dung theo chiều dọc
    },
    textContainer: {
        alignItems: 'center', // Căn giữa chữ
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'center',
    },
    description: {
        fontSize: 11,
        lineHeight: 16,
        textAlign: 'center',
    },
});

export default DealCard;