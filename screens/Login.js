import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    !emailRegex.test(text) ? setError("Invalid email address") : setError("");
  };

  const handleLogin = () => {
    navigation.replace("AppDrawer");
  };

  const isDisable = !!error || !email || !password;
  const bgColor = isDisable ? "#e0e0e0" : "#000"; 

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>H&Q Store</Text>
      <Text style={styles.subText}>
        Please Enter your Email and Password to{"\n"}Sign In
      </Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={handleEmailChange}
        />
      </View>
      {error ? <Text style={{ color: "red", marginTop: 5 }}>{error}</Text> : null}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
        style={[styles.continue, { backgroundColor: bgColor }]}
        disabled={isDisable}
        onPress={handleLogin}
      >
        <Text style={{ textAlign: "center", color: "#fff" }}>CONTINUE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.25,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff", 
  },
  logo: {
    width: 100,
    height: 100,
  },
  text: {
    color: "#000",
    fontSize: 30,
    fontWeight: "bold",
  },
  subText: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 16,
    color: "#555",
  },
  inputContainer: {
    flexDirection: "row",
    width: width * 0.7,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: "#000", 
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  continue: {
    width: width * 0.7,
    paddingVertical: 15,
    marginTop: 20,
    borderRadius: 8,
  },
});

export default LoginScreen;