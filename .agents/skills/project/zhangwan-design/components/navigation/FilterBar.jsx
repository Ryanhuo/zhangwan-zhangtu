import React, { useState, useRef, useEffect } from 'react';

/**
 * BiSearchBlock + .search-form recreation — matches compass/src/styles/ui.scss:
 * a white card whose .search-item cells flow as responsive percentage columns
 * (min-width 350px; 2–5 columns depending on available width), each cell being
 * [80px right-aligned label | control stretched to 100%]. Cells carry
 * padding-right/bottom 20px; the card supplies the remaining 20px on top/left.
 */
export function FilterBar(props) {
  const { children } = props;
  const ref = useRef(null);
  const [cols, setCols] = useState(3);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width;
      // real breakpoints: 50% / 33.3% / 25% / 20% with min-width 350px per item
      setCols(Math.max(2, Math.min(5, Math.floor(w / 350))));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        background: '#fff',
        padding: '20px 0 0 20px',
        borderRadius: 'var(--radius-sm)',
        fontFamily: 'var(--font-ui)',
      }}
    >
      {React.Children.map(children, (child) =>
        child && child.type === FilterField ? React.cloneElement(child, { $cols: cols }) : child
      )}
    </div>
  );
}

export function FilterField(props) {
  const { label, children, $cols = 3, action = false } = props;
  // .search-item: label 80px right-aligned + content flex-grow, control 100% wide
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: action ? 'auto' : `calc(${(100 / $cols).toFixed(2)}% - 0.1px)`,
        minWidth: action ? 0 : 330,
        flex: '0 0 auto',
        paddingRight: 20,
        paddingBottom: 20,
        boxSizing: 'border-box',
      }}
    >
      {label !== undefined && (
        <label
          style={{
            width: 80,
            flexShrink: 0,
            paddingRight: 10,
            textAlign: 'right',
            fontSize: 'var(--text-sm)',
            color: 'var(--text-heading)',
            lineHeight: '16px',
            maxHeight: 32,
            overflow: 'hidden',
            boxSizing: 'border-box',
          }}
        >
          {label}
        </label>
      )}
      <div style={{ flexGrow: 1, minWidth: 0 }}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child) && typeof child.type !== 'string'
            ? React.cloneElement(child, { width: '100%' })
            : child
        )}
      </div>
    </div>
  );
}
