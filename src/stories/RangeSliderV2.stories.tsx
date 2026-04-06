import type { Meta, StoryObj } from '@storybook/react-native';
import React, { useState } from 'react';
import { View } from 'react-native';
import { RangeSliderV2 } from '../components/atoms/RangeSliderV2';
import type { RangeSliderV2Props } from '../components/atoms/RangeSliderV2';

const meta: Meta<typeof RangeSliderV2> = {
  title: 'ATOMS/RangeSliderV2',
  component: RangeSliderV2,
};

export default meta;

type Story = StoryObj<typeof RangeSliderV2>;

export const Single: Story = {
  render: () => {
    const [values, setValues] = useState<[number]>([40]);

    return (
      <View style={{ padding: 20, width: 300 }}>
        <RangeSliderV2 values={values} onChange={(vals) => setValues([vals[0]])} />
      </View>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [values, setValues] = useState<[number, number]>([20, 80]);

    return (
      <View style={{ padding: 20, width: 300 }}>
        <RangeSliderV2 values={values} onChange={(vals) => setValues([vals[0], vals[1]])} />
      </View>
    );
  },
};

export const MultiPoint: Story = {
  render: () => {
    const [values, setValues] = useState<[number, number, number]>([10, 40, 90]);

    return (
      <View style={{ padding: 20, width: 300 }}>
        <RangeSliderV2 values={values} onChange={(vals) => setValues([vals[0], vals[1], vals[2]])} />
      </View>
    );
  },
};
