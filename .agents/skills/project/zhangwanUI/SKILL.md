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

- 主色是 `#16a56f`，绿色只承担主操作与成功反馈，不做大面积装饰渐变。
- 背景 `#f4f6f8` 配白色工作面 `#ffffff`，形成浅灰画布 + 白卡片的低干扰后台结构。
- 中性色以 `#6b7683` 为正文辅助基准，边框 `#d8e0e6` 保持轻描边，优先服务扫读。
- 默认输入高 `32px`、按钮高 `36px`、导航高 `56px`，间距基线从 `4px` 起按 `4/8/12/16/20/24/32` 递增。
- 圆角以 `4px / 6px / 8px` 为主，卡片到导航可放宽到 `10px`，只有状态胶囊使用 `9999px`。
- 字体使用 `Noto Sans SC` 承担中文标题与正文，`Inter` 承担拉丁字形、数字与等宽数据展示。
- 阴影是“弱存在”策略：常态卡片 `--shadow-1`，悬停 `--shadow-2`，浮层再逐级上升，不靠重阴影制造层次。
- 品牌语气为中文优先、专业克制、数据导向；界面文案短促直接，如“智能创建”“ROI”“点击率”，不使用表情和营销腔。

## Components

| 组件 | 预览 | 合同 | 关键提示 |
|---|---|---|---|
| Smart Button | `preview/component-smart-button.html` | `components/smart-button.json` | 绿色主按钮建立操作优先级，次操作退回白底细边框。 |
| Metric Card | `preview/component-metric-card.html` | `components/metric-card.json` | 指标卡突出数值与趋势，不用装饰性块面抢注意力。 |
| Filter Form | `preview/component-filter-form.html` | `components/filter-form.json` | 筛选栏强调紧凑并排与固定操作区，适合高频查询。 |
| Data Table | `preview/component-data-table.html` | `components/data-table.json` | 表格是核心工作面，边框、对齐和选中态都服务扫读效率。 |
| Top Navigation | `preview/component-top-navigation.html` | `components/top-navigation.json` | 顶部导航负责上下文切换，保持轻边框和低视觉噪声。 |
| Sidebar Navigation | `preview/component-sidebar-nav.html` | `components/sidebar-nav.json` | 侧栏是后台骨架，当前态依赖浅绿容器与清晰分组。 |
