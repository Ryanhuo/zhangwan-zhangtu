import React, { useState } from 'react';

const statusTone = {
  0: { label: '未开始', bg: 'var(--color-surface-muted)', color: 'var(--text-body)' },
  11: { label: '执行中', bg: '#ffeacb', color: '#e6a23c' },
  21: { label: '已完成', bg: 'var(--state-success-bg)', color: 'var(--state-success-text)' },
  31: { label: '导出失败', bg: 'var(--state-danger-bg)', color: 'var(--state-danger-text)' },
};

function StatusPill({ status }) {
  const t = statusTone[status] || statusTone[0];
  return (
    <span style={{ display: 'inline-block', background: t.bg, color: t.color, borderRadius: 'var(--radius-pill)', padding: '0 10px', fontSize: 12, lineHeight: '20px' }}>
      {t.label}
    </span>
  );
}

/**
 * DownloadCenter recreation — the "下载中心" export-task panel: a filter
 * form (task ID / type / status / time range) over a task table (status
 * pill, export-condition summary, created/completed time, download link),
 * with its own pagination footer. The standard shell for any export-queue
 * feature across the product's analysis pages.
 */
export function DownloadCenter(props) {
  const {
    tasks = [],
    typeOptions = [],
    statusOptions = [],
    filters = {},
    onFiltersChange,
    onSearch,
    onReset,
    page = 1,
    pageSize = 20,
    total = 0,
    onPageChange,
  } = props;
  const [local, setLocal] = useState(filters);
  const f = onFiltersChange ? filters : local;
  const setF = (patch) => {
    const next = { ...f, ...patch };
    onFiltersChange ? onFiltersChange(next) : setLocal(next);
  };
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ fontFamily: 'var(--font-ui)', background: 'var(--surface-canvas)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ background: '#fff', padding: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '12px 20px' }}>
          <Field label="任务ID">
            <input
              value={f.taskCode || ''}
              onChange={(e) => setF({ taskCode: e.target.value })}
              style={fieldInputStyle}
            />
          </Field>
          <Field label="任务类型">
            <select value={f.taskType || ''} onChange={(e) => setF({ taskType: e.target.value })} style={fieldInputStyle}>
              <option value="">全部</option>
              {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="任务状态">
            <select value={f.status || ''} onChange={(e) => setF({ status: e.target.value })} style={fieldInputStyle}>
              <option value="">全部</option>
              {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onSearch} style={primaryBtnStyle}>搜索</button>
            <button onClick={onReset} style={defaultBtnStyle}>重置</button>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: 20 }}>
        <div style={{ border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-sm)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 'var(--text-sm)' }}>
            <thead>
              <tr>
                {['任务ID', '任务状态', '任务类型', '导出条件', '创建时间', '完成时间', '操作'].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tasks.length === 0 && (
                <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-faint)', padding: '32px 10px' }}>暂无数据</td></tr>
              )}
              {tasks.map((t, i) => (
                <tr key={t.taskCode || i}>
                  <td style={tdStyle}>{t.taskCode}</td>
                  <td style={tdStyle}><StatusPill status={t.status} /></td>
                  <td style={tdStyle}>{t.taskName}</td>
                  <td style={{ ...tdStyle, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.queryText}>
                    {t.queryText || '——'}
                  </td>
                  <td style={tdStyle}>{t.createTime}</td>
                  <td style={tdStyle}>{t.completeTime || '——'}</td>
                  <td style={tdStyle}>
                    {t.status === 21
                      ? <a href={t.path} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-primary)' }}>下载</a>
                      : <span style={{ color: 'var(--text-faint)' }}>下载</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {total > 0 && (
          <div style={{ textAlign: 'center', marginTop: 20, display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center' }}>
            <span onClick={() => page > 1 && onPageChange && onPageChange(page - 1)} style={pagerArrowStyle}>‹</span>
            {Array.from({ length: pageCount }).slice(0, 5).map((_, i) => {
              const p = i + 1;
              const active = p === page;
              return (
                <span
                  key={p}
                  onClick={() => onPageChange && onPageChange(p)}
                  style={{ cursor: 'pointer', minWidth: 24, height: 24, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)', background: active ? 'var(--brand-primary)' : 'transparent', color: active ? '#fff' : 'var(--text-body)' }}
                >
                  {p}
                </span>
              );
            })}
            <span onClick={() => page < pageCount && onPageChange && onPageChange(page + 1)} style={pagerArrowStyle}>›</span>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>{label}</label>
      {children}
    </div>
  );
}

const fieldInputStyle = {
  height: 32,
  width: 180,
  border: '1px solid #dcdfe6',
  borderRadius: 'var(--radius-md)',
  padding: '0 10px',
  fontSize: 'var(--text-sm)',
  fontFamily: 'var(--font-ui)',
  color: 'var(--text-heading)',
  background: '#fff',
  boxSizing: 'border-box',
};

const primaryBtnStyle = {
  height: 32, padding: '0 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--brand-primary)',
  background: 'var(--brand-primary)', color: '#fff', fontSize: 14, fontFamily: 'var(--font-ui)', cursor: 'pointer',
};
const defaultBtnStyle = {
  height: 32, padding: '0 16px', borderRadius: 'var(--radius-md)', border: '1px solid #dcdfe6',
  background: '#fff', color: 'var(--text-body)', fontSize: 14, fontFamily: 'var(--font-ui)', cursor: 'pointer',
};
const thStyle = {
  padding: '7px 10px', fontWeight: 500, color: 'var(--text-heading)', borderBottom: '1px solid var(--color-border-light)',
  whiteSpace: 'nowrap', background: 'var(--color-surface-muted)', textAlign: 'left',
};
const tdStyle = {
  padding: '7px 10px', color: 'var(--text-body)', borderBottom: '1px solid var(--color-border-light)',
};
const pagerArrowStyle = { cursor: 'pointer', color: 'var(--text-faint)', padding: '2px 8px' };
