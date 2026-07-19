import React, { useState } from 'react';

/**
 * 表格单元格的多值列表展示 — 对应 components/popoverTableCell/index.vue：
 * 顿号连接的前 3 项 + "..."，超过 3 项时悬停弹出完整列表。
 */
export function PopoverTableCell(props) {
  const { items = [], renderLabel = (i) => i.label } = props;
  const [open, setOpen] = useState(false);
  const shown = items.slice(0, 3);
  const overflow = items.length > 3;

  return (
    <div
      style={{ position: 'relative', display: 'inline-block', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)', color: 'var(--text-body)' }}
      onMouseEnter={() => overflow && setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span style={{ cursor: overflow ? 'default' : 'inherit' }}>
        {shown.map((it, i) => (
          <React.Fragment key={i}>
            {renderLabel(it)}
            {i !== shown.length - 1 ? '、' : overflow ? '...' : ''}
          </React.Fragment>
        ))}
      </span>
      {open && overflow && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0, marginTop: 4, background: '#fff',
            border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)',
            padding: '8px 12px', zIndex: 50, maxHeight: 200, overflowY: 'auto', minWidth: 160,
          }}
        >
          {items.map((it, i) => (
            <div key={i} style={{ padding: '2px 0', whiteSpace: 'nowrap' }}>{renderLabel(it)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
