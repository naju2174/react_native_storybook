import type React from 'react';

export interface AccordionProps {
  title: string;
  children: string | React.ReactElement;
  /** Controlled: whether this item is expanded */
  expanded?: boolean;
  /** Controlled: called when header is pressed */
  onToggle?: () => void;
  /** Internal: used by AccordionGroup to control which borders are drawn */
  _borderTop?: boolean;
  _borderBottom?: boolean;
}

export interface AccordionGroupItem {
  title: string;
  children: string | React.ReactElement;
}

export interface AccordionGroupProps {
  items: AccordionGroupItem[];
}
