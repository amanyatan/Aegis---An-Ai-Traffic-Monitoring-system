import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/theme';

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <View style={styles.track} pointerEvents="none">
      <View style={[styles.bar, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: 'fixed' as unknown as 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(119, 141, 169, 0.15)',
    zIndex: 9999,
  },
  bar: {
    height: 2,
    backgroundColor: COLORS.mist,
    boxShadow: `0 0 12px ${COLORS.accentGlow}`,
  },
});
