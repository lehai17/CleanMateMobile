import { useUiPreferences as useCleanMateUi } from './../../ui/Preferences';
import { Text, View } from './../../ui/Preferences';
import CleanerJobList from "../../components/CleanerJobList";

export default function CleanerCalendarScreen() {
  useCleanMateUi();
  return <View style={{ flex: 1, padding: 16 }}>
    <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>Lịch công việc</Text>
    <CleanerJobList chronological />
  </View>;
}