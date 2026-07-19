import React from 'react';

export function SidebarNav(props) {
  const { items = [], collapsed = false, onSelect } = props;
  const width = collapsed ? 56 : 190;
  return (
    <div
      style={{
        width,
        background: '#fff',
        height: '100%',
        boxShadow: 'var(--shadow-sidebar)',
        fontFamily: 'var(--font-ui)',
        transition: 'width var(--duration-fast) var(--ease-standard)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? 0 : '0 14px', gap: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'conic-gradient(from 180deg, var(--brand-primary), #22d3a0, var(--brand-primary))', flexShrink: 0 }} />
        {!collapsed && <span style={{ fontWeight: 600, color: 'var(--text-heading)', fontSize: 16 }}>掌玩</span>}
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => onSelect && onSelect(i)}
          style={{
            height: 50,
            lineHeight: '50px',
            paddingLeft: collapsed ? 0 : 20,
            textAlign: collapsed ? 'center' : 'left',
            fontSize: 15,
            color: item.active ? 'var(--brand-primary)' : 'var(--text-body)',
            background: item.active ? 'var(--brand-active-bg)' : 'transparent',
            borderRight: item.active ? '3px solid var(--brand-primary)' : '3px solid transparent',
            cursor: 'pointer',
            boxSizing: 'border-box',
          }}
          onMouseEnter={(e) => { if (!item.active) e.currentTarget.style.background = 'var(--brand-hover-bg)'; }}
          onMouseLeave={(e) => { if (!item.active) e.currentTarget.style.background = 'transparent'; }}
        >
          {collapsed ? item.label.slice(0, 1) : item.label}
        </div>
      ))}
    </div>
  );
}
