import React, { useState } from 'react';
import type { AccordionProps, AccordionGroupProps } from './Accordion.types';

export function Accordion({
  title,
  children,
  expanded: expandedProp,
  onToggle,
  _borderTop = true,
  _borderBottom = true,
}: AccordionProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);

  const isControlled = expandedProp !== undefined;
  const expanded = isControlled ? expandedProp : internalExpanded;

  const toggle = () => {
    if (isControlled) {
      onToggle?.();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  return (
    <div
      style={{
        borderTop: _borderTop ? '1px solid #D1D5DB' : 'none',
        borderBottom: _borderBottom ? '1px solid #D1D5DB' : 'none',
        backgroundColor: '#FFFFFF',
        width: '100%',
      }}
    >
      <button
        onClick={toggle}
        aria-expanded={expanded}
        aria-label={title}
        style={{
          display: 'flex',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          minHeight: 44,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 16,
          fontWeight: 500,
          color: '#111827',
        }}
      >
        <span>{title}</span>
        <svg
          width={20}
          height={20}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B7280"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: 'transform 0.3s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        role="region"
        aria-hidden={!expanded}
        style={{
          display: 'grid',
          gridTemplateRows: expanded ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.3s ease-in-out',
        }}
      >
        <div style={{ overflow: 'hidden', minHeight: 0 }}>
          <div style={{ padding: '0 16px 14px' }}>
            {typeof children === 'string' ? (
              <p style={{ fontSize: 14, color: '#4B5563', lineHeight: 1.6, margin: 0 }}>{children}</p>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccordionGroup({ items }: AccordionGroupProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastIndex = items.length - 1;

  return (
    <div style={{ width: '100%', borderTop: '1px solid #D1D5DB' }}>
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
    </div>
  );
}
