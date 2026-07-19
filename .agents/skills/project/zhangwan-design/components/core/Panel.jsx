import React from 'react';

export function Panel(props) {
  const { title, children } = props;
  return (
    <div style={{ border: '1px solid var(--color-border-light)', fontFamily: 'var(--font-ui)', background: '#fff' }}>
      <div
        style={{
          lineHeight: '39px',
          background: 'var(--surface-sunken)',
          padding: '0 10px',
          borderBottom: '1px solid var(--color-border-light)',
          fontWeight: 500,
          color: 'var(--text-heading)',
          fontSize: 'var(--text-sm)',
        }}
      >
        {title}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}
