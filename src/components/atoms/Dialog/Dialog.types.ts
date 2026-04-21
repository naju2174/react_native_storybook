import type { ReactNode } from 'react';

export interface DialogProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface DialogTriggerProps {
  children: ReactNode;
  asChild?: boolean;
}

export interface DialogContentProps {
  children: ReactNode;
  hideCloseIcon?: boolean;
}

export interface DialogHeaderProps {
  children: ReactNode;
}

export interface DialogFooterProps {
  children: ReactNode;
}

export interface DialogTitleProps {
  children: ReactNode;
}

export interface DialogDescriptionProps {
  children: ReactNode;
}

export interface DialogCloseProps {
  children: ReactNode;
  asChild?: boolean;
}
