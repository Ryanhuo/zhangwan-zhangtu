# zhangwanUI Design System

A design system reconstruction of **zhangwanUI** — 一套面向中文广告投放与运营后台的高密度仪表盘界面系统。  
The system is purpose-built for 高频筛选、批量判断、表格扫读和重复查询场景，目标不是制造视觉情绪，而是让操作者更快地进入数据决策状态。

## Source

- **Figma library:** 当前交付未附带原始 Figma 文件名；本说明基于 `phase2-brand-analyst.json`、`colors_and_type.css`、`components.css` 与 6 个预览页重建。
- **Pages:** 6 个预览页面，覆盖 action、form、data-display、navigation 四类核心后台模式。
- **Brand owner:** zhangwanUI；品牌语境为中文广告运营工作台。

## What this design system covers

- **Foundations** — 绿色主色 10 阶、灰阶 10 阶、14px 正文、4px 基础间距、4/6/8/10/12/9999 圆角、5 层轻量阴影；其中主色/语义色/部分尺寸锚点已用真实业务系统（罗盘 compass）源码核对替换，见下方 Caveats。
- **Components** — 19 个已文档化组件：原有 6 个（Smart Button、Metric Card、Filter Form、Data Table、Top Navigation、Sidebar Navigation，均为早期占位设计）+ 新增 13 个（Drawer、Tooltip、Tag、Popover、Message/MessageBox、DateRangePicker、SortCaret、ViewList、CascaderSelect、TagSelect、Radio/Checkbox、Pagination、DataOverview，均为对真实 Vue 源码核对后的验证结果）。
- **Sample slides & UI kit** — 原有 6 个组件有 `preview/` 静态 HTML 预览；新增的 13 个组件暂无预览页，仅有 JSON 合同，可运行的 React 参考实现见 `~/.claude/skills/compass-ui/assets/eui-kit/`（详见 Caveats）。

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
| Sidebar Navigation | `preview/component-sidebar-nav.html` | `components/sidebar-nav.json` | `components.css` | 展开宽 `240px`，折叠宽 `72px`；条目高 `40px`；当前项用浅绿底；分组标题用 `11–12px` 大写式标签。 | 侧栏是后台骨架，重点不是存在感，而是让当前位置一眼可见。（真实业务系统实测展开/折叠宽度是 `220/60px`，条目高 `50px`，见 `sidebar-nav.json` 的 `zhangwanVerification` 字段） |

### 新增：真实业务系统核对组件（13 个，暂无 preview）

| Component | Contract | Key Facts | Key Insight |
|---|---|---|---|
| Drawer | `components/drawer.json` | 默认宽度 `80%`，具体页面按内容覆盖为固定像素值（如 900/1000/1300px）。 | 不存在单一“标准抽屉宽度”，宽度是内容驱动的。 |
| Tooltip | `components/tooltip.json` | 深色纯文字气泡（`#404040` 底、白字），仅 hover 触发。 | 和 Popover（白底+富内容+点击/hover）是两个独立组件，不要合并实现。 |
| Tag | `components/tag.json` | 默认（无类型）标签走主色浅底 `#e6f9f3`/边框 `#ccf2e8`；light/dark/plain 三种 effect；medium/small/mini 高度 `28/24/20px`。 | 默认标签不是灰色，是主色浅底。 |
| Popover | `components/popover.json` | 白底 + 边框 + 阴影（与下拉阴影同值 `0 4px 10px 0 rgba(0,0,0,.1)`），可容纳标题+富内容。 | 表格列头说明气泡只是 Popover 的一种业务用法，不单独做组件。 |
| Message / MessageBox | `components/message.json` | Message 最小宽 `380px`，顶部居中；MessageBox 宽 `420px`，居中确认弹窗。 | 两者语义和触发方式都不同，不要混用。 |
| DateRangePicker | `components/date-range-picker.json` | 真实交互是 `646px` 宽双月历网格；快捷项固定 7 个（今天/昨天/近一周/近一月/上个月/本月/下个月）。 | 日期格式化必须手动拼接本地年月日，禁止用 `toISOString()`，否则 UTC+8 时区会出现选中日期显示错一天的 bug。 |
| SortCaret | `components/sort-caret.json` | 上下箭头独立高亮。 | 不是单一箭头旋转 180°。 |
| ViewList | `components/view-list.json` | “收起/展示”只控制已保存视图标签列表本身。 | 不是收起整个筛选表单——这是最容易凭直觉猜错的一处。 |
| CascaderSelect | `components/cascader-select.json` | 占位符固定“请选择”。 | 只有级联选择器和分销方 CustomSelect 用“请选择”，其余下拉一律“请输入”。 |
| TagSelect | `components/tag-select.json` | 远程搜索模式需 300ms 防抖 + “搜索中...”态。 | 缺少防抖会导致远程搜索请求风暴。 |
| Radio / Checkbox | `components/radio-checkbox.json` | 基础表单控件。 | 视觉与常规实现一致，无特殊还原点。 |
| Pagination | `components/pagination.json` | 页码格 `32×32px`，字号 `14px`，默认底色 `#fff`，选中态用浅绿底+主色字。 | 不是常见的 `28×28px/12px/#f4f4f5` 配置。 |
| DataOverview | `components/data-overview.json` | KPI 小卡是 `2×2` 灰底（`#f7f8fa`）网格，迷你图在卡片右侧；环比数值带符号；说明文案是 `?` 图标 hover 弹出。 | 涨跌语义只在环比文字/箭头上表达，迷你图始终用统一主色，不按涨跌变色。 |

## Index

- `README.md` — 本文件，面向设计师的品牌叙事与实现解释。
- `colors_and_type.css` — 颜色、字体、间距、圆角、阴影与结构尺寸变量。
- `components.css` — 从预览页汇总出的组件样式定义。
- `components/index.json` — 当前组件清单与优先级提示。
- `preview/` — 6 个组件级 HTML 预览。
- `SKILL.md` — 供 AI 代理快速读取的设计系统入口说明。
- `library-consumption.json` — 推荐的下游读取顺序。

## Caveats / known substitutions

1. **原始品牌字体未随当前资料提供。** 运行时使用 **Noto Sans SC** 处理中文、使用 **Inter** 处理拉丁字符与数字；这能维持后台信息密度，但不保证与品牌历史界面逐像素一致。未核对，沿用原设定。
2. **`colors_and_type.css` 中的颜色/尺寸令牌现在是混合可信度状态，不再是一律 AI-generated。** 主色 `#00bf8a`、语义色（success/warning/danger）、页面灰底 `#f0f2f5`、表格表头底色 `#f2f3f5`、导航高 `50px`、侧栏 `220/60px`、输入/按钮高 `32px` 等锚点，已用真实业务系统（罗盘 compass，Vue2 + `bi-element-ui`/`bi-eleme`）源码或线上实测核对替换，并在 `colors_and_type.css`/`css.json` 中逐条标注 `VERIFIED: <来源>`。**但 10 阶色板中除锚点外的插值步进（大部分 100/200/300/700/800/900 等中间阶）仍未逐一核对**，`info` 语义色也仍是旧占位值（真实业务系统里没有独立的信息蓝色，多复用主色青绿表达信息态）。使用前请看变量旁的注释区分 `VERIFIED` 与 `未验证，沿用旧值`。
3. **圆角/阴影未强行按真实业务系统改动。** 真实系统里圆角统一只用 `4px`、卡片默认无阴影，这两点已作为 `SKILL.md`/`colors_and_type.css` 中的记录性注释保留，但现有的 `4/6/8/10/12/9999` 圆角 ramp 与 5 层阴影系统未被替换——是否收敛为真实系统的极简方案，属于后续需要单独决策的设计改动，不在本次核对范围内。
4. **当前 `generatedArtifacts` 未包含独立图标或资产目录。** 预览中的图标语义主要通过占位块与 `currentColor` 表达，真实产品若补充 SVG 资产，精细度会进一步提升。
5. **README 的 Source 范围来自品牌分析、令牌文件和预览组件，加上真实业务系统源码核对结果。** 原有 6 个组件的“为何如此设计”解释仍属于基于现有输出的推断；新增 13 个组件的解释则直接来自 Vue 源码/编译后 CSS 阅读，来源见各组件 JSON 的 `provenance` 字段。
6. **新增的 13 个组件暂无 `preview/component-{slug}.html` 静态预览页**，只有 JSON 合同（`components/{slug}.json`），每个文件用 `previewStatus: "no-preview-html-yet"` 标记。按本技能自身规则，组件读取顺序本应是 `preview/*.html` 优先于 JSON 合同；这 13 个组件目前只能直接读 JSON 合同，或参考另一个 skill（`~/.claude/skills/compass-ui/assets/eui-kit/`）里可运行的 React 组件源码。是否需要补齐这些静态预览页，留作后续任务，未在本次核对中处理。
7. **系统同时提供 `.dark` 令牌。** 但当前组件叙事和预览重点仍是浅色工作台模式；如果后续扩展暗色主题，应优先验证表格对比度与状态色识别，而不是直接复制浅色层级。
