import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { NEU, PALETTE, iconColorForFill } from '@/constants/neubrutalism';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { PremiumButton } from '@/components/premium/PremiumButton';
import { User, Bell, Shield, LogOut, ChevronRight, Moon, Globe, Lock, HelpCircle, FileText } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';

interface MenuItem {
  icon: LucideIcon;
  label: string;
  action?: () => void;
  value?: string;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (val: boolean) => void;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleSignOut = async () => {
    await signOut();
    router.replace('/');
  };

  const menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'PROFILE',
      items: [
        { icon: User, label: 'Edit Profile', action: () => {} },
        { icon: Shield, label: 'Role & Permissions', value: profile?.role || 'Viewer', action: () => {} },
        { icon: Lock, label: 'Security', action: () => {} },
      ],
    },
    {
      title: 'PREFERENCES',
      items: [
        { icon: Moon, label: 'Dark Mode', toggle: true, toggleValue: darkMode, onToggle: setDarkMode },
        { icon: Bell, label: 'Notifications', toggle: true, toggleValue: notifications, onToggle: setNotifications },
        { icon: Globe, label: 'Language', value: 'English', action: () => {} },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { icon: FileText, label: 'About AEGIS', action: () => {} },
        { icon: HelpCircle, label: 'Help & Support', action: () => {} },
      ],
    },
  ];

  return (
    <PremiumScreen title="SETTINGS" padHorizontal noBackground>
      <NeoCard backgroundColor={PALETTE.cyan} contentStyle={styles.profileCard}>
        <View style={styles.avatar}>
          <User size={32} color={NEU.ink} strokeWidth={2.5} />
        </View>
        <Text style={styles.profileName}>{profile?.full_name || 'Officer'}</Text>
        <Text style={styles.profileEmail}>{profile?.email || 'user@aegis.gov'}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{(profile?.role || 'viewer').toUpperCase()}</Text>
        </View>
      </NeoCard>

      {menuSections.map((section, si) => (
        <View key={si} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, ii) => (
            <NeoCard key={ii} onPress={item.action} shadow={false} contentStyle={styles.menuItem}>
              <View style={styles.menuLeft}>
                <item.icon size={18} color={NEU.ink} strokeWidth={2.5} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuRight}>
                {item.toggle ? (
                  <Switch
                    value={item.toggleValue}
                    onValueChange={item.onToggle}
                    trackColor={{ false: '#ccc', true: PALETTE.green }}
                    thumbColor={NEU.paper}
                  />
                ) : (
                  <>
                    {item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
                    <ChevronRight size={16} color={NEU.ink} strokeWidth={2.5} />
                  </>
                )}
              </View>
            </NeoCard>
          ))}
        </View>
      ))}

      <PremiumButton label="Sign Out" onPress={handleSignOut} icon={LogOut} />
      <Text style={styles.footer}>AEGIS v1.0 | National Traffic Intelligence Network</Text>
      <View style={{ height: 24 }} />
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  profileCard: { alignItems: 'center', marginBottom: 20, marginTop: 4 },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: NEU.paper,
    borderWidth: NEU.borderWidth,
    borderColor: NEU.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  profileName: { fontSize: 20, fontWeight: '900', color: NEU.ink },
  profileEmail: { fontSize: 13, fontWeight: '600', color: '#444', marginTop: 4 },
  roleBadge: {
    backgroundColor: PALETTE.yellow,
    borderWidth: 2,
    borderColor: NEU.ink,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 10,
  },
  roleText: { fontSize: 10, fontWeight: '900', color: NEU.ink, letterSpacing: 1 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 11, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8, color: NEU.ink },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, marginBottom: 8 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuLabel: { fontSize: 14, fontWeight: '800', color: NEU.ink },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menuValue: { fontSize: 12, fontWeight: '600', color: '#555' },
  footer: { textAlign: 'center', fontSize: 10, fontWeight: '600', color: '#777', marginTop: 20, letterSpacing: 0.5 },
});
