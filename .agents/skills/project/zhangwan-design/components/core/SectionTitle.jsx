import React from 'react';

/**
 * lineLightTitle recreation — a 4px brand-green bar followed by a label,
 * the standard section-header treatment used throughout analysis pages
 * (userPortrait, dashboard blocks, etc).
 */
export function SectionTitle(props) {
  const { children, fontSize = 16 } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-ui)', fontSize }}>
      <div style={{ width: 4, height: '1em', background: 'var(--brand-primary)', marginRight: 8, flexShrink: 0 }} />
      <div style={{ color: 'var(--text-heading)', fontWeight: 500 }}>{children}</div>
    </div>
  );
}
