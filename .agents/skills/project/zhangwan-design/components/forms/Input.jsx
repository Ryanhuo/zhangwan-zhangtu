import React, { useState } from 'react';

export function Input(props) {
  const {
    value,
    placeholder = '请输入',
    size = 'medium',
    disabled = false,
    clearable = false,
    width = 240,
    onChange,
  } = props;
  const [focused, setFocused] = useState(false);
  const [internal, setInternal] = useState(value || '');
  const val = value !== undefined ? value : internal;
  const height = size === 'small' ? 28 : 32;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height,
        width,
        border: `1px solid ${focused ? 'var(--brand-primary)' : '#dcdfe6'}`,
        borderRadius: 'var(--radius-md)',
        background: disabled ? 'var(--color-surface-muted)' : '#fff',
        padding: '0 10px',
        boxSizing: 'border-box',
        transition: 'border-color var(--duration-fast) var(--ease-standard)',
      }}
    >
      <input
        value={val}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => {
          setInternal(e.target.value);
          onChange && onChange(e.target.value);
        }}
        style={{
          border: 'none',
          outline: 'none',
          background: 'transparent',
          width: '100%',
          fontSize: 'var(--text-sm)',
          fontFamily: 'var(--font-ui)',
          color: 'var(--text-heading)',
        }}
      />
      {clearable && val && !disabled && (
        <span
          onClick={() => { setInternal(''); onChange && onChange(''); }}
          style={{ cursor: 'pointer', color: 'var(--text-faint)', fontSize: 12, marginLeft: 4 }}
        >
          ✕
        </span>
      )}
    </div>
  );
}
