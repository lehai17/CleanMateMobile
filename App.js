import { useUiPreferences as useCleanMateUi } from './src/ui/Preferences';
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/app/navigation/RootNavigator";
import { UiPreferencesProvider } from './src/ui/Preferences';

export default function App() {
  useCleanMateUi();
  return (
    <UiPreferencesProvider><AuthProvider>
      <RootNavigator />
    </AuthProvider></UiPreferencesProvider>
  );
}
