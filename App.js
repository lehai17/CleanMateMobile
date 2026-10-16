import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/app/navigation/RootNavigator";

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
