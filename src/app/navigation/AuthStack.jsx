import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/customers/LoginScreen";
import RegisterScreen from "../../screens/customers/RegisterScreen";
import RecoveryScreen from "../../screens/RecoveryScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Đăng ký" }} />
      <Stack.Screen name="ForgotPassword" component={RecoveryScreen} options={{ title: "Khôi phục mật khẩu" }} />
    </Stack.Navigator>
  );
}
