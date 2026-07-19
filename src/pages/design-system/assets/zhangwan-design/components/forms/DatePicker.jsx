import React, { useState, useRef, useEffect } from 'react';

function fmt(d) {
  if (!d) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function addDays(d, n) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

const DEFAULT_PRESETS = [
  { label: '今天', range: () => { const t = new Date(); return [t, t]; } },
  { label: '昨天', range: () => { const y = addDays(new Date(), -1); return [y, y]; } },
  { label: '近7天', range: () => [addDays(new Date(), -6), new Date()] },
  { label: '近30天', range: () => [addDays(new Date(), -29), new Date()] },
];

/**
 * BiDatePicker recreation — a text-field trigger that opens a panel with a
 * date-range display and quick-range preset shortcuts (今天/近7天/近30天…).
 * The calendar grid itself is intentionally simplified (no month-grid picker)
 * since exact calendar behavior lives in the un-mounted bi-element-ui source.
 */
export function DatePicker(props) {
  const { value, presets = DEFAULT_PRESETS, onChange, startPlaceholder = '开始日期', endPlaceholder = '结束日期', separator = '~', width = 240 } = props;
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value || [null, null]);
  const ref = useRef(null);
  const [start, end] = value !== undefined ? value : internal;

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function pick(preset) {
    const range = preset.range();
    setInternal(range);
    onChange && onChange(range);
    setOpen(false);
  }



  return (
    <div ref={ref} style={{ position: 'relative', width, fontFamily: 'var(--font-ui)' }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          height: 32,
          border: `1px solid ${open ? 'var(--brand-primary)' : '#dcdfe6'}`,
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '0 10px',
          fontSize: 'var(--text-sm)',
          color: start ? 'var(--text-heading)' : 'var(--text-faint)',
          background: '#fff',
          cursor: 'pointer',
          boxSizing: 'border-box',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
          <rect x="1" y="2.5" width="12" height="10.5" rx="1" stroke="#c0c4cc" strokeWidth="1.2"></rect>
          <path d="M1 5.5h12M4.2 1v3M9.8 1v3" stroke="#c0c4cc" strokeWidth="1.2"></path>
        </svg>
        <span style={{ flex: 1, textAlign: 'center', color: start ? 'var(--text-heading)' : 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{start ? fmt(start) : startPlaceholder}</span>
        <span style={{ color: 'var(--text-faint)', flexShrink: 0 }}>{separator}</span>
        <span style={{ flex: 1, textAlign: 'center', color: end ? 'var(--text-heading)' : 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{end ? fmt(end) : endPlaceholder}</span>
      </div>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            background: '#fff',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            zIndex: 10,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <div style={{ borderRight: '1px solid var(--color-border-light)', padding: 8, display: 'flex', flexDirection: 'column', minWidth: 88 }}>
            {presets.map((p) => (
              <div
                key={p.label}
                onClick={() => pick(p)}
                style={{ padding: '6px 10px', fontSize: 'var(--text-sm)', color: 'var(--text-body)', cursor: 'pointer', borderRadius: 4, whiteSpace: 'nowrap' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; e.currentTarget.style.color = 'var(--brand-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-body)'; }}
              >
                {p.label}
              </div>
            ))}
          </div>
          <div style={{ padding: 16, minWidth: 200, fontSize: 'var(--text-sm)', color: 'var(--text-body)' }}>
            <div style={{ marginBottom: 8, color: 'var(--text-heading)', fontFamily: 'var(--font-numeric)' }}>
              {start ? fmt(start) : '开始日期'} ~ {end ? fmt(end) : '结束日期'}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>选择左侧快捷时间段，或对接日历组件进行精确选择。</div>
          </div>
        </div>
      )}
    </div>
  );
}
