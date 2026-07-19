对应 `layout/components/Navbar` 的顶部应用栏，白色背景、微弱阴影，固定 50px
高，是页面级布局的顶部条。

```jsx
<Navbar title="数据总览" userName="张三" />
<Navbar title="数据总览" userName="张三" avatarUrl="/avatar.png" />
```

用法：`title` 是靠左的当前页面/产品名，通常是静态文字而不是可切换的导航项——
页面内的层级导航应该放在内容区用 Breadcrumb 表达，不要把 Breadcrumb 塞进
Navbar。右侧固定是头像 + 用户名，`avatarUrl` 不传时头像显示为浅灰底色方块
（10px 圆角），不会显示默认人形图标或首字母。

搭配惯例：Navbar 常与 Hamburger 组合，Hamburger 放在 Navbar 最左侧、`title`
之前；整体布局中 Navbar 横跨顶部整行，SidebarNav 占左侧剩余高度，两者共同
构成应用外壳，页面内容在右下方区域滚动。

边界情况：`userName` 过长时不做省略，会撑开右侧区域——如遇到过长用户名，
建议业务层自行截断后传入。
