import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../../screens/customers/LoginScreen";
import RegisterScreen from "../../screens/customers/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Đăng nhập" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Đăng ký" }} />
    </Stack.Navigator>
  );
}
