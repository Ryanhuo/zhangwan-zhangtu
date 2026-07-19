import React from 'react';

export function Navbar(props) {
  const { title, userName = '管理员', avatarUrl } = props;
  return (
    <div
      style={{
        height: 50,
        background: '#fff',
        boxShadow: 'var(--shadow-navbar)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        fontFamily: 'var(--font-ui)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ color: 'var(--text-heading)', fontSize: 15 }}>{title}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'var(--surface-sunken)',
            border: '1px solid var(--color-border-light)',
          }}
        />
        <span style={{ fontSize: 14, color: 'var(--text-body)' }}>{userName}</span>
      </div>
    </div>
  );
}
