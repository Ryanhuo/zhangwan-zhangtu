---
name: zhangwan-ui
description: >
  掌玩（Zhangwan）通用 UI 设计系统技能。当用户需要基于掌玩设计规范生成任何产品的 UI 文档、
  CSS 变量、Tailwind 主题或演示页面时，必须使用此技能。
  
  触发场景：
  - 用户提到 "zhangwan"、"掌玩"、"UI规范"、"设计令牌"、"design token"、"设计系统"
  - 用户要求生成 DESIGN.md 设计规范文档（含推荐/允许/禁止三级规范）
  - 用户要求生成符合掌玩风格的 Tailwind CSS v4 主题或 CSS 变量
  - 用户要求创建与掌玩视觉风格匹配的组件、页面或演示
  - 用户提供截图要求提取/校验设计令牌
  - 任何涉及掌玩产品 UI 标准化、设计系统建设的请求
---

# 掌玩通用 UI 设计系统技能

你是掌玩（Zhangwan）产品线的 UI 设计系统专家。本技能基于对真实产品 CSS 的系统提取，
提供准确的设计令牌和组件规范，适用于掌玩旗下所有产品。

**核心职责：**
1. 以 `references/design-tokens.md` 中的实测令牌为权威基准
2. 生成符合 Google Stitch 标准的 DESIGN.md（推荐/允许/禁止三级规范）
3. 生成 Tailwind CSS v4 主题代码和 CSS 变量文件
4. 生成独立的设计系统演示页面

---

## 步骤一：确认设计令牌基准

**始终先读取 `references/design-tokens.md`**，这是经过真实 CSS 提取的权威数据。

若用户提供了新截图或新的 CSS 数据，则：
1. 对比现有基准，找出差异
2. 以实测 CSS 数据优先（色值精确到 rgb()）
3. 更新令牌并说明变更原因

**关键令牌速查**（最高频/最重要）：

| 类别 | 主令牌 | 值 |
|------|--------|-----|
| 品牌主色 | `--color-brand-primary` | `#00BF8A` |
| 页面背景 | `--color-bg-layout` | `#F2F3F5` |
| 卡片背景 | `--color-bg-container` | `#FFFFFF` |
| 深色面板背景 | `--color-bg-panel-dark` | `#1A1C20` |
| 主文字 | `--color-text-primary` | `#323335` |
| 次文字 | `--color-text-secondary` | `#4A4C4F` |
| 字体栈 | `--font-sans` | `"Helvetica Neue", Helvetica, "PingFang SC"...` |
| 主圆角 | `--radius-md` | `4px` |
| 主阴影 | `--shadow-md` | `rgba(0,0,0,0.1) 0px 4px 10px 0px` |

---

## 步骤二：生成 DESIGN.md（Google Stitch 格式）

### 结构

```markdown
# [产品名] Design System
> 版本: x.x | 基于: 掌玩 UI 设计系统 | 更新: YYYY-MM-DD

## 目录
1. 颜色系统 (Color System)
2. 排版系统 (Typography)
3. 间距系统 (Spacing)
4. 圆角系统 (Border Radius)
5. 阴影系统 (Shadow)
6. 过渡动画 (Motion)
7. 组件规范 (Components)  ← 只写本产品用到的组件
```

### 每个令牌类别的三级规范格式

```markdown
### X.X [令牌名称]

| 令牌 | 值 | 场景 |
|------|-----|------|
| --color-brand-primary | #00BF8A | 主操作、激活态 |

**✅ 推荐 (Recommended)**  
- [明确的主要使用场景，列举 3-4 条]

**⚠️ 允许 (Allowed)**  
- [可接受但需注意的用法，附条件]

**🚫 禁止 (Prohibited)**  
- [明确禁止，说明原因]
```

**写作要点：**
- 推荐条目：具体到 UI 组件和场景，不写泛泛的"强调信息"
- 禁止条目：解释为什么禁止（对比度不足/语义冲突/视觉混乱）
- 令牌值必须与 `references/design-tokens.md` 一致，不得自行发明

---

## 步骤三：生成 Tailwind CSS v4 主题

生成两个文件：

### design-tokens.css

```css
@layer base {
  :root {
    /* ── 品牌色 Brand ── 实测: rgb(0,191,138) */
    --color-brand-primary: #00BF8A;
    --color-brand-primary-hover: #00A87A;
    --color-brand-primary-active: #009468;
    --color-brand-light: rgba(0, 191, 138, 0.1);

    /* ── 背景色 Background ── */
    --color-bg-layout: #F2F3F5;        /* 页面级背景，rgb(242,243,245) */
    --color-bg-container: #FFFFFF;     /* 卡片/面板 */
    --color-bg-elevated: #FFFFFF;      /* 浮层/下拉 */
    --color-bg-table-header: #F5F7FA;  /* 表头，rgb(245,247,250) */
    --color-bg-hover: #F7F8FA;         /* 行/项 hover，rgb(247,248,250) */
    --color-bg-disabled: #F3F4F5;      /* 禁用态，rgb(243,244,245) */
    --color-bg-panel-dark: #1A1C20;    /* 深色面板/数据大屏侧栏 */
    --color-bg-mask: rgba(134, 144, 156, 0.3); /* 遮罩 */

    /* ── 边框色 Border ── */
    --color-border: #E5E6EB;
    --color-border-brand: #00BF8A;

    /* ── 文字色 Text ── 实测频率排序 */
    --color-text-primary: #323335;     /* rgb(50,51,53)，count:4785 */
    --color-text-secondary: #4A4C4F;   /* rgb(74,76,79)，count:3329 */
    --color-text-tertiary: #4E5969;    /* rgb(78,89,105)，count:877 */
    --color-text-placeholder: #86909C; /* rgb(134,144,156)，count:122 */
    --color-text-disabled: #C9CDD4;    /* rgb(201,205,212)，count:24 */
    --color-text-inverse: #FFFFFF;
    --color-text-brand: #00BF8A;
    --color-text-icon: #8893AA;        /* rgb(136,147,170) */

    /* ── 语义色 Semantic ── */
    --color-success: #00BF8A;
    --color-warning: #FF7D00;
    --color-error: #F53F3F;
    --color-info: #165DFF;
    --color-success-bg: rgba(0, 191, 138, 0.08);
    --color-warning-bg: rgba(255, 125, 0, 0.08);
    --color-error-bg: rgba(245, 63, 63, 0.08);

    /* ── 排版 Typography ── 实测字体栈 */
    --font-sans: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
    --font-number: "dinFont", "Helvetica Neue", sans-serif; /* 大数字展示 */
    --font-size-xs: 12px;
    --font-size-sm: 13px;
    --font-size-base: 14px;   /* 绝对主导字号 */
    --font-size-md: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 32px;

    /* ── 间距 Spacing ── 实测高频值 */
    --space-1: 4px;
    --space-2: 8px;
    --space-2-5: 10px;     /* 最高频，count:1224 */
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;       /* count:362 */
    --space-6: 24px;
    --space-8: 32px;
    --space-item: 44px;    /* 列表项/行高，count:298 */

    /* ── 圆角 Radius ── 实测: 4px 主导 count:543 */
    --radius-xs: 2px;
    --radius-sm: 3px;
    --radius-md: 4px;
    --radius-lg: 6px;
    --radius-xl: 8px;
    --radius-full: 9999px;

    /* ── 阴影 Shadow ── 实测 */
    --shadow-sm: rgba(0, 21, 41, 0.08) 0px 1px 4px 0px;
    --shadow-md: rgba(0, 0, 0, 0.1) 0px 4px 10px 0px;    /* 主阴影 count:41 */
    --shadow-strong: rgba(0, 0, 0, 0.3) 0px 1px 3px 0px;
    --shadow-modal: rgba(0,0,0,0.2) 0px 8px 10px -5px,
                    rgba(0,0,0,0.14) 0px 16px 24px 2px,
                    rgba(0,0,0,0.12) 0px 6px 30px 5px;

    /* ── 过渡 Transition ── 实测 */
    --transition-interactive: border-color 0.3s, background-color 0.3s, color 0.3s;
    --transition-bg: background-color 0.3s;
    --transition-row: background-color 0.25s;  /* 表格行 */
    --transition-fast: 0.1s;
    --transition-transform: transform 0.3s;
  }
}
```

### tailwind.config.ts

```ts
import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: 'var(--color-brand-primary)',    // #00BF8A
          hover: 'var(--color-brand-primary-hover)',
          active: 'var(--color-brand-primary-active)',
          light: 'var(--color-brand-light)',
        },
        bg: {
          layout: 'var(--color-bg-layout)',
          container: 'var(--color-bg-container)',
          'table-header': 'var(--color-bg-table-header)',
          hover: 'var(--color-bg-hover)',
          disabled: 'var(--color-bg-disabled)',
          'panel-dark': 'var(--color-bg-panel-dark)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          placeholder: 'var(--color-text-placeholder)',
          disabled: 'var(--color-text-disabled)',
          inverse: 'var(--color-text-inverse)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          brand: 'var(--color-border-brand)',
        },
        semantic: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          error: 'var(--color-error)',
          info: 'var(--color-info)',
        },
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', '"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'Arial', 'sans-serif'],
        number: ['"dinFont"', '"Helvetica Neue"', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['13px', { lineHeight: '1.5' }],
        base: ['14px', { lineHeight: '20px' }],   // 实测主流 14/20
        md: ['16px', { lineHeight: '18.4px' }],
        lg: ['18px', { lineHeight: '1.5' }],
        xl: ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.4' }],
      },
      boxShadow: {
        sm: 'rgba(0, 21, 41, 0.08) 0px 1px 4px 0px',
        DEFAULT: 'rgba(0, 0, 0, 0.1) 0px 4px 10px 0px',
        strong: 'rgba(0, 0, 0, 0.3) 0px 1px 3px 0px',
        modal: 'rgba(0,0,0,0.2) 0px 8px 10px -5px, rgba(0,0,0,0.14) 0px 16px 24px 2px, rgba(0,0,0,0.12) 0px 6px 30px 5px',
      },
      borderRadius: {
        xs: '2px',
        sm: '3px',
        DEFAULT: '4px',
        lg: '6px',
        xl: '8px',
      },
      spacing: {
        '2.5': '10px',
        'item': '44px',
      },
      transitionProperty: {
        'interactive': 'border-color, background-color, color',
      },
    },
  },
} satisfies Config
```

---

## 步骤四：生成演示页面

生成一个独立 HTML 文件。在动手编写任何组件之前，**必须先确认并应用以下强制布局规范**，这些规范优先于所有其他设计偏好。

---

### 强制布局规范（必须在页面生成前确认）

#### 图标系统（严禁违反）

- **严禁使用任何 emoji 作为图标**，包括导航图标、KPI 区图标、按钮图标、状态指示符、操作按钮。
- 必须使用 **inline SVG `<symbol>` + `<use href="#id">` 精灵图模式**：
  - 在 `<body>` 顶部放置一个 `<svg style="display:none" aria-hidden="true">` 精灵块
  - 在精灵块内用 `<symbol id="i-xxx" viewBox="0 0 16 16">` 定义所有图标
  - 使用时写 `<svg width="16" height="16"><use href="#i-xxx"/></svg>`
- **严禁把 `fill`/`stroke`/`stroke-width`/`stroke-linecap`/`stroke-linejoin` 等属性写在 `<symbol>` 标签上**。这些 presentation attributes 不会通过 `<use>` 的 shadow DOM 向下继承，子元素将回退为 SVG 默认值（`fill: black; stroke: none`），导致图标显示为实心黑块或完全不可见。
- 必须把 `fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"` 分别写在每个 `<path>` / `<circle>` / `<line>` / `<rect>` 子元素上，不得依赖 `<symbol>` 继承。
- 图标颜色通过父元素 `color` 属性驱动，不得在 symbol 内硬编码颜色值。

#### 侧边导航（默认浅色，不得随意改为深色）

- **必须默认使用浅色侧边栏**：`background: #FFFFFF`，`border-right: 1px solid var(--color-border)`
- **严禁把 `--color-bg-panel-dark: #1A1C20` 用作主导航侧边栏背景**。深色面板令牌仅用于以下场景：
  - 数据大屏（全屏暗色看板）
  - 页面内的"深色面板"组件演示区块
  - 用户在需求中明确要求深色侧边栏
- 侧边栏浅色激活态规范：
  - 激活项：`background: rgba(0,191,138,0.1)`，`color: #00BF8A`
  - 激活指示条：`position: absolute; left: 0; width: 3px; background: #00BF8A; border-radius: 0 2px 2px 0`（一级）；`width: 2px`（二三级）
  - 悬停态：`background: #F7F8FA`，`color: #323335`
  - 图标色：默认 `#8893AA`，激活 `#00BF8A`，悬停 `#4E5969`

#### 多级菜单（业务看板必须实现）

- 生成业务系统看板时，必须实现**至少 2 级、推荐 3 级**的导航菜单层级。
- 展开/收起通过 JavaScript `classList.toggle('open')` 控制，CSS 使用 `max-height` 过渡（`0 → auto值`，`transition: max-height 0.3s ease`）。
- 展开箭头必须使用 **chevron-down（朝下 ∨ 形）SVG 图标**，展开时通过 CSS `transform: rotate(180deg)` 旋转为朝上，`transition: transform 0.3s ease`，父元素具有 `.open` class 时应用旋转。严禁使用 `rotate(90deg)`（那是 chevron-right 图标的旋转量，两者不可混用）。
- 各级缩进规范：
  - 一级 group header：`padding: 0 16px`，`height: 36px`，带图标 + 文字 + 展开箭头
  - 二级 sub-item：`padding: 0 16px 0 40px`，`height: 32px`，`font-size: 13px`
  - 三级 sub-sub-item：`padding: 0 16px 0 56px`，`height: 30px`，`font-size: 12px`

#### 面包屑（位置与滚动行为）

- **Topbar** 必须 `position: sticky; top: 0; z-index: 100`，仅包含：全局搜索输入框 + 图标按钮区（刷新/通知）+ 用户信息区。Topbar 内**严禁放置面包屑**。
- **面包屑**必须作为可滚动内容区（`.page-content`）的**第一个子元素**，随页面内容一起滚动（不 sticky）。
- 面包屑条带规范：**透明无底色**（无 `background`、无 `border-bottom`），`height: 40px`，`padding: 0 20px`，左侧显示导航路径，右侧显示最后更新时间。面包屑视觉上应融入页面背景色（`--color-bg-layout: #F2F3F5`），不得有任何白色或有色底层。

---

### 区域 1 — 令牌展示

- **色板**：每个颜色令牌一个色块，显示令牌名 + 十六进制值
- **排版阶梯**：每个 font-size 展示一行中文示例文字，标注字号/行高/字重
- **间距/圆角/阴影**：可视化对比块

---

### 区域 2 — 核心组件

按 `references/components.md` 实现以下组件，必须包含所有状态：

| 组件 | 必须展示的状态 |
|------|--------------|
| 按钮 (Button) | default / hover / active / disabled，Primary + Secondary |
| 切换按钮组 | 按天/按月 style |
| 输入框 (Input) | default / focus / error / disabled |
| 下拉选择 (Select) | closed / open |
| 数据表格 (Table) | 表头 + 5行数据 + 汇总行，含货币列/数字列/状态列 |
| KPI 数据卡 | 4列布局，含数字/标题/SVG图标（不得用 emoji） |
| 标签 (Tag) | success / warning / error / default 四种 |
| Tabs | 激活/非激活 |
| 深色面板 | 作为页面内**独立演示区块**展示 `--color-bg-panel-dark` 的用法，不作为主导航 |

---

### 技术要求

- **纯内联 CSS**，不依赖任何外部库（含 Tailwind CDN）
- 允许使用原生 JavaScript 实现交互（菜单展开/折叠、Tab 切换、Toggle 按钮组）
- 所有颜色通过 `:root` 中的 CSS 变量引用，不出现硬编码色值
- 字体栈：`"Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif`
- 大数字使用 `font-family: var(--font-number)`
- 货币列：`$` 前缀 + 千位分隔符，如 `$1,842.25`
- 数字列：`font-variant-numeric: tabular-nums`
- 过渡动画：严格遵循实测值（行 hover `0.25s`，交互元素 `0.3s`）
- 圆角统一 `4px`（--radius-md）
- 阴影使用 `--shadow-md`

---

## 输出物清单

| 文件 | 内容 |
|------|------|
| `DESIGN.md` | Google Stitch 格式，每个令牌类别含三级规范 |
| `design-tokens.css` | 完整 CSS Custom Properties，含注释说明实测来源 |
| `tailwind.config.ts` | Tailwind CSS v4 主题，引用 CSS 变量 |
| `demo.html` | 独立演示页面，覆盖令牌展示 + 核心组件，严格遵守强制布局规范 |

---

## 参考文件

- `references/design-tokens.md` — 完整令牌规格（含实测来源说明）
- `references/components.md` — 组件状态矩阵和尺寸规格
