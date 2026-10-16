import { Text, View } from "react-native";
import CleanerJobList from "../../components/CleanerJobList";

export default function CleanerCalendarScreen() {
  return <View style={{ flex: 1, padding: 16 }}>
    <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>Lịch công việc</Text>
    <CleanerJobList chronological />
  </View>;
}