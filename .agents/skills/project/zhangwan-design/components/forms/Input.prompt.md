对应 `el-input` 样式的搜索栏文本输入框，用于 BiFormItem 字段和筛选行里的
自由文本查询（名称、ID、关键词等）。

```jsx
<Input placeholder="请输入短剧名称" value={keyword} onChange={setKeyword} />
<Input value={keyword} onChange={setKeyword} clearable size="small" />
```

用法：默认宽度 240px，与 Select/DatePicker/InputNumberRange 共用同一套
240px 默认值，保证筛选行里各控件尺寸统一——如果某个字段需要更宽的输入框
（如长文本搜索），应通过外层容器 `style` 覆盖宽度而不是新建变体。`clearable`
仅在有值且非 disabled 时显示尾部"✕"；`size="small"` 把高度从 32px 收窄到
28px，用于表格内联编辑等更紧凑的场景。

搭配惯例：几乎总是出现在 FilterBar 一行内，与其它筛选控件并排；单独使用时
（如弹窗内的表单字段）不需要额外包裹容器，聚焦态边框会自动变为品牌绿。

边界情况：没有内置校验状态（错误红框），如需展示校验失败，需要在外部包一层
自定义边框样式或在下方追加错误文案，Input 本身不处理 error 态。
