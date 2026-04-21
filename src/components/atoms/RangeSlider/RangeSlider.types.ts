export interface RangeSliderProps {
  /** Single value for single-thumb slider */
  value?: number;
  /** Array of values for multi-thumb slider (1, 2, or 3 thumbs) */
  values?: number[];
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Callback when single value changes */
  onValueChange?: (value: number) => void;
  /** Callback when values change (multi-thumb) */
  onValuesChange?: (values: number[]) => void;
  /** Whether the slider is disabled */
  disabled?: boolean;
}