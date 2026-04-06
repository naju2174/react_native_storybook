import { Pressable, Text, StyleSheet } from 'react-native';
import type { ButtonProps } from './Button.types';

const sizes = {
  small: { paddingVertical: 10, paddingHorizontal: 16, fontSize: 12 },
  medium: { paddingVertical: 11, paddingHorizontal: 20, fontSize: 14 },
  large: { paddingVertical: 12, paddingHorizontal: 24, fontSize: 16 },
};

export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  onClick,
}: ButtonProps) => {
  const sizeStyle = sizes[size];

  return (
    <Pressable
      onPress={onClick}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !onClick }}
      style={[
        styles.base,
        primary ? styles.primary : styles.secondary,
        { paddingVertical: sizeStyle.paddingVertical, paddingHorizontal: sizeStyle.paddingHorizontal, minHeight: 44 },
        backgroundColor ? { backgroundColor } : undefined,
      ]}
    >
      <Text
        style={[
          styles.label,
          primary ? styles.primaryLabel : styles.secondaryLabel,
          { fontSize: sizeStyle.fontSize },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#555ab9',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  label: {
    fontWeight: '700',
    lineHeight: 16,
  },
  primaryLabel: {
    color: '#ffffff',
  },
  secondaryLabel: {
    color: '#333333',
  },
});
