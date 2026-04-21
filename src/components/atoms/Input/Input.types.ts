import type { ReactNode } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputColor = 'info' | 'warning' | 'success' | 'error';

export interface InputProps {
  size?: InputSize;
  color?: InputColor;
  rounded?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
}
