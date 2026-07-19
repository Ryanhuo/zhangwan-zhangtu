import React, { useState, useRef, useEffect } from 'react';

/**
 * SystemLink recreation — the top-navbar cross-system switcher: a row of
 * system entries (icon + name), a plain link for a single-destination
 * system, or a hover dropdown listing sub-systems/groups for one with
 * several destinations.
 */
export function SystemLink(props) {
  const { systems = [] } = props;
  return (
    <div style={{ display: 'inline-flex', fontFamily: 'var(--font-ui)' }}>
      {systems.map((s) => (
        <SystemEntry key={s.name} system={s} />
      ))}
    </div>
  );
}

function SystemEntry({ system }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const hasMenu = Array.isArray(system.items) && system.items.length > 0;

  const label = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '14px 15px',
        fontSize: 16,
        color: open ? 'var(--brand-primary)' : 'var(--text-body)',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; }}
      onMouseLeave={(e) => { if (!open) e.currentTarget.style.color = 'var(--text-body)'; }}
    >
      {system.icon && <span style={{ width: 20, height: 20, borderRadius: 4, background: system.icon, flexShrink: 0 }} />}
      {system.name}
    </span>
  );

  if (!hasMenu) {
    return <a href={system.link || '#'} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>{label}</a>;
  }

  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={() => setOpen((o) => !o)}>
      {label}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: 160,
            background: '#fff',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            padding: '6px 0',
            zIndex: 20,
          }}
        >
          {system.items.map((it) => (
            <a
              key={it.name}
              href={it.link || '#'}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'block',
                padding: '8px 16px',
                fontSize: 14,
                color: 'var(--text-body)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; e.currentTarget.style.color = 'var(--brand-primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-body)'; }}
            >
              {it.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
