import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password
  const [forgotStep, setForgotStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // ================= LOGIN =================
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
    }

    try {
      setLoading(true);

      const data = await authApi.login({
        email,
        password,
      });

      const token = data.token;
      const user = data.user || data;

      if (token) {
        await AsyncStorage.setItem("token", token);
      }

      setLoading(false);

      Alert.alert("Thành công", "Đăng nhập thành công!");

      navigation.replace("App", {
        user,
        token,
      });
    } catch (error) {
      setLoading(false);

      Alert.alert(
        "Lỗi",
        error?.response?.data?.message || "Không thể kết nối server!"
      );
    }
  };

  // ================= GOOGLE MOCK =================
  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const mockUser = {
        firstname: "Google",
        lastname: "User",
      };
      Alert.alert("Thành công", "Đăng nhập Google!");
      navigation.replace("App", { user: mockUser });
    }, 1000);
  };

  // ================= FORGOT PASSWORD =================
  const handleSendOtp = async () => {
    if (!email) return Alert.alert("Lỗi", "Vui lòng nhập email!");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Thành công", "Mã OTP đã được gửi đến email của bạn!");
      setForgotStep(2);
      setCooldown(60);
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return Alert.alert("Lỗi", "Vui lòng nhập OTP!");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Thành công", "Xác thực OTP thành công!");
      setForgotStep(3);
    }, 1000);
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6)
      return Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự!");

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert("Thành công", "Cập nhật mật khẩu thành công! Vui lòng đăng nhập lại.");
      setForgotStep(0);
      setOtp("");
      setNewPassword("");
    }, 1000);
  };

  const ScreenWrapper = ({ children }) => (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  // ================= UI FORGOT =================
  if (forgotStep > 0) {
    return (
      <ScreenWrapper>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>H&Q</Text>
        </View>

        <Text style={styles.text}>Quên Mật Khẩu</Text>
        <Text style={styles.subText}>
          {forgotStep === 1 && "Nhập email để nhận mã OTP"}
          {forgotStep === 2 && "Nhập mã OTP (6 số) đã được gửi đến email"}
          {forgotStep === 3 && "Nhập mật khẩu mới của bạn"}
        </Text>

        {forgotStep === 1 && (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Địa chỉ email của bạn"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <TouchableOpacity style={styles.button} disabled={loading} onPress={handleSendOtp}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>GỬI MÃ OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {forgotStep === 2 && (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, { textAlign: "center", letterSpacing: 8, fontWeight: "bold" }]}
                placeholder="OTP"
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
              />
            </View>
            <TouchableOpacity style={styles.button} disabled={loading} onPress={handleVerifyOtp}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>XÁC NHẬN OTP</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity disabled={cooldown > 0 || loading} onPress={handleSendOtp}>
              <Text style={styles.linkText}>{cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : "Gửi lại mã OTP"}</Text>
            </TouchableOpacity>
          </>
        )}

        {forgotStep === 3 && (
          <>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Mật khẩu mới"
                secureTextEntry={!showPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10 }}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#888" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} disabled={loading} onPress={handleResetPassword}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>CẬP NHẬT MẬT KHẨU</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={() => {
            setForgotStep(0);
            setOtp("");
            setNewPassword("");
            setCooldown(0);
          }}
          style={{ marginTop: 20 }}
        >
          <Text style={styles.linkText}>Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    );
  }

  // ================= UI LOGIN =================
  return (
    <ScreenWrapper>
      <View style={styles.iconBox}>
        <Text style={styles.iconText}>H&Q</Text>
      </View>

      <Text style={styles.text}>Chào mừng trở lại!</Text>
      <Text style={styles.subText}>Vui lòng nhập thông tin chi tiết của bạn</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Địa chỉ email của bạn"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10 }}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={{ width: width * 0.85, alignItems: "flex-end", marginTop: 10 }}>
        <TouchableOpacity onPress={() => setForgotStep(1)}>
          <Text style={styles.linkText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={handleLogin}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        )}
      </TouchableOpacity>

      {/* Dòng phân cách */}
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 20, width: width * 0.85 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
        <Text style={{ marginHorizontal: 10, color: "#888", fontWeight: "500" }}>Hoặc</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: "#ddd" }} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        disabled={loading}
        onPress={handleGoogleLogin}
      >
        <Image
          source={{ uri: "https://img.icons8.com/color/48/000000/google-logo.png" }}
          style={{ width: 24, height: 24, marginRight: 10 }}
          resizeMode="contain"
        />
        <Text style={styles.googleButtonText}>ĐĂNG NHẬP BẰNG GOOGLE</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 20 }}>
        <Text style={{ color: "#555" }}>
          Chưa có tài khoản? <Text style={styles.linkText}>Đăng ký ngay</Text>
        </Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
};

// ================= STYLE =================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: "#fff",
  },
  iconBox: {
    backgroundColor: "#000",
    width: 50,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  iconText: {
    color: "#fff",
    fontWeight: "bold",
    fontStyle: "italic",
    fontSize: 18,
  },
  text: {
    color: "#000",
    fontSize: 26,
    fontWeight: "bold",
  },
  subText: {
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 14,
    color: "#888",
  },
  inputContainer: {
    flexDirection: "row",
    width: width * 0.85,
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fafafa",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  button: {
    width: width * 0.85,
    paddingVertical: 15,
    marginTop: 25,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  googleButton: {
    flexDirection: "row",
    width: width * 0.85,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
  linkText: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default LoginScreen;
