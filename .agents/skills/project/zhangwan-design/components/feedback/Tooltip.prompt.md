深色气泡提示，对应 `el-tooltip` 的 `effect="dark"` 样式，以及项目自有的
`TextTooltip` 用法（仅当文字被截断时才显示）。

```jsx
<Tooltip content="完整名称：某某短剧第二季特别篇">
  <span>某某短剧第二季特...</span>
</Tooltip>
<Tooltip content="完整标题文字" onlyOnOverflow>
  <div style={{ width: 120 }}>一段可能很长的标题文字</div>
</Tooltip>
```

两种模式：默认模式下悬停 `children` 即显示提示，适合图标按钮、简写字段等
"永远需要补充说明"的场景。`onlyOnOverflow` 模式下组件会自动给 `children`
套上单行省略样式（`text-overflow: ellipsis`），并在渲染后测量是否真的发生
截断——只有实际被截断时悬停才会弹出提示，未截断时悬停无任何反应，调用方
不需要自己判断是否溢出。

用法：`placement` 只支持 `top` / `bottom`，没有左右方向——横向空间不够时
应调整触发元素位置而不是依赖 Tooltip 自适应方向。`disabled` 用于临时关闭
提示（不改变 DOM 结构），适合"某些状态下不需要提示"的场景。

搭配惯例：`onlyOnOverflow` 模式最常与 DataTable 里的窄列文字、Breadcrumb
层级名称等定宽容器搭配；默认模式常用于图标按钮补充文字说明。
