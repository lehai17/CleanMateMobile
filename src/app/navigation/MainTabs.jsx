import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import LandingScreen from "../../features/home/screens/LandingScreen";
import ServicesScreen from "../../screens/customers/ServicesScreen";
import BookingScreen from "../../screens/customers/BookingScreen";
import OrdersScreen from "../../screens/customers/OrdersScreen";
import ProfileScreen from "../../screens/customers/ProfileScreen";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import NotificationsScreen from "../../screens/NotificationsScreen";
import { useNotifications } from "../../context/NotificationContext";

const Tab = createBottomTabNavigator();

function ProtectedScreen({ navigation, children }) {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) navigation.navigate("Auth", { screen: "Login" });
  }, [navigation, user]);
  if (!user) return null;
  return children;
}

function BookingProtected(props) {
  return (
    <ProtectedScreen {...props}>
      <BookingScreen />
    </ProtectedScreen>
  );
}

function OrdersProtected(props) {
  return (
    <ProtectedScreen {...props}>
      <OrdersScreen />
    </ProtectedScreen>
  );
}

function NotificationsProtected(props) {
  return <ProtectedScreen {...props}><NotificationsScreen {...props} /></ProtectedScreen>;
}

export default function MainTabs() {
  const { unreadCount } = useNotifications();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: "#059669",
        tabBarInactiveTintColor: "#6B7280",
        tabBarIcon: ({ color, size }) => {
          const map = {
            Home: "home",
            Services: "grid",
            Booking: "calendar",
            Orders: "list",
            Profile: "person",
            Notifications: "notifications",
          };
          return <Ionicons name={map[route.name] || "ellipse"} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={LandingScreen} options={{ title: "Trang chủ" }} />
      <Tab.Screen name="Services" component={ServicesScreen} options={{ title: "Dịch vụ" }} />
      <Tab.Screen name="Booking" component={BookingProtected} options={{ title: "Đặt lịch" }} />
      <Tab.Screen name="Orders" component={OrdersProtected} options={{ title: "Đơn hàng" }} />
      <Tab.Screen name="Notifications" component={NotificationsProtected} options={{ title: "Thông báo", tabBarBadge: unreadCount > 0 ? unreadCount : undefined }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: "Hồ sơ" }} />
    </Tab.Navigator>
  );
}
