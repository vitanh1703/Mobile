import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;
    !phoneRegex.test(text) ? setError("Invalid phone number") : setError("");
  };

  const handleSendOTP = () => {
    navigation.navigate("Auth", { phoneNumber });
  };

  const isDisable = !!error || !phoneNumber;
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
        Please Enter your Mobile Number to{"\n"}Sign In/Sign Up
      </Text>
      <View style={styles.phoneContainer}>
        <Text style={{ left: 5 }}>+84</Text>
        <TextInput
          style={styles.phoneInput}
          placeholder="Enter phone your number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={handlePhoneChange}
          maxLength={11}
        />
      </View>
      {error ? <Text style={{ color: "red", marginTop: 5 }}>{error}</Text> : null}
      <TouchableOpacity
        style={[styles.continue, { backgroundColor: bgColor }]}
        disabled={isDisable}
        onPress={handleSendOTP}
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
  phoneContainer: {
    flexDirection: "row",
    width: width * 0.7,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1.5,
    borderColor: "#000", 
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  phoneInput: {
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