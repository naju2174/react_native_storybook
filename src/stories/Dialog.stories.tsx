import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { View } from 'react-native';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../components/atoms/Dialog';

// ─── Design tokens ────────────────────────────────────────────────────────────

const FONT = "'ElevanceSans', 'ElevanceSans-Regular', system-ui, sans-serif";

const C = {
  primary: '#1355e9',
  gray12:  '#131331',
  gray9:   '#666666',
  gray5:   '#e0e0e0',
  white:   '#ffffff',
} as const;

// ─── Story helpers ────────────────────────────────────────────────────────────

// NOTE: These helpers do NOT forward onClick, so they must be used inside
// DialogTrigger without asChild — the wrapping button handles the click.
const TriggerBtn = ({ label, onClick }: { label: string; onClick?: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      backgroundColor: C.primary,
      color: C.white,
      border: 'none',
      borderRadius: 8,
      padding: '12px 24px',
      fontSize: 14,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: FONT,
    }}
  >
    {label}
  </button>
);

const ActionBtn = ({
  label,
  variant = 'primary',
  onClick,
}: {
  label: string;
  variant?: 'primary' | 'outline';
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      backgroundColor: variant === 'primary' ? C.primary : C.white,
      color: variant === 'primary' ? C.white : C.primary,
      border: `1.5px solid ${C.primary}`,
      borderRadius: 8,
      padding: '10px 28px',
      fontSize: 14,
      fontWeight: 700,
      cursor: 'pointer',
      fontFamily: FONT,
      minWidth: 100,
    }}
  >
    {label}
  </button>
);

const FormInput = ({ placeholder, type = 'text' }: { placeholder: string; type?: string }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: '100%',
        height: 44,
        border: `1.5px solid ${focused ? C.primary : C.gray5}`,
        borderRadius: 8,
        padding: '0 16px',
        fontSize: 14,
        fontFamily: FONT,
        color: C.gray12,
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.15s ease',
      }}
    />
  );
};

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'ATOMS/Dialog',
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const SimpleDialog: Story = {
  render: () => (
    <View style={{ paddingHorizontal: 32, paddingVertical: 40 }}>
      <Dialog>
        {/* No asChild — DialogTrigger's own <button> wrapper handles the click */}
        <DialogTrigger>
          <TriggerBtn label="Open Simple Modal" />
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>This is the dialog description.</DialogDescription>
          </DialogHeader>
          <div style={{ padding: '8px 24px 24px', fontFamily: FONT, fontSize: 14, color: C.gray9 }}>
            This is the content of the dialog.
          </div>
        </DialogContent>
      </Dialog>
    </View>
  ),
};

export const DialogHeaderFooter: Story = {
  render: () => (
    <View style={{ paddingHorizontal: 32, paddingVertical: 40 }}>
      <Dialog>
        <DialogTrigger>
          <TriggerBtn label="Open Modal with Header and Footer" />
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Header</DialogTitle>
            <DialogDescription>This is the dialog header description.</DialogDescription>
          </DialogHeader>

          <div style={{ padding: '4px 24px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <FormInput placeholder="User Name" />
            <FormInput placeholder="Password" type="password" />
          </div>

          <DialogFooter>
            {/* ActionBtn forwards onClick so asChild works correctly here */}
            <DialogClose asChild>
              <ActionBtn label="Close" variant="outline" />
            </DialogClose>
            <ActionBtn label="Submit" variant="primary" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  ),
};

export const NoCloseIcon: Story = {
  render: () => (
    <View style={{ paddingHorizontal: 32, paddingVertical: 40 }}>
      <Dialog>
        <DialogTrigger>
          <TriggerBtn label="Open (No Close Icon)" />
        </DialogTrigger>

        <DialogContent hideCloseIcon>
          <DialogHeader>
            <DialogTitle>No Close Icon</DialogTitle>
            <DialogDescription>Use the footer button to dismiss.</DialogDescription>
          </DialogHeader>
          <div style={{ padding: '8px 24px', fontFamily: FONT, fontSize: 14, color: C.gray9 }}>
            The X button is hidden. Only the footer action closes this dialog.
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <ActionBtn label="Dismiss" variant="outline" />
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  ),
};
