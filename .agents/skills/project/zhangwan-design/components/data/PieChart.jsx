import React, { useState } from 'react';

const FONT = 'Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif';
// exact categorical palette from chartsNew/pieChart.vue's `.color(...)` call
const PALETTE = ['#3491FA', '#3BCC96', '#F88A02', '#3EC6FF', '#7442D4', '#FAC300', '#304D77', '#B48DEB', '#299488', '#F97DDA', '#025DF4', '#EA5BDB', '#09A4F0', '#BBBDE6', '#4045B2', '#21A97A', '#FF745A', '#007E99', '#FFA8A8', '#2391FF', '#946DFF', '#626681', '#EB4185'];

function polar(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function donutSlicePath(cx, cy, outerR, innerR, startAngle, endAngle) {
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  const [x1, y1] = polar(cx, cy, outerR, startAngle);
  const [x2, y2] = polar(cx, cy, outerR, endAngle);
  const [x3, y3] = polar(cx, cy, innerR, endAngle);
  const [x4, y4] = polar(cx, cy, innerR, startAngle);
  return [
    `M${x1},${y1}`,
    `A${outerR},${outerR} 0 ${largeArc} 1 ${x2},${y2}`,
    `L${x3},${y3}`,
    `A${innerR},${innerR} 0 ${largeArc} 0 ${x4},${y4}`,
    'Z',
  ].join(' ');
}

/**
 * chartsNew/pieChart.vue 的还原 — 环形图（theta 坐标系，innerRadius 0.6 /
 * radius 0.75），右侧图例，悬停显示 名称/数值/占比。无数据时显示"暂无数据"。
 */
export function PieChart(props) {
  const {
    data = [],
    height = 280,
    showLabelText = false,
    formatValue = (v) => String(v),
  } = props;

  const [hover, setHover] = useState(null);

  const total = data.reduce((sum, d) => sum + (Number(d.value) || 0), 0);

  if (!data.length || total <= 0) {
    return (
      <div style={{ height, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
        <span style={{ color: 'var(--text-faint)', fontSize: 16, fontWeight: 400 }}>暂无数据</span>
      </div>
    );
  }

  const size = height;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.375;
  const innerR = outerR * 0.6 / 0.75;

  let angle = 0;
  const slices = data.map((d, i) => {
    const value = Number(d.value) || 0;
    const pct = (value / total) * 100;
    const start = angle;
    const end = angle + (value / total) * 360;
    angle = end;
    return { ...d, value, pct, start, end, color: d.color || PALETTE[i % PALETTE.length] };
  });

  return (
    <div style={{ width: '100%', fontFamily: FONT, display: 'flex', alignItems: 'center', gap: 16, position: 'relative' }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ flexShrink: 0, overflow: 'visible' }}>
        {slices.map((s, i) => (
          <path
            key={i}
            d={donutSlicePath(cx, cy, outerR, innerR, s.start, s.end)}
            fill={s.color}
            stroke="#fff"
            strokeWidth="1"
            opacity={hover === null || hover === i ? 1 : 0.35}
            style={{ cursor: 'pointer', transition: 'opacity 0.15s' }}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-muted)', maxWidth: 160 }}>
        {slices.map((s, i) => (
          <span
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, opacity: hover === null || hover === i ? 1 : 0.45, cursor: 'default' }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
            <span style={{ marginLeft: 'auto', color: 'var(--text-faint)' }}>{s.pct.toFixed(0)}%</span>
          </span>
        ))}
      </div>
      {hover !== null && (
        <div
          style={{
            position: 'absolute',
            left: cx,
            top: 0,
            transform: 'translate(-50%, -110%)',
            background: 'rgba(0,0,0,0.75)',
            color: '#fff',
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {slices[hover].label}: {formatValue(slices[hover].value)}（{slices[hover].pct.toFixed(0)}%）
        </div>
      )}
    </div>
  );
}
