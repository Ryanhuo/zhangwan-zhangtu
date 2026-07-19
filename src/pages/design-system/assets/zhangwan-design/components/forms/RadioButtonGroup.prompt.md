对应 `el-radio-group` + `el-radio-button` 的分段控件，用于分析工具栏中的
展示模式/统计粒度切换（如"按日/按周/按月"、"数量/占比"）。

```jsx
<RadioButtonGroup
  options={[{ label: '按日', value: 'day' }, { label: '按周', value: 'week' }]}
  value={granularity}
  onChange={setGranularity}
/>
```

用法：受控组件，各选项首尾自动做圆角处理、中间选项直角拼接，视觉上是连续的
一整条分段控件——不要在 `options` 之间额外插入分隔或间距。激活项填充品牌绿
底色 + 白字，其余为描边灰底。

搭配惯例：与图表/DataTable 上方的工具栏并排使用，常见于"切换聚合维度后
下方图表联动刷新"的场景；不用于互斥的多选场景（多选用 Checkbox 组），也
不用于超过 4-5 个选项的场景（选项过多应改用 Select 下拉，分段条会被撑得
很宽）。

边界情况：`options` 为空数组时渲染空容器（无高度），调用方应保证至少传入
2 个选项，单个选项没有意义（等同于静态文字）。
