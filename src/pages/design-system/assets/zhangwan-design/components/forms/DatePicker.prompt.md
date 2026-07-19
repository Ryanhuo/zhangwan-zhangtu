BiDatePicker 还原——文本触发器 + 面板，展示日期区间和快捷时间段
（今天/昨天/近7天/近30天…），是掌玩分析页里主要的日期筛选控件。

```jsx
<DatePicker value={range} onChange={setRange} />
<DatePicker value={range} presets={[{ label: '本周', range: () => [startOfWeek(), new Date()] }]} onChange={setRange} />
```

外观与筛选行一致性：触发器外观（32px 高、边框、圆角）与 Select/Input 完全
一致，默认宽度 240px，与其它筛选控件共用同一套尺寸规范，保证筛选行视觉统一
——不要单独调整 DatePicker 的高度或宽度。

用法：`presets` 覆盖默认的四个快捷选项，每项通过 `range()` 函数即时计算出
`[start, end]`；点击某个快捷项会立即应用并收起面板，不需要额外确认按钮。
日历网格本身做了简化（没有可视化的月历选择格），面板里只展示当前选中的
起止日期文字——精确到"某一天"级别的手动选择依赖接入真实的 bi-element-ui
日历组件，本还原版本只覆盖快捷区间这一最常见的使用路径。

搭配惯例：几乎总是出现在 FilterBar 内，与 Select/Input/InputNumberRange
并排、共用 240px 宽度；不单独作为角落控件使用（角落的时间/时区类控件用
SelectTimezone）。

边界情况：`value` 为 `[null, null]` 时显示 `placeholder`；只传 `start` 不传
`end`（或反之）不是受支持的中间态，业务层应等两端都选定后再触发 `onChange`。
