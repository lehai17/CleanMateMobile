import { useUiPreferences as useCleanMateUi } from './../../ui/Preferences';
import React, { useEffect, useState } from "react";
import { StyleSheet, Platform } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, Pressable, Alert, ActivityIndicator, KeyboardAvoidingView } from './../../ui/Preferences';
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../context/AuthContext";
import { loginApi } from "../../api/auth";

export default function LoginScreen({ navigation }) {
  useCleanMateUi();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Customer");

  useEffect(() => {
    (async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("cm_remember_email");
        if (savedEmail) {
          setEmail(savedEmail);
          setRemember(true);
        }
      } catch {}
    })();
  }, []);

  const onSubmit = async () => {
    if (loading) return;
    if (!email.trim() || !password.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      const res = await loginApi(email.trim(), password);

      if (remember) {
        await AsyncStorage.setItem("cm_remember_email", email.trim());
      } else {
        await AsyncStorage.removeItem("cm_remember_email");
      }

      await login(res.user, res.token);

    } catch (err) {
      setPassword('');
      Alert.alert(
        "Đăng nhập thất bại",
        err?.response?.data?.message || "Sai email hoặc mật khẩu."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#059669", "#f59e0b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.screen}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <View style={s.centerWrap}>
          <View style={s.card}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Text style={s.brandRow}>
                <Text style={[s.brandPart, { color: "#059669" }]}>Clean</Text>
                <Text style={[s.brandPart, { color: "#f59e0b" }]}>Mate</Text>
              </Text>
              <Text style={{ color: "#4b5563", marginTop: 6 }}>
                Dịch vụ giúp việc theo giờ
              </Text>
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={s.label}>Đăng nhập với vai trò</Text>
              <View style={s.roleRow}>
                <Pressable
                  style={[s.roleBtn, selectedRole === "Customer" && s.roleBtnActiveCustomer]}
                  onPress={() => setSelectedRole("Customer")}
                >
                  <Text
                    style={[
                      s.roleText,
                      selectedRole === "Customer" && s.roleTextActiveCustomer,
                    ]}
                  >
                    👥 Khách hàng
                  </Text>
                </Pressable>
                <Pressable
                  style={[s.roleBtn, selectedRole === "Cleaner" && s.roleBtnActiveCleaner]}
                  onPress={() => setSelectedRole("Cleaner")}
                >
                  <Text
                    style={[
                      s.roleText,
                      selectedRole === "Cleaner" && s.roleTextActiveCleaner,
                    ]}
                  >
                    🧹 Người giúp việc
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={{ gap: 16 }}>
              <View style={s.fieldWrap}>
                <Text style={s.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="you@example.com"
                  style={s.input}
                />
              </View>

              <View style={s.fieldWrap}>
                <Text style={s.label}>Mật khẩu</Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPwd}
                    placeholder="••••••••"
                    style={[s.input, { paddingRight: 44 }]}
                  />
                  <Pressable
                    onPress={() => setShowPwd((v) => !v)}
                    style={s.eyeBtn}
                    accessibilityLabel={showPwd ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    <Text style={{ fontSize: 16 }}>{showPwd ? "🙈" : "👁️"}</Text>
                  </Pressable>
                </View>
              </View>

              <View style={s.rowBetween}>
                <Pressable
                  onPress={() => setRemember((v) => !v)}
                  style={s.rememberWrap}
                >
                  <View style={[s.checkbox, remember && s.checkboxChecked]} />
                  <Text style={s.rememberText}>Ghi nhớ đăng nhập</Text>
                </Pressable>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ForgotPassword')
                  }
                >
                  <Text style={[s.link, { color: "#059669" }]}>Quên mật khẩu?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={onSubmit}
                disabled={loading}
                style={[s.submitBtn, loading && { opacity: 0.7 }]}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={s.submitText}>Đăng nhập</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 18, alignItems: "center" }}>
              <Text style={{ color: "#4b5563" }}>
                Chưa có tài khoản?{" "}
                <Text
                  onPress={() => navigation.navigate("Register")}
                  style={[s.link, { color: "#f59e0b" }]}
                >
                  Đăng ký ngay
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1 },
  centerWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 22,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  brandRow: { marginTop: 6, lineHeight: 28 },
  brandPart: { fontSize: 28, fontWeight: "700" },
  roleRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginTop: 8 },
  roleBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
  },
  roleText: { fontWeight: "600", color: "#6b7280" },
  roleBtnActiveCustomer: { backgroundColor: "#ecfdf5", borderColor: "#059669" },
  roleTextActiveCustomer: { color: "#059669" },
  roleBtnActiveCleaner: { backgroundColor: "#fff7ed", borderColor: "#f59e0b" },
  roleTextActiveCleaner: { color: "#f59e0b" },
  fieldWrap: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  eyeBtn: { position: "absolute", right: 10, top: "50%", marginTop: -12, padding: 4 },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rememberWrap: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    backgroundColor: "white",
  },
  checkboxChecked: { backgroundColor: "#059669", borderColor: "#059669" },
  rememberText: { marginLeft: 8, color: "#4b5563", fontSize: 13 },
  link: { fontWeight: "600" },
  submitBtn: {
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "white", fontWeight: "700" },
});
