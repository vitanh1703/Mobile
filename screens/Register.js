import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { apiClient } from "../services/api";

const { height, width } = Dimensions.get("window");

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [step, setStep] = useState(0); // 0: Form, 1: OTP
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dữ liệu Form
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleRegister = async () => {
    if (!name || !lastname || !email || !password || !confirmPassword) {
      return Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp!");
    }

    setLoading(true);
    try {
      await apiClient.post("/Auth/send-register-otp", {
        fullName: `${lastname} ${name}`.trim(),
        email: email,
        password: password
      });
      Alert.alert("Thành công", "Mã OTP đã được gửi đến email của bạn!");
      setStep(1);
      setCooldown(60);
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.message || "Không thể gửi OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return Alert.alert("Lỗi", "Vui lòng nhập OTP!");
    setLoading(true);
    try {
      await apiClient.post("/Auth/verify-register-otp", {
        email: email,
        otp: otp
      });
      Alert.alert("Thành công", "Đăng ký thành công! Hãy đăng nhập nhé.");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Lỗi", error.response?.data?.message || "Mã OTP không hợp lệ!");
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Xác thực Email</Text>
        <Text style={styles.subText}>Nhập mã OTP đã được gửi đến {email}</Text>
        <View style={styles.inputBox}>
          <TextInput style={[styles.input, { textAlign: 'center', letterSpacing: 8, fontWeight: 'bold' }]} placeholder="Nhập mã OTP (6 số)" keyboardType="number-pad" maxLength={6} value={otp} onChangeText={setOtp} />
        </View>
        <TouchableOpacity style={styles.button} disabled={loading} onPress={handleVerifyOtp}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>XÁC NHẬN OTP</Text>}
        </TouchableOpacity>
        <TouchableOpacity disabled={cooldown > 0 || loading} onPress={handleRegister} style={{ marginTop: 20 }}>
          <Text style={styles.linkText}>{cooldown > 0 ? `Gửi lại mã (${cooldown}s)` : "Gửi lại mã OTP"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStep(0)} style={{ marginTop: 15 }}><Text style={styles.linkText}>Quay lại</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản mới</Text>
      <Text style={styles.subText}>Vui lòng điền thông tin bên dưới</Text>

      <View style={{ flexDirection: "row", width: width * 0.85, justifyContent: "space-between" }}>
        <View style={[styles.inputBox, { width: '48%' }]}><TextInput style={styles.input} placeholder="Tên" value={name} onChangeText={setName} /></View>
        <View style={[styles.inputBox, { width: '48%' }]}><TextInput style={styles.input} placeholder="Họ" value={lastname} onChangeText={setLastname} /></View>
      </View>

      <View style={styles.inputBox}><TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} /></View>
      
      <View style={styles.inputBox}>
        <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry={!showPassword} value={password} onChangeText={setPassword} />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 10 }}>
          <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputBox}>
        <TextInput style={styles.input} placeholder="Xác nhận mật khẩu" secureTextEntry={!showPassword} value={confirmPassword} onChangeText={setConfirmPassword} />
      </View>

      <TouchableOpacity style={styles.button} disabled={loading} onPress={handleRegister}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>ĐĂNG KÝ NGAY</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 25 }}>
        <Text style={{ color: "#555" }}>Đã có tài khoản? <Text style={styles.linkText}>Đăng nhập</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.12,
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff", 
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#000" },
  subText: { marginTop: 10, marginBottom: 20, fontSize: 14, color: "#888", textAlign: "center" },
  inputBox: {
    flexDirection: "row",
    width: width * 0.85,
    alignItems: "center",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#ddd", 
    borderRadius: 10,
    backgroundColor: "#fafafa",
  },
  input: { flex: 1, padding: 12, fontSize: 16, color: "#000" },
  button: {
    width: width * 0.85,
    paddingVertical: 15,
    marginTop: 25,
    borderRadius: 10,
    backgroundColor: "#000",
  },
  buttonText: { textAlign: "center", color: "#fff", fontWeight: "bold" },
  linkText: { fontWeight: "bold", color: "#000" },
});
export default RegisterScreen;