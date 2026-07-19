import React from 'react';

/**
 * BiTable-style data table.
 * Adds: optional row-selection checkbox column (sticky-left), optional
 * grouped/multi-level header row, sortable column headers, and a
 * sticky/fixed first data column for wide tables with horizontal scroll.
 */
export function DataTable(props) {
  const {
    columns = [],
    rows = [],
    page = 1,
    pageSize = 20,
    total = 0,
    onPageChange,
    selectable = false,
    selectedKeys = [],
    rowKey = '__index',
    onSelectChange,
    groups = null,
    sortBy = null,
    sortOrder = 'asc',
    onSortChange,
    onRowClick,
  } = props;

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const getKey = (row, i) => (rowKey === '__index' ? i : row[rowKey]);
  const allKeys = rows.map((r, i) => getKey(r, i));
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeys.includes(k));
  const someSelected = allKeys.some((k) => selectedKeys.includes(k)) && !allSelected;

  const toggleAll = () => {
    if (!onSelectChange) return;
    onSelectChange(allSelected ? [] : allKeys);
  };
  const toggleRow = (k) => {
    if (!onSelectChange) return;
    onSelectChange(
      selectedKeys.includes(k) ? selectedKeys.filter((x) => x !== k) : [...selectedKeys, k]
    );
  };

  const stickyLeftOf = (idx) => {
    // width of checkbox col + any fixed columns before idx
    let left = selectable ? 42 : 0;
    for (let i = 0; i < idx; i++) {
      if (columns[i].fixed === 'left') left += Number(columns[i].width) || 120;
    }
    return left;
  };

  const thBase = {
    padding: '7px 10px',
    fontWeight: 500,
    color: 'var(--text-heading)',
    borderBottom: '1px solid var(--color-border-light)',
    whiteSpace: 'nowrap',
    background: 'var(--color-surface-muted)',
  };

  const handleSort = (col) => {
    if (!col.sortable || !onSortChange) return;
    if (sortBy !== col.prop) onSortChange(col.prop, 'asc');
    else onSortChange(col.prop, sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)' }}>
      <div
        style={{
          border: '1px solid var(--color-border-light)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'auto',
          maxWidth: '100%',
        }}
      >
        <table style={{ width: '100%', minWidth: 'max-content', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            {groups && (
              <tr>
                {selectable && <th style={{ ...thBase, position: 'sticky', left: 0, zIndex: 3 }} />}
                {groups.map((g, gi) => (
                  <th
                    key={gi}
                    colSpan={g.span}
                    style={{
                      ...thBase,
                      textAlign: 'center',
                      color: 'var(--text-faint)',
                      fontWeight: 400,
                      fontSize: 'var(--text-xs, 12px)',
                      borderBottom: '1px solid var(--color-border-light)',
                    }}
                  >
                    {g.label}
                  </th>
                ))}
              </tr>
            )}
            <tr>
              {selectable && (
                <th
                  style={{
                    ...thBase,
                    width: 42,
                    textAlign: 'center',
                    position: 'sticky',
                    left: 0,
                    zIndex: 3,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={toggleAll}
                    style={{ accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
                  />
                </th>
              )}
              {columns.map((col, idx) => (
                <th
                  key={col.prop}
                  onClick={() => handleSort(col)}
                  style={{
                    ...thBase,
                    textAlign: col.align || 'left',
                    width: col.width,
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    ...(col.fixed === 'left'
                      ? { position: 'sticky', left: stickyLeftOf(idx), zIndex: 2, boxShadow: '1px 0 0 var(--color-border-light)' }
                      : {}),
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {col.label}
                    {col.sortable && (
                      <span style={{ display: 'inline-flex', flexDirection: 'column', lineHeight: '6px', fontSize: 8 }}>
                        <span style={{ color: sortBy === col.prop && sortOrder === 'asc' ? 'var(--brand-primary)' : 'var(--color-border-scrollbar-thumb)' }}>▲</span>
                        <span style={{ color: sortBy === col.prop && sortOrder === 'desc' ? 'var(--brand-primary)' : 'var(--color-border-scrollbar-thumb)' }}>▼</span>
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const k = getKey(row, i);
              const checked = selectedKeys.includes(k);
              return (
                <tr
                  key={i}
                  onClick={() => onRowClick && onRowClick(row, i)}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f5f7fa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = checked ? 'var(--brand-primary-bg)' : 'transparent'; }}
                  style={{ transition: 'background 0.15s', background: checked ? 'var(--brand-primary-bg)' : 'transparent', cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {selectable && (
                    <td
                      style={{
                        padding: '7px 10px',
                        textAlign: 'center',
                        borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--color-border-light)',
                        position: 'sticky',
                        left: 0,
                        zIndex: 1,
                        background: checked ? 'var(--brand-primary-bg)' : 'var(--color-surface)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRow(k)}
                        style={{ accentColor: 'var(--brand-primary)', cursor: 'pointer' }}
                      />
                    </td>
                  )}
                  {columns.map((col, idx) => (
                    <td
                      key={col.prop}
                      style={{
                        textAlign: col.align || 'left',
                        padding: '7px 10px',
                        color: 'var(--text-body)',
                        borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--color-border-light)',
                        ...(col.fixed === 'left'
                          ? {
                              position: 'sticky',
                              left: stickyLeftOf(idx),
                              zIndex: 1,
                              background: checked ? 'var(--brand-primary-bg)' : 'var(--color-surface)',
                              boxShadow: '1px 0 0 var(--color-border-light)',
                            }
                          : {}),
                      }}
                    >
                      {col.render ? col.render(row) : row[col.prop]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center' }}>
          <span
            onClick={() => page > 1 && onPageChange && onPageChange(page - 1)}
            style={{ cursor: 'pointer', color: 'var(--text-faint)', padding: '2px 8px' }}
          >
            ‹
          </span>
          {Array.from({ length: pageCount }).slice(0, 5).map((_, i) => {
            const p = i + 1;
            const active = p === page;
            return (
              <span
                key={p}
                onClick={() => onPageChange && onPageChange(p)}
                style={{
                  cursor: 'pointer',
                  minWidth: 24,
                  height: 24,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  background: active ? 'var(--brand-primary)' : 'transparent',
                  color: active ? '#fff' : 'var(--text-body)',
                }}
              >
                {p}
              </span>
            );
          })}
          <span
            onClick={() => page < pageCount && onPageChange && onPageChange(page + 1)}
            style={{ cursor: 'pointer', color: 'var(--text-faint)', padding: '2px 8px' }}
          >
            ›
          </span>
        </div>
      )}
    </div>
  );
}
