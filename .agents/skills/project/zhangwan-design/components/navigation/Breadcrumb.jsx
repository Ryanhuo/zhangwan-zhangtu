import React from 'react';

/**
 * 面包屑导航 — 对应 components/Breadcrumb/index.vue：斜杠分隔，最后一级为纯文本
 * （不可点击），其余各级可点击跳转。
 */
export function Breadcrumb(props) {
  const { items = [], onNavigate } = props;
  return (
    <div style={{ display: 'flex', alignItems: 'center', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)', lineHeight: '20px', padding: '10px 0' }}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label + i} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <span style={{ margin: '0 6px', color: 'var(--text-faint)' }}>/</span>}
            {isLast ? (
              <span style={{ color: 'var(--text-muted)', cursor: 'text' }}>{item.label}</span>
            ) : (
              <a
                onClick={(e) => { e.preventDefault(); onNavigate && onNavigate(item, i); }}
                href="#"
                style={{ color: 'var(--text-body)', textDecoration: 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--brand-primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-body)'; }}
              >
                {item.label}
              </a>
            )}
          </span>
        );
      })}
    </div>
  );
}
