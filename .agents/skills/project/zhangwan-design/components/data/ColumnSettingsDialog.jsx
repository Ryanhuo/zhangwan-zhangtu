import React, { useState, useEffect } from 'react';

/**
 * "自定义列" dialog — matches components/showTableColumn/index.vue exactly:
 * groups of columns, each with a parent "select all in group" checkbox and a
 * row of child checkboxes; a single global "全选" checkbox sits in the footer
 * (left-aligned) next to a single "关闭" button — there is no separate
 * cancel/confirm pair, since real usage saves each toggle immediately.
 */
export function ColumnSettingsDialog(props) {
  const { open, groups = [], onChange, onClose } = props;
  const [state, setState] = useState(groups);

  useEffect(() => { setState(groups); }, [open]);

  if (!open) return null;

  const allChecked = state.length > 0 && state.every((g) => g.children.every((c) => c.checked));

  function toggleGroup(gi, val) {
    setState((prev) => {
      const next = prev.map((g, i) => (i === gi ? { ...g, children: g.children.map((c) => ({ ...c, checked: val })) } : g));
      onChange && onChange(next);
      return next;
    });
  }
  function toggleChild(gi, ci, val) {
    setState((prev) => {
      const next = prev.map((g, i) =>
        i === gi ? { ...g, children: g.children.map((c, j) => (j === ci ? { ...c, checked: val } : c)) } : g
      );
      onChange && onChange(next);
      return next;
    });
  }
  function toggleAll(val) {
    setState((prev) => {
      const next = prev.map((g) => ({ ...g, children: g.children.map((c) => ({ ...c, checked: val })) }));
      onChange && onChange(next);
      return next;
    });
  }

  const checkboxStyle = (checked) => ({
    width: 16, height: 16, borderRadius: 2, border: `1px solid ${checked ? 'var(--brand-primary)' : '#dcdfe6'}`,
    background: checked ? 'var(--brand-primary)' : '#fff', color: '#fff', display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', fontSize: 11, flexShrink: 0, cursor: 'pointer',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-ui)' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 620, maxWidth: '92vw', background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: '0 12px 32px rgba(0,0,0,0.18)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', fontSize: 16, fontWeight: 600, color: 'var(--text-heading)', borderBottom: '1px solid var(--color-border-light)' }}>自定义列</div>
        <div style={{ padding: 20, minHeight: 120, maxHeight: 420, overflowY: 'auto' }}>
          {state.map((g, gi) => (
            <div key={g.label} style={{ display: 'flex', padding: '10px 0', borderBottom: gi === state.length - 1 ? 'none' : '1px solid var(--color-border-light)' }}>
              <label style={{ width: 140, display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-heading)', cursor: 'pointer', flexShrink: 0 }} onClick={() => toggleGroup(gi, !g.children.every((c) => c.checked))}>
                <span style={checkboxStyle(g.children.every((c) => c.checked))}>{g.children.every((c) => c.checked) ? '✓' : ''}</span>
                {g.label}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 15px', flex: 1 }}>
                {g.children.map((c, ci) => (
                  <label key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-sm)', color: 'var(--text-body)', cursor: 'pointer', width: 120 }} onClick={() => toggleChild(gi, ci, !c.checked)}>
                    <span style={checkboxStyle(c.checked)}>{c.checked ? '✓' : ''}</span>
                    {c.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border-light)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', color: 'var(--text-body)', cursor: 'pointer' }} onClick={() => toggleAll(!allChecked)}>
            <span style={checkboxStyle(allChecked)}>{allChecked ? '✓' : ''}</span>
            全选
          </label>
          <button onClick={onClose} style={{ height: 32, padding: '0 16px', border: '1px solid #dcdfe6', background: '#fff', color: 'var(--text-body)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
