import { t, useUiPreferences as useCleanMateUi } from './../../ui/Preferences';
import { ActivityIndicator, View } from './../../ui/Preferences';
import { NavigationContainer } from './../../ui/Preferences';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../../context/AuthContext";
import AuthStack from "./AuthStack";
import MainTabs from "./MainTabs";
import CleanerTabs from "../../navigation/CleanerTabs";
import { NotificationProvider } from "../../context/NotificationContext";
import OrdersScreen from "../../screens/customers/OrdersScreen";
import SupportScreen from '../../screens/SupportScreen';
import SecurityScreen from '../../screens/SecurityScreen';

const RootStack = createNativeStackNavigator();
export default function RootNavigator() {
  useCleanMateUi();
  const { loading, user } = useAuth();
  if (loading) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator /></View>;
  return (
    <NotificationProvider><NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {user?.role === "Cleaner" && user?.isCleaner ? (
          <RootStack.Screen name="CleanerTabs" component={CleanerTabs} />
        ) : (
          <RootStack.Screen name="Root" component={MainTabs} />
        )}
        {!user && <RootStack.Screen name="Auth" component={AuthStack} />}
        {user && <RootStack.Screen name="CustomerOrders" component={OrdersScreen} options={{ headerShown: true, title: t("Đơn hàng của tôi") }} />}
        {user && <RootStack.Screen name="Support" component={SupportScreen} options={{headerShown:true,title:t('Hỗ trợ')}} />}
        {user && <RootStack.Screen name="Security" component={SecurityScreen} options={{headerShown:true,title:t('Đổi mật khẩu')}} />}
      </RootStack.Navigator>
    </NavigationContainer></NotificationProvider>
  );
}
