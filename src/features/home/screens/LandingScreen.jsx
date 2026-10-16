import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import FeatureCard from "../components/FeatureCard";
import ServiceCard from "../components/ServiceCard";
import StepCard from "../components/StepCard";
import { featureItems, serviceItems, stepItems } from "../data/homeContent";

export default function LandingScreen({ navigation }) {
  const onBook = () => navigation.navigate("Booking");
  const onExplore = () => navigation.navigate("Services");

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <LinearGradient colors={["#065f46", "#10b981", "#f59e0b"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 28 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ marginBottom: 12, color: "#ffffff", fontSize: 30, lineHeight: 38, fontWeight: "900" }}>
            Giúp việc chuyên nghiệp, đặt lịch nhanh và dễ theo dõi
          </Text>
          <Text style={{ marginBottom: 18, color: "rgba(255,255,255,0.92)" }}>
            Giao diện mobile được tách gọn theo từng tính năng để bạn dễ dùng và đội ngũ dễ bảo trì hơn.
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            <TouchableOpacity onPress={onBook} style={{ borderRadius: 14, backgroundColor: "#ffffff", paddingVertical: 12, paddingHorizontal: 18 }}>
              <Text style={{ fontWeight: "700", color: "#111827" }}>Đặt lịch ngay</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onExplore} style={{ borderRadius: 14, borderWidth: 1.5, borderColor: "#ffffff", paddingVertical: 12, paddingHorizontal: 18 }}>
              <Text style={{ fontWeight: "700", color: "#ffffff" }}>Xem dịch vụ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: 20, paddingVertical: 24 }}>
        <Text style={{ marginBottom: 6, textAlign: "center", fontSize: 22, fontWeight: "800", color: "#111827" }}>
          Vì sao nên chọn CleanMate?
        </Text>
        <Text style={{ marginBottom: 16, textAlign: "center", color: "#6B7280" }}>
          Cấu trúc mới giúp phần nội dung gọn hơn, rõ hơn và đồng bộ tiếng Việt.
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          {featureItems.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </View>
      </View>

      <LinearGradient colors={["#065f46", "#047857", "#d97706"]} start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }} style={{ paddingVertical: 28 }}>
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ marginBottom: 6, textAlign: "center", fontSize: 22, fontWeight: "800", color: "#ffffff" }}>
            Dịch vụ nổi bật
          </Text>
          <Text style={{ marginBottom: 16, textAlign: "center", color: "rgba(255,255,255,0.88)" }}>
            Các nhóm dịch vụ chính đã được tách rõ ràng để dễ theo dõi hơn.
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}>
            {serviceItems.map((item) => (
              <ServiceCard key={item.title} {...item} onBook={onBook} />
            ))}
          </View>
        </View>
      </LinearGradient>

      <View style={{ paddingHorizontal: 20, paddingVertical: 28 }}>
        <Text style={{ marginBottom: 6, textAlign: "center", fontSize: 22, fontWeight: "800", color: "#111827" }}>
          Quy trình sử dụng
        </Text>
        <Text style={{ marginBottom: 16, textAlign: "center", color: "#6B7280" }}>
          Chỉ cần ba bước để bắt đầu với dịch vụ trên ứng dụng.
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          {stepItems.map((item) => (
            <StepCard key={item.number} {...item} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
