import type { SelectButtonsProps } from './SelectButtons.types';
import { Button } from '../../atoms/Button';

export const SelectButtons = ({
  value,
  isMulti = false,
  options,
  onValueChange,
  size = 'medium',
}: SelectButtonsProps) => {
  const selectedValues = isMulti
    ? Array.isArray(value)
      ? value
      : value
      ? [value]
      : []
    : value
    ? [value]
    : [];

  const handleButtonClick = (optionValue: string) => {
    if (isMulti) {
      const newValues = selectedValues.includes(optionValue)
        ? selectedValues.filter((v) => v !== optionValue)
        : [...selectedValues, optionValue];
      onValueChange?.(newValues);
    } else {
      onValueChange?.(optionValue);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {options.map((option) => (
        <Button
          key={option.value}
          label={option.label}
          primary={selectedValues.includes(option.value)}
          size={size}
          onClick={() => handleButtonClick(option.value)}
        />
      ))}
    </div>
  );
};
