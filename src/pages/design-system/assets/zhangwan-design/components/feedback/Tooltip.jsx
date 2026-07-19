import React, { useState, useRef, useEffect } from 'react';

/**
 * 深色气泡提示 — 对应 el-tooltip 的 effect="dark" 样式，及项目自有的
 * TextTooltip 用法（仅当文字被截断时才显示提示，否则不显示）。
 */
export function Tooltip(props) {
  const { content, children, placement = 'top', disabled = false, onlyOnOverflow = false } = props;
  const [visible, setVisible] = useState(false);
  const [overflowing, setOverflowing] = useState(!onlyOnOverflow);
  const ref = useRef(null);

  useEffect(() => {
    if (!onlyOnOverflow || !ref.current) return;
    const el = ref.current;
    setOverflowing(el.scrollWidth > el.clientWidth);
  }, [children, onlyOnOverflow]);

  const showTooltip = visible && !disabled && overflowing;
  const isTop = placement === 'top';

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', maxWidth: '100%' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <div
        ref={ref}
        style={onlyOnOverflow ? { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' } : undefined}
      >
        {children}
      </div>
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            [isTop ? 'bottom' : 'top']: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: isTop ? 0 : 6,
            marginBottom: isTop ? 6 : 0,
            background: '#303133',
            color: '#fff',
            fontSize: 12,
            lineHeight: '18px',
            padding: '6px 10px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            maxWidth: 320,
            zIndex: 100,
            fontFamily: 'var(--font-ui)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
