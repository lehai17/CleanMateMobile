import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import CleanerHomeScreen from "../screens/cleaner/HomeScreen";
import FindJobScreen from "../screens/cleaner/FindJobScreen";
import CleanerCalendarScreen from "../screens/cleaner/CleanerCalendarScreen";
import CleanerProfileScreen from "../screens/cleaner/CleanerProfileScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import { useNotifications } from "../context/NotificationContext";

const Tab = createBottomTabNavigator();

export default function CleanerTabs() {
  const { unreadCount } = useNotifications();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#16a34a",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { paddingVertical: 8, height: 70 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            CleanerHome: "home",
            FindJob: "search",
            Calendar: "calendar",
            Notifications: "notifications",
            CleanerProfile: "person",
          };
          return (
            <Ionicons
              name={icons[route.name] || "ellipse"}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="CleanerHome"
        component={CleanerHomeScreen}
        options={{ title: "Trang chủ" }}
      />
      <Tab.Screen
        name="FindJob"
        component={FindJobScreen}
        options={{ title: "Tìm việc" }}
      />
      <Tab.Screen
        name="Calendar"
        component={CleanerCalendarScreen}
        options={{ title: "Lịch" }}
      />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: "Thông báo", tabBarBadge: unreadCount > 0 ? unreadCount : undefined }} />
      <Tab.Screen
        name="CleanerProfile"
        component={CleanerProfileScreen}
        options={{ title: "Cá nhân" }}
      />
    </Tab.Navigator>
  );
}
