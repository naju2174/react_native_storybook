import * as React from 'react';
import * as ReactDOM from 'react-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  style?: React.CSSProperties;
}

export interface DialogPortalProps {
  children: React.ReactNode;
}

export interface DialogOverlayProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface DialogCloseProps {
  children: React.ReactNode;
  asChild?: boolean;
  style?: React.CSSProperties;
}

export interface DialogContentProps {
  children: React.ReactNode;
  hideCloseIcon?: boolean;
  style?: React.CSSProperties;
}

export interface DialogHeaderProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface DialogFooterProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface DialogTitleProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export interface DialogDescriptionProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

// ─── Design tokens — tailwind.config.js ──────────────────────────────────────

const C = {
  primary:  '#1355e9',   // primary.DEFAULT
  gray12:   '#131331',   // gray.12
  gray9:    '#666666',   // gray.9
  gray8:    '#949494',   // gray.8
  gray5:    '#e0e0e0',   // gray.5
  white:    '#ffffff',
} as const;

const FONT = "'ElevanceSans', 'ElevanceSans-Regular', system-ui, sans-serif";

// ─── Context ──────────────────────────────────────────────────────────────────

interface DialogContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

const useDialogContext = () => {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error('Dialog components must be used within a Dialog');
  return context;
};

// ─── Dialog Root ──────────────────────────────────────────────────────────────

export const Dialog: React.FC<DialogProps> = ({
  children,
  open: controlledOpen,
  onOpenChange,
}) => {
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

// ─── DialogTrigger ────────────────────────────────────────────────────────────

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  asChild = false,
  style,
}) => {
  const { setOpen } = useDialogContext();

  const handleClick = () => setOpen(true);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'inline-block',
        fontFamily: FONT,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// ─── DialogPortal ─────────────────────────────────────────────────────────────

export const DialogPortal: React.FC<DialogPortalProps> = ({ children }) => {
  if (typeof document === 'undefined') return <>{children}</>;
  return ReactDOM.createPortal(children, document.body);
};

// ─── DialogOverlay ────────────────────────────────────────────────────────────

export const DialogOverlay: React.FC<DialogOverlayProps> = ({ style, children }) => {
  const { setOpen } = useDialogContext();

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 50,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ─── DialogClose ──────────────────────────────────────────────────────────────

export const DialogClose: React.FC<DialogCloseProps> = ({
  children,
  asChild = false,
  style,
}) => {
  const { setOpen } = useDialogContext();

  const handleClick = () => setOpen(false);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'inline-block',
        fontFamily: FONT,
        ...style,
      }}
    >
      {children}
    </button>
  );
};

// ─── X Icon ───────────────────────────────────────────────────────────────────

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
    style={{ display: 'block' }}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ─── DialogContent ────────────────────────────────────────────────────────────

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  hideCloseIcon = false,
  style,
}) => {
  const { open, setOpen } = useDialogContext();

  // Mirror the RN Animated approach: start at 0/0.95, animate to 1/1
  const [animating, setAnimating] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      // Allow one paint at the starting state, then transition in
      const id = requestAnimationFrame(() => setAnimating(true));
      return () => cancelAnimationFrame(id);
    } else {
      setAnimating(false);
    }
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <DialogPortal>
      {/* Backdrop — click outside to close */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(107,114,128,0.5)', // matches RN bg-gray-500/50
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Panel — stop propagation so clicks inside don't close */}
        <div
          role="dialog"
          aria-modal="true"
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '90%',
            maxWidth: 512,            // max-w-lg
            backgroundColor: C.white, // bg-white — always white, cannot be overridden
            borderRadius: 8,          // rounded-lg
            border: `1px solid ${C.gray5}`, // border-gray-200
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)', // shadow-lg
            minHeight: 200,
            fontFamily: FONT,
            opacity: animating ? 1 : 0,
            transform: animating ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
            ...style,
          }}
        >
          <div style={{ backgroundColor: C.white, borderRadius: 8, minHeight: 200, width: '100%' }}>
            {children}
          </div>

          {!hideCloseIcon && (
            <button
              type="button"
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

// ─── DialogHeader ─────────────────────────────────────────────────────────────

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, style }) => (
  <div
    style={{
      padding: '24px 24px 8px 24px',  // px-6 pt-6 pb-2
      display: 'flex',
      flexDirection: 'column',
      gap: 4,                           // gap-1
      alignItems: 'flex-start',
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── DialogFooter ─────────────────────────────────────────────────────────────

export const DialogFooter: React.FC<DialogFooterProps> = ({ children, style }) => (
  <div
    style={{
      padding: '16px 24px 24px 24px',  // px-6 pt-4 pb-6
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 8,                            // gap-2
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── DialogTitle ──────────────────────────────────────────────────────────────

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, style }) => (
  <h2
    role="heading"
    style={{
      margin: 0,
      fontSize: 18,       // text-lg
      fontWeight: 600,    // font-semibold
      lineHeight: 1.3,    // leading-tight
      color: C.gray12,    // text-gray-900 → gray-12 in config
      fontFamily: FONT,
      ...style,
    }}
  >
    {children}
  </h2>
);

// ─── DialogDescription ────────────────────────────────────────────────────────

export const DialogDescription: React.FC<DialogDescriptionProps> = ({ children, style }) => (
  <p
    style={{
      margin: 0,
      fontSize: 14,       // text-sm
      lineHeight: 1.625,  // leading-relaxed
      color: C.gray9,     // text-gray-600 → gray-9 in config
      fontFamily: FONT,
      ...style,
    }}
  >
    {children}
  </p>
);
