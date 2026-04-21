import * as React from 'react';
import * as ReactDOM from 'react-dom';
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

// Design tokens from tailwind.config.js
const C = {
  primary: '#1355e9',
  gray12: '#131331',
  gray9:  '#666666',
  gray8:  '#949494',
  gray5:  '#e0e0e0',
  white:  '#ffffff',
};

const FONT = "'ElevanceSans', 'ElevanceSans-Regular', system-ui, sans-serif";

// ─── Context ────────────────────────────────────────────────────────────────

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

// ─── Dialog ─────────────────────────────────────────────────────────────────

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
      onClick: () => setOpen(true),
    });
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setOpen(true)}
      onKeyDown={(e) => e.key === 'Enter' && setOpen(true)}
      style={{ cursor: 'pointer', display: 'inline-block' }}
    >
      {children}
    </span>
  );
};

// ─── DialogPortal ────────────────────────────────────────────────────────────

const DialogPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (typeof document === 'undefined') return <>{children}</>;
  return ReactDOM.createPortal(children, document.body);
};

// ─── DialogOverlay ───────────────────────────────────────────────────────────

const DialogOverlay: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { setOpen } = useDialogCtx();
  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 50,
      }}
    >
      {children}
    </div>
  );
};

// ─── DialogClose ─────────────────────────────────────────────────────────────

const DialogClose: React.FC<DialogCloseProps> = ({ children, asChild = false }) => {
  const { setOpen } = useDialogCtx();

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: () => setOpen(false),
    });
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={() => setOpen(false)}
      onKeyDown={(e) => e.key === 'Enter' && setOpen(false)}
      style={{ cursor: 'pointer', display: 'inline-block' }}
    >
      {children}
    </span>
  );
};

// ─── X Icon ──────────────────────────────────────────────────────────────────

const XIcon: React.FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke={C.gray8}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── DialogContent ───────────────────────────────────────────────────────────

const DialogContent: React.FC<DialogContentProps> = ({ children, hideCloseIcon = false }) => {
  const { open, setOpen } = useDialogCtx();
  const [animating, setAnimating] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      // Small rAF so the initial opacity:0/scale:0.95 is painted before transitioning in
      requestAnimationFrame(() => setAnimating(true));
    } else {
      setAnimating(false);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <DialogPortal>
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '90%',
            maxWidth: 512,
            backgroundColor: C.white,
            borderRadius: 8,
            border: `1px solid ${C.gray5}`,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            minHeight: 200,
            fontFamily: FONT,
            opacity: animating ? 1 : 0,
            transform: animating ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
        >
          {children}

          {!hideCloseIcon && (
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                borderRadius: 4,
                opacity: 0.7,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 1,
              }}
            >
              <XIcon />
            </button>
          )}
        </div>
      </div>
    </DialogPortal>
  );
};

// ─── DialogHeader ────────────────────────────────────────────────────────────

const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => (
  <div
    style={{
      padding: '24px 24px 8px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
    }}
  >
    {children}
  </div>
);

// ─── DialogFooter ────────────────────────────────────────────────────────────

const DialogFooter: React.FC<DialogFooterProps> = ({ children }) => (
  <div
    style={{
      padding: '16px 24px 24px 24px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 8,
    }}
  >
    {children}
  </div>
);

// ─── DialogTitle ─────────────────────────────────────────────────────────────

const DialogTitle: React.FC<DialogTitleProps> = ({ children }) => (
  <h2
    style={{
      margin: 0,
      fontSize: 18,
      fontWeight: 700,
      lineHeight: 1.3,
      color: C.gray12,
      fontFamily: FONT,
    }}
  >
    {children}
  </h2>
);

// ─── DialogDescription ───────────────────────────────────────────────────────

const DialogDescription: React.FC<DialogDescriptionProps> = ({ children }) => (
  <p
    style={{
      margin: 0,
      fontSize: 14,
      lineHeight: 1.6,
      color: C.primary,
      fontFamily: FONT,
    }}
  >
    {children}
  </p>
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
