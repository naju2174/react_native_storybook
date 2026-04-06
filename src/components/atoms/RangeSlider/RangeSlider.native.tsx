import React, { useState, useRef, useMemo } from 'react';
import { View, StyleSheet, PanResponder, LayoutChangeEvent } from 'react-native';
import type { RangeSliderProps } from './RangeSlider.types';

const PRIMARY = '#555ab9';
const TRACK_COLOR = '#e0e3e7';
const THUMB_SIZE = 22;
const TRACK_HEIGHT = 3;

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

  const tw = () => Math.max(0, containerWidthRef.current - THUMB_SIZE);

  const valueToPct = (v: number) => (v - min) / (max - min);

  const createPR = (thumbIndex: number) => {
    const startValueRef = { current: 0 };
    return PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        startValueRef.current = thumbValuesRef.current[thumbIndex];
      },
      onPanResponderMove: (_, { dx }) => {
        const trackWidth = tw();
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

  const trackWidth = tw();
  const thumbLeft = (v: number) => valueToPct(v) * trackWidth;

  const sorted = [...thumbValues].sort((a, b) => a - b);
  const activeLeft = thumbValues.length === 1 ? 0 : valueToPct(sorted[0]) * trackWidth;
  const activeWidth = valueToPct(sorted[sorted.length - 1]) * trackWidth - activeLeft;

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <View style={styles.track} pointerEvents="none">
        <View
          style={[styles.activeTrack, { left: activeLeft, width: Math.max(0, activeWidth) }]}
        />
      </View>

      {thumbValues.map((val, idx) => (
        <View
          key={idx}
          {...prs[idx].panHandlers}
          style={[
            styles.thumb,
            { left: thumbLeft(val) },
            disabled && styles.disabledThumb,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: THUMB_SIZE + 20,
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    position: 'absolute',
    left: THUMB_SIZE / 2,
    right: THUMB_SIZE / 2,
    height: TRACK_HEIGHT,
    backgroundColor: TRACK_COLOR,
    borderRadius: TRACK_HEIGHT / 2,
  },
  activeTrack: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    backgroundColor: PRIMARY,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: PRIMARY,
    top: '50%',
    marginTop: -(THUMB_SIZE / 2),
  },
  disabledThumb: {
    backgroundColor: '#ccc',
  },
});
