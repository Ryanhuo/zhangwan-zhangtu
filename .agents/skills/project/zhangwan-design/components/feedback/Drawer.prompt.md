侧滑抽屉，对应 `BiDrawer`——应用里详情/编辑视图的主要面板模式，在掌玩全站
比居中 Dialog 更常用，应作为"打开一个次级视图"的默认选择。

```jsx
<Drawer open={open} title="编辑短剧信息" width="60%" onCancel={close} onConfirm={save} confirmLoading={saving}>
  <FormFields />
</Drawer>
```

用法：从右侧滑入（0.28s 缓动动画），默认宽度是视口宽度的 80%（`width`
prop 覆盖），不是固定像素——大多数编辑表单场景直接用默认宽度即可，只有内容
特别简单（如单个确认信息）时才考虑传更小的 `width`。`children` 区域可滚动
（`overflow-y: auto`），头部和底部按钮条固定不随内容滚动。

`footer` 设为 false 时隐藏底部"取消/确定"按钮条，用于纯展示型抽屉（如详情
只读页），此时应在 `children` 内部自行提供关闭方式，或依赖头部的"×"按钮
（始终存在，不受 `footer` 影响）。

搭配惯例：内容较多、需要表单/多个 Panel 分区的场景优先用 Drawer；只有需要
用户显式确认一个简短决定时才用 Dialog。两者的底部按钮条视觉完全一致
（DialogDefaultFooter 约定），保证切换使用时不会有违和感。
