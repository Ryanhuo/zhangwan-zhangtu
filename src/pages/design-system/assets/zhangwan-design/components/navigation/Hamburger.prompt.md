侧边栏折叠/展开切换图标，对应 `components/Hamburger/index.vue`，通常放在
Navbar 最左侧，紧邻 SidebarNav。

```jsx
<Hamburger isActive={collapsed} onToggle={() => setCollapsed((c) => !c)} />
```

行为：三道杠图标，`isActive` 为 true（代表侧边栏当前已折叠）时图标旋转
180°，带 `--duration-fast` 缓动过渡；本组件只负责图标本身的视觉状态切换和
点击回调，不控制 SidebarNav 的展开/折叠——调用方需要把同一个 `collapsed`
state 同时传给 Hamburger 的 `isActive` 和 SidebarNav 的 `collapsed`。

用法：点击区域是整个 20px 图标加 8px 内边距（共 36px 见方），足够的点击热区，
不需要额外包裹按钮容器。

搭配惯例：固定放在 Navbar 最左端，与 title 之间留出正常间距即可，不需要
分隔线。
