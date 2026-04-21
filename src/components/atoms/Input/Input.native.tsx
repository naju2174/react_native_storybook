import * as React from 'react';
import { View, TextInput, type TextInputProps } from 'react-native';
import type { InputProps } from './Input.types';

type NativeInputProps = InputProps & Omit<TextInputProps, 'style'>;

// Dynamic border colors handled via style prop — NativeWind class extraction is
// compile-time only, so computed class strings are unreliable for runtime color changes.
const BORDER_COLOR: Record<string, { default: string; focused: string }> = {
  info:    { default: '#e0e0e0', focused: '#1355e9' }, // gray-5 → primary
  warning: { default: '#ffcb37', focused: '#ffcb37' }, // warning-9
  success: { default: '#55bf4d', focused: '#55bf4d' }, // success-8
  error:   { default: '#d20a36', focused: '#d20a36' }, // error-9
};

const SIZE_CLASS: Record<string, string> = {
  sm: 'h-9 text-sm',
  md: 'h-11 text-base',
  lg: 'h-12 text-lg',
};

export const Input = React.forwardRef<TextInput, NativeInputProps>(
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

    const borderColor = focused
      ? BORDER_COLOR[color].focused
      : BORDER_COLOR[color].default;

    const inputClassName = [
      'w-full bg-white border',
      SIZE_CLASS[size],
      rounded ? 'rounded-full' : 'rounded-lg',
      prefix ? 'pl-10' : 'pl-5',
      suffix ? 'pr-10' : 'pr-5',
      disabled ? 'opacity-50' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <View className="relative w-full">
        {prefix && (
          <View
            className={`absolute inset-y-0 left-0 items-center justify-center pl-3${disabled ? ' opacity-50' : ''}`}
          >
            {prefix}
          </View>
        )}

        <TextInput
          ref={ref}
          editable={!disabled}
          focusable={!disabled}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholderTextColor={disabled ? '#a1a1aa' : '#71717a'}
          underlineColorAndroid="transparent"
          className={inputClassName}
          style={{ borderColor, outlineWidth: 0 }}
          {...props}
        />

        {suffix && (
          <View
            className={`absolute inset-y-0 right-0 items-center justify-center pr-3${disabled ? ' opacity-50' : ''}`}
          >
            {suffix}
          </View>
        )}
      </View>
    );
  },
);

Input.displayName = 'Input';
