import { Raw, useUiPreferences as useCleanMateUi } from './../../ui/Preferences';
import React, { useState } from "react";
import { StyleSheet, Platform } from 'react-native';
import { View, Text, TextInput, Alert, TouchableOpacity, Pressable, ScrollView, KeyboardAvoidingView, ActivityIndicator } from './../../ui/Preferences';
import { LinearGradient } from "expo-linear-gradient";
import { registerApi } from "../../api/auth";

export default function RegisterScreen({ navigation }) {
  useCleanMateUi();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [role, setRole] = useState("Customer");
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Vui lòng nhập họ tên";
    if (!form.email.trim()) e.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Email không hợp lệ";
    if (!form.phone.trim()) e.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10,11}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Số điện thoại không hợp lệ";
    if (!form.password) e.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 8)
      e.password = "Mật khẩu phải có ít nhất 8 ký tự";
    if (!form.confirmPassword) e.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Mật khẩu xác nhận không khớp";
    if (!form.acceptTerms)
      e.acceptTerms = "Vui lòng đồng ý với điều khoản sử dụng";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async () => {
    if (loading) return;
    if (!validate()) return;
    setLoading(true);
    try {
      await registerApi({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        role,
      });
      Alert.alert("Thành công", "Đăng ký thành công, vui lòng đăng nhập.");
      navigation.replace("Login");
    } catch (err) {
      Alert.alert("Đăng ký thất bại", err?.response?.data?.message || "Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#059669", "#f59e0b"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={s.center} keyboardShouldPersistTaps="handled">
          <View style={s.card}>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <Text style={s.title}>Đăng ký CleanMate</Text>
              <Text style={{ color: "#4b5563" }}>Tạo tài khoản mới</Text>
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={s.label}>Bạn muốn đăng ký với vai trò gì? *</Text>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
                <TouchableOpacity
                  onPress={() => setRole("Customer")}
                  style={[s.roleBtn, role === "Customer" && s.roleSelectedCustomer]}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      s.roleText,
                      role === "Customer" && s.roleTextActiveCustomer,
                    ]}
                  >
                    👥 Khách hàng
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setRole("Cleaner")}
                  style={[s.roleBtn, role === "Cleaner" && s.roleSelectedCleaner]}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[
                      s.roleText,
                      role === "Cleaner" && s.roleTextActiveCleaner,
                    ]}
                  >
                    🧹 Người giúp việc
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={s.fieldWrap}>
              <Text style={s.label}>Họ và tên *</Text>
              <TextInput
                value={form.fullName}
                onChangeText={(t) => setField("fullName", t)}
                placeholder="Nhập họ và tên của bạn"
                style={[s.input, errors.fullName && s.inputError]}
              />
              {errors.fullName ? <Text style={s.err}>{<Raw>{errors.fullName}</Raw>}</Text> : null}
            </View>

            <View style={s.fieldWrap}>
              <Text style={s.label}>Email *</Text>
              <TextInput
                value={form.email}
                onChangeText={(t) => setField("email", t)}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Nhập email của bạn"
                style={[s.input, errors.email && s.inputError]}
              />
              {errors.email ? <Text style={s.err}>{<Raw>{errors.email}</Raw>}</Text> : null}
            </View>

            <View style={s.fieldWrap}>
              <Text style={s.label}>Số điện thoại *</Text>
              <TextInput
                value={form.phone}
                onChangeText={(t) => setField("phone", t)}
                keyboardType="phone-pad"
                placeholder="Nhập số điện thoại"
                style={[s.input, errors.phone && s.inputError]}
              />
              {errors.phone ? <Text style={s.err}>{<Raw>{errors.phone}</Raw>}</Text> : null}
            </View>

            <View style={s.fieldWrap}>
              <Text style={s.label}>Mật khẩu *</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={form.password}
                  maxLength={72}
                  onChangeText={(t) => setField("password", t)}
                  secureTextEntry={!showPwd}
                  placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                  style={[
                    s.input,
                    { paddingRight: 44 },
                    errors.password && s.inputError,
                  ]}
                />
                <Pressable onPress={() => setShowPwd((v) => !v)} style={s.eyeBtn}>
                  <Text style={{ color: "#6b7280" }}>{showPwd ? "🙈" : "👁️"}</Text>
                </Pressable>
              </View>
              {errors.password ? <Text style={s.err}>{errors.password}</Text> : null}
            </View>

            <View style={s.fieldWrap}>
              <Text style={s.label}>Xác nhận mật khẩu *</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={form.confirmPassword}
                  maxLength={72}
                  onChangeText={(t) => setField("confirmPassword", t)}
                  secureTextEntry={!showConfirmPwd}
                  placeholder="Nhập lại mật khẩu"
                  style={[
                    s.input,
                    { paddingRight: 44 },
                    errors.confirmPassword && s.inputError,
                  ]}
                />
                <Pressable
                  onPress={() => setShowConfirmPwd((v) => !v)}
                  style={s.eyeBtn}
                >
                  <Text style={{ color: "#6b7280" }}>
                    {showConfirmPwd ? "🙈" : "👁️"}
                  </Text>
                </Pressable>
              </View>
              {errors.confirmPassword ? (
                <Text style={s.err}>{errors.confirmPassword}</Text>
              ) : null}
            </View>

            <View style={{ marginTop: 4 }}>
              <Pressable
                onPress={() => setField("acceptTerms", !form.acceptTerms)}
                style={{ flexDirection: "row", alignItems: "flex-start" }}
              >
                <View
                  style={[
                    s.checkbox,
                    form.acceptTerms && {
                      backgroundColor: "#059669",
                      borderColor: "#059669",
                    },
                  ]}
                />
                <Text style={{ marginLeft: 8, color: "#4b5563", flex: 1 }}>
                  Tôi đồng ý với{" "}
                  <Text style={s.link}>Điều khoản sử dụng</Text> và{" "}
                  <Text style={[s.link, { color: "#f59e0b" }]}>Chính sách bảo mật</Text>
                </Text>
              </Pressable>
              {errors.acceptTerms ? <Text style={s.err}>{errors.acceptTerms}</Text> : null}
            </View>

            <TouchableOpacity
              onPress={onSubmit}
              disabled={loading}
              style={[s.submitBtn, loading && { opacity: 0.6 }]}
              activeOpacity={0.9}
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.submitText}>Đăng ký</Text>}
            </TouchableOpacity>

            <View style={{ marginTop: 18, alignItems: "center" }}>
              <Text style={{ color: "#4b5563" }}>
                Đã có tài khoản?{" "}
                <Text
                  style={{ color: "#f59e0b", fontWeight: "600" }}
                  onPress={() => navigation.replace("Login")}
                >
                  Đăng nhập ngay
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  center: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
    textAlign: "center",
  },
  fieldWrap: { marginTop: 10 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "white",
  },
  inputError: { borderColor: "#ef4444" },
  err: { color: "#ef4444", fontSize: 12, marginTop: 6 },
  eyeBtn: { position: "absolute", right: 10, top: "50%", marginTop: -12, padding: 4 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "#d1d5db",
    backgroundColor: "white",
    marginTop: 2,
  },
  submitBtn: {
    marginTop: 16,
    backgroundColor: "#10b981",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitText: { color: "white", fontWeight: "700" },
  roleBtn: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  roleText: { fontWeight: "600", color: "#374151" },
  roleSelectedCustomer: { borderColor: "#3b82f6", backgroundColor: "#dbeafe" },
  roleSelectedCleaner: { borderColor: "#059669", backgroundColor: "#d1fae5" },
  roleTextActiveCustomer: { color: "#1d4ed8" },
  roleTextActiveCleaner: { color: "#047857" },
  link: { color: "#059669", fontWeight: "600" },
});
