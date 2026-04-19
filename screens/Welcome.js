import React, { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

const Welcome = () => {
    const navigation = useNavigation(); 
    const { theme } = useTheme();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Login");
        }, 3000); 

        return () => clearTimeout(timer);
    }, [navigation]); 

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
            <Image
                source={require("../assets/logo.png")} 
                style={{ width: 140, height: 140 }} 
                resizeMode="contain"
            />
            <Text style={{ fontSize: 30, fontWeight: "bold", color: theme.text, marginTop: 10 }}>H&Q Store</Text>
        </View>
    );
};

export default Welcome;