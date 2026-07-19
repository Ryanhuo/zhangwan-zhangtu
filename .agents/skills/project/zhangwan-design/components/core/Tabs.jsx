import React from 'react';

export function Tabs(props) {
  const { items = [], value, onChange } = props;
  return (
    <div
      style={{
        display: 'flex',
        background: '#fff',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <div
            key={item.value}
            onClick={() => onChange && onChange(item.value)}
            style={{
              height: 50,
              lineHeight: '50px',
              padding: '0 20px',
              fontSize: 16,
              color: active ? 'var(--text-heading)' : 'var(--text-muted)',
              fontWeight: active ? 700 : 400,
              position: 'relative',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            {item.label}
            {active && (
              <span
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 2,
                  background: 'var(--brand-primary)',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
