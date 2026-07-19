柱状图，对应 `components/chartsNew/columnChart.vue`（基于 @antv/g2plot 的
`Column`），用于展示按类目分组的数量对比（渠道分布、时段分布等）。

```jsx
<ColumnChart
  data={[{ label: '周一', value: 120 }, { label: '周二', value: 86 }]}
  color="#00bf8a"
  formatValue={(v) => `${v} 人`}
/>
```

视觉规则：品牌绿填充、圆角柱顶，Y 轴虚线网格自动按数值生成"整齐刻度"
（niceTicks，不是简单等分），X 轴显示 `label`。悬停某根柱子会略微提高不透明度
并弹出深色提示框（`label: formatValue(value)`）。

用法：`data` 为空数组时显示居中的"暂无数据"占位，不会渲染空坐标轴——调用方
不需要自己判断空态。`width`/`height` 决定内部 viewBox 比例，图表本身通过 SVG
`width="100%"` 自适应容器宽度，因此外层容器的实际宽度由父级布局决定，`width`
prop 只影响长宽比例，不是像素级约束。

边界情况：类目过多（超过 15-20 个）柱子会变得很窄，建议改用横向滚动容器或
切换到更聚合的维度；柱状图不支持负值（Y 轴从 0 起算）。
