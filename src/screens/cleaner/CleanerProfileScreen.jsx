import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const CleanerProfileScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.row}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>MH</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editIcon}>✎</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Mai Hương</Text>
            <Text style={styles.role}>Chuyên viên dọn dẹp chuyên nghiệp</Text>
            <View style={styles.row}>
              <Text style={styles.rating}>⭐ 4.8 (234)</Text>
              <Text style={styles.activeDot}>●</Text>
              <Text style={styles.active}>Đang hoạt động</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.purpleButton}>
            <Text style={styles.purpleText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { color: "#3b82f6", label: "Công việc", value: "156" },
            { color: "#16a34a", label: "Thu nhập", value: "12.5M" },
            { color: "#8b5cf6", label: "Hoàn thành", value: "98%" },
            { color: "#f97316", label: "Kinh nghiệm", value: "2.5 năm" },
          ].map((s) => (
            <View
              key={s.label}
              style={[styles.statBox, { backgroundColor: `${s.color}15` }]}
            >
              <Text style={[styles.statValue, { color: s.color }]}>
                {s.value}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        {["Thông tin cá nhân", "Kỹ năng & chứng chỉ", "Khu vực làm việc"].map(
          (title, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem}>
              <Text style={styles.menuText}>{title}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Work Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Công việc</Text>
        {["Thống kê thu nhập", "Đánh giá & Nhận xét", "Lịch sử công việc"].map(
          (title, idx) => (
            <TouchableOpacity key={idx} style={styles.menuItem}>
              <Text style={styles.menuText}>{title}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cài đặt</Text>
        {["Thông báo", "Bảo mật", "Thanh toán"].map((title, idx) => (
          <TouchableOpacity key={idx} style={styles.menuItem}>
            <Text style={styles.menuText}>{title}</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CleanerProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  headerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "center" },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8b5cf6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: { fontSize: 28, color: "#fff", fontWeight: "800" },
  editButton: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
  },
  editIcon: { color: "#fff", fontSize: 14, fontWeight: "700" },
  name: { fontSize: 20, fontWeight: "800", color: "#111827" },
  role: { color: "#6b7280", marginBottom: 4 },
  rating: { color: "#facc15", fontWeight: "600" },
  activeDot: { color: "#16a34a", marginHorizontal: 4 },
  active: { color: "#16a34a", fontWeight: "600" },
  purpleButton: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  purpleText: { color: "#fff", fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statBox: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 8,
    marginHorizontal: 4,
    alignItems: "center",
  },
  statValue: { fontSize: 16, fontWeight: "700" },
  statLabel: { fontSize: 12, color: "#6b7280" },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "800",
    fontSize: 16,
    color: "#111827",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  menuText: { color: "#374151", fontWeight: "500" },
  arrow: { color: "#9ca3af", fontSize: 18 },
  logoutButton: {
    backgroundColor: "#fee2e2",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 24,
  },
  logoutText: { color: "#dc2626", fontWeight: "700", fontSize: 16 },
});
