import type { Meta, StoryObj } from '@storybook/react-native';
import { SelectButtons } from '../components/molecules/SelectButtons';
import type { SelectButtonsProps } from '../components/molecules/SelectButtons/SelectButtons.types';

const meta: Meta<SelectButtonsProps> = {
  title: 'MOLECULES/SelectButtons',
  component: SelectButtons,
  parameters: {
    layout: 'centered',
  },
  args: {
    onValueChange: () => {},
  },
};

export default meta;
type Story = StoryObj<SelectButtonsProps>;

export const SingleSelect: Story = {
  args: {
    value: 'one',
    options: [
      { label: 'One', value: 'one' },
      { label: 'Two', value: 'two' },
      { label: 'Three', value: 'three' },
    ],
  },
};

export const MultiSelect: Story = {
  args: {
    isMulti: true,
    value: ['one', 'three'],
    options: [
      { label: 'One', value: 'one' },
      { label: 'Two', value: 'two' },
      { label: 'Three', value: 'three' },
    ],
  },
};

export const NoSelection: Story = {
  args: {
    value: undefined,
    options: [
      { label: 'Red', value: 'red' },
      { label: 'Green', value: 'green' },
      { label: 'Blue', value: 'blue' },
    ],
  },
};
