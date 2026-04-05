import type { ButtonProps } from './Button.types';

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: 'inline-block',
    cursor: 'pointer',
    border: 0,
    borderRadius: '3em',
    fontWeight: 700,
    lineHeight: 1,
    fontFamily: "'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  primary: {
    backgroundColor: '#555ab9',
    color: 'white',
  },
  secondary: {
    boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset',
    backgroundColor: 'transparent',
    color: '#333',
  },
  small: { padding: '10px 16px', fontSize: 12 },
  medium: { padding: '11px 20px', fontSize: 14 },
  large: { padding: '12px 24px', fontSize: 16 },
};

export const Button = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  onClick,
}: ButtonProps) => (
  <button
    type="button"
    aria-label={label}
    style={{
      ...styles.base,
      ...(primary ? styles.primary : styles.secondary),
      ...styles[size],
      ...(backgroundColor ? { backgroundColor } : {}),
      minHeight: 44,
    }}
    onClick={onClick}
  >
    {label}
  </button>
);
