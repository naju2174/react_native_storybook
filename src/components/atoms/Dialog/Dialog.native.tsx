import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  Animated,
} from 'react-native';
import { X } from 'lucide-react-native';
import type {
  DialogProps,
  DialogTriggerProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogCloseProps,
} from './Dialog.types';

// ─── Context ─────────────────────────────────────────────────────────────────

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

const useDialogCtx = (): DialogContextValue => {
  const ctx = React.useContext(DialogContext);
  if (!ctx) throw new Error('Dialog components must be used within <Dialog>');
  return ctx;
};

// ─── Dialog ──────────────────────────────────────────────────────────────────

const Dialog: React.FC<DialogProps> = ({ children, open: controlledOpen, onOpenChange }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (controlledOpen === undefined) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [controlledOpen, onOpenChange],
  );

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

// ─── DialogTrigger ───────────────────────────────────────────────────────────

const DialogTrigger: React.FC<DialogTriggerProps> = ({ children, asChild = false }) => {
  const { setOpen } = useDialogCtx();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => setOpen(true),
    });
  }

  return (
    <Pressable onPress={() => setOpen(true)} accessibilityRole="button">
      {children}
    </Pressable>
  );
};

// ─── DialogPortal ────────────────────────────────────────────────────────────

const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>{children}</>
);

// ─── DialogOverlay ───────────────────────────────────────────────────────────

const DialogOverlay: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { setOpen } = useDialogCtx();
  return (
    <Pressable
      className="absolute inset-0 bg-black/80"
      onPress={() => setOpen(false)}
    >
      {children}
    </Pressable>
  );
};

// ─── DialogClose ─────────────────────────────────────────────────────────────

const DialogClose: React.FC<DialogCloseProps> = ({ children, asChild = false }) => {
  const { setOpen } = useDialogCtx();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onPress: () => setOpen(false),
    });
  }

  return (
    <Pressable onPress={() => setOpen(false)} accessibilityRole="button">
      {children}
    </Pressable>
  );
};

// ─── DialogContent ───────────────────────────────────────────────────────────

const DialogContent: React.FC<DialogContentProps> = ({ children, hideCloseIcon = false }) => {
  const { open, setOpen } = useDialogCtx();
  const fadeAnim  = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.95);
    }
  }, [open, fadeAnim, scaleAnim]);

  if (!open) return null;

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={() => setOpen(false)}>
      <View className="flex-1 justify-center items-center">
        <Pressable
          className="absolute inset-0 bg-black/50"
          onPress={() => setOpen(false)}
        />
        <Animated.View
          className="w-[90%] max-w-lg bg-white rounded-lg border border-gray-5 shadow-lg"
          style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }] }}
        >
          <View className="bg-white rounded-lg min-h-[200px] w-full">
            {children}
          </View>
          {!hideCloseIcon && (
            <Pressable
              onPress={() => setOpen(false)}
              className="absolute right-4 top-4 rounded p-1 opacity-70"
              accessibilityRole="button"
              accessibilityLabel="Close"
            >
              <X size={16} color="#949494" />
            </Pressable>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

// ─── DialogHeader ────────────────────────────────────────────────────────────

const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <View className="px-6 pt-6 pb-2">
    <View className="flex-col gap-1">
      {children}
    </View>
  </View>
);

// ─── DialogFooter ────────────────────────────────────────────────────────────

const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => (
  <View className="px-6 pt-4 pb-6">
    <View className="flex-row justify-end items-center gap-2">
      {children}
    </View>
  </View>
);

// ─── DialogTitle ─────────────────────────────────────────────────────────────

const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => (
  <Text
    className="text-lg font-semibold leading-tight text-gray-12"
    accessibilityRole="header"
  >
    {children}
  </Text>
);

// ─── DialogDescription ───────────────────────────────────────────────────────

const DialogDescription: React.FC<DialogDescriptionProps> = ({ children }) => (
  <Text className="text-sm text-primary leading-relaxed">
    {children}
  </Text>
);

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
