import { Text, View } from "react-native";

export default function StepCard({ number, title, description }) {
  return (
    <View style={{ flex: 1, marginHorizontal: 4, alignItems: "center" }}>
      <View style={{ width: 56, height: 56, borderRadius: 9999, marginBottom: 6, alignItems: "center", justifyContent: "center", backgroundColor: "#059669" }}>
        <Text style={{ fontSize: 18, fontWeight: "800", color: "#ffffff" }}>{number}</Text>
      </View>
      <Text style={{ marginBottom: 6, textAlign: "center", fontSize: 16, fontWeight: "700", color: "#111827" }}>{title}</Text>
      <Text style={{ textAlign: "center", color: "#6B7280" }}>{description}</Text>
    </View>
  );
}
