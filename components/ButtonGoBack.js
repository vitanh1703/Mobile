import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from '../context/ThemeContext';

const ButtonGoBack = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    return (
        <TouchableOpacity 
            style={[styles.container, { backgroundColor: theme.background1 }]} 
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 8,
    },
});

export default ButtonGoBack;