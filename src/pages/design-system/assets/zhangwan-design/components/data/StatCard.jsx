import React from 'react';

export function StatCard(props) {
  const { title, value, caption, active = false, onClick, aside } = props;
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 130,
        padding: 20,
        borderRadius: 'var(--radius-md)',
        background: 'var(--surface-sunken)',
        border: active ? '1px solid var(--brand-primary)' : '2px solid var(--surface-sunken)',
        boxShadow: active ? 'var(--shadow-card)' : 'none',
        cursor: onClick ? 'pointer' : 'default',
        boxSizing: 'border-box',
        fontFamily: 'var(--font-ui)',
        width: 280,
      }}
    >
      <div>
        <h5 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: 'var(--text-heading)' }}>{title}</h5>
        <div style={{ fontFamily: 'var(--font-numeric)', fontSize: 'var(--text-xl)', color: 'var(--text-heading)', padding: '10px 0' }}>
          {value}
        </div>
        {caption && <p style={{ margin: 0, fontSize: 12, color: 'var(--text-faint)' }}>{caption}</p>}
      </div>
      {aside && <div style={{ minWidth: 100, width: '50%', height: 98 }}>{aside}</div>}
    </div>
  );
}
