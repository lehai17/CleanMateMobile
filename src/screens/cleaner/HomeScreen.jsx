import { Raw, useUiPreferences as useCleanMateUi } from './../../ui/Preferences';
import { Button, Text, View } from './../../ui/Preferences';
import { useAuth } from "../../context/AuthContext";
import CleanerJobList from "../../components/CleanerJobList";

export default function CleanerHomeScreen() {
  useCleanMateUi();
  const { user, logout } = useAuth();
  return <View style={{ flex: 1, padding: 16 }}>
    <Text style={{ fontSize: 22, fontWeight: "700" }}>Chào {<Raw>{user?.fullName}</Raw>}</Text>
    <Button title="Đăng xuất" onPress={logout} />
    <Text style={{ fontSize: 18, marginVertical: 12 }}>Công việc của tôi</Text>
    <CleanerJobList />
  </View>;
}