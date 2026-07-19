import React, { useState, useMemo } from 'react';

const FONT = 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';

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
 * chartsNew/columnChart.vue 的还原 — 柱状图，品牌绿填充、圆角柱顶，
 * 悬停高亮当前柱并显示数值提示。无数据时显示"暂无数据"。
 */
export function ColumnChart(props) {
  const {
    data = [],
    height = 280,
    width = 600,
    color = '#00bf8a',
    formatValue = (v) => String(v),
  } = props;

  const [hover, setHover] = useState(null);
  const padding = { top: 24, right: 20, bottom: 32, left: 44 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const values = data.map((d) => Number(d.value) || 0);
  const maxVal = Math.max(1, ...values, 0);
  const ticks = useMemo(() => niceTicks(maxVal), [maxVal]);
  const tickMax = ticks[ticks.length - 1] || 1;

  if (!data.length) {
    return (
      <div style={{ height, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
        <span style={{ color: 'var(--text-faint)', fontSize: 16, fontWeight: 400 }}>暂无数据</span>
      </div>
    );
  }

  const bandWidth = innerW / data.length;
  const barWidth = Math.min(40, bandWidth * 0.5);
  const yFor = (v) => padding.top + innerH - (innerH * v) / tickMax;

  return (
    <div style={{ width: '100%', fontFamily: FONT, position: 'relative' }}>
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
        {data.map((d, i) => {
          const cx = padding.left + bandWidth * i + bandWidth / 2;
          const v = Number(d.value) || 0;
          const y = yFor(v);
          const h = padding.top + innerH - y;
          const active = hover === i;
          return (
            <g key={i}>
              <rect
                x={cx - barWidth / 2}
                y={y}
                width={barWidth}
                height={Math.max(h, 0)}
                rx={2}
                fill={active ? color : color}
                fillOpacity={active ? 1 : 0.85}
                style={{ cursor: 'pointer', transition: 'fill-opacity 0.15s' }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              <text x={cx} y={height - 8} textAnchor="middle" fontSize="11" fill="#4E5969">{d.label}</text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${((padding.left + bandWidth * hover + bandWidth / 2) / width) * 100}%`,
            top: `${(yFor(Number(data[hover].value) || 0) / height) * 100}%`,
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
          {data[hover].label}: {formatValue(data[hover].value)}
        </div>
      )}
    </div>
  );
}
