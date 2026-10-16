import { Button, Text, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import CleanerJobList from "../../components/CleanerJobList";

export default function CleanerHomeScreen() {
  const { user, logout } = useAuth();
  return <View style={{ flex: 1, padding: 16 }}>
    <Text style={{ fontSize: 22, fontWeight: "700" }}>Chào {user?.fullName}</Text>
    <Button title="Đăng xuất" onPress={logout} />
    <Text style={{ fontSize: 18, marginVertical: 12 }}>Công việc của tôi</Text>
    <CleanerJobList />
  </View>;
}