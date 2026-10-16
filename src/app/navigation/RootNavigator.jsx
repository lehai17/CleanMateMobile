import { t, useUiPreferences as useCleanMateUi } from './../../ui/Preferences';
import { ActivityIndicator, View, Text, Button } from './../../ui/Preferences';
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
  const { loading, user, restoreError, restore, logout, logoutFailed } = useAuth();
  if (loading) return <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}><ActivityIndicator /></View>;
  if(restoreError)return <View style={{padding:24,gap:16}}><Text accessibilityRole="alert">{restoreError}</Text><Button title={logoutFailed?'Thử đăng xuất lại':'Thử kết nối lại'} onPress={restore}/><Button title="Đăng nhập bằng tài khoản khác" onPress={logout}/></View>;
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
