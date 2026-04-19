import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const DealCard = ({ code, title, description, discountText, onPress }) => {
    const { theme } = useTheme();
    
    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            activeOpacity={0.9}
        >
            {/* Top Section - Red Theme */}
            <View style={styles.topSection}>
                <View style={styles.discountBadge}>
                    <Ionicons name="flame" size={22} color="#fff" style={styles.flameIcon} />
                    <Text style={styles.discountText}>{discountText || 'SALE'}</Text>
                </View>
                
                <View style={styles.codeBadge}>
                    <Text style={styles.codeBadgeText}>{code || 'PROMO'}</Text>
                </View>
            </View>

            {/* Bottom Section */}
            <View style={styles.bottomSection}>
                <View style={styles.codeRow}>
                    <View style={styles.dot} />
                    <Text style={styles.smallCodeText}>{code || 'PROMO'}</Text>
                </View>
                <View style={[styles.applyBtn, { backgroundColor: theme.mode === 'light' ? '#FEF2F2' : theme.background2 }]}>
                    <Text style={[styles.applyText, { color: theme.text }]}>ÁP DỤNG NGAY</Text>
                    <Ionicons name="arrow-forward" size={14} color={theme.text} />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 210,
        marginRight: 15,
        flexDirection: 'column',
    },
    topSection: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
        marginBottom: 16,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    discountBadge: {
        backgroundColor: '#EF4444',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        marginBottom: 12,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    flameIcon: {
        marginRight: 6,
    },
    discountText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
    },
    codeBadge: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 50,
    },
    codeBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    bottomSection: {
        paddingHorizontal: 4,
        flex: 1,
    },
    codeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    dot: {
        width: 6,
        height: 6,
        backgroundColor: '#EF4444',
        borderRadius: 3,
    },
    smallCodeText: {
        fontSize: 9,
        color: '#EF4444',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginLeft: 6,
    },
    title: {
        fontSize: 14,
        fontWeight: '900',
        textTransform: 'uppercase',
        marginBottom: 6,
        lineHeight: 20,
    },
    description: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        lineHeight: 16,
        marginBottom: 12,
        opacity: 0.85,
    },
    applyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    applyText: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginRight: 8,
    },
});

export default DealCard;