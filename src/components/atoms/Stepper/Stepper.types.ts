import type { ReactNode } from 'react';

export type StepperOrientation = 'horizontal' | 'vertical';

export interface StepperItemProps {
  label: string;
  description?: string;
}

export interface StepperProps {
  /** Step items — use <StepperItem> children to define each step */
  children: ReactNode;
  /** Current active step index (0-based) */
  activeStep?: number;
  /** Orientation of the stepper */
  orientation?: StepperOrientation;
  /** Optional percentage used by the progress bar (1–100) */
  percentage?: number;
  /** Custom progress fill color */
  progressColor?: string;
  /** Show a ghost-style stepper */
  ghost?: boolean;
  /** Show checkmark icon for completed steps */
  showCheckMark?: boolean;
  /** Show partial progress line on the active step connector */
  showProgress?: boolean;
}
