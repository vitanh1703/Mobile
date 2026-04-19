import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

const DealCard = ({ title, description, image1, image2, onPress }) => {
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
            <View style={styles.imageContainer}>
                <Image source={image1} style={styles.imageLeft} />
                <Image source={image2} style={styles.imageRight} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 150,
        height: 170,
        borderRadius: 16,
        padding: 12,
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4, // Đổ bóng cho Android
        justifyContent: 'space-between',
    },
    textContainer: {
        marginBottom: 8,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    description: {
        fontSize: 11,
        lineHeight: 16,
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    imageLeft: {
        width: 60,
        height: 60,
        borderRadius: 10,
        resizeMode: 'cover',
        alignSelf: 'flex-start',
    },
    imageRight: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
        alignSelf: 'flex-end',
        marginTop: -15, // Tạo hiệu ứng xếp chồng/so le đẹp mắt
    },
});

export default DealCard;