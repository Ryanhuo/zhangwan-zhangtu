---
name: zhangwanui-design
description: Use this skill to generate well-branded interfaces and assets for zhangwanUI — a Chinese ad-operations dashboard. Contains essential design guidelines, colors, type, fonts, and UI kit components for prototyping dashboard UIs.
user-invocable: true
---
# zhangwanUI Design Skill

先读 `README.md`，再按需浏览其他文件；做视觉产物时优先产出可预览的静态 HTML，做工程实现时直接复用这里的规则与资产。

若用户只调用本技能而未说明目标，先询问要设计的页面、场景与交付形式，再以品牌设计专家身份输出方案。

## Quick map

- `README.md` — 品牌背景、内容语气与视觉基础（先读）
- `css.json` — 设计令牌理解源；用于程序化读取颜色、字号、圆角、阴影、间距
- `colors_and_type.css` — 运行时样式入口；直接 link/import，不作为首选理解源
- `components.css` — 组件聚合 CSS，来自预览页抽取结果
- `components/index.json` — 组件索引与优先级
- `preview/component-{slug}.html` — 第一组件来源，优先读取 DOM/CSS 结构
- `components/{slug}.json` — 第二组件来源，读取意图、变体与使用提示；无 `_evidence/` 时即为最终合同
- `library-consumption.json` — 推荐下游读取顺序

UIKit 或页面生成时，组件读取顺序固定为：`preview/component-{slug}.html` → `components/{slug}.json`；仅当预览不足且存在 `_evidence/` 时才回退到证据文件。`css.json` 负责理解，`colors_and_type.css` 负责运行时接入。

### 编码规范

*   Vue 页面/组件**优先采用 Vue 3 Composition API + TypeScript**。
*   组件默认使用**单文件组件 (SFC)**，输出 `.vue` 文件。
*   `<script>` 块必须使用 `<script setup lang="ts">`。
*   业务相关样式写在组件 `<style scoped>` 中，全局样式仅放 Element Plus 覆盖和 CSS 变量。

### 依赖安装

```bash
npm install vue@3.5.22 element-plus @element-plus/icons-vue
npm install -D typescript@^5.6.3
```

> Element Plus 图标在 `main.ts` 全局注册：
> ```ts
> import * as ElementPlusIconsVue from '@element-plus/icons-vue'
> for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
>   app.component(key, component)
> }
> ```

> 如用户指定其他技术栈（React、Naive UI 等），以用户要求为准。

---

## Essentials at a glance

> 以下标记 **[VERIFIED]** 的条目已用真实业务系统（罗盘 compass，Vue2 + element-ui 内部主题 `bi-eleme`）源码核对替换过占位值；未标记的仍是早期 AI 生成占位值，改动前请自行核实。详细来源见 `colors_and_type.css`/`css.json` 内每条变量的注释。

- **[VERIFIED]** 主色是 `#00bf8a`（不是旧占位值 `#16a56f`），绿色只承担主操作与成功反馈；hover 态比默认色更浅（`#33cca1`，element-ui 用主色+白混合出 hover，不是变深），active/pressed 为 `#00ac7c`。
- **[VERIFIED]** 语义色：success `#00b42a`、warning `#ff7d00`、danger `#f53f3f`；info 尚无真实业务色可对照，沿用旧占位值，标记为未验证。
- 背景 `#f4f6f8` 配白色工作面 `#ffffff` 的整体结构未变；**[VERIFIED]** 页面级灰底实测为 `#f0f2f5`，表格表头/hover 底色为 `#f2f3f5`（不是旧值 `#f6f8f9`）。
- **[VERIFIED]** 中性文字：正文 `#323335`、常规辅助 `#4e5969`、次级辅助 `#86909c`；边框：浅 `#e5e6eb`、常规 `#c9cdd4`。
- **[VERIFIED]** 默认输入/按钮高 `32px`（不是 `36px`）、顶部导航高 `50px`（不是 `56px`）；侧栏展开 `220px`/折叠 `60px`（不是 `240/72px`）；表格单元格内边距 `10px`、字号 `14px`；侧栏条目高 `50px`。
- 圆角占位仍是 `4/6/8/10/12/9999` 一套 ramp；**[VERIFIED] 真实业务系统里圆角统一只用 `4px`**（按钮/输入/卡片/下拉都是 4px），未强行改动现有 ramp，仅作为参考记录在 `colors_and_type.css` 注释中。
- 字体使用 `Noto Sans SC` 承担中文标题与正文，`Inter` 承担拉丁字形、数字与等宽数据展示（未核对，沿用原设定）。
- **[VERIFIED] 真实业务系统里卡片默认没有阴影**（`box-shadow: none`）；占位的 `--shadow-1` 仍保留供其他场景使用。已新增 `--zhangwan-shadow-dropdown`（下拉/气泡 `0 4px 10px 0 rgba(0,0,0,.1)`）、`--zhangwan-shadow-navbar`（导航 `0 1px 4px 0 rgba(0,21,41,.08)`）、`--zhangwan-shadow-drawer`（抽屉/模态三层阴影）。
- 品牌语气为中文优先、专业克制、数据导向；界面文案短促直接，如“智能创建”“ROI”“点击率”，不使用表情和营销腔（未核对，沿用原设定）。

## Components

原有 6 个组件为早期占位设计（`from-scratch`，无 `preview/*.html` 以外的真实来源）；新增 13 个组件（`vue-source-verified`）来自对真实业务系统 Vue 源码的核对，暂缺 `preview/component-{slug}.html` 静态预览页（每个组件 JSON 内 `previewStatus: "no-preview-html-yet"` 标记了这一点，可运行的 React 参考实现在另一个 skill：`~/.claude/skills/compass-ui/assets/eui-kit/`）。

| 组件 | 预览 | 合同 | 关键提示 |
|---|---|---|---|
| Smart Button | `preview/component-smart-button.html` | `components/smart-button.json` | 绿色主按钮建立操作优先级，次操作退回白底细边框。 |
| Metric Card | `preview/component-metric-card.html` | `components/metric-card.json` | 指标卡突出数值与趋势，不用装饰性块面抢注意力。 |
| Filter Form | `preview/component-filter-form.html` | `components/filter-form.json` | 筛选栏强调紧凑并排与固定操作区，适合高频查询。 |
| Data Table | `preview/component-data-table.html` | `components/data-table.json` | 表格是核心工作面，边框、对齐和选中态都服务扫读效率。 |
| Top Navigation | `preview/component-top-navigation.html` | `components/top-navigation.json` | 顶部导航负责上下文切换，保持轻边框和低视觉噪声。 |
| Sidebar Navigation | `preview/component-sidebar-nav.html` | `components/sidebar-nav.json` | 侧栏是后台骨架，当前态依赖浅绿容器与清晰分组。 |
| Drawer *(verified)* | 暂无 | `components/drawer.json` | 默认宽度 80%，具体页面按内容覆盖为固定像素值，无单一标准宽度。 |
| Tooltip *(verified)* | 暂无 | `components/tooltip.json` | 深色纯文字气泡，仅 hover，与 Popover 是两个独立组件。 |
| Tag *(verified)* | 暂无 | `components/tag.json` | 默认标签走主色浅底，不是灰色；light/dark/plain 三种 effect。 |
| Popover *(verified)* | 暂无 | `components/popover.json` | 白底+边框+阴影，可容纳富内容，点击或悬浮触发。 |
| Message / MessageBox *(verified)* | 暂无 | `components/message.json` | Message 顶部居中轻提示，MessageBox 居中确认弹窗，语义不同。 |
| DateRangePicker *(verified)* | 暂无 | `components/date-range-picker.json` | 真实交互是 646px 双月历网格，日期格式化必须手动拼本地年月日，禁止 `toISOString()`。 |
| SortCaret *(verified)* | 暂无 | `components/sort-caret.json` | 上下箭头独立高亮，不是单箭头旋转。 |
| ViewList *(verified)* | 暂无 | `components/view-list.json` | “收起/展示”只控制已保存视图标签列表本身，不收起整个筛选表单。 |
| CascaderSelect *(verified)* | 暂无 | `components/cascader-select.json` | 只有级联选择器和分销方 CustomSelect 用“请选择”，其余用“请输入”。 |
| TagSelect *(verified)* | 暂无 | `components/tag-select.json` | 远程搜索模式需 300ms 防抖 + “搜索中...”态。 |
| Radio / Checkbox *(verified)* | 暂无 | `components/radio-checkbox.json` | 基础表单控件，无特殊还原点。 |
| Pagination *(verified)* | 暂无 | `components/pagination.json` | 页码格 32×32px/14px/默认底色 #fff，不是常见的 28×28px/12px/#f4f4f5。 |
| DataOverview *(verified)* | 暂无 | `components/data-overview.json` | KPI 小卡是 2×2 灰底网格，迷你图在卡片右侧，环比数值带符号。 |
