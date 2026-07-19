# 设计系统

## 页面目标

- 把 `.agents/skills/project/zhangwan-design/` 这份设计系统 skill 的真实内容（tokens、规范卡片、组件、完整 UI Kit）可视化展示出来，作为团队浏览"掌玩风格长什么样"的统一入口。
- 本页所有可视内容均直接来自 skill 原始文件的镜像（`assets/zhangwan-design/`），不是手抄的数值或截图——skill 更新后重新复制一次这个目录即可保持同步。

## 页面结构

- 左侧固定导航（TOC），右侧内容区，按 `_ds_manifest.json` 里的 card 分组顺序排列：概览 → 品牌 → 色彩 → 字体 → 间距 → 组件 → 完整 UI Kit → 完整 Token 列表。
- "品牌/色彩/字体/间距/组件/UI Kit" 六个分区里的每一张卡片，都是用 `<iframe>` 直接嵌入 `assets/zhangwan-design/` 下对应的真实 `.html` 文件（guidelines 规范卡 + 各组件目录下的 `*.card.html` + `ui_kits/zhangwan-console/index.html`），因此渲染出的样式/交互和 skill 自带的预览完全一致。
- "完整 Token 列表" 是从 `_ds_manifest.json` 的 `tokens` 数组（97 条）渲染出的参考表格，按颜色/字体/间距-圆角-阴影分类，作为规范卡片之外的完整索引。

## 当前边界

- 组件分区展示的是 skill 自带的 `*.card.html` 静态演示（React 18 + Babel standalone CDN 自渲染，含真实交互如可排序表格/悬停图表提示），不是把 34+ 个组件 `.jsx` 逐一接入本项目工程做原生 import/live demo。
- 页面本身不引入 zhangwan-design 之外的视觉规范；容器壳（导航、分区标题、留白节奏）的排版风格参考 Claude 文档站的编辑感呈现，但色彩/组件内容一律来自 zhangwan-design 原始文件。
- 数据静态，无后端依赖；`assets/zhangwan-design/` 是只读镜像，不在本页面内修改。
- 唯一的手动改动：`ui_kits/zhangwan-console/` 下 4 个 `.jsx` 文件重命名为 `.jsx.txt`（`App`/`ConsoleShell`/`DashboardScreen`/`AnalysisScreen`），并同步改了 `index.html` 里的 `<script src>` 引用。原因：这 4 个文件通过外链 `<script type="text/babel" src="...">` 加载，若保留 `.jsx` 扩展名，会被 Vite dev server 的默认转换中间件当成源码模块拦截重写（注入 `import.meta.hot` 等 ESM 头），导致浏览器报 "Cannot use import statement outside a module" 且页面空白；其余 `*.card.html`/`guidelines/*.html` 都是内联 `<script type="text/babel">`，不经过文件请求，不受影响，无需改动。代码内容本身未做任何修改。
