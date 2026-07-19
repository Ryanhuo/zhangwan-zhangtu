import React from 'react';

export function Checkbox(props) {
  const { label, checked = false, disabled = false, onChange } = props;
  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-sm)',
        color: disabled ? 'var(--text-faint)' : 'var(--text-body)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <span
        onClick={() => !disabled && onChange && onChange(!checked)}
        style={{
          width: 14,
          height: 14,
          borderRadius: 2,
          border: `1px solid ${checked ? 'var(--brand-primary)' : '#dcdfe6'}`,
          background: checked ? 'var(--brand-primary)' : '#fff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {checked && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3.2 5.7L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}
