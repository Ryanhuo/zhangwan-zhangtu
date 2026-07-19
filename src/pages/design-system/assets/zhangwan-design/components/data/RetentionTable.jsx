import React, { useState } from 'react';

// Heat color from game/preserveAnalysis analysisColorOpacity():
// positive base rgb(133,221,131); negative/comparison base rgb(252,145,138).
// opacity scaled by value / maxValue (smooth), or snapped to the nearest
// ladder stop when colorMode is 'ladder'.
const LADDER_STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];

function heatStyle(value, maxValue, colorMode) {
  if (value === null || value === undefined || isNaN(value)) {
    return { background: 'transparent', color: 'var(--text-faint)' };
  }
  const negative = value < 0;
  let o = Math.abs(value) / (maxValue || 100);
  o = o < 0 ? 0 : o > 1 ? 1 : o;
  if (colorMode === 'ladder') {
    let snapped = LADDER_STOPS[0];
    for (const s of LADDER_STOPS) if (o >= s) snapped = s;
    o = snapped;
  }
  const base = negative ? '252,145,138' : '133,221,131';
  return {
    background: `rgba(${base},${o.toFixed(2)})`,
    color: o > 0.6 ? (negative ? '#5c1414' : '#1f3d20') : 'var(--text-body)',
  };
}

function fmt(n) {
  return typeof n === 'number' ? n.toLocaleString('en-US') : n;
}

// Matches components/PreserveAnalysis/Color.vue exactly: a centered el-dialog
// (700px) with a 阶梯着色/平滑着色 radio row, and — only in ladder mode — two
// gradient inputs (ROI梯度 %, 收入梯度 元).
function ColorSettingsDialog({ colorMode, onColorModeChange, roi, onRoiChange, income, onIncomeChange, onCancel, onConfirm }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 700, maxWidth: '92vw', background: '#fff', borderRadius: 'var(--radius-md)', boxShadow: '0 12px 32px rgba(0,0,0,0.18)', overflow: 'hidden' }}
      >
        <div style={{ padding: '16px 20px', fontSize: 16, fontWeight: 600, color: 'var(--text-heading)', borderBottom: '1px solid var(--color-border-light)' }}>
          着色设置
        </div>
        <div style={{ padding: 20, fontSize: 'var(--text-sm)', color: 'var(--text-body)' }}>
          <div style={{ display: 'flex', padding: '0 10px 15px' }}>
            <p style={{ width: 80, height: 32, lineHeight: '32px', margin: 0 }}>着色展示:</p>
            <div style={{ display: 'flex', gap: 24, marginLeft: 10, alignItems: 'center', height: 32 }}>
              {[['ladder', '阶梯着色'], ['smooth', '平滑着色']].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={() => onColorModeChange(key)}>
                  <span
                    style={{
                      width: 14, height: 14, borderRadius: '50%', border: `1px solid ${colorMode === key ? 'var(--brand-primary)' : '#dcdfe6'}`,
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {colorMode === key && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-primary)' }} />}
                  </span>
                  {label}
                </label>
              ))}
            </div>
          </div>
          {colorMode === 'ladder' && (
            <div style={{ display: 'flex', padding: '15px 10px' }}>
              <p style={{ width: 80, height: 32, lineHeight: '32px', margin: 0 }}>梯度设置:</p>
              <div style={{ display: 'flex', marginLeft: 4, gap: 30 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>ROI梯度：</div>
                  <input
                    value={roi}
                    onChange={(e) => onRoiChange(e.target.value)}
                    style={{ width: 100, height: 32, boxSizing: 'border-box', border: '1px solid var(--color-border)', borderRadius: 4, padding: '0 8px', marginLeft: 4, fontFamily: 'var(--font-numeric)' }}
                  />
                  <div>%</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div>收入梯度：</div>
                  <input
                    value={income}
                    onChange={(e) => onIncomeChange(e.target.value)}
                    style={{ width: 100, height: 32, boxSizing: 'border-box', border: '1px solid var(--color-border)', borderRadius: 4, padding: '0 8px', marginLeft: 4, fontFamily: 'var(--font-numeric)' }}
                  />
                  <div>元</div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', gap: 10, borderTop: '1px solid var(--color-border-light)' }}>
          <button onClick={onCancel} style={{ height: 32, padding: '0 16px', border: '1px solid #dcdfe6', background: '#fff', color: 'var(--text-body)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>取 消</button>
          <button onClick={onConfirm} style={{ height: 32, padding: '0 16px', border: '1px solid var(--brand-primary)', background: 'var(--brand-primary)', color: '#fff', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontFamily: 'var(--font-ui)' }}>确 定</button>
        </div>
      </div>
    </div>
  );
}

export function RetentionTable(props) {
  const {
    dayLabels = [],
    rows = [],
    metricLabel = '留存率',
    maxValue: maxValueProp = 100,
    percent = true,
    cumulativeLabel = null,
    allowColorSettings = true,
  } = props;

  const [colorMode, setColorMode] = useState('ladder');
  const [maxValue, setMaxValue] = useState(maxValueProp);
  const [roi, setRoi] = useState(5);
  const [income, setIncome] = useState(1000);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const cellBase = {
    padding: '7px 10px',
    fontSize: 'var(--text-sm)',
    borderBottom: '1px solid var(--color-border-light)',
    borderRight: '1px solid var(--color-border-light)',
    whiteSpace: 'nowrap',
  };
  const headBase = {
    ...cellBase,
    background: 'var(--color-surface-muted)',
    color: 'var(--text-heading)',
    fontWeight: 500,
    textAlign: 'center',
    position: 'sticky',
    top: 0,
  };

  const cumMax = cumulativeLabel ? Math.max(1, ...rows.map((r) => r.cumulative || 0)) : 1;

  return (
    <div style={{ fontFamily: 'var(--font-ui)', position: 'relative' }}>
      {allowColorSettings && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button
            onClick={() => setSettingsOpen(true)}
            style={{
              fontSize: 12, color: 'var(--text-body)', cursor: 'pointer', padding: '5px 12px',
              border: '1px solid #dcdfe6', borderRadius: 'var(--radius-md)', background: '#fff', fontFamily: 'var(--font-ui)',
            }}
          >
            着色设置
          </button>
          {settingsOpen && (
            <ColorSettingsDialog
              colorMode={colorMode}
              onColorModeChange={setColorMode}
              roi={roi}
              onRoiChange={setRoi}
              income={income}
              onIncomeChange={setIncome}
              onCancel={() => setSettingsOpen(false)}
              onConfirm={() => { setMaxValue(colorMode === 'ladder' ? Number(roi) || maxValue : maxValue); setSettingsOpen(false); }}
            />
          )}
        </div>
      )}
      <div style={{ overflowX: 'auto', border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-sm)' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ ...headBase, textAlign: 'left', width: 120, left: 0, zIndex: 2 }}>日期</th>
              <th style={{ ...headBase, width: 90 }}>新增</th>
              <th style={{ ...headBase, width: 100 }}>花费</th>
              {cumulativeLabel && <th style={{ ...headBase, width: 120 }}>{cumulativeLabel}</th>}
              <th style={{ ...headBase, textAlign: 'center' }} colSpan={dayLabels.length}>{metricLabel}</th>
            </tr>
            <tr>
              <th style={{ ...headBase, top: 34, left: 0, zIndex: 2 }}></th>
              <th style={{ ...headBase, top: 34 }}></th>
              <th style={{ ...headBase, top: 34 }}></th>
              {cumulativeLabel && <th style={{ ...headBase, top: 34 }}></th>}
              {dayLabels.map((d) => (
                <th key={d} style={{ ...headBase, top: 34, width: 68 }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                <td style={{ ...cellBase, textAlign: 'left', color: 'var(--text-heading)', position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}>{row.label}</td>
                <td style={{ ...cellBase, textAlign: 'right', fontFamily: 'var(--font-numeric)' }}>{fmt(row.newUsers)}</td>
                <td style={{ ...cellBase, textAlign: 'right', fontFamily: 'var(--font-numeric)' }}>¥{fmt(row.cost)}</td>
                {cumulativeLabel && (
                  <td style={{ ...cellBase, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'var(--color-surface-muted)', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.round(((row.cumulative || 0) / cumMax) * 100)}%`, height: '100%', background: 'var(--brand-primary)' }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-numeric)', fontSize: 12, color: 'var(--text-body)', minWidth: 32, textAlign: 'right' }}>
                        {percent ? `${row.cumulative}%` : fmt(row.cumulative)}
                      </span>
                    </div>
                  </td>
                )}
                {row.values.map((v, j) => {
                  const hs = heatStyle(v, maxValue, colorMode);
                  return (
                    <td key={j} style={{ ...cellBase, textAlign: 'center', fontFamily: 'var(--font-numeric)', ...hs }}>
                      {v === null || v === undefined ? '-' : percent ? v + '%' : fmt(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
