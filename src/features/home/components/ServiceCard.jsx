import { useUiPreferences as useCleanMateUi } from './../../../ui/Preferences';
import { Text, TouchableOpacity, View } from './../../../ui/Preferences';

export default function ServiceCard({ icon, title, description, onBook }) {
  useCleanMateUi();
  return (
    <View style={{ width: "48%", borderRadius: 16, backgroundColor: "#ffffff", padding: 16, borderWidth: 1, borderColor: "#E5E7EB" }}>
      <Text style={{ marginBottom: 8, fontSize: 28 }}>{icon}</Text>
      <Text style={{ marginBottom: 6, fontSize: 16, fontWeight: "700", color: "#111827" }}>{title}</Text>
      <Text style={{ marginBottom: 10, color: "#6B7280" }}>{description}</Text>
      <Text style={{ marginBottom: 12, fontWeight: "800", color: "#059669" }}>Xem giá hiện tại khi đặt lịch</Text>
      <TouchableOpacity onPress={onBook} style={{ borderRadius: 12, backgroundColor: "#059669", paddingVertical: 10, alignItems: "center" }}>
        <Text style={{ fontWeight: "700", color: "#ffffff" }}>Đặt lịch</Text>
      </TouchableOpacity>
    </View>
  );
}
