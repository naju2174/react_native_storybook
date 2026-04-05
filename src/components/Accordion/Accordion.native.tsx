import React, { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import type { AccordionProps, AccordionGroupProps } from './Accordion.types';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const DURATION = 300;

export function Accordion({
  title,
  children,
  expanded: expandedProp,
  onToggle,
  _borderTop = true,
  _borderBottom = true,
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  const isControlled = expandedProp !== undefined;
  const expanded = isControlled ? expandedProp : internalExpanded;

  const [heightAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: expanded ? measuredHeight : 0,
      duration: DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [expanded, measuredHeight, heightAnim]);

  const toggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <View
      style={{
        borderTopWidth: _borderTop ? 1 : 0,
        borderBottomWidth: _borderBottom ? 1 : 0,
        borderColor: '#D1D5DB',
        backgroundColor: '#FFFFFF',
        width: '100%',
      }}
    >
      <Pressable
        onPress={toggle}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={expanded ? 'Double tap to collapse' : 'Double tap to expand'}
        accessibilityState={{ expanded }}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          minHeight: 44,
          opacity: pressed ? 0.7 : 1,
          ...(Platform.OS === 'web' ? ({ cursor: 'pointer' } as object) : {}),
        })}
      >
        <Text style={{ flex: 1 }} className="text-base font-medium text-gray-900">
          {title}
        </Text>
        {expanded ? (
          <ChevronUp size={20} color="#6B7280" />
        ) : (
          <ChevronDown size={20} color="#6B7280" />
        )}
      </Pressable>

      <Animated.View style={{ height: heightAnim, overflow: 'hidden' }}>
        <View
          style={{ paddingHorizontal: 16, paddingBottom: 14 }}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0) setMeasuredHeight(h);
          }}
        >
          {typeof children === 'string' ? (
            <Text className="text-sm text-gray-600 leading-relaxed">{children}</Text>
          ) : (
            children
          )}
        </View>
      </Animated.View>
    </View>
  );
}

export function AccordionGroup({ items }: AccordionGroupProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastIndex = items.length - 1;

  return (
    <View
      accessible={true}
      accessibilityRole="list"
      accessibilityLabel="Accordion group"
      style={{ width: '100%', borderTopWidth: 1, borderColor: '#D1D5DB' }}
    >
      {items.map((item, index) => (
        <Accordion
          key={index}
          title={item.title}
          expanded={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          _borderTop={false}
          _borderBottom={index !== lastIndex}
        >
          {item.children}
        </Accordion>
      ))}
    </View>
  );
}
