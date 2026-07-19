对应 `el-checkbox` 的复选框，用于自定义列选择弹窗与表格行多选。

```jsx
<Checkbox label="短剧信息" checked={checked} onChange={setChecked} />
<Checkbox label="不可编辑项" checked disabled />
```

用法：14px 方形勾选框，`label` 可选——不传时只渲染勾选框本身，用于表格表头/
行首的纯选择框场景（不需要文字说明）。`disabled` 时勾选框和文字都变浅灰、
光标变 `not-allowed`，但仍会渲染当前 `checked` 状态（勾选态可以是 disabled +
checked，用于展示"已锁定为选中"的字段）。

搭配惯例：多个 Checkbox 纵向排列用于 ColumnSettingsDialog 这类自定义列选择
弹窗，横向排列用于表格工具栏的批量操作前置勾选；纵向列表建议每项之间留 8-10px
间距（flex column + gap），不要用 Checkbox 自身的行高模拟间距。

边界情况：这是无三态（indeterminate）版本——如果需要"部分选中"的父子联动
勾选框（全选/半选），当前组件不支持，需要在业务层自行处理视觉表现。
