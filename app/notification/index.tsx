import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { NEU, PALETTE, SEVERITY_NEU, iconColorForFill } from '@/constants/neubrutalism';
import { NeuStackPage } from '@/components/ui/NeuPage';
import { NeoCard } from '@/components/ui/NeoCard';
import { Bell, AlertTriangle, Car, Info, Shield, Zap } from 'lucide-react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  read: boolean;
  created_at: string;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notifications')
      .select('id, title, message, type, severity, read, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setNotifications(data || []);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fetchNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications().then(() => setRefreshing(false));
  };

  const markAllRead = async () => {
    if (!user) return;
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false);
    fetchNotifications();
  };

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    fetchNotifications();
  };

  const formatTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const notificationIcon = (type: string) => {
    switch (type) {
      case 'violation': return AlertTriangle;
      case 'accident': return Shield;
      case 'missing_vehicle': return Car;
      case 'alert': return Bell;
      case 'system': return Info;
      case 'prediction': return Zap;
      default: return Bell;
    }
  };

  return (
    <NeuStackPage
      title="NOTIFICATIONS"
      subtitle={`${notifications.filter(n => !n.read).length} unread`}
      refreshing={refreshing}
      onRefresh={onRefresh}
      headerRight={
        <TouchableOpacity onPress={markAllRead} style={styles.markAll}>
          <Text style={styles.markAllText}>MARK ALL</Text>
        </TouchableOpacity>
      }
    >
      <Animated.View style={{ opacity: fadeAnim }}>
        {notifications.map((n) => {
          const Icon = notificationIcon(n.type);
          const fill = SEVERITY_NEU[n.severity] || PALETTE.blue;
          return (
            <NeoCard
              key={n.id}
              onPress={() => markRead(n.id)}
              backgroundColor={n.read ? NEU.paper : PALETTE.cyan}
              style={styles.card}
            >
              <View style={styles.row}>
                <View style={[styles.iconBox, { backgroundColor: fill }]}>
                  <Icon size={18} color={iconColorForFill(fill)} strokeWidth={2.5} />
                </View>
                <View style={styles.content}>
                  <View style={styles.head}>
                    <Text style={styles.title}>{n.title}</Text>
                    <Text style={styles.time}>{formatTime(n.created_at)}</Text>
                  </View>
                  <Text style={styles.message}>{n.message}</Text>
                  {!n.read ? <View style={styles.unreadDot} /> : null}
                </View>
              </View>
            </NeoCard>
          );
        })}
        {notifications.length === 0 && (
          <NeoCard contentStyle={styles.empty}>
            <Bell size={36} color={NEU.ink} strokeWidth={2.5} />
            <Text style={styles.emptyText}>No notifications</Text>
          </NeoCard>
        )}
      </Animated.View>
    </NeuStackPage>
  );
}

const styles = StyleSheet.create({
  markAll: {
    borderWidth: 2,
    borderColor: NEU.ink,
    backgroundColor: PALETTE.yellow,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 8,
  },
  markAllText: { fontSize: 10, fontWeight: '900', color: NEU.ink },
  card: { marginBottom: 10 },
  row: { flexDirection: 'row', gap: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: NEU.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flex: 1 },
  head: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  title: { fontSize: 14, fontWeight: '900', color: NEU.ink, flex: 1 },
  time: { fontSize: 10, fontWeight: '700', color: '#555' },
  message: { fontSize: 12, fontWeight: '600', color: '#444', marginTop: 4, lineHeight: 18 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PALETTE.magenta,
    borderWidth: 2,
    borderColor: NEU.ink,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyText: { fontSize: 14, fontWeight: '700', color: '#666' },
});
