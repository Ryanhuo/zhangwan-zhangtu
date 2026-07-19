KPI 统计卡，对应 dataOverviewChart 中的 "small-card" 模式，用于展示头条指标
（新增用户、留存率、总收入等），可选内嵌一个迷你图。

```jsx
<StatCard title="新增用户" value="12,480" caption="较昨日 +6.2%" active onClick={() => setMetric('new')} />
<StatCard title="留存率" value="38.2%" aside={<ColumnChart data={miniData} height={98} />} />
```

用法：`value` 用 `--font-numeric` 等宽数字字体渲染，适合放格式化后的数字/
百分比字符串（调用方负责千分位、单位等格式化，组件不做数值处理）。`caption`
是数值下方的一行小字说明（涨跌幅、时间范围等），留空则不渲染这行，不会留白。

交互模式：`active` + `onClick` 搭配用于"卡片驱动图表"场景——一组 StatCard
横排展示不同指标，点击某张卡片切换下方联动图表展示的维度，被点击的卡片显示
绿色描边环。若只是展示型 KPI（不可点击），不要传 `onClick`，也不要传
`active`，避免出现无意义的 cursor:pointer。

`aside` 用于嵌入一个高约 98px、宽卡片一半的迷你图（通常是简化过的
ColumnChart/LineChart，不传图例和坐标轴文字）。

搭配惯例：多张 StatCard 横排时用 flex/grid + gap，不要用 margin；一行放
3-4 张为宜，卡片固定宽度 280px，超宽容器会留白而不是拉伸卡片。
