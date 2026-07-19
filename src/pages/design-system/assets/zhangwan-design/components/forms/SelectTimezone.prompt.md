对应真实的 `components/SelectTimezone/index.vue`——一个紧凑、不可清空的时区
下拉（如"北京UTC+8"），用于海外/留存分析页重新锚定日期边界。这是一个独立的小
尺寸控件（150px），因为真实代码中它是固定定位在角落的组件，不参与筛选行的
240px 统一宽度。

```jsx
<SelectTimezone value={tz} onChange={setTz} />
<SelectTimezone value={tz} zones={[{ label: '北京UTC+8', value: '+8' }, { label: '洛杉矶UTC-8', value: '-8' }]} onChange={setTz} />
```

用法：`zones` 默认只有两个选项（北京/纽约），是示例数据，接入真实业务时应
按需替换为项目实际支持的时区列表。不支持自定义输入或清空——选中态永远指向
`zones` 中的某一项，不存在"未选择"的空状态。

搭配惯例：不放进筛选行（FilterBar），而是作为独立的、通常靠近页面右上角或
图表工具栏的小控件出现，视觉上比 Select/Input 窄很多（150px vs 240px），
不要为了对齐筛选行而强行拉宽。

边界情况：`zones` 列表较长时下拉面板不做滚动限制，会无限向下延伸——时区数量
通常不多，暂不需要处理这种情况，但接入超过 8-10 项时应考虑加滚动容器。
