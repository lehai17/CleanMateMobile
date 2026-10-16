import { Raw, useUiPreferences as useCleanMateUi } from './../../ui/Preferences';
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Button } from './../../ui/Preferences';
import { getServices } from "../../api/services";
export default function ServicesScreen({ navigation }) {
  useCleanMateUi();
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const load = () => { setError(""); getServices().then(setItems).catch(() => setError("Không thể tải dịch vụ. Vui lòng thử lại.")); };
  useEffect(() => { load(); }, []);
  return <ScrollView contentContainerStyle={{ padding: 20, gap: 15 }}>
    <Text style={{ fontSize: 25, fontWeight: "700" }}>Dịch vụ CleanMate</Text>
    <Text>Giá hiện tại theo giờ. Khách trả tiền mặt trực tiếp sau khi hoàn thành ca.</Text>
    {error ? <View><Text>{error}</Text><Button title="Thử lại" onPress={load} /></View> : null}
    {!items && !error && <Text>Đang tải dịch vụ...</Text>}
    {items?.length === 0 && <Text>Hiện chưa có dịch vụ mở đặt lịch.</Text>}
    {items?.map(item => <View key={item.key} style={{ padding: 18, borderRadius: 12, backgroundColor: "#ecfdf5" }}>
      <Text style={{ fontSize: 19, fontWeight: "700" }}>{<Raw>{item.name}</Raw>}</Text>
      <Text>{item.hourlyRate.toLocaleString("vi-VN")} đ/giờ · {item.minHours}–{item.maxHours} giờ</Text>
      <Button title="Đặt lịch" onPress={() => navigation.navigate("Booking")} />
    </View>)}
  </ScrollView>;
}