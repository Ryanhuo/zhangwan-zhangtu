面包屑导航，对应 `components/Breadcrumb/index.vue`，用于展示当前页面在层级
结构中的位置，放在页面内容区最顶部。

```jsx
<Breadcrumb
  items={[{ label: '数据分析' }, { label: '短剧详情' }, { label: '《XX传》' }]}
  onNavigate={(item, index) => router.push(item)}
/>
```

行为：斜杠"/"分隔各级，最后一级永远渲染为纯文本（`cursor: text`，不可点击、
不触发 `onNavigate`），代表当前所在页面；其余各级可点击、悬停变品牌绿色。

用法：`items` 至少应有 1 项（当前页面本身）；只有 1 项时不会显示任何斜杠，
退化为纯文本标题——这种情况下更适合直接用 SectionTitle，Breadcrumb 的价值
在于展示层级关系。`onNavigate` 收到被点击的 item 和其索引，具体跳转逻辑（
路由、tab 切换等）由调用方决定。

搭配惯例：常与 UpdateTime 同一行，Breadcrumb 靠左、UpdateTime 靠右对齐；下方
紧跟页面主体内容，不需要额外分隔线。

边界情况：单个 label 过长时不做省略处理，会撑开面包屑高度换行，建议层级
名称保持简短（如实体名称过长，改为点击后在详情区展示全称）。
