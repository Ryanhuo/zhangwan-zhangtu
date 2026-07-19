import React, { useState, useRef, useEffect, useMemo } from 'react';

/**
 * Zhangwan dropdown select — matches el-select.
 * Adds: filterable search input (stand-in for remote search), collapsed
 * tag summary ("已选2项 +N") for multi-select, and a select-all row.
 */
export function Select(props) {
  const {
    options = [],
    value,
    placeholder = '请选择',
    multiple = false,
    filterable = false,
    collapseTags = true,
    showSelectAll = true,
    showBatchInput = false,
    batchTitle = '批量输入',
    width = 240,
    onChange,
  } = props;
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchText, setBatchText] = useState('');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [internal, setInternal] = useState(multiple ? (value || []) : value);
  const ref = useRef(null);
  const inputRef = useRef(null);
  const val = value !== undefined ? value : internal;

  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQuery(''); }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (open && filterable && inputRef.current) inputRef.current.focus();
  }, [open, filterable]);

  const filtered = useMemo(() => {
    if (!filterable || !query) return options;
    return options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query, filterable]);

  function selectOpt(opt) {
    if (multiple) {
      const arr = Array.isArray(val) ? val : [];
      const next = arr.includes(opt.value) ? arr.filter((v) => v !== opt.value) : [...arr, opt.value];
      setInternal(next);
      onChange && onChange(next);
    } else {
      setInternal(opt.value);
      onChange && onChange(opt.value);
      setOpen(false);
      setQuery('');
    }
  }

  function toggleAll() {
    const arr = Array.isArray(val) ? val : [];
    const allVals = filtered.map((o) => o.value);
    const allChecked = allVals.length > 0 && allVals.every((v) => arr.includes(v));
    const next = allChecked ? arr.filter((v) => !allVals.includes(v)) : Array.from(new Set([...arr, ...allVals]));
    setInternal(next);
    onChange && onChange(next);
  }

  const selectedOpts = multiple ? options.filter((o) => (val || []).includes(o.value)) : [];
  const labelText = multiple ? null : options.find((o) => o.value === val)?.label;

  const arr = Array.isArray(val) ? val : [];
  const allVals = filtered.map((o) => o.value);
  const allChecked = allVals.length > 0 && allVals.every((v) => arr.includes(v));
  const someChecked = allVals.some((v) => arr.includes(v)) && !allChecked;

  const MAX_TAGS = 2;

  function applyBatch() {
    const lines = batchText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) { setBatchOpen(false); return; }
    const matched = options.filter((o) => lines.includes(String(o.label)) || lines.includes(String(o.value)));
    const nextVals = matched.map((o) => o.value);
    if (multiple) {
      const merged = Array.from(new Set([...(Array.isArray(val) ? val : []), ...nextVals]));
      setInternal(merged);
      onChange && onChange(merged);
    } else if (nextVals.length) {
      setInternal(nextVals[0]);
      onChange && onChange(nextVals[0]);
    }
    setBatchText('');
    setBatchOpen(false);
  }

  return (
    <div ref={ref} style={{ position: 'relative', width, fontFamily: 'var(--font-ui)' }}>
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          minHeight: 32,
          border: `1px solid ${open ? 'var(--brand-primary)' : '#dcdfe6'}`,
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `0 ${showBatchInput ? '38px' : '10px'} 0 10px`,
          fontSize: 'var(--text-sm)',
          color: (labelText || selectedOpts.length) ? 'var(--text-heading)' : 'var(--text-faint)',
          background: '#fff',
          cursor: 'pointer',
          boxSizing: 'border-box',
          gap: 6,
        }}
      >
        {multiple ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', flexWrap: collapseTags ? 'nowrap' : 'wrap', padding: '4px 0' }}>
            {selectedOpts.length === 0 && <span style={{ color: 'var(--text-faint)' }}>{placeholder}</span>}
            {collapseTags ? (
              <>
                {selectedOpts.slice(0, MAX_TAGS).map((o) => (
                  <span key={o.value} style={{ background: 'var(--color-surface-muted)', color: 'var(--text-body)', borderRadius: 4, padding: '1px 6px', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {o.label}
                  </span>
                ))}
                {selectedOpts.length > MAX_TAGS && (
                  <span style={{ background: 'var(--brand-primary-bg)', color: 'var(--brand-primary)', borderRadius: 4, padding: '1px 6px', fontSize: 12, whiteSpace: 'nowrap' }}>
                    +{selectedOpts.length - MAX_TAGS}
                  </span>
                )}
              </>
            ) : (
              selectedOpts.map((o) => (
                <span key={o.value} style={{ background: 'var(--color-surface-muted)', color: 'var(--text-body)', borderRadius: 4, padding: '1px 6px', fontSize: 12, whiteSpace: 'nowrap' }}>
                  {o.label}
                </span>
              ))
            )}
          </span>
        ) : (
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{labelText || placeholder}</span>
        )}
        <span style={{ fontSize: 10, color: 'var(--text-faint)', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }}>▾</span>
      </div>
      {showBatchInput && (
        <div
          onClick={(e) => { e.stopPropagation(); setBatchOpen((o) => !o); setOpen(false); }}
          title={batchTitle}
          style={{
            position: 'absolute', right: 1, top: 1, bottom: 1, width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--color-surface-sunken)', borderRadius: '0 var(--radius-md) var(--radius-md) 0', cursor: 'pointer', color: 'var(--text-faint)', fontSize: 13,
          }}
        >
          📋
        </div>
      )}
      {batchOpen && (
        <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, background: '#fff', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-card)', zIndex: 11, padding: 10 }}>
          <div style={{ fontSize: 12, color: 'var(--text-heading)', marginBottom: 6 }}>{batchTitle}（每行一个）</div>
          <textarea
            value={batchText}
            onChange={(e) => setBatchText(e.target.value)}
            rows={4}
            style={{ width: '100%', boxSizing: 'border-box', border: '1px solid var(--color-border)', borderRadius: 4, padding: 8, fontFamily: 'var(--font-ui)', fontSize: 12, resize: 'vertical' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <button onClick={() => setBatchOpen(false)} style={{ height: 26, padding: '0 10px', border: '1px solid #dcdfe6', background: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>取消</button>
            <button onClick={applyBatch} style={{ height: 26, padding: '0 10px', border: '1px solid var(--brand-primary)', background: 'var(--brand-primary)', color: '#fff', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>确定</button>
          </div>
        </div>
      )}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid var(--color-border-light)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            zIndex: 10,
            overflow: 'hidden',
          }}
        >
          {filterable && (
            <div style={{ padding: '6px 8px', borderBottom: '1px solid var(--color-border-light)' }}>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="搜索关键词"
                style={{
                  width: '100%', boxSizing: 'border-box', height: 26, border: '1px solid var(--color-border)',
                  borderRadius: 4, padding: '0 8px', fontSize: 12, outline: 'none', fontFamily: 'var(--font-ui)',
                }}
              />
            </div>
          )}
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {multiple && showSelectAll && filtered.length > 1 && (
              <div
                onClick={toggleAll}
                style={{ padding: '8px 12px', fontSize: 'var(--text-sm)', color: 'var(--text-body)', cursor: 'pointer', borderBottom: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', gap: 8 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <input type="checkbox" checked={allChecked} ref={(el) => { if (el) el.indeterminate = someChecked; }} readOnly style={{ accentColor: 'var(--brand-primary)' }} />
                全选
              </div>
            )}
            {filtered.length === 0 && (
              <div style={{ padding: '12px', fontSize: 12, color: 'var(--text-faint)', textAlign: 'center' }}>无匹配数据</div>
            )}
            {filtered.map((opt) => {
              const active = multiple ? (val || []).includes(opt.value) : val === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => selectOpt(opt)}
                  style={{
                    padding: '8px 12px',
                    fontSize: 'var(--text-sm)',
                    color: active ? 'var(--brand-primary)' : 'var(--text-body)',
                    background: active ? 'var(--brand-primary-bg)' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'var(--color-surface-hover)'; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  {multiple && <input type="checkbox" checked={active} readOnly style={{ accentColor: 'var(--brand-primary)' }} />}
                  {opt.label}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
