import React, { useState, useMemo } from 'react';

const FONT = 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';
const PALETTE = ['#3bc2ac', '#3491FA', '#F88A02', '#7442D4', '#F97DDA'];

function niceTicks(max) {
  if (max <= 0) return [0, 1];
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / step;
  const niceStep = (norm <= 2 ? 0.5 : norm <= 5 ? 1 : 2) * step;
  const ticks = [];
  for (let v = 0; v <= max + niceStep * 0.5; v += niceStep) ticks.push(Math.round(v * 100) / 100);
  return ticks;
}

/**
 * chartsNew/lineChart.vue 的还原 — 单/多系列折线图，浅绿色面积填充，
 * 悬停显示数值点提示。无数据时显示"暂无数据"。
 */
export function LineChart(props) {
  const {
    series = [],
    height = 280,
    width = 600,
    valueLabel = '',
    formatValue = (v) => String(v),
  } = props;

  const [hover, setHover] = useState(null); // { si, pi }

  const padding = { top: 24, right: 24, bottom: 32, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const labels = series[0]?.data?.map((d) => d.label) || [];
  const allValues = series.flatMap((s) => s.data.map((d) => Number(d.value) || 0));
  const maxVal = Math.max(1, ...allValues, 0);
  const ticks = useMemo(() => niceTicks(maxVal), [maxVal]);
  const tickMax = ticks[ticks.length - 1] || 1;

  const xFor = (i) => (labels.length <= 1 ? padding.left + innerW / 2 : padding.left + (innerW * i) / (labels.length - 1));
  const yFor = (v) => padding.top + innerH - (innerH * v) / tickMax;

  const hasData = labels.length > 0 && allValues.some((v) => v !== 0) || allValues.length > 0;

  if (!labels.length) {
    return (
      <div style={{ height, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
        <span style={{ color: 'var(--text-faint)', fontSize: 16, fontWeight: 400 }}>暂无数据</span>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', fontFamily: FONT, position: 'relative' }}>
      {series.length > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 4 }}>
          {series.map((s, si) => (
            <span key={si} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
              <span style={{ width: 10, height: 2, background: s.color || PALETTE[si % PALETTE.length], display: 'inline-block' }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" style={{ display: 'block', overflow: 'visible' }}>
        {ticks.map((t, i) => {
          const y = yFor(t);
          return (
            <g key={i}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#E5E6EB" strokeWidth="1" strokeDasharray="5,2" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#4E5969">{t}</text>
            </g>
          );
        })}
        {labels.map((l, i) => (
          <text key={i} x={xFor(i)} y={height - 8} textAnchor="middle" fontSize="11" fill="#4E5969">{l}</text>
        ))}
        {series.map((s, si) => {
          const color = s.color || PALETTE[si % PALETTE.length];
          const pts = s.data.map((d, i) => [xFor(i), yFor(Number(d.value) || 0)]);
          const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
          const areaPath = `${linePath} L${pts[pts.length - 1][0]},${padding.top + innerH} L${pts[0][0]},${padding.top + innerH} Z`;
          return (
            <g key={si}>
              <path d={areaPath} fill={color} fillOpacity="0.1" stroke="none" />
              <path d={linePath} fill="none" stroke={color} strokeWidth="2" />
              {pts.map((p, i) => (
                <circle
                  key={i}
                  cx={p[0]}
                  cy={p[1]}
                  r={hover && hover.si === si && hover.pi === i ? 5 : 3}
                  fill="#fff"
                  stroke={color}
                  strokeWidth="2"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHover({ si, pi: i })}
                  onMouseLeave={() => setHover(null)}
                />
              ))}
            </g>
          );
        })}
      </svg>
      {hover && (
        <div
          style={{
            position: 'absolute',
            left: `${(xFor(hover.pi) / width) * 100}%`,
            top: `${(yFor(Number(series[hover.si].data[hover.pi].value) || 0) / height) * 100}%`,
            transform: 'translate(-50%, -130%)',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {series[hover.si].name || valueLabel}: {formatValue(series[hover.si].data[hover.pi].value)}
        </div>
      )}
    </div>
  );
}
