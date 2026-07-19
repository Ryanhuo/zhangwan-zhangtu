折线图，对应 `components/chartsNew/lineChart.vue`（基于 @antv/g2plot 的
`Line`），用于展示随时间变化的趋势（日活、留存曲线等）。

```jsx
<LineChart
  series={[{ name: '新增用户', data: [{ label: '7/1', value: 120 }, { label: '7/2', value: 156 }] }]}
  valueLabel="新增用户"
  formatValue={(v) => `${v} 人`}
/>
```

视觉规则：浅绿色面积填充 + 折线 + 描边圆点，Y 轴虚线网格自动生成整齐刻度，
悬停数据点会放大并弹出提示框。多系列（`series.length > 1`）时会在图表上方
显示居中图例，各系列颜色取自品牌色系调色板（`series[i].color` 可覆盖）；
单系列时不显示图例，提示框用 `valueLabel` 作为前缀。

用法：所有系列共用同一组 X 轴类目，取 `series[0].data` 的 `label` 作为
X 轴——因此多系列传入时务必保证每个系列的 `data` 长度和顺序一致，否则点位会
错位。

边界情况：`series` 为空或没有任何 label 时显示"暂无数据"占位；单个数据点
（长度为 1）时折线退化为居中的单个点，仍会渲染但没有线段，此时更适合用
StatCard 展示单一数值而不是折线图。
