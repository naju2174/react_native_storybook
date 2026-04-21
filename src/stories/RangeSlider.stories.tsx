import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import { RangeSlider } from '../components/atoms/RangeSlider';
import type { RangeSliderProps } from '../components/atoms/RangeSlider/RangeSlider.types';

const meta: Meta<RangeSliderProps> = {
  title: 'ATOMS/RangeSlider',
  component: RangeSlider,
  parameters: {
    layout: 'centered',
  },
  args: {
    onValueChange: () => {},
    onValuesChange: () => {},
  },
  render: (args) => (
    <View className="px-8 py-10 w-[800px]">
      <RangeSlider {...args} />
    </View>
  ),
};

export default meta;
type Story = StoryObj<RangeSliderProps>;

export const Default: Story = {
  args: {
    value: 50,
    min: 0,
    max: 100,
    step: 1,
  },
};

export const Range: Story = {
  args: {
    values: [20, 70],
    min: 0,
    max: 100,
    step: 1,
  },
};

export const MultiPoint: Story = {
  args: {
    values: [20, 50, 80],
    min: 0,
    max: 100,
    step: 1,
  },
};
