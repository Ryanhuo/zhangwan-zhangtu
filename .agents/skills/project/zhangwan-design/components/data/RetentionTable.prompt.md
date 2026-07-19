掌玩标志性的留存热力表——左侧是日期，日偏移列（次日/3日/7日…）渲染成绿色热力
渐变。依据 `game/preserveAnalysis` 的 `analysisColorOpacity()` 还原（基准色
`rgb(133,221,131)`，透明度按数值缩放）。

```jsx
<RetentionTable
  metricLabel="次留 (新增ROI)"
  dayLabels={['次日','3日','7日','14日','30日']}
  rows={[
    { label:'2026-07-01', newUsers:12840, cost:38200, values:[62,44,31,22,15] },
    { label:'2026-07-02', newUsers:11020, cost:35100, values:[58,41,28,null,null] },
  ]}
/>
```

绝对值指标（收入/ROI）用 `percent={false}` 加更高的 `maxValue`，而不是留存百分比。
吸顶首列 + 表头，方便宽日期范围横向滚动。
