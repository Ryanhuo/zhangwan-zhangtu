import React from 'react';

export function RadioButtonGroup(props) {
  const { options = [], value, onChange } = props;
  return (
    <div style={{ display: 'inline-flex', fontFamily: 'var(--font-ui)' }}>
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <div
            key={opt.value}
            onClick={() => onChange && onChange(opt.value)}
            style={{
              minWidth: 70,
              padding: '0 16px',
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              border: `1px solid ${active ? 'var(--brand-primary)' : '#dcdfe6'}`,
              background: active ? 'var(--brand-primary)' : '#fff',
              color: active ? '#fff' : 'var(--text-body)',
              borderLeft: i === 0 ? undefined : 'none',
              borderRadius: i === 0 ? 'var(--radius-md) 0 0 var(--radius-md)' : i === options.length - 1 ? '0 var(--radius-md) var(--radius-md) 0' : 0,
              boxSizing: 'border-box',
              position: 'relative',
              zIndex: active ? 1 : 0,
            }}
          >
            {opt.label}
          </div>
        );
      })}
    </div>
  );
}
