import React, { useState, useRef } from 'react';
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
  const initial = values?.length ? [...values] : [value ?? 50];
  const [thumbValues, setThumbValues] = useState<number[]>(initial);
  const thumbValuesRef = useRef(thumbValues);
  thumbValuesRef.current = thumbValues;
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<{ index: number; startClientX: number; startValue: number } | null>(null);

  const valueToPct = (v: number) => ((v - min) / (max - min)) * 100;

  const handleMouseDown = (index: number) => (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    draggingRef.current = { index, startClientX: e.clientX, startValue: thumbValuesRef.current[index] };

    const onMouseMove = (me: MouseEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const { index: idx, startClientX, startValue } = draggingRef.current;
      const trackWidth = containerRef.current.getBoundingClientRect().width - THUMB_SIZE;
      const dx = me.clientX - startClientX;
      const dValue = (dx / trackWidth) * (max - min);
      const raw = startValue + dValue;
      const stepped = Math.round(raw / step) * step;
      const newValue = Math.max(min, Math.min(max, stepped));
      const current = thumbValuesRef.current;

      if (idx > 0 && newValue < current[idx - 1]) return;
      if (idx < current.length - 1 && newValue > current[idx + 1]) return;

      const next = [...current];
      next[idx] = newValue;
      thumbValuesRef.current = next;
      setThumbValues([...next]);
      onValuesChange?.(next);
      if (next.length === 1) onValueChange?.(next[0]);
    };

    const onMouseUp = () => {
      draggingRef.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const sorted = [...thumbValues].sort((a, b) => a - b);
  const activeLeftPct = thumbValues.length === 1 ? 0 : valueToPct(sorted[0]);
  const activeWidthPct = valueToPct(sorted[sorted.length - 1]) - activeLeftPct;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: THUMB_SIZE + 20,
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* Track */}
      <div
        style={{
          position: 'absolute',
          left: THUMB_SIZE / 2,
          right: THUMB_SIZE / 2,
          height: TRACK_HEIGHT,
          backgroundColor: TRACK_COLOR,
          borderRadius: TRACK_HEIGHT / 2,
        }}
      >
        {/* Active segment */}
        <div
          style={{
            position: 'absolute',
            left: `${activeLeftPct}%`,
            width: `${activeWidthPct}%`,
            height: '100%',
            backgroundColor: PRIMARY,
            borderRadius: TRACK_HEIGHT / 2,
          }}
        />
      </div>

      {/* Thumbs */}
      {thumbValues.map((val, idx) => {
        const pct = valueToPct(val);
        return (
          <div
            key={idx}
            onMouseDown={handleMouseDown(idx)}
            style={{
              position: 'absolute',
              left: `calc(${pct}% - ${(pct / 100) * THUMB_SIZE}px)`,
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: '50%',
              backgroundColor: disabled ? '#ccc' : PRIMARY,
              cursor: disabled ? 'not-allowed' : 'grab',
              zIndex: 1,
            }}
          />
        );
      })}
    </div>
  );
};
