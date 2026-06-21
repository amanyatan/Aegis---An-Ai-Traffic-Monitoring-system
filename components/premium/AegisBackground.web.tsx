import { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '@/constants/theme';

export function AegisBackground({ intensity = 1 }: { intensity?: number }) {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <View style={styles.root} pointerEvents="none">
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(65, 90, 119, 0.35) 0%, transparent 45%), linear-gradient(180deg, ${COLORS.abyss} 0%, ${COLORS.deep} 50%, ${COLORS.abyss} 100%)`,
        }}
      />
      <div className="aegis-grid" style={styles.grid as object} />
      <div className="aegis-aurora" style={{ opacity: intensity }} />
      <ParticleField />
      <div style={styles.vignette as object} />
    </View>
  );
}

function ParticleField() {
  const particles = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
    }))
  ).current;

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="aegis-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    inset: 0,
    opacity: 0.4,
  },
  vignette: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(13, 27, 42, 0.5)',
  },
});
