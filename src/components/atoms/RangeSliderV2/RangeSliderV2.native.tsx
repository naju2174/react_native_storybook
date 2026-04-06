import React from 'react';
import { View } from 'react-native';
import { styles } from './RangeSliderV2.styles';
import type { RangeSliderV2Props } from './RangeSliderV2.types';

export const RangeSliderV2 = ({
  values,
  disabled = false,
}: RangeSliderV2Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.track} />

      {values.map((_, index) => (
        <View
          key={index}
          style={[
            styles.thumb,
            { left: index * 40 }, // temporary position to visualise thumbs
            disabled && styles.disabledThumb,
          ]}
        />
      ))}
    </View>
  );
};
