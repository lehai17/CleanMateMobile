import { Text, View } from "react-native";

export default function FeatureCard({ icon, title, description }) {
  return (
    <View style={{ flex: 1, marginHorizontal: 4, borderRadius: 16, borderWidth: 1, borderColor: "#BBF7D0", backgroundColor: "#F0FDF4", padding: 16, alignItems: "center" }}>
      <Text style={{ marginBottom: 8, fontSize: 28 }}>{icon}</Text>
      <Text style={{ marginBottom: 8, textAlign: "center", fontSize: 16, fontWeight: "700", color: "#111827" }}>{title}</Text>
      <Text style={{ textAlign: "center", lineHeight: 20, color: "#6B7280" }}>{description}</Text>
    </View>
  );
}
