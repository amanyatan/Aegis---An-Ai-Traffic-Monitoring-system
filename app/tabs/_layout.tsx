import { Tabs } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';
import { COLORS, FONTS } from '@/constants/theme';
import { LayoutDashboard, Camera, AlertTriangle, Car, BarChart3, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.deep,
          borderTopWidth: 1,
          borderTopColor: 'rgba(119, 141, 169, 0.2)',
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.pearl,
        tabBarInactiveTintColor: COLORS.pearlSubtle,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ size, color }) => (
            <LayoutDashboard size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          title: 'Live Feed',
          tabBarIcon: ({ size, color }) => <Camera size={size} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="violations"
        options={{
          title: 'Violations',
          tabBarIcon: ({ size, color }) => (
            <AlertTriangle size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="vehicles"
        options={{
          title: 'Vehicles',
          tabBarIcon: ({ size, color }) => <Car size={size} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ size, color }) => (
            <BarChart3 size={size} color={color} strokeWidth={1.5} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => <Settings size={size} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 10,
    letterSpacing: 0.3,
  },
});
