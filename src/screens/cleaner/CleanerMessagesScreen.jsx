import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const CleanerMessagesScreen = () => {
  const chats = [
    {
      id: 1,
      name: "Chị Lan Anh",
      message: "Chị đã đến chưa ạ? Tôi đang chờ ở tầng 1",
      time: "10:30",
      color: "#8b5cf6",
    },
    {
      id: 2,
      name: "Anh Minh",
      message: "Cảm ơn chị đã dọn dẹp rất sạch sẽ!",
      time: "09:15",
      color: "#16a34a",
    },
    {
      id: 3,
      name: "Chị Thu",
      message: "Chị có thể đến sớm hơn 30 phút được không?",
      time: "Hôm qua",
      color: "#6366f1",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>💬 Tin nhắn</Text>

      {chats.map((chat) => (
        <TouchableOpacity key={chat.id} style={styles.chatCard}>
          <View style={[styles.avatar, { backgroundColor: chat.color }]}>
            <Text style={styles.avatarText}>
              {chat.name.split(" ").pop()[0]}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.chatHeader}>
              <Text style={styles.name}>{chat.name}</Text>
              <Text style={styles.time}>{chat.time}</Text>
            </View>
            <Text style={styles.message} numberOfLines={1}>
              {chat.message}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CleanerMessagesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#6d28d9",
    marginBottom: 12,
  },
  chatCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  chatHeader: { flexDirection: "row", justifyContent: "space-between" },
  name: { fontWeight: "700", color: "#111827", fontSize: 15 },
  time: { color: "#6b7280", fontSize: 12 },
  message: { color: "#4b5563", marginTop: 2 },
});
