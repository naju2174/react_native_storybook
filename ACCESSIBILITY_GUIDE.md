# Accessibility Standards & Implementation Guide

## Overview

Accessibility (a11y) ensures your app is usable by everyone, including people with disabilities (visual, motor, cognitive, hearing impairments). This guide covers **WCAG 2.1 Level AA** (web standard) and platform-specific guidelines for **iOS, Android, and Web**.

---

## Platform-Specific Tools & Technologies

### iOS (VoiceOver)
- **VoiceOver** — screen reader for blind/low-vision users
- **Dynamic Type** — adjustable font sizes
- **Haptic Feedback** — vibration cues
- **Voice Control** — speak to control the app
- **Accessibility Inspector** — Xcode tool for testing

**Key APIs:**
```swift
// React Native accessible props:
accessible={true}
accessibilityLabel="Description of the element"
accessibilityHint="Additional context"
accessibilityRole="button" | "image" | "text" | etc.
accessibilityState={{ disabled: true }}
accessibilityActions={[{ name: 'activate' }]}
```

### Android (TalkBack)
- **TalkBack** — screen reader
- **Switch Access** — navigate with physical switches
- **Voice Access** — speak commands
- **Magnification** — zoom in
- **High contrast** — improve visibility

**Key APIs:**
```tsx
accessible={true}
accessibilityLabel="Description"
accessibilityHint="Help text"
accessibilityRole="button"
accessibilityState={{ disabled: true }}
accessibilityActions={[{ name: 'activate' }]}
importantForAccessibility="yes" | "no" | "auto" (Android only)
```

### Web (Screen Readers & Browsers)
- **Screen Readers** — NVDA (Windows), JAWS (Windows), VoiceOver (Mac), ChromeVox
- **Keyboard Navigation** — tab, enter, space, arrow keys
- **Browser DevTools** — accessibility audit
- **ARIA** (Accessible Rich Internet Applications) — semantic markup

**Key APIs:**
```html
<!-- Semantic HTML -->
<button>, <input>, <label>, <a>, <nav>, <main>, <section>

<!-- ARIA attributes -->
aria-label="Description"
aria-labelledby="id-of-label"
aria-describedby="id-of-description"
aria-hidden="true"
aria-disabled="true"
aria-pressed="true"
aria-expanded="true"
role="button" | "navigation" | "alert" | etc.
tabIndex={0}
```

---

## WCAG 2.1 Level AA Standards

| Criterion | Level | Description |
|-----------|-------|-------------|
| **Perceivable** | AA | Content must be presentable (color, text size, captions) |
| **Operable** | AA | Keyboard accessible, enough time to interact, no seizures |
| **Understandable** | AA | Clear language, consistent navigation, error prevention |
| **Robust** | AA | Compatible with assistive technologies |

---

## Component-by-Component Implementation

### 1. BUTTON

**Accessibility Requirements:**
- ✅ Keyboard accessible (Enter, Space)
- ✅ Clear, descriptive label
- ✅ Visual focus indicator
- ✅ Sufficient color contrast (4.5:1 text-to-background for AA)
- ✅ Minimum 44×44 px touch target (iOS/Android guideline)
- ✅ Disabled state clearly indicated
- ✅ Loading state announced to screen readers

**Web Implementation:**
```tsx
export function Button({ 
  label, 
  onClick, 
  disabled, 
  isLoading,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel || label}
      aria-busy={isLoading}
      style={{
        // Visual focus indicator (required for keyboard users)
        outline: '2px solid transparent',
        outlineOffset: '2px',
      }}
      onKeyDown={(e) => {
        // Enter or Space should trigger click (browsers do this automatically)
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          onClick?.();
        }
      }}
    >
      {isLoading ? 'Loading...' : label}
    </button>
  );
}
```

**Native Implementation:**
```tsx
import { Pressable, Text, AccessibilityInfo } from 'react-native';

export function Button({ label, onClick, disabled, isLoading }: ButtonProps) {
  return (
    <Pressable
      onPress={onClick}
      disabled={disabled || isLoading}
      accessible={true}
      accessibilityLabel={label}
      accessibilityHint="Double tap to activate"
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || isLoading, busy: isLoading }}
      style={({ pressed }) => ({
        // Minimum 44×44 touch target (iOS/Android guideline)
        minHeight: 44,
        minWidth: 44,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Text>{isLoading ? 'Loading...' : label}</Text>
    </Pressable>
  );
}
```

**Storybook Story:**
```tsx
export const Default: Story = {
  args: {
    label: 'Click me',
    onClick: fn(),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    label: 'Submit',
    isLoading: true,
  },
};

export const WithAriaLabel: Story = {
  args: {
    label: '🗑️', // Icon-only button
    ariaLabel: 'Delete item',
    onClick: fn(),
  },
};
```

---

### 2. TEXT INPUT

**Accessibility Requirements:**
- ✅ Associated label (`<label>` on web, `accessibilityLabel` on native)
- ✅ Error messages linked to input (`aria-describedby` on web)
- ✅ Keyboard type hints (email, password, number)
- ✅ Required/optional clearly marked
- ✅ Character count if limited
- ✅ Clear focus indicator

**Web Implementation:**
```tsx
export function TextInput({
  id,
  label,
  placeholder,
  type = 'text',
  disabled,
  required,
  error,
  helperText,
  maxLength,
  value,
  onChange,
}: TextInputProps) {
  const inputId = id || `input-${Math.random()}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  return (
    <div>
      {/* Label is essential for screen readers */}
      <label htmlFor={inputId} style={{ display: 'block', marginBottom: 4 }}>
        {label} {required && <span aria-label="required">*</span>}
      </label>

      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        maxLength={maxLength}
        // Links error message to input
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        style={{
          // Visual focus indicator
          outline: '2px solid transparent',
          outlineOffset: '2px',
          border: error ? '2px solid #EF4444' : '1px solid #D1D5DB',
          padding: '8px 12px',
          fontSize: 16, // Prevents iOS zoom on focus
        }}
      />

      {error && (
        <div id={errorId} role="alert" style={{ color: '#DC2626', fontSize: 12, marginTop: 4 }}>
          {error}
        </div>
      )}

      {helperText && (
        <div id={helperId} style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
          {helperText}
        </div>
      )}

      {maxLength && (
        <div aria-live="polite" style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
          {value?.length || 0} / {maxLength} characters
        </div>
      )}
    </div>
  );
}
```

**Native Implementation:**
```tsx
import { View, TextInput, Text } from 'react-native';

export function TextInput({
  label,
  placeholder,
  keyboardType = 'default',
  disabled,
  required,
  error,
  helperText,
  maxLength,
  value,
  onChange,
}: TextInputProps) {
  return (
    <View>
      {/* Label */}
      <Text
        nativeID="textInputLabel"
        className="text-sm font-medium text-gray-700"
      >
        {label} {required && <Text className="text-red-600">*</Text>}
      </Text>

      <TextInput
        accessible={true}
        accessibilityLabel={label}
        accessibilityHint={helperText}
        accessibilityRole="adjustable"
        accessibilityLiveRegion="polite"
        accessibilityState={{
          disabled,
          selected: false,
        }}
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={!disabled}
        maxLength={maxLength}
        value={value}
        onChangeText={onChange}
        // Link label to input (iOS/Android semantic)
        nativeID="textInput"
        style={{
          borderWidth: error ? 2 : 1,
          borderColor: error ? '#EF4444' : '#D1D5DB',
          padding: 12,
          borderRadius: 6,
          fontSize: 16,
          minHeight: 44, // Touch target
        }}
      />

      {error && (
        <Text
          accessible={true}
          accessibilityRole="alert"
          className="text-red-600 text-xs mt-1"
        >
          {error}
        </Text>
      )}

      {helperText && (
        <Text className="text-gray-600 text-xs mt-1">{helperText}</Text>
      )}

      {maxLength && (
        <Text
          accessibilityLiveRegion="polite"
          className="text-gray-600 text-xs mt-1"
        >
          {value?.length || 0} / {maxLength}
        </Text>
      )}
    </View>
  );
}
```

---

### 3. TABS

**Accessibility Requirements:**
- ✅ Keyboard navigation (arrow keys, Home, End)
- ✅ Selected tab indicated (`aria-selected` on web, state on native)
- ✅ Tab list has `role="tablist"` on web
- ✅ Tabs have `role="tab"` and panels have `role="tabpanel"`
- ✅ Minimum 44×44 touch target per tab

**Web Implementation:**
```tsx
export function Tabs({ tabs, activeIndex, onChange }: TabsProps) {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        onChange(index === 0 ? tabs.length - 1 : index - 1);
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        onChange((index + 1) % tabs.length);
        break;
      case 'Home':
        e.preventDefault();
        onChange(0);
        break;
      case 'End':
        e.preventDefault();
        onChange(tabs.length - 1);
        break;
    }
  };

  return (
    <div>
      {/* Tab list container */}
      <div
        role="tablist"
        aria-label="Tabs"
        style={{
          display: 'flex',
          borderBottom: '1px solid #D1D5DB',
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            role="tab"
            aria-selected={activeIndex === index}
            aria-controls={`panel-${index}`}
            id={`tab-${index}`}
            onClick={() => onChange(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            style={{
              padding: '12px 16px',
              minHeight: 44,
              cursor: 'pointer',
              borderBottom: activeIndex === index ? '2px solid blue' : 'none',
              fontWeight: activeIndex === index ? 'bold' : 'normal',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab panels */}
      {tabs.map((tab, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`panel-${index}`}
          aria-labelledby={`tab-${index}`}
          hidden={activeIndex !== index}
          style={{ padding: '16px' }}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
```

**Native Implementation:**
```tsx
import { View, Pressable, Text, ScrollView } from 'react-native';

export function Tabs({ tabs, activeIndex, onChange }: TabsProps) {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        accessibilityRole="tablist"
        accessible={true}
      >
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            onPress={() => onChange(index)}
            accessible={true}
            accessibilityRole="tab"
            accessibilityLabel={tab.label}
            accessibilityState={{
              selected: activeIndex === index,
            }}
            accessibilityHint={`Tab ${index + 1} of ${tabs.length}`}
            style={{
              minHeight: 44,
              minWidth: 44,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: activeIndex === index ? 2 : 0,
              borderBottomColor: activeIndex === index ? '#3B82F6' : 'transparent',
            }}
          >
            <Text
              className={activeIndex === index ? 'font-bold' : 'font-normal'}
              style={{ color: activeIndex === index ? '#1F2937' : '#6B7280' }}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Tab panel */}
      <View
        accessible={true}
        accessibilityRole="tabpanel"
        accessibilityLabel={`${tabs[activeIndex]?.label} panel`}
        style={{ padding: 16 }}
      >
        {tabs[activeIndex]?.content}
      </View>
    </View>
  );
}
```

---

### 4. NAVIGATION / LINKS

**Accessibility Requirements:**
- ✅ Understandable link text (not "Click here")
- ✅ Keyboard accessible (Tab, Enter)
- ✅ Visual focus indicator
- ✅ Indicate external links (`aria-label` with "opens in new window")
- ✅ Color not the only indicator (use underline or icon)
- ✅ Sufficient color contrast (4.5:1)

**Web Implementation:**
```tsx
export function Link({
  href,
  label,
  external,
  disabled,
  onClick,
}: LinkProps) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      disabled={disabled}
      aria-disabled={disabled}
      aria-label={external ? `${label} (opens in new window)` : label}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        color: disabled ? '#D1D5DB' : '#3B82F6',
        textDecoration: 'underline', // Don't rely on color alone
        outline: 'transparent',
        outlineOffset: '2px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        '&:focus': {
          outline: '2px solid blue',
        },
      }}
    >
      {label}
      {external && <span aria-hidden="true"> ↗️</span>}
    </a>
  );
}
```

**Native Implementation:**
```tsx
import { Pressable, Text, Linking } from 'react-native';

export function Link({
  href,
  label,
  external,
  disabled,
  onPress,
}: LinkProps) {
  return (
    <Pressable
      onPress={() => {
        if (!disabled) {
          if (href) {
            Linking.openURL(href);
          } else {
            onPress?.();
          }
        }
      }}
      disabled={disabled}
      accessible={true}
      accessibilityLabel={external ? `${label}, opens in new window` : label}
      accessibilityRole="link"
      accessibilityState={{ disabled }}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        minHeight: 44,
      })}
    >
      <Text
        className={disabled ? 'text-gray-400' : 'text-blue-600'}
        style={{ textDecorationLine: 'underline' }}
      >
        {label}
        {external && ' ↗️'}
      </Text>
    </Pressable>
  );
}
```

---

### 5. DELETE BUTTON (Destructive Action)

**Accessibility Requirements:**
- ✅ Clear warning of destructive action
- ✅ Confirmation required (not triggered by accident)
- ✅ Clear recovery information (undo option if possible)
- ✅ Visually distinct (red color for delete)
- ✅ Keyboard accessible

**Web Implementation:**
```tsx
export function DeleteButton({
  label = 'Delete',
  onDelete,
  itemName,
}: DeleteButtonProps) {
  const [confirmed, setConfirmed] = useState(false);

  return confirmed ? (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => {
          onDelete?.();
          setConfirmed(false);
        }}
        aria-label={`Confirm deletion of ${itemName}`}
        style={{
          backgroundColor: '#DC2626',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Confirm Delete
      </button>
      <button
        onClick={() => setConfirmed(false)}
        aria-label="Cancel deletion"
        style={{
          backgroundColor: '#E5E7EB',
          padding: '8px 16px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Cancel
      </button>
    </div>
  ) : (
    <button
      onClick={() => setConfirmed(true)}
      aria-label={`Delete ${itemName}`}
      style={{
        backgroundColor: '#FEE2E2',
        color: '#DC2626',
        padding: '8px 16px',
        borderRadius: '4px',
        border: '1px solid #DC2626',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}
```

**Native Implementation:**
```tsx
import { Pressable, Text, Alert } from 'react-native';

export function DeleteButton({
  label = 'Delete',
  onDelete,
  itemName,
}: DeleteButtonProps) {
  return (
    <Pressable
      onPress={() => {
        // Use native Alert for confirmation
        Alert.alert(
          'Confirm Deletion',
          `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
          [
            { text: 'Cancel', onPress: () => {}, isPreferred: true },
            {
              text: 'Delete',
              onPress: () => onDelete?.(),
              isPreferred: false,
            },
          ]
        );
      }}
      accessible={true}
      accessibilityLabel={`Delete ${itemName}`}
      accessibilityRole="button"
      accessibilityHint="Double tap to delete. Confirmation will be requested."
      style={({ pressed }) => ({
        backgroundColor: pressed ? '#FECACA' : '#FEE2E2',
        padding: 12,
        borderRadius: 6,
        minHeight: 44,
      })}
    >
      <Text style={{ color: '#DC2626', fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}
```

---

### 6. ALERT / NOTIFICATION

**Accessibility Requirements:**
- ✅ Announced immediately to screen readers
- ✅ Role="alert" on web for urgent alerts
- ✅ Role="status" for non-urgent updates
- ✅ Color not the only indicator (use icon + text)
- ✅ Clear dismissal mechanism (button with clear label)
- ✅ Persist long enough to read (min 3-5 seconds)

**Web Implementation:**
```tsx
export function Alert({
  type = 'info', // 'info' | 'success' | 'warning' | 'error'
  title,
  message,
  onDismiss,
  dismissible = true,
}: AlertProps) {
  const colors = {
    info: { bg: '#DBEAFE', border: '#3B82F6', icon: 'ℹ️' },
    success: { bg: '#DCFCE7', border: '#10B981', icon: '✓' },
    warning: { bg: '#FEF3C7', border: '#F59E0B', icon: '⚠️' },
    error: { bg: '#FEE2E2', border: '#EF4444', icon: '✕' },
  };

  const style = colors[type];

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      style={{
        backgroundColor: style.bg,
        borderLeft: `4px solid ${style.border}`,
        padding: '16px',
        borderRadius: '4px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      <span role="img" aria-label={type}>
        {style.icon}
      </span>
      <div style={{ flex: 1 }}>
        {title && <strong>{title}</strong>}
        {message && <p style={{ margin: 0 }}>{message}</p>}
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            padding: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
}
```

**Native Implementation:**
```tsx
import { View, Text, Pressable } from 'react-native';
import { useEffect, useState } from 'react';

export function Alert({
  type = 'info',
  title,
  message,
  onDismiss,
  dismissible = true,
  autoDismiss = 5000, // Auto-dismiss after 5 seconds
}: AlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss]);

  if (!visible) return null;

  const colors = {
    info: { bg: 'bg-blue-100', border: 'border-blue-500' },
    success: { bg: 'bg-green-100', border: 'border-green-500' },
    warning: { bg: 'bg-yellow-100', border: 'border-yellow-500' },
    error: { bg: 'bg-red-100', border: 'border-red-500' },
  };

  return (
    <View
      accessible={true}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
      accessibilityLabel={`${type}: ${title || message}`}
      className={`${colors[type].bg} border-l-4 ${colors[type].border} p-4 rounded`}
      style={{ marginVertical: 8 }}
    >
      {title && (
        <Text className="font-bold text-gray-900" accessibilityRole="header">
          {title}
        </Text>
      )}
      {message && <Text className="text-gray-700">{message}</Text>}

      {dismissible && (
        <Pressable
          onPress={() => {
            setVisible(false);
            onDismiss?.();
          }}
          accessible={true}
          accessibilityLabel="Dismiss alert"
          accessibilityRole="button"
          style={{ minHeight: 44 }}
        >
          <Text className="text-gray-600 text-lg">×</Text>
        </Pressable>
      )}
    </View>
  );
}
```

---

### 7. MODAL / POPUP WINDOW

**Accessibility Requirements:**
- ✅ Focus trapped inside modal (keyboard tab doesn't escape)
- ✅ Backdrop not interactive when modal is open
- ✅ Clear title (`aria-labelledby` on web)
- ✅ Close button clearly available (X button + ESC key on web)
- ✅ Role="dialog" on web
- ✅ Announced to screen readers

**Web Implementation:**
```tsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLElement>(null);
  const lastFocusableRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Trap focus inside modal
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (e.shiftKey) {
          if (document.activeElement === firstFocusableRef.current) {
            e.preventDefault();
            (lastFocusableRef.current as HTMLElement)?.focus();
          }
        } else {
          if (document.activeElement === lastFocusableRef.current) {
            e.preventDefault();
            (firstFocusableRef.current as HTMLElement)?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    firstFocusableRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '8px',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2 id="modal-title" style={{ margin: '0 0 16px 0' }}>
          {title}
        </h2>

        {/* Close button */}
        {closeButton && (
          <button
            ref={firstFocusableRef as any}
            onClick={onClose}
            aria-label="Close modal"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '24px',
            }}
          >
            ×
          </button>
        )}

        {/* Content */}
        <div style={{ marginTop: '16px' }}>{children}</div>

        {/* Last focusable element for focus trap */}
        <button
          ref={lastFocusableRef as any}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        />
      </div>
    </div>,
    document.body
  );
}
```

**Native Implementation:**
```tsx
import { Modal, View, Text, Pressable } from 'react-native';

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  closeButton = true,
}: ModalProps) {
  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal={true}
    >
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        accessibilityLabel="Close modal by tapping outside"
        accessible={false}
      >
        {/* Modal content */}
        <Pressable
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 24,
            maxWidth: '90%',
            maxHeight: '90%',
          }}
          onPress={(e) => e.stopPropagation()}
          accessible={true}
          accessibilityRole="dialog"
          accessibilityLabel={title}
        >
          {/* Title */}
          <Text
            className="text-xl font-bold"
            accessibilityRole="header"
          >
            {title}
          </Text>

          {/* Content */}
          <View style={{ marginTop: 16 }}>
            {children}
          </View>

          {/* Close button */}
          {closeButton && (
            <Pressable
              onPress={onClose}
              accessible={true}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                minHeight: 44,
                minWidth: 44,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 24 }}>×</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
```

---

### 8. CAROUSEL / SLIDER

**Accessibility Requirements:**
- ✅ Keyboard controls (arrow keys)
- ✅ Indicate current position (e.g., "3 of 5")
- ✅ Pause auto-rotation on focus/hover (web)
- ✅ Touch swipe is not the only way to navigate
- ✅ Images have alt text
- ✅ Minimum 44×44 navigation buttons

**Web Implementation:**
```tsx
import { useState, useRef } from 'react';

export function Carousel({
  items,
  onSlideChange,
  autoPlay = true,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout>();

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    onSlideChange?.(index);
  };

  const goNext = () => {
    goToSlide((currentIndex + 1) % items.length);
  };

  const goPrev = () => {
    goToSlide(currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    }
  };

  // Auto-play
  const startAutoPlay = () => {
    if (!autoPlay || isPaused) return;
    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
  };

  const stopAutoPlay = () => {
    clearInterval(autoPlayRef.current);
  };

  return (
    <div
      role="region"
      aria-label="Carousel"
      aria-live="polite"
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        setIsPaused(true);
        stopAutoPlay();
      }}
      onMouseLeave={() => {
        setIsPaused(false);
        startAutoPlay();
      }}
      onFocus={() => {
        setIsPaused(true);
        stopAutoPlay();
      }}
      onBlur={() => {
        setIsPaused(false);
        startAutoPlay();
      }}
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Slide container */}
      <div
        role="presentation"
        style={{
          display: 'flex',
          overflow: 'hidden',
          borderRadius: '8px',
        }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            role="tabpanel"
            aria-label={`Slide ${index + 1} of ${items.length}`}
            hidden={index !== currentIndex}
            style={{
              flex: '0 0 100%',
              display: index === currentIndex ? 'block' : 'none',
            }}
          >
            {typeof item === 'string' ? (
              <img src={item} alt={`Slide ${index + 1}`} style={{ width: '100%' }} />
            ) : (
              item
            )}
          </div>
        ))}
      </div>

      {/* Previous button */}
      <button
        onClick={goPrev}
        aria-label="Previous slide"
        aria-controls="carousel-slides"
        style={{
          position: 'absolute',
          left: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          minWidth: 44,
          minHeight: 44,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ← Prev
      </button>

      {/* Next button */}
      <button
        onClick={goNext}
        aria-label="Next slide"
        aria-controls="carousel-slides"
        style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          minWidth: 44,
          minHeight: 44,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Next →
      </button>

      {/* Slide indicators */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: index === currentIndex ? '#3B82F6' : '#D1D5DB',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

**Native Implementation:**
```tsx
import { View, ScrollView, Pressable, Text, AccessibilityInfo } from 'react-native';
import { useState, useRef } from 'react';

export function Carousel({
  items,
  onSlideChange,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    scrollViewRef.current?.scrollTo({
      x: index * 300, // Adjust based on item width
      animated: true,
    });
    onSlideChange?.(index);

    // Announce to screen readers
    AccessibilityInfo.announceForAccessibility(
      `Slide ${index + 1} of ${items.length}`
    );
  };

  return (
    <View
      accessible={true}
      accessibilityRole="tablist"
      accessibilityLabel="Carousel"
    >
      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToInterval={300}
        decelerationRate="fast"
        onMomentumScrollEnd={(event) => {
          const contentOffsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(contentOffsetX / 300);
          goToSlide(index);
        }}
        accessible={false}
      >
        {items.map((item, index) => (
          <View
            key={index}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`Slide ${index + 1} of ${items.length}`}
            style={{ width: 300, height: 200 }}
          >
            {typeof item === 'string' ? (
              // Image slide
              <Image source={{ uri: item }} style={{ flex: 1 }} />
            ) : (
              item
            )}
          </View>
        ))}
      </ScrollView>

      {/* Indicators */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 8,
          marginTop: 16,
        }}
        accessible={true}
        accessibilityRole="tablist"
      >
        {items.map((_, index) => (
          <Pressable
            key={index}
            onPress={() => goToSlide(index)}
            accessible={true}
            accessibilityLabel={`Go to slide ${index + 1}`}
            accessibilityRole="tab"
            accessibilityState={{ selected: index === currentIndex }}
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: index === currentIndex ? '#3B82F6' : '#D1D5DB',
              minHeight: 44,
              minWidth: 44,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />
        ))}
      </View>
    </View>
  );
}
```

---

### 9. DRAG AND DROP

**Accessibility Requirements:**
- ✅ Keyboard alternative (arrow keys, cut/paste, form inputs)
- ✅ Not the only interaction method
- ✅ Clear drop zones (high contrast, labeled)
- ✅ Announce drag state and result
- ✅ Touch target at least 44×44

**Web Implementation:**
```tsx
import { useState } from 'react';

export function DragDropZone({
  items,
  onReorder,
}: DragDropZoneProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Announce to screen readers
    e.dataTransfer.setData(
      'text/plain',
      `Dragging: ${items[index]}, position ${index + 1} of ${items.length}`
    );
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDropIndex(index);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      const newItems = [...items];
      [newItems[draggedIndex], newItems[index]] = [newItems[index], newItems[draggedIndex]];
      onReorder(newItems);
    }
    setDraggedIndex(null);
    setDropIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    // Arrow keys to reorder
    if (e.key === 'ArrowUp' && index > 0) {
      e.preventDefault();
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      onReorder(newItems);
    } else if (e.key === 'ArrowDown' && index < items.length - 1) {
      e.preventDefault();
      const newItems = [...items];
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
      onReorder(newItems);
    }
  };

  return (
    <div role="region" aria-label="Drag and drop list">
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
            role="button"
            aria-label={`${item}, position ${index + 1} of ${items.length}. Use arrow keys to move.`}
            style={{
              padding: '16px',
              margin: '8px 0',
              backgroundColor: dropIndex === index ? '#DBEAFE' : '#FFFFFF',
              border: '2px solid #D1D5DB',
              borderRadius: '4px',
              cursor: 'grab',
              opacity: draggedIndex === index ? 0.5 : 1,
              minHeight: 44,
            }}
          >
            <span>⋮⋮</span> {item}
          </li>
        ))}
      </ul>
      <p style={{ fontSize: 12, color: '#6B7280' }}>
        Use drag and drop or arrow keys to reorder items.
      </p>
    </div>
  );
}
```

**Native Implementation:**
```tsx
import { View, Text, Pressable, Alert } from 'react-native';
import { useState } from 'react';

export function ReorderableList({
  items,
  onReorder,
}: ReorderableListProps) {
  const [reorderMode, setReorderMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const moveUp = (index: number) => {
    if (index > 0) {
      const newItems = [...items];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      onReorder(newItems);
      setCurrentIndex(index - 1);
      AccessibilityInfo.announceForAccessibility(
        `${items[index]} moved up to position ${index}`
      );
    }
  };

  const moveDown = (index: number) => {
    if (index < items.length - 1) {
      const newItems = [...items];
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
      onReorder(newItems);
      setCurrentIndex(index + 1);
      AccessibilityInfo.announceForAccessibility(
        `${items[index]} moved down to position ${index + 2}`
      );
    }
  };

  return (
    <View
      accessible={true}
      accessibilityRole="list"
      accessibilityLabel="Reorderable list"
    >
      {items.map((item, index) => (
        <View
          key={index}
          accessible={true}
          accessibilityRole="listitem"
          accessibilityLabel={`${item}, position ${index + 1} of ${items.length}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            marginVertical: 4,
            borderWidth: 1,
            borderColor: '#D1D5DB',
            borderRadius: 6,
          }}
        >
          <Text style={{ flex: 1 }}>{item}</Text>

          {reorderMode && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable
                onPress={() => moveUp(index)}
                disabled={index === 0}
                accessible={true}
                accessibilityLabel="Move up"
                accessibilityRole="button"
                accessibilityState={{ disabled: index === 0 }}
                style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}
              >
                <Text>↑</Text>
              </Pressable>
              <Pressable
                onPress={() => moveDown(index)}
                disabled={index === items.length - 1}
                accessible={true}
                accessibilityLabel="Move down"
                accessibilityRole="button"
                accessibilityState={{ disabled: index === items.length - 1 }}
                style={{ minHeight: 44, minWidth: 44, justifyContent: 'center' }}
              >
                <Text>↓</Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}

      <Pressable
        onPress={() => setReorderMode(!reorderMode)}
        accessible={true}
        accessibilityLabel={reorderMode ? 'Done reordering' : 'Start reordering'}
        accessibilityRole="button"
        style={{ minHeight: 44, minWidth: 44, padding: 12, marginTop: 12 }}
      >
        <Text style={{ color: '#3B82F6' }}>
          {reorderMode ? 'Done' : 'Reorder'}
        </Text>
      </Pressable>
    </View>
  );
}
```

---

### 10. TOUCH AREA / MINIMUM TARGET SIZE

**Accessibility Requirements:**
- ✅ Minimum 44×44 device-independent pixels (iOS/Android guideline)
- ✅ Minimum 44×48 for web (per WCAG 2.5.5)
- ✅ Adequate spacing between touch targets (8px minimum)

**Implementation Pattern (All Platforms):**

```tsx
// Web
style={{
  minWidth: 44,
  minHeight: 44,
  padding: '8px 12px', // Ensure padding doesn't reduce the target
}}

// Native
style={{
  minWidth: 44,
  minHeight: 44,
  justifyContent: 'center',
  alignItems: 'center',
}}
```

**Testing:**
```tsx
// Check if element meets 44×44 minimum
const button = document.querySelector('button');
const { width, height } = button.getBoundingClientRect();
console.assert(width >= 44 && height >= 44, 'Touch target too small');
```

---

## Testing Checklist

### Automated Tests
```bash
# Web accessibility testing
npm install --save-dev @axe-core/react
npm install --save-dev jest-axe

// In your test file:
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button label="Click" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing Checklist

**Keyboard Navigation:**
- [ ] All interactive elements reachable via Tab key
- [ ] Focus indicator clearly visible
- [ ] Tab order is logical
- [ ] Enter/Space activates buttons
- [ ] Arrow keys work in tabs/carousels
- [ ] Escape closes modals

**Screen Reader Testing:**
- [ ] All text content readable
- [ ] Form labels associated with inputs
- [ ] Buttons have descriptive labels
- [ ] Links have meaningful text (not "Click here")
- [ ] Images have alt text
- [ ] Alerts announced immediately

**Color & Contrast:**
- [ ] 4.5:1 contrast for body text
- [ ] 3:1 contrast for large text
- [ ] Color not the only way to convey info (use icons, patterns)

**Touch Targets:**
- [ ] All buttons/links at least 44×44 (iOS/Android)
- [ ] Adequate spacing (8px+) between targets

**Mobile:**
- [ ] Works with system font size increases
- [ ] Works with bold text enabled
- [ ] Rotates correctly (portrait/landscape)
- [ ] Readable without horizontal scrolling

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Apple Accessibility Guidelines](https://developer.apple.com/accessibility/)
- [Android Accessibility Guidelines](https://developer.android.com/guide/topics/ui/accessibility)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Axe DevTools](https://www.deque.com/axe/devtools/)
