import React, { useState } from 'react';

/**
 * "更新时间" 标签 — 对应 components/updateTime/index.vue：显示数据最后更新
 * 时间，悬停时（若提供了 breakdown）弹出各数据源明细。常见于分析页顶部，与
 * Breadcrumb 同一行右侧对齐。
 */
export function UpdateTime(props) {
  const { time, breakdown = [] } = props;
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}
      onMouseEnter={() => breakdown.length > 0 && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span style={{ color: 'var(--text-muted)' }}>更新时间：</span>
      <span style={{ color: 'var(--text-muted)' }}>{time}</span>
      {open && breakdown.length > 0 && (
        <div
          style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 6, background: '#fff',
            border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)',
            padding: '10px 14px', zIndex: 50, whiteSpace: 'nowrap',
          }}
        >
          {breakdown.map((b) => (
            <div key={b.key} style={{ display: 'flex', gap: 8, padding: '2px 0', fontSize: 12 }}>
              <span style={{ width: 90, textAlign: 'right', color: 'var(--text-faint)' }}>{b.key}：</span>
              <span style={{ color: 'var(--text-body)' }}>{b.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
