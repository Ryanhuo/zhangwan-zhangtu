掌玩状态胶囊，对应分析表格中使用的 `el-tag--type` / `el-tag--nanpin` /
`el-tag--nvpin` 类，用于给一行数据打上简短的分类/状态标记。

```jsx
<Tag tone="success">连载中</Tag>
<Tag tone="info">男频</Tag>
<Tag tone="danger">女频</Tag>
<Tag tone="neutral">已下架</Tag>
```

Tone 语义（不是任意配色，对应项目里固定的业务含义）：`success` 用于类型/分类
标签（绿色），`info` 用于男频/nanpin 分组（青色），`danger` 用于女频/nvpin
分组（粉色，注意这里不代表"危险"，是历史上的分组配色），`neutral` 是默认灰色
状态标签。同一个语义在全站要保持一致的 tone，不要因为审美原因换色。

用法：`children` 应为短文字（2-4 个字），Tag 不做文字省略处理，长文本会撑开
胶囊宽度。多个 Tag 并排时用 flex + gap（建议 6-8px），不要用 margin。

搭配惯例：常出现在 DataTable 单元格里，或紧跟在标题/名称后面作为状态修饰。
