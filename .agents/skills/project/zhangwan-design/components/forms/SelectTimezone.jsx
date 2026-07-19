import React, { useState } from 'react';

const DEFAULT_ZONES = [
  { label: '北京UTC+8', value: '+8' },
  { label: '纽约UTC-5', value: '-5' },
];

/**
 * Timezone dropdown — matches SelectTimezone: a small, non-clearable
 * el-select of a couple named UTC offsets, used to re-anchor day-boundary
 * figures on retention/overseas analysis pages.
 */
export function SelectTimezone(props) {
  const { value = '+8', zones = DEFAULT_ZONES, onChange } = props;
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value);
  const val = props.value !== undefined ? props.value : internal;
  const label = zones.find((z) => z.value === val)?.label || val;

  return (
    <div style={{ position: 'relative', width: 150, fontFamily: 'var(--font-ui)' }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          height: 32, border: `1px solid ${open ? 'var(--brand-primary)' : '#dcdfe6'}`, borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 10px', fontSize: 'var(--text-sm)',
          color: 'var(--text-heading)', background: '#fff', cursor: 'pointer', boxSizing: 'border-box',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        <span style={{ fontSize: 10, color: 'var(--text-faint)', transform: open ? 'rotate(180deg)' : 'none' }}>▾</span>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', zIndex: 10, overflow: 'hidden' }}>
          {zones.map((z) => (
            <div
              key={z.value}
              onClick={() => { setInternal(z.value); onChange && onChange(z.value); setOpen(false); }}
              style={{ padding: '8px 12px', fontSize: 'var(--text-sm)', color: z.value === val ? 'var(--brand-primary)' : 'var(--text-body)', background: z.value === val ? 'var(--brand-primary-bg)' : 'transparent', cursor: 'pointer' }}
              onMouseEnter={(e) => { if (z.value !== val) e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
              onMouseLeave={(e) => { if (z.value !== val) e.currentTarget.style.background = 'transparent'; }}
            >
              {z.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
