分区小标题，对应 `lineLightTitle` 组件——4px 品牌绿竖线 + 标题文字，用于
分析页/详情页内部的分区标题（不是页面级标题，页面级标题用 Breadcrumb）。

```jsx
<SectionTitle>基础信息</SectionTitle>
<SectionTitle fontSize={14}>关联数据</SectionTitle>
```

用法：`children` 应为简短的分区名词（2-6 个字），不承载副标题或说明文字；
竖线高度按 `fontSize` 等比例缩放（`1em`），因此调整字号不需要额外处理竖线
尺寸。默认不带右侧操作区——如果分区需要"更多"链接或筛选控件，把它们作为
兄弟节点放在同一行，用 flex + justify-content: space-between 布局，不要塞进
SectionTitle 内部。

搭配惯例：SectionTitle 后紧跟该分区的内容（Panel、DataTable、图表等），两者
间距建议 12-16px；一个页面内多个 SectionTitle 应使用同样的 `fontSize`，不要
逐个自定义字号造成层级混乱。

区别提醒：Panel 自带的标题条（浅色底 + 边框）是另一套视觉语言，用于"卡片式
分组"；SectionTitle 是更轻量的"裸标题"，用于自由布局的分区起始。两者不要
叠加使用（不要把 SectionTitle 放进 Panel 的 title 里）。
