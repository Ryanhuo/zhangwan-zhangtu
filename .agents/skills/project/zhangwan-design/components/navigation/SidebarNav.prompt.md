对应 `layout/components/Sidebar` 的左侧导航栏——白色背景，绿色激活态加右
边缘强调条，展开 190px / 折叠 56px，是应用外壳的固定左侧结构。

```jsx
<SidebarNav
  items={[{ label: '数据总览', active: true }, { label: '短剧管理' }, { label: '用户画像' }]}
  collapsed={collapsed}
  onSelect={(i) => navigateTo(i)}
/>
```

用法：顶部固定一个 50px 高的品牌区（渐变圆形 logo + "掌玩"文字），折叠态下
只显示 logo、隐藏文字；导航项折叠态下也只显示 `label` 的首字（截取
`label.slice(0, 1)`），因此文案设计上第一个字应具有辨识度（如"总览"而非
"总"），必要时可考虑改用图标而非纯文字截断。

`active` 由调用方在 `items` 里显式标记（组件不维护内部选中状态），激活项
右侧有 3px 品牌绿强调条并轻微变色背景；未激活项悬停有浅绿背景反馈。

搭配惯例：`collapsed` state 应与 Hamburger 的 `isActive` 共用同一个变量，
两者需要一起切换，SidebarNav 本身不提供折叠触发器。宽度切换有过渡动画
（`--duration-fast`），与 Hamburger 的旋转动画节奏一致。

边界情况：`items` 过多、超出视口高度时不做内部滚动处理，会直接溢出——
导航项通常个位数到十几项，若业务扩展到需要滚动的量级，应在外层容器包一层
`overflow-y: auto`。
