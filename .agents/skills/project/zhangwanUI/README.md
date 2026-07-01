# zhangwanUI Design System

A design system reconstruction of **zhangwanUI** — 一套面向中文广告投放与运营后台的高密度仪表盘界面系统。  
The system is purpose-built for 高频筛选、批量判断、表格扫读和重复查询场景，目标不是制造视觉情绪，而是让操作者更快地进入数据决策状态。

## Source

- **Figma library:** 当前交付未附带原始 Figma 文件名；本说明基于 `phase2-brand-analyst.json`、`colors_and_type.css`、`components.css` 与 6 个预览页重建。
- **Pages:** 6 个预览页面，覆盖 action、form、data-display、navigation 四类核心后台模式。
- **Brand owner:** zhangwanUI；品牌语境为中文广告运营工作台。

## What this design system covers

- **Foundations** — 绿色主色 10 阶、灰阶 10 阶、14px 正文、4px 基础间距、4/6/8/10/12/9999 圆角、5 层轻量阴影。
- **Components** — 6 个已文档化组件：Smart Button、Metric Card、Filter Form、Data Table、Top Navigation、Sidebar Navigation。
- **Sample slides & UI kit** — 当前输出以 `preview/` 中的小型 HTML 卡片为主，用于说明结构、密度与交互优先级，而不是做营销型展示。

## CONTENT FUNDAMENTALS

### Voice & tone

zhangwanUI 的语气是专业、克制、低干扰的。它更像一名熟悉业务口径的投放运营同事，而不是一个热情的增长产品。中文文案以动作词、结果词和指标词为主，句长偏短，默认省略情绪化修饰，不使用感叹号，不依赖口语化鼓励，也没有 emoji。界面中的每一个词都服务于“下一步操作是什么”或“当前结果是否达标”这两个问题，因此 copy 应始终优先保证检索性、对齐性和重复查询时的识别效率。

### Concrete copy examples

- 主操作按钮: *“智能创建”*
- 次操作按钮: *“取消”*
- 持久化动作: *“保存”*
- 确认动作: *“确定”*
- 指标标签: *“ROI”*
- 指标标签: *“点击率”*

### When generating copy

- 优先使用 2 到 4 个字的动作词，避免长句按钮文案。
- 把业务指标直接暴露为名词标签，例如 ROI、点击率，而不是解释性句子。
- 主操作文案应可在高频重复出现时快速辨认，避免每个页面都发明不同说法。
- 同层级动作要形成稳定对照，如“保存 / 取消”“确定 / 取消”，减少二次判断成本。

## VISUAL FOUNDATIONS

### Color

zhangwanUI 的颜色系统以 `#16a56f` 为中心，这个绿色不是消费级产品常见的明亮激励色，而是更偏运营后台的执行色：稳定、节制、可连续使用。10 阶主色从 `#eefbf6` 到 `#0b4b35`，在实际界面里主要承担主按钮、当前导航项、选中行背景和局部成功信号。最关键的不是“绿”本身，而是它与大面积浅灰壳层之间形成的低噪声对比。

- **Brand primary:** `#16a56f`，用于主操作、当前态、关键正向状态。
- **Brand scale:** 10 stops，从 `#eefbf6` → `#0b4b35`；最常用的是 `500`、`600` 和 `50`。
- **Neutrals:** 10 阶灰度从 `#f7f8fa` 到 `#111827`，主工作区常用 `#ffffff`、`#fbfcfd`、`#f7f9fb`、`#f4f6f8`、`#d8e0e6`。
- **Semantic:** Success `#16a34a`，Warning `#e49a12`，Danger `#e5484d`，Info `#1683d8`；其中 Info 更像辅助跳转和次级说明，不与绿色争夺主导权。

这套颜色给人的感受不是“新锐”而是“耐用”。浅灰背景 `#f4f6f8` 与白色表面 `#ffffff` 提供了足够清晰的层级，但不会产生强烈分割；主选中底色使用 `--color-primary-container`，也就是非常浅的绿色容器层，能在表格与导航中提供状态提示，同时不破坏大面积数据排版的连续性。

### Typography

系统使用 **Noto Sans SC** 作为中文标题与正文主字体，使用 **Inter** 处理拉丁字符、数字与展示型排版。这一组合非常符合后台产品的需要：中文部分稳、密度高、识别快；数字和英文指标则用 Inter 保持更整齐的宽度感和现代感。`--font-display`、`--font-heading`、`--font-body`、`--font-mono` 都已在 `colors_and_type.css` 中明确。

- **Primary face:** **Noto Sans SC**，用于中文 heading 与 body；权重使用 `400 / 500 / 600 / 700`。
- **Latin / numeric face:** **Inter** 用于拉丁字符、数字、价格式展示与等宽化指标表达；`--font-mono` 也回落到 Inter。
- **Scale:** display `40/1.2`，h1 `32/1.25`，h2 `28/1.3`，h3 `24/1.35`，h4 `20/1.4`，lead `16/1.6`，body `14/1.6`，caption `12/1.5`，eyebrow `11/1.4`，mono `13/1.5`。
- **Letter-spacing:** display 带 `-0.02em` 收紧；eyebrow 带 `0.08em` 并转大写，适合分组标签。
- **Line-height:** 正文维持 `1.6`，让密集信息在窄列与表格旁注中仍保有呼吸；标题逐级压缩到 `1.25–1.4`，保证后台面板不被过大的垂直节奏拖慢。

从气质上看，zhangwanUI 的字体策略不是“品牌化字体秀”，而是“把数字和中文都摆正”。这是典型的数据工作台判断：可读性优先于个性，数字列的整齐感优先于装饰性的标题风格。

### Spacing

间距系统以 **4px** 为基础单位，令牌为 `4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 / 40 / 48 / 56 / 64px`。这不是松弛型网页节奏，而是典型后台系统节奏：字段之间以 `8px` 和 `12px` 维持紧凑，卡片内边距常用 `16px` 和 `20px`，页面级沟槽使用 `24px`。控件高度也围绕效率组织：tag `22px`，control-xs `24px`，control-sm `28px`，input `32px`，button `36px`，control-md `40px`，control-lg `44px`。这意味着信息块默认是紧凑的，但主点击目标仍保留足够命中面积。

### Radius

- **4px** — 小图标槽位、最克制的矩形边角，强调工具感。
- **6px** — 小型 ghost 元素或需要更紧凑轮廓的辅助操作。
- **8px** — 默认控件圆角，输入框、按钮、筛选容器与多数交互项的主值。
- **10px** — 卡片与导航容器使用的更柔和轮廓，用来区分信息块与字段控件。
- **12px** — 更高层级的面板保留值，在当前组件中较少出现。
- **9999px** — 仅用于 pill、状态标签、导航 chip 等胶囊形元素。

这组半径并不追求统一，而是通过 `8px` 与 `10px` 的微差，把“能操作的控件”和“承载内容的容器”分开。对广告运营后台而言，这个差值非常有效，因为它在不增加额外色彩的情况下就能表达结构层级。

### Shadow / Elevation

系统共有 5 层阴影，而且整体非常克制：

1. **Shadow 1 / Card:** `0 1px 2px rgba(17, 24, 39, 0.05), 0 1px 1px rgba(17, 24, 39, 0.03)` — 静止卡片和导航容器。
2. **Shadow 2 / Card Hover:** `0 4px 10px -4px rgba(17, 24, 39, 0.08), 0 2px 4px rgba(17, 24, 39, 0.04)` — 主按钮、滚动中的顶部导航、轻度浮起态。
3. **Shadow 3 / Floating Panel:** `0 8px 24px -10px rgba(17, 24, 39, 0.10), 0 4px 8px rgba(17, 24, 39, 0.05)` — 浮层面板。
4. **Shadow 4 / Modal:** `0 16px 36px -14px rgba(17, 24, 39, 0.14), 0 8px 12px rgba(17, 24, 39, 0.06)` — 模态层。
5. **Shadow 5 / Overlay:** `0 24px 56px -20px rgba(17, 24, 39, 0.18), 0 12px 20px rgba(17, 24, 39, 0.08)` — 最强覆盖层。

这里的阴影哲学很明确：静止时尽量薄，交互时再抬起。后台系统需要的是层级提示而不是漂浮感，因此阴影从不浓重，也不会与边框一起制造“卡片秀场”效果。

### Borders

- 默认边框使用 `#d8e0e6`，属于轻灰、低对比、持续可见的工作边界。
- 轮廓变体使用 `#dfe5eb`，更适合表格行分隔与弱强调容器。
- 选中态不靠重边框，而是使用浅绿底加局部强调线，例如表格选中行左侧 `inset 2px 0 0 var(--color-primary)`。

### Backgrounds

- 页面壳层背景是 `#f4f6f8`，让高密度模块先“坐稳”再展开。
- 主要工作面是 `#ffffff`，确保表格、筛选和指标卡具有稳定对比。
- 次级表面在 `#fbfcfd`、`#f7f9fb`、`#f2f5f7` 之间递进，适合 toolbar、pager、sidebar 等结构件。

### Animation

- 动效时长只给出 `120ms / 180ms / 240ms` 三档，体现操作系统式而非品牌秀式节奏。
- 颜色变化使用 `120ms`，阴影变化使用 `180ms`，避免 hover 过慢影响扫数节奏。
- 缓动以 `cubic-bezier(0.2, 0, 0, 1)` 为标准，整体偏干脆，没有弹性效果。

### Iconography

- 图标尺寸为 `12 / 14 / 16 / 20px`，与紧凑控件高度匹配。
- 预览组件中的图标更多是结构占位而非装饰图形，说明系统重视功能位而不是插画感。
- 侧栏与顶部导航使用 `currentColor` 语义继承，让图标始终服从文本与状态层级。

## Component Patterns

| Component | Preview | Contract | CSS Source | Key Facts | Key Insight |
|---|---|---|---|---|---|
| Smart Button | `preview/component-smart-button.html` | `components/smart-button.json` | `components.css` | 主按钮高度 `36px`；ghost 高度 `28px`；主按钮使用 `--shadow-2`；主次层级通过填充与边框区分。 | 绿色只留给真正的主动作，按钮系统本质上在给运营流程排序。 |
| Metric Card | `preview/component-metric-card.html` | `components/metric-card.json` | `components.css` | 卡片宽 `208px`、最小高 `132px`、内边距 `20px`；标签用 `12px`；状态 pill 高 `22px`。 | 指标卡是扫读入口，视觉重点始终让位于数字本身。 |
| Filter Form | `preview/component-filter-form.html` | `components/filter-form.json` | `components.css` | 输入高度 `32px`；字段最小宽 `132/180/196px`；chip 高 `22px`；主按钮用于“查询”。 | 筛选区被设计成压缩而稳定的操作条，适合高频重复提交。 |
| Data Table | `preview/component-data-table.html` | `components/data-table.json` | `components.css` | 表头与单元格高度 `44px`；数字列右对齐；选中行使用浅绿底与 `2px` 左侧强调线；toolbar 与 pager 均为浅层表面。 | 表格是系统主角，所有颜色和间距都在服务对齐、扫描和比较。 |
| Top Navigation | `preview/component-top-navigation.html` | `components/top-navigation.json` | `components.css` | 导航高 `56px`；平台 chip 与 tab 采用胶囊形；滚动态提升到 `--shadow-2`；图标按钮使用容器底色。 | 顶部导航提供上下文切换，但始终保持轻量，避免压过主内容区。 |
| Sidebar Navigation | `preview/component-sidebar-nav.html` | `components/sidebar-nav.json` | `components.css` | 展开宽 `240px`，折叠宽 `72px`；条目高 `40px`；当前项用浅绿底；分组标题用 `11–12px` 大写式标签。 | 侧栏是后台骨架，重点不是存在感，而是让当前位置一眼可见。 |

## Index

- `README.md` — 本文件，面向设计师的品牌叙事与实现解释。
- `colors_and_type.css` — 颜色、字体、间距、圆角、阴影与结构尺寸变量。
- `components.css` — 从预览页汇总出的组件样式定义。
- `components/index.json` — 当前组件清单与优先级提示。
- `preview/` — 6 个组件级 HTML 预览。
- `SKILL.md` — 供 AI 代理快速读取的设计系统入口说明。
- `library-consumption.json` — 推荐的下游读取顺序。

## Caveats / known substitutions

1. **原始品牌字体未随当前资料提供。** 运行时使用 **Noto Sans SC** 处理中文、使用 **Inter** 处理拉丁字符与数字；这能维持后台信息密度，但不保证与品牌历史界面逐像素一致。
2. **`colors_and_type.css` 中的大部分颜色阶梯标记为 AI-generated。** 因此 10 阶色板应视为对品牌角色关系的重建，而不是经品牌方确认的官方色票。
3. **当前 `generatedArtifacts` 未包含独立图标或资产目录。** 预览中的图标语义主要通过占位块与 `currentColor` 表达，真实产品若补充 SVG 资产，精细度会进一步提升。
4. **README 的 Source 范围来自品牌分析、令牌文件和预览组件。** 原始页面数、顶层 frame 数与更细的业务场景说明并未提供，因此部分“为何如此设计”的解释属于基于现有输出的推断，而非原设计师逐条批注。
5. **系统同时提供 `.dark` 令牌。** 但当前组件叙事和预览重点仍是浅色工作台模式；如果后续扩展暗色主题，应优先验证表格对比度与状态色识别，而不是直接复制浅色层级。
