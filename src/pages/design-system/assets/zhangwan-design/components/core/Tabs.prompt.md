下划线 tab 栏，对应分析页面中反复出现的 `.tabs-box-resetSty` 模式（公告板、
短剧详情、小说详情），用于在同一区块内切换不同的数据维度或视图。

```jsx
<Tabs
  items={[{ label: '概览', value: 'overview' }, { label: '明细', value: 'detail' }]}
  value={tab}
  onChange={setTab}
/>
```

用法：受控组件，`value` 必须匹配某个 item 的 `value` 才会高亮；不提供匹配项时
不会有任何 tab 处于激活态（不会自动选中第一个）。每个 tab 固定 50px 高、左右
各 20px 内边距，激活态加粗并显示 2px 品牌绿下划线——不要在 `label` 里嵌入图标
或计数徽标，这不是标准用法。

搭配惯例：用于切换页面内的图表/表格视图，不用于顶层页面导航（顶层导航用
SidebarNav，二级路由用 Breadcrumb）。Tabs 下方紧跟对应的内容区，两者之间通常
不加额外的分隔线或间距。

边界情况：`items` 过多（超过 5-6 个）会横向撑开导致换行，此模式不支持横向
滚动，需要更多分类时应改用 Select 或分组 Tabs。
