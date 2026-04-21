import * as React from 'react';
import type { InputProps } from './Input.types';

type WebInputProps = InputProps & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix' | 'onChange'>;

const BORDER: Record<string, string> = {
  info: '#1355e9',
  warning: '#ffcb37',
  success: '#55bf4d',
  error: '#d20a36',
};

const SIZE: Record<string, React.CSSProperties> = {
  sm: { height: 36, fontSize: 14 },
  md: { height: 44, fontSize: 16 },
  lg: { height: 48, fontSize: 18 },
};

const containerStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
};

const adornmentBase: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  pointerEvents: 'none',
};

export const Input = React.forwardRef<HTMLInputElement, WebInputProps>(
  (
    {
      size = 'md',
      color = 'info',
      rounded = false,
      disabled = false,
      prefix,
      suffix,
      onChangeText,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = React.useState(false);

    const borderColor =
      color === 'info' ? (focused ? BORDER.info : '#e0e0e0') : BORDER[color];

    const inputStyle: React.CSSProperties = {
      width: '100%',
      backgroundColor: 'white',
      border: `1px solid ${borderColor}`,
      borderRadius: rounded ? 9999 : 8,
      outline: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'text',
      paddingLeft: prefix ? 40 : 20,
      paddingRight: suffix ? 40 : 20,
      ...SIZE[size],
      transition: 'border-color 0.15s ease',
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeText?.(e.target.value);
    };

    return (
      <div style={containerStyle}>
        {prefix && (
          <div
            style={{
              ...adornmentBase,
              left: 0,
              paddingLeft: 12,
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          disabled={disabled}
          style={inputStyle}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />

        {suffix && (
          <div
            style={{
              ...adornmentBase,
              right: 0,
              paddingRight: 12,
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {suffix}
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
