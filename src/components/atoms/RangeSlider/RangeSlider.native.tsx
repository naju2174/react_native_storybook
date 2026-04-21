import React, { useState, useRef, useMemo } from 'react';
import { View, PanResponder, LayoutChangeEvent } from 'react-native';
import type { RangeSliderProps } from './RangeSlider.types';

const THUMB_SIZE = 48;

export const RangeSlider = ({
  value,
  values,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  onValuesChange,
  disabled = false,
}: RangeSliderProps) => {
  const initial = (): number[] => {
    if (values?.length) return [...values];
    return [value ?? 50];
  };

  const [thumbValues, setThumbValues] = useState<number[]>(initial);
  const thumbValuesRef = useRef(thumbValues);
  thumbValuesRef.current = thumbValues;
  const containerWidthRef = useRef(0);

  const getUsableTrackWidth = () => Math.max(0, containerWidthRef.current - THUMB_SIZE);

  const valueToPercent = (sliderValue: number) => (sliderValue - min) / (max - min);

  const createPR = (thumbIndex: number) => {
    const startValueRef = { current: 0 };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        startValueRef.current = thumbValuesRef.current[thumbIndex];
      },
      onPanResponderMove: (_, { dx }) => {
        const trackWidth = getUsableTrackWidth();
        if (!trackWidth) return;
        const dValue = (dx / trackWidth) * (max - min);
        const raw = startValueRef.current + dValue;
        const stepped = Math.round(raw / step) * step;
        const newValue = Math.max(min, Math.min(max, stepped));
        const current = thumbValuesRef.current;

        if (thumbIndex > 0 && newValue < current[thumbIndex - 1]) return;
        if (thumbIndex < current.length - 1 && newValue > current[thumbIndex + 1]) return;

        const next = [...current];
        next[thumbIndex] = newValue;
        thumbValuesRef.current = next;
        setThumbValues(next);
        onValuesChange?.(next);
        if (next.length === 1) onValueChange?.(next[0]);
      },
    });
  };

  const prs = useMemo(
    () => [createPR(0), createPR(1), createPR(2)],
    [disabled, min, max, step],
  );

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    containerWidthRef.current = nativeEvent.layout.width;
  };

  const trackWidth = getUsableTrackWidth();
  const thumbLeft = (thumbValue: number) => valueToPercent(thumbValue) * trackWidth;

  const sorted = [...thumbValues].sort((a, b) => a - b);
  const activeLeft = thumbValues.length === 1 ? 0 : valueToPercent(sorted[0]) * trackWidth;
  const activeWidth = valueToPercent(sorted[sorted.length - 1]) * trackWidth - activeLeft;

  return (
    <View className="w-full h-[68px] justify-center relative" onLayout={handleLayout}>
      <View
        className="absolute left-[24px] right-[24px] h-[6px] bg-[#e0e3e7] rounded-full"
        pointerEvents="none"
      >
        <View
          className="absolute h-[6px] rounded-full"
          style={{ left: activeLeft, width: Math.max(0, activeWidth), backgroundColor: '#2563eb' }}
        />
      </View>

      {thumbValues.map((val, idx) => (
        <View
          key={idx}
          {...prs[idx].panHandlers}
          className="absolute w-[48px] h-[48px] rounded-full top-1/2 -mt-[24px]"
          style={{ left: thumbLeft(val), backgroundColor: disabled ? '#cccccc' : '#2563eb' }}
        />
      ))}
    </View>
  );
};
