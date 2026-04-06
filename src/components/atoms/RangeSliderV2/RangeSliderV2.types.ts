export interface RangeSliderV2Props {
  values: [number] | [number, number] | [number, number, number];
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onChange?: (values: number[]) => void;
}
