表格单元格的多值展示，对应 `components/popoverTableCell/index.vue`，用于一个
单元格需要显示多个关联对象时（投放渠道、标签、关联账号等）。

```jsx
<PopoverTableCell items={channels} renderLabel={(c) => c.name} />
```

行为：顿号"、"连接前 3 项，超过 3 项时第 3 项后接"..."，悬停时（仅在
`items.length > 3` 时才会响应悬停）弹出完整列表，弹层带滚动区域（最高 200px）。
不足 3 项时不会有任何悬停行为，也不显示"..."。

用法：`renderLabel` 默认取 `item.label`，如果 `items` 是普通字符串数组或
其它结构，必须显式传 `renderLabel`；不要在 `items` 外面再包一层文字省略
（如 text-overflow），这个组件自己控制截断逻辑。

搭配惯例：只用于 DataTable 单元格内，不用于独立的表单展示——独立场景下的多
选值展示用 InputMultTag 或 Tag 列表。
