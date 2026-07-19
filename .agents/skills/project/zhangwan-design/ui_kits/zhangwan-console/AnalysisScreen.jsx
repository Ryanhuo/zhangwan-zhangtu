// Analysis screen — recreated from game/drama preserveAnalysis + dataOverviewChart:
// title -> tabs -> filter -> data-overview KPI cards -> toolbar -> table.
// Retention pages (买量留存/留存分析/回本留存…) render the green heatmap table;
// other pages render the generic content list table.

// Store status as plain data; the Tag is built in the cell renderer at render time.
// (Constructing JSX at module scope triggers createElement before editor deps exist.)
const DEMO_ROWS = [
  { title: '重生之我是首富', channel: '抖音', price: '120', status: 'success', statusLabel: '已上架' },
  { title: '闪婚老公是首富', channel: '快手', price: '90', status: 'success', statusLabel: '已上架' },
  { title: '999次告白', channel: '视频号', price: '150', status: 'danger', statusLabel: '已下架' },
  { title: '闪婚厂长小娇妻', channel: '抖音', price: '120', status: 'success', statusLabel: '已上架' },
  { title: '总裁的替嫁新娘', channel: '快手', price: '90', status: 'success', statusLabel: '已上架' },
];

const ALL_COLUMNS = [
  { label: '内容信息', prop: 'title', width: 260, fixed: 'left' },
  { label: '渠道', prop: 'channel', width: 120 },
  { label: '定价(虚拟币/集)', prop: 'price', align: 'right', width: 140, sortable: true },
  { label: '状态', prop: 'status', align: 'center', render: (row) => <CompassDesignSystem_6dfef5.Tag tone={row.status}>{row.statusLabel}</CompassDesignSystem_6dfef5.Tag> },
];

const SECTION_COPY = {
  game: { nameLabel: '游戏名称', infoLabel: '游戏信息', unit: '游戏' },
  gameOverseas: { nameLabel: '游戏名称', infoLabel: '游戏信息', unit: '游戏' },
  drama: { nameLabel: '短剧名称', infoLabel: '短剧信息', unit: '短剧' },
  dramaOverseas: { nameLabel: '短剧名称', infoLabel: '短剧信息', unit: '短剧' },
  mp: { nameLabel: '书籍名称', infoLabel: '书籍信息', unit: '书籍' },
  quickapp: { nameLabel: '书籍名称', infoLabel: '书籍信息', unit: '书籍' },
  qw: { nameLabel: '账号名称', infoLabel: '账号信息', unit: '账号' },
  novelOverseas: { nameLabel: '书籍名称', infoLabel: '书籍信息', unit: '书籍' },
  userPortrait: { nameLabel: '用户昵称', infoLabel: '用户信息', unit: '用户' },
  companyBi: { nameLabel: '项目名称', infoLabel: '项目信息', unit: '项目' },
  export: { nameLabel: '任务名称', infoLabel: '任务信息', unit: '任务' },
};

// deterministic demo retention rows: retention decays over day offsets
function buildRetentionRows() {
  const days = ['07-01', '07-02', '07-03', '07-04', '07-05', '07-06', '07-07'];
  const base = [63, 58, 66, 54, 61, 57, 64];
  const decay = [1, 0.72, 0.5, 0.36, 0.26, 0.18, 0.12]; // per day-offset
  return days.map((d, i) => {
    const b = base[i];
    return {
      label: '2026-' + d,
      newUsers: 9000 + ((i * 1730) % 6000),
      cost: 28000 + ((i * 2900) % 15000),
      // reveal fewer future columns for the most recent dates (data not matured)
      values: decay.map((k, j) => (j > 6 - i ? null : Math.round(b * k))),
    };
  });
}
const RETENTION_ROWS = buildRetentionRows();
const RETENTION_METRICS = [
  { label: '次留率', value: 'ret' },
  { label: '新增ROI', value: 'addRoi' },
  { label: '累计ROI', value: 'allRoi' },
];

function AnalysisScreen({ moduleId = 'drama', itemName = '买量留存' }) {
  const { FilterBar, FilterField, Select, Input, Button, RadioButtonGroup, DataTable, RetentionTable, StatCard, Tabs, Dialog, Drawer, DatePicker, InputNumberRange, SelectTimezone, ColumnSettingsDialog, ViewSet } = CompassDesignSystem_6dfef5;
  const copy = SECTION_COPY[moduleId] || SECTION_COPY.drama;
  const isRetention = /留存|回本/.test(itemName);

  const columns = React.useMemo(
    () => ALL_COLUMNS.map((c) => (c.prop === 'title' ? { ...c, label: copy.infoLabel } : c)),
    [copy]
  );
  const [granularity, setGranularity] = React.useState('day');
  const [metric, setMetric] = React.useState('ret');
  const [activeKpi, setActiveKpi] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [tab, setTab] = React.useState('overview');
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [columnDialogOpen, setColumnDialogOpen] = React.useState(false);
  const [columnGroups, setColumnGroups] = React.useState(() => [
    { label: '基础信息', children: [{ label: copy.infoLabel, prop: 'title', checked: true }, { label: '渠道', prop: 'channel', checked: true }] },
    { label: '数据表现', children: [{ label: '定价', prop: 'price', checked: true }, { label: '状态', prop: 'status', checked: true }] },
  ]);
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [detailRow, setDetailRow] = React.useState(null);
  const [sortBy, setSortBy] = React.useState(null);
  const [sortOrder, setSortOrder] = React.useState('asc');
  const [dateRange, setDateRange] = React.useState([null, null]);
  const [activeViewId, setActiveViewId] = React.useState('1');
  const [savedViews, setSavedViews] = React.useState(() => [
    { id: '1', label: '默认视图', color: '#f2f3f5', removable: false },
    { id: '2', label: '高价值用户', color: '#fdeed2' },
  ]);

  const shownColumns = columns.filter((c) => columnGroups.some((g) => g.children.some((ch) => ch.prop === c.prop && ch.checked)));
  const metricLabel = RETENTION_METRICS.find((m) => m.value === metric).label;
  const percent = metric === 'ret';
  const maxValue = metric === 'ret' ? 100 : 240;
  // scale demo values for ROI metrics so heat still reads well
  const retRows = React.useMemo(() => {
    if (metric === 'ret') return RETENTION_ROWS;
    return RETENTION_ROWS.map((r) => ({ ...r, values: r.values.map((v) => (v === null ? null : Math.round(v * 2.4))) }));
  }, [metric]);

  const KPIS = [
    { title: '新增用户', value: '128,493', caption: '较昨日 +4.2%' },
    { title: '广告花费', value: '¥ 236,110', caption: '较昨日 +6.1%' },
    { title: '次日留存率', value: '62.4%', caption: '较昨日 -0.8%' },
    { title: '首日ROI', value: '31.5%', caption: '较昨日 +1.2%' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Tabs
        items={[{ label: '数据概览', value: 'overview' }, { label: '留存明细', value: 'retention' }, { label: '付费分析', value: 'payment' }]}
        value={tab}
        onChange={setTab}
      />

      <FilterBar>
        <FilterField label={copy.nameLabel}>
          <Input placeholder="请输入关键词" clearable />
        </FilterField>
        <FilterField label="渠道">
          <Select options={[{ label: '抖音', value: 1 }, { label: '快手', value: 2 }, { label: '视频号', value: 3 }]} multiple placeholder="请选择渠道" />
        </FilterField>
        <FilterField label="定价区间">
          <InputNumberRange />
        </FilterField>
        <FilterField label={isRetention ? '日期' : '上架状态'}>
          {isRetention ? <DatePicker value={dateRange} onChange={setDateRange} /> : <Select options={[{ label: '已上架', value: 1 }, { label: '已下架', value: 2 }]} placeholder="全部" />}
        </FilterField>
        {isRetention && (
          <FilterField label="时区">
            <SelectTimezone />
          </FilterField>
        )}
        <FilterField action>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="primary">搜索</Button>
            <Button variant="default">重置</Button>
          </div>
        </FilterField>
      </FilterBar>

      {ViewSet && (
        // real usage renders viewSetList as the footer row of the filter card itself
        // (BiSearchBlock's `footer` slot) — its own padding is top/sides-only (10px 20px 0),
        // so the wrapper supplies matching bottom padding to balance the card.
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', paddingBottom: 10 }}>
          <ViewSet
            views={savedViews}
            activeId={activeViewId}
            onSelect={setActiveViewId}
            onDelete={(v) => setSavedViews(savedViews.filter((x) => x.id !== v.id))}
          />
        </div>
      )}

      {isRetention && (
        <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 20 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-heading)', marginBottom: 16 }}>数据总览</div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {KPIS.map((k, i) => (
              <div key={k.title} style={{ flex: '1 1 220px' }}>
                <StatCard {...k} active={i === activeKpi} onClick={() => setActiveKpi(i)} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 'var(--radius-sm)', padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <RadioButtonGroup
              options={[{ label: '按天', value: 'day' }, { label: '按周', value: 'week' }, { label: '按月', value: 'month' }]}
              value={granularity}
              onChange={setGranularity}
            />
            {isRetention && (
              <Select options={RETENTION_METRICS} value={metric} onChange={setMetric} />
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="default" onClick={() => setColumnDialogOpen(true)}>自定义列</Button>
            <Button variant="default">导出</Button>
            {!isRetention && (
              <Button variant="danger" disabled={selectedRows.length === 0} onClick={() => setConfirmOpen(true)}>
                批量删除{selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
              </Button>
            )}
          </div>
        </div>

        {isRetention && RetentionTable ? (
          <RetentionTable
            metricLabel={metricLabel}
            dayLabels={['次日', '3日', '7日', '14日', '30日', '60日', '90日']}
            rows={retRows}
            percent={percent}
            maxValue={maxValue}
            cumulativeLabel={percent ? '累计至今' : null}
          />
        ) : (
          <DataTable
            columns={shownColumns}
            rows={DEMO_ROWS}
            page={page}
            pageSize={20}
            total={86}
            onPageChange={setPage}
            selectable
            selectedKeys={selectedRows}
            onSelectChange={setSelectedRows}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(p, o) => { setSortBy(p); setSortOrder(o); }}
            onRowClick={(row) => setDetailRow(row)}
          />
        )}
      </div>

      <Dialog open={confirmOpen} title="确认提示" width={360} onCancel={() => setConfirmOpen(false)} onConfirm={() => setConfirmOpen(false)}>
        确定要删除选中的{copy.unit}么？
      </Dialog>

      <ColumnSettingsDialog
        open={columnDialogOpen}
        groups={columnGroups}
        onChange={setColumnGroups}
        onClose={() => setColumnDialogOpen(false)}
      />

      <Drawer open={!!detailRow} title={copy.infoLabel + '详情'} width={380} onCancel={() => setDetailRow(null)} onConfirm={() => setDetailRow(null)}>
        {detailRow && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 6 }}>{copy.nameLabel}</div>
              <Input value={detailRow.title} onChange={() => {}} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 6 }}>渠道</div>
              <Input value={detailRow.channel} onChange={() => {}} />
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--text-faint)', marginBottom: 6 }}>定价（虚拟币/集）</div>
              <Input value={detailRow.price} onChange={() => {}} />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}

window.AnalysisScreen = AnalysisScreen;
