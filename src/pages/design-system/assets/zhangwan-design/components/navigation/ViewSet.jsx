import React, { useState } from 'react';

/**
 * ViewSet / ViewList recreation — the "自定义视图" saved-view row shown
 * under a filter bar: a row of color-tinted pill buttons (one per saved
 * view), each removable by its owner, plus an expand/collapse toggle when
 * there are many. Real usage saves the current filter/column/color state
 * as a named view and lets the user jump back to it later.
 */
export function ViewSet(props) {
  const { views = [], activeId = null, onSelect, onDelete, label = '自定义视图:' } = props;
  const [expanded, setExpanded] = useState(true);

  if (views.length === 0) return null;
  const shown = expanded ? views : views.slice(0, 1);

  return (
    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'var(--font-ui)', padding: '10px 20px 0' }}>
      <div style={{ fontSize: 'var(--text-sm)', color: '#323335', lineHeight: '22px', paddingLeft: 5, paddingRight: 12, marginBottom: 10, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        {shown.map((v) => {
          const active = v.id === activeId;
          return (
            <span
              key={v.id}
              onClick={() => onSelect && onSelect(v.id)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                height: 28,
                marginRight: 12,
                marginBottom: 10,
                padding: '0 20px 0 14px',
                borderRadius: 4,
                fontSize: 14,
                color: active ? 'var(--brand-primary)' : 'var(--text-heading)',
                background: active ? 'var(--brand-primary-bg)' : (v.color || 'var(--color-surface-muted)'),
                border: active ? '1px solid var(--brand-primary)' : '1px solid transparent',
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onMouseEnter={(e) => { const del = e.currentTarget.querySelector('[data-del]'); if (del) del.style.display = 'inline-block'; }}
              onMouseLeave={(e) => { const del = e.currentTarget.querySelector('[data-del]'); if (del) del.style.display = 'none'; }}
            >
              {v.label}
              {v.removable !== false && (
                <span
                  data-del
                  onClick={(e) => { e.stopPropagation(); onDelete && onDelete(v); }}
                  style={{ display: 'none', position: 'absolute', right: 4, color: active ? 'var(--brand-primary)' : 'var(--text-faint)', fontSize: 12 }}
                >
                  ✕
                </span>
              )}
            </span>
          );
        })}
      </div>
      {views.length > 1 && (
        <span
          onClick={() => setExpanded((e) => !e)}
          style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#777D8C', fontSize: 13, cursor: 'pointer', flexShrink: 0, lineHeight: '28px', marginBottom: 10 }}
        >
          <span style={{ fontSize: 10 }}>{expanded ? '▲' : '▼'}</span>
          <span style={{ color: 'var(--text-heading)' }}>{expanded ? '收起' : '展示'}</span>
        </span>
      )}
    </div>
  );
}
