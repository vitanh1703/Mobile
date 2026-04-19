import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const ButtonCancel = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();

    return (
        <TouchableOpacity 
            style={styles.container} 
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="close-circle-outline" size={30} color={theme.text} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 5,
    },
});

export default ButtonCancel;