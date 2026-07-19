// Dashboard home — recreated from compass/src/views/dashboard/index.vue
// Time-of-day greeting + a row of KPI stat cards (dataOverviewChart pattern).
function greeting() {
  const h = new Date().getHours();
  if (h >= 22 || h < 0) return '深夜好';
  if (h >= 18) return '晚上好';
  if (h >= 13) return '下午好';
  if (h >= 12) return '中午好';
  if (h >= 10) return '上午好';
  if (h >= 5) return '早上好';
  return '凌晨好';
}

const KPI_DATA = [
  { title: '新增用户', value: '128,493', caption: '较昨日 +4.2%' },
  { title: '次日留存率', value: '86.4%', caption: '较昨日 -0.8%' },
  { title: '当日充值', value: '¥ 392,110', caption: '较昨日 +12.1%' },
  { title: 'ARPU', value: '18.6', caption: '较昨日 +0.3' },
];

function DashboardScreen({ moduleId }) {
  const [activeIdx, setActiveIdx] = React.useState(0);

  return (
    <div>
      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 20, marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 'var(--text-xl)', color: 'var(--text-heading)', fontWeight: 500 }}>
          {greeting()}，管理员
        </h2>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: 'var(--text-faint)' }}>加油！干饭人 · 这是今天的关键指标</p>
      </div>

      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 20 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {KPI_DATA.map((kpi, i) => (
            <div key={kpi.title} onClick={() => setActiveIdx(i)} style={{ flex: '1 1 240px' }}>
              <CompassDesignSystem_6dfef5.StatCard {...kpi} active={i === activeIdx} onClick={() => setActiveIdx(i)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
