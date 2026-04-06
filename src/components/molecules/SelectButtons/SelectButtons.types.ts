export interface SelectButtonsProps {
  /** Currently selected value(s) */
  value?: string | string[];
  /** Enable multi-select mode */
  isMulti?: boolean;
  /** Available button options */
  options: Array<{ label: string; value: string }>;
  /** Callback when selection changes */
  onValueChange?: (value: string | string[]) => void;
  /** Button size */
  size?: 'small' | 'medium' | 'large';
}
