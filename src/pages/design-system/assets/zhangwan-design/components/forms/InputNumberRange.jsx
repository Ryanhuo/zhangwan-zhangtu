import React, { useState } from 'react';

/**
 * Numeric range input — matches InputNumberRange: two el-inputs joined by a
 * "~" separator (最小值 / 最大值 placeholders) with a trailing clear icon.
 */
export function InputNumberRange(props) {
  const { from, to, placeholderFrom = '最小值', placeholderTo = '最大值', disabled = false, clearable = true, width = 240, onChange } = props;
  const [internalFrom, setInternalFrom] = useState(from ?? '');
  const [internalTo, setInternalTo] = useState(to ?? '');
  const [focused, setFocused] = useState(false);
  const f = from !== undefined ? from : internalFrom;
  const t = to !== undefined ? to : internalTo;

  function update(nf, nt) {
    setInternalFrom(nf);
    setInternalTo(nt);
    onChange && onChange(nf, nt);
  }

  const inputStyle = {
    border: 'none', outline: 'none', background: 'transparent', width: '100%',
    fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)', color: 'var(--text-heading)', textAlign: 'center',
  };

  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', height: 32, width,
        border: `1px solid ${focused ? 'var(--brand-primary)' : '#dcdfe6'}`, borderRadius: 'var(--radius-md)',
        background: disabled ? 'var(--color-surface-muted)' : '#fff', boxSizing: 'border-box',
        transition: 'border-color var(--duration-fast) var(--ease-standard)', fontFamily: 'var(--font-ui)',
      }}
    >
      <input
        value={f}
        placeholder={placeholderFrom}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => update(e.target.value, t)}
        style={{ ...inputStyle, paddingLeft: 10 }}
      />
      <span style={{ color: 'var(--text-faint)', flexShrink: 0 }}>~</span>
      <input
        value={t}
        placeholder={placeholderTo}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => update(f, e.target.value)}
        style={inputStyle}
      />
      {clearable && (f || t) && !disabled && (
        <span onClick={() => update('', '')} style={{ cursor: 'pointer', color: 'var(--text-faint)', fontSize: 12, padding: '0 8px', flexShrink: 0 }}>✕</span>
      )}
    </div>
  );
}
