import React, { useState } from 'react';

/**
 * InputMultTag recreation — free-typed multi-tag input (Enter to commit,
 * dedupes, respects a max count). Distinct from Select's multi-select:
 * there is no dropdown/option list here, the user types arbitrary values
 * (IDs, keywords) and each becomes a removable chip.
 */
export function InputMultTag(props) {
  const {
    value = [],
    placeholder = '请输入',
    disabled = false,
    clearable = false,
    collapseTags = false,
    multipleLimit = 0,
    width = 240,
    onChange,
  } = props;
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  function commit() {
    const q = query.trim();
    if (!q) return;
    if (value.includes(q)) { setQuery(''); return; }
    if (multipleLimit > 0 && value.length >= multipleLimit) { setQuery(''); return; }
    onChange && onChange([...value, q]);
    setQuery('');
  }

  function removeTag(tag) {
    if (disabled) return;
    onChange && onChange(value.filter((v) => v !== tag));
  }

  function onKeyDown(e) {
    if (e.key === 'Enter') { e.preventDefault(); commit(); }
    else if (e.key === 'Backspace' && !query && value.length) removeTag(value[value.length - 1]);
  }

  const shown = collapseTags ? value.slice(0, 1) : value;
  const overflow = collapseTags ? value.length - shown.length : 0;

  return (
    <div
      onClick={() => !disabled && document.getElementById(props.id || '__imt_focus')?.focus()}
      style={{
        display: 'flex',
        flexWrap: collapseTags ? 'nowrap' : 'wrap',
        alignItems: 'center',
        gap: 6,
        minHeight: 32,
        width,
        border: `1px solid ${focused ? 'var(--brand-primary)' : '#dcdfe6'}`,
        borderRadius: 'var(--radius-md)',
        background: disabled ? 'var(--color-surface-muted)' : '#fff',
        padding: '4px 8px',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-ui)',
        cursor: disabled ? 'not-allowed' : 'text',
        transition: 'border-color var(--duration-fast) var(--ease-standard)',
      }}
    >
      {shown.map((tag) => (
        <span
          key={tag}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            background: 'var(--color-surface-muted)',
            color: 'var(--text-body)',
            borderRadius: 4,
            padding: '2px 6px',
            fontSize: 12,
            whiteSpace: 'nowrap',
          }}
        >
          {tag}
          {!disabled && (
            <span onClick={(e) => { e.stopPropagation(); removeTag(tag); }} style={{ cursor: 'pointer', color: 'var(--text-faint)' }}>✕</span>
          )}
        </span>
      ))}
      {overflow > 0 && (
        <span style={{ background: 'var(--brand-primary-bg)', color: 'var(--brand-primary)', borderRadius: 4, padding: '2px 6px', fontSize: 12, whiteSpace: 'nowrap' }}>
          +{overflow}
        </span>
      )}
      <input
        id={props.id || '__imt_focus'}
        value={query}
        disabled={disabled}
        placeholder={value.length === 0 ? placeholder : ''}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); commit(); }}
        style={{
          flex: 1,
          minWidth: 40,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 'var(--text-sm)',
          fontFamily: 'var(--font-ui)',
          color: 'var(--text-heading)',
        }}
      />
      {clearable && value.length > 0 && !disabled && (
        <span
          onClick={(e) => { e.stopPropagation(); onChange && onChange([]); setQuery(''); }}
          style={{ cursor: 'pointer', color: 'var(--text-faint)', fontSize: 12 }}
        >
          ✕
        </span>
      )}
    </div>
  );
}
