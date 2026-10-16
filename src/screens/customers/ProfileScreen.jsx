// src/screens/ProfileScreen.js
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ScrollView, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { registerCleanerApi, resubmitCleanerApi, meApi } from "../../api/auth";

export default function ProfileScreen({ navigation }) {
  const { user, logout, refreshUser } = useAuth();
  const [registering, setRegistering] = useState(false);
  const [city, setCity] = useState(user?.cleanerProfile?.city || "Ha Noi");
  const [bio, setBio] = useState(user?.cleanerProfile?.bio || "");
  const registerCleaner = async () => {
    if (registering) return;
    setRegistering(true);
    try {
      const currentUser = await (user?.cleanerProfile ? resubmitCleanerApi : registerCleanerApi)({ bio, city, addressText: user?.address || "", hourlyRate: 120000 });
      await refreshUser(currentUser);
    } catch (error) {
      Alert.alert("Không thể đăng ký", error?.response?.data?.message || "Vui lòng thử lại.");
    } finally { setRegistering(false); }
  };

  // --- Nếu chưa đăng nhập ---
  if (!user) {
    return (
      <LinearGradient
        colors={["#059669", "#f59e0b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.centered}
      >
        <Ionicons name="person-circle-outline" size={100} color="#fff" />
        <Text style={styles.guestTitle}>Bạn chưa đăng nhập</Text>
        <Text style={styles.guestSubtitle}>
          Hãy đăng nhập hoặc tạo tài khoản để trải nghiệm đầy đủ dịch vụ
        </Text>

        <View style={styles.authActions}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Auth", { screen: "Login" })}
            style={[styles.authBtn, { backgroundColor: "#fff" }]}
          >
            <Text style={[styles.authBtnText, { color: "#059669" }]}>
              Đăng nhập
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Auth", { screen: "Register" })}
            style={[styles.authBtn, { backgroundColor: "#111827" }]}
          >
            <Text style={[styles.authBtnText, { color: "#fff" }]}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // --- Nếu đã đăng nhập ---
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header gradient */}
      <LinearGradient
        colors={["#059669", "#f59e0b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Image
          source={{ uri: "https://i.pravatar.cc/150?u=" + user.email }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.fullName}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </LinearGradient>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Vai trò</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>

        {/* Link đăng ký Cleaner */}
        {user.cleanerProfile && <View>
          <Text>Hồ sơ cleaner: {({ Pending: "Chờ duyệt", Rejected: "Từ chối", NeedsInfo: "Cần bổ sung" })[user.cleanerProfile.reviewStatus] || user.cleanerProfile.reviewStatus}</Text>
          {user.cleanerProfile.reviewReason && <Text>Lý do: {user.cleanerProfile.reviewReason}</Text>}
          <TouchableOpacity onPress={() => meApi().then(refreshUser).catch(() => Alert.alert("Lỗi", "Không thể tải lại hồ sơ."))}><Text>Tải lại trạng thái hồ sơ</Text></TouchableOpacity>
        </View>}
        <TextInput accessibilityLabel="Thành phố làm việc" value={city} onChangeText={setCity} maxLength={200} placeholder="Thành phố làm việc" />
        <TextInput accessibilityLabel="Giới thiệu kinh nghiệm" value={bio} onChangeText={setBio} maxLength={2000} multiline placeholder="Giới thiệu kinh nghiệm" />
        <TouchableOpacity
          onPress={registerCleaner}
          disabled={registering || user.cleanerProfile?.reviewStatus === "Pending"}
          style={styles.cleanerLink}
        >
          <Text style={styles.cleanerLinkText}>
            {user.cleanerProfile?.reviewStatus === "Pending" ? "Đang chờ xét duyệt" : user.cleanerProfile ? "Gửi lại hồ sơ cleaner" : "Đăng ký làm cleaner"}
          </Text>
        </TouchableOpacity>

        <Button title="Hỗ trợ đơn hàng" onPress={()=>navigation.navigate('Support')} />
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // --- Guest UI ---
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginTop: 16,
  },
  guestSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  authActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  authBtn: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  authBtnText: {
    fontWeight: "700",
    fontSize: 16,
  },

  // --- Logged in UI ---
  header: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
  },
  email: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  body: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  logoutBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "700",
  },
  cleanerLink: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#4F46E5", // tím đậm
  },
  cleanerLinkText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
