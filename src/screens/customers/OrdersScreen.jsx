import { Raw, useUiPreferences as useCleanMateUi } from './../../ui/Preferences';
import React, { useState, useCallback, useRef } from "react";
import { StyleSheet, Linking, Platform } from 'react-native';
import { View, Text, FlatList, Button, Alert, TextInput } from './../../ui/Preferences';
import DateTimePicker from "@react-native-community/datetimepicker";
import { getOrders, deleteOrder, confirmOrderCompletion, rescheduleOrder, getRebooking } from "../../api/orders";
import { randomUUID } from "expo-crypto";
import { useAuth } from "../../context/AuthContext";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { paymentLabel } from "../../utils/payment";
import { phoneLink } from "../../utils/contact";

export default function OrdersScreen() {
  useCleanMateUi();
  const navigation = useNavigation();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [rescheduling, setRescheduling] = useState(null);
  const [newTime, setNewTime] = useState(new Date());
  const [picker, setPicker] = useState(null);
  const pending = useRef(false);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try { setOrders(await getOrders(user.id)); }
    catch (error) { Alert.alert("Lỗi", error?.response?.data?.message || "Không thể tải đơn hàng."); }
    finally { setLoading(false); }
  }, [user?.id]);
  useFocusEffect(useCallback(() => { load(); }, [load]));

  const rebook = async id => {
    if (pending.current) return;
    pending.current = true; setBusyId(id);
    try {
      const template = await getRebooking(id);
      navigation.navigate('Booking', { rebook: template, rebookKey: randomUUID() });
    } catch (error) {
      Alert.alert("Không thể đặt lại", error?.response?.data?.message || "Không thể tải thông tin. Vui lòng thử lại.");
      if (error?.response?.status === 409) await load();
    } finally { pending.current = false; setBusyId(null); }
  };

  const callCleaner = async phone => {
    try { await Linking.openURL(phoneLink(phone)); }
    catch { Alert.alert("Không thể mở cuộc gọi", "Hãy gọi số điện thoại hiển thị trong đơn hàng."); }
  };

  const cancel = id => Alert.alert("Hủy đơn", "Bạn muốn hủy đơn này?", [
    { text: "Đóng", style: "cancel" },
    { text: "Hủy đơn", style: "destructive", onPress: async () => {
      if (pending.current) return;
      pending.current = true; setBusyId(id);
      try { await deleteOrder(id); await load(); }
      catch (error) { Alert.alert("Lỗi", error?.response?.data?.message || "Không thể hủy đơn."); }
      finally { pending.current = false; setBusyId(null); }
    } },
  ]);

  const submitFeedback = async id => {
    if (pending.current || !rating) return;
    pending.current = true; setBusyId(id);
    try {
      const result = await confirmOrderCompletion(id, { rating, review });
      setOrders(current => current.map(order => order.id === id ? { ...order, ...result } : order));
      setEditingId(null);
    } catch (error) { Alert.alert("Lỗi", error?.response?.data?.message || "Không thể gửi đánh giá."); }
    finally { pending.current = false; setBusyId(null); }
  };

  const saveSchedule = async () => {
    if (pending.current || !rescheduling) return;
    if (newTime <= new Date()) {
      Alert.alert("Ngày giờ không hợp lệ", "Vui lòng chọn ngày giờ trong tương lai."); return;
    }
    pending.current = true; setBusyId(rescheduling.id);
    try {
      const result = await rescheduleOrder(rescheduling.id, {
        startTime: newTime.toISOString(), expectedStartTime: rescheduling.date || rescheduling.startTime,
      });
      setOrders(current => current.map(order => order.id === rescheduling.id ? { ...order, ...result } : order));
      setRescheduling(null); setPicker(null);
      Alert.alert("Đã đổi lịch", "Giá và thời lượng giữ nguyên.");
    } catch (error) {
      Alert.alert("Không thể đổi lịch", error?.response?.data?.message || "Vui lòng thử lại.");
      if (error?.response?.status === 409) { setRescheduling(null); setPicker(null); await load(); }
    } finally { pending.current = false; setBusyId(null); }
  };

  return <View style={styles.container}>
    <Text style={styles.title}>Đơn hàng của tôi</Text>
    <Text>Khách trả tiền mặt trực tiếp cho cleaner sau khi hoàn thành ca. CleanMate không thu hoặc giữ tiền.</Text>
    <Button title="Tải lại trạng thái" onPress={load} disabled={loading || busyId !== null} />
    {loading && <Text>Đang tải…</Text>}
    <FlatList data={orders} keyExtractor={item => String(item.id)} contentContainerStyle={{ gap: 8 }}
      renderItem={({ item }) => <View style={styles.card}>
        <Text style={styles.code}>CM{String(item.id).padStart(6, "0")}</Text>
        <Text>Ngày: {formatDate(item.date || item.startTime || item.createdAt)}</Text>
        <Text>Địa chỉ: {<Raw>{item.address || "-"}</Raw>}</Text>
        {item.contactName && <Text>Người liên hệ: {<Raw>{item.contactName}</Raw>}</Text>}
        {item.contactPhone && <Text>SĐT liên hệ: {<Raw>{item.contactPhone}</Raw>}</Text>}
        {item.cleaner ? <View>
          <Text>Cleaner nhận việc: {<Raw>{item.cleaner.name}</Raw>}</Text>
          <Text>{<Raw>{item.cleaner.phoneNumber || "Chưa cập nhật số điện thoại"}</Raw>}</Text>
          {phoneLink(item.cleaner.phoneNumber) && <Button title="Gọi cleaner" onPress={() => callCleaner(item.cleaner.phoneNumber)} />}
        </View> : <Text>Chưa có cleaner nhận việc</Text>}
        <Text>Giá: {Number(item.price || 0).toLocaleString("vi-VN")} đ</Text>
        <Text>Thanh toán: {item.paymentMethod === "cash" ? "Tiền mặt trực tiếp" : "Ghi nhận cũ"}</Text>
        <Text>{paymentLabel(item.paymentStatus, item.paymentMethod)}</Text>
        {item.paidAt && <Text>Thời gian xác nhận: {formatDate(item.paidAt)}</Text>}
        <Text>Trạng thái: {item.status}</Text>
        {["Completed", "Cancelled"].includes(item.status) && <Button title="Đặt lại" disabled={busyId !== null} onPress={() => rebook(item.id)} />}
        {item.startedAt && <Text>Bắt đầu: {formatDate(item.startedAt)}</Text>}
        {item.completedAt && <Text>Hoàn thành: {formatDate(item.completedAt)}</Text>}
        {item.customerConfirmedAt && <View>
          <Text>Khách đã xác nhận hoàn thành</Text>
          <Text>Đánh giá: {item.customerRating}/5 sao</Text>
          {item.customerReview && <Text>{<Raw>{item.customerReview}</Raw>}</Text>}
        </View>}
        <Button title="Hủy đơn" color="#e11d48" onPress={() => cancel(item.id)}
          disabled={busyId !== null || item.status !== "Pending" || new Date(item.date || item.startTime) <= new Date()} />
        {item.status === "Pending" && !item.cleaner && new Date(item.date || item.startTime) > new Date() &&
          (rescheduling?.id === item.id ? <View>
            <Text>Chỉ đổi ngày/giờ khi chưa có cleaner nhận. Giá và thời lượng giữ nguyên.</Text>
            <Text>Ngày giờ mới: {formatDate(newTime)}</Text>
            <Button title="Chọn ngày mới" disabled={busyId !== null} onPress={() => setPicker("date")} />
            <Button title="Chọn giờ mới" disabled={busyId !== null} onPress={() => setPicker("time")} />
            {picker && <DateTimePicker value={newTime} mode={picker} minimumDate={picker === "date" ? new Date() : undefined}
              onChange={(event, value) => {
                if (Platform.OS === "android") setPicker(null);
                if (event.type === "dismissed" || !value) return;
                const updated = new Date(newTime);
                if (picker === "date") updated.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
                else updated.setHours(value.getHours(), value.getMinutes(), 0, 0);
                setNewTime(updated);
              }} />}
            <Button title="Lưu lịch mới" disabled={busyId !== null} onPress={saveSchedule} />
            <Button title="Đóng" disabled={busyId !== null} onPress={() => { setRescheduling(null); setPicker(null); }} />
          </View> : <Button title="Đổi lịch" disabled={busyId !== null} onPress={() => {
            setRescheduling(item); setNewTime(new Date(item.date || item.startTime));
            setPicker(null); setEditingId(null);
          }} />)}
        {item.status === "Completed" && !item.customerConfirmedAt && (editingId === item.id ? <View>
          <Text>Xác nhận công việc đã hoàn thành. Đánh giá này không xác nhận đã trả tiền.</Text>
          <Text>Đánh giá ca làm: {rating || "chưa chọn"}/5 sao</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            {[1, 2, 3, 4, 5].map(value => <Button key={value} title={`${value} sao`}
              disabled={busyId !== null} color={rating === value ? "#059669" : "#64748b"} onPress={() => setRating(value)} />)}
          </View>
          <TextInput accessibilityLabel="Nhận xét ca làm" placeholder="Nhận xét (không bắt buộc)" multiline
            maxLength={1000} value={review} editable={busyId === null} onChangeText={setReview} style={styles.input} />
          <Button title="Gửi đánh giá" disabled={busyId !== null || !rating} onPress={() => submitFeedback(item.id)} />
          <Button title="Đóng" disabled={busyId !== null} onPress={() => setEditingId(null)} />
        </View> : <Button title="Xác nhận và đánh giá" disabled={busyId !== null} onPress={() => {
          setEditingId(item.id); setRating(0); setReview("");
          setRescheduling(null); setPicker(null);
        }} />)}
      </View>}
    />
  </View>;
}
function formatDate(value) { return value ? new Date(value).toLocaleString("vi-VN") : "-"; }
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 }, title: { fontSize: 20, fontWeight: "700", marginBottom: 12 },
  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 12, padding: 12, backgroundColor: "white" },
  code: { fontWeight: "800", color: "#059669", marginBottom: 4 },
  input: { borderWidth: 1, borderColor: "#cbd5e1", padding: 10, marginVertical: 8, borderRadius: 8 },
});
