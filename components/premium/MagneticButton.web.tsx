import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { COLORS, FONTS, RADIUS } from '@/constants/theme';

type MagneticButtonWebProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
};

export function MagneticButtonWeb({
  children,
  onClick,
  variant = 'primary',
  disabled,
}: MagneticButtonWebProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({
      x: (e.clientX - rect.left - rect.width / 2) * 0.15,
      y: (e.clientY - rect.top - rect.height / 2) * 0.15,
    });
  };

  const baseStyle: React.CSSProperties = {
    fontFamily: FONTS.heading,
    fontSize: 14,
    letterSpacing: '0.08em',
    color: COLORS.pearl,
    borderRadius: RADIUS.md,
    padding: '16px 28px',
    border: '1px solid rgba(119, 141, 169, 0.35)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    background:
      variant === 'primary'
        ? `linear-gradient(135deg, ${COLORS.slate}, ${COLORS.mist})`
        : 'rgba(27, 38, 59, 0.5)',
    backdropFilter: 'blur(12px)',
    transition: 'box-shadow 0.3s ease',
    boxShadow: variant === 'primary' ? `0 0 24px ${COLORS.accentGlow}` : 'none',
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      disabled={disabled}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      style={baseStyle}
    >
      {children}
    </motion.button>
  );
}
