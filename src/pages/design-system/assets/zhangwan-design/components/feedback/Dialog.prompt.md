模态弹窗，对应 `el-dialog` + 项目自有的 `DialogDefaultFooter` 约定——居中
显示，遮罩点击关闭，底部固定"取消 + 确定"按钮组合。

```jsx
<Dialog open={open} title="确认删除" onCancel={close} onConfirm={handleDelete} confirmLoading={deleting}>
  删除后不可恢复，确定继续吗？
</Dialog>
```

用法：`open` 为 false 时组件返回 `null`（不挂载、不做淡入淡出动画）——不需要
调用方额外做条件渲染。`confirmLoading` 为 true 时确定按钮文案变为"提交中…"
并禁用点击，项目约定是在异步请求的 `finally` 块里把它切回 false（与 Button
的 `loading` 用法一致）。点击遮罩层等效于点击"取消"（触发 `onCancel`），
点击弹窗内容本身不会关闭。

用途边界：Dialog 用于短小的确认/提示类交互（删除确认、简单表单），内容较多
的编辑/详情类交互应使用 Drawer——项目里 Drawer 比居中 Dialog 更常用，Dialog
仅保留给需要用户明确"确认"的轻量场景。

用法限制：没有暴露"隐藏底部按钮"或"自定义底部"的 prop——如果需要非
取消/确定的按钮组合，应直接在业务层另写弹窗结构，不要往 `children` 里塞
按钮伪装成底部区域。
