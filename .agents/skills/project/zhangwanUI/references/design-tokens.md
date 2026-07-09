# 掌玩 UI 设计令牌基准

> **数据来源**：对掌玩真实产品页面的 CSS 计算样式进行系统提取，所有色值来自 `rgb()` 实测值。
> 本文件为权威基准，生成任何文档/代码时以此为准，不得使用估算值。

---

## 颜色系统 (Color System)

### 品牌色 / Brand

| 令牌 | CSS 变量 | 值 | 实测来源 |
|------|---------|-----|---------|
| brand-primary | `--color-brand-primary` | `#00BF8A` | `rgb(0,191,138)`，bg count:13，border count:585，text count:116 |
| brand-primary-hover | `--color-brand-primary-hover` | `#00A87A` | 基于主色加深 8% |
| brand-primary-active | `--color-brand-primary-active` | `#009468` | 基于主色加深 15% |
| brand-light | `--color-brand-light` | `rgba(0,191,138,0.1)` | `rgba(0,191,138,0.1)`，bg count:10，用于激活背景 |

### 背景色 / Background

| 令牌 | CSS 变量 | 值 | 实测来源 |
|------|---------|-----|---------|
| bg-layout | `--color-bg-layout` | `#F2F3F5` | `rgb(242,243,245)`，table/th/td，count:48 |
| bg-container | `--color-bg-container` | `#FFFFFF` | count:217，最高频，卡片/面板 |
| bg-elevated | `--color-bg-elevated` | `#FFFFFF` | 浮层/下拉/弹窗 |
| bg-table-header | `--color-bg-table-header` | `#F5F7FA` | `rgb(245,247,250)`，thead，count:4 |
| bg-hover | `--color-bg-hover` | `#F7F8FA` | `rgb(247,248,250)`，count:8 |
| bg-disabled | `--color-bg-disabled` | `#F3F4F5` | `rgb(243,244,245)`，count:8 |
| bg-panel-dark | `--color-bg-panel-dark` | `#1A1C20` | 深色面板/侧边栏（截图实测） |
| bg-mask | `--color-bg-mask` | `rgba(134,144,156,0.3)` | count:32，遮罩 |

### 文字色 / Text

> 实测文字色按出现频率排序。`#323335` 是绝对主色（4785 次），其余依次衰减。

| 令牌 | CSS 变量 | 值 | 实测来源 |
|------|---------|-----|---------|
| text-primary | `--color-text-primary` | `#323335` | `rgb(50,51,53)`，body 级，count:4785 |
| text-secondary | `--color-text-secondary` | `#4A4C4F` | `rgb(74,76,79)`，表格内容，count:3329 |
| text-tertiary | `--color-text-tertiary` | `#4E5969` | `rgb(78,89,105)`，辅助说明，count:877 |
| text-placeholder | `--color-text-placeholder` | `#86909C` | `rgb(134,144,156)`，count:122 |
| text-disabled | `--color-text-disabled` | `#C9CDD4` | `rgb(201,205,212)`，count:24 |
| text-inverse | `--color-text-inverse` | `#FFFFFF` | 深色背景上的文字 |
| text-brand | `--color-text-brand` | `#00BF8A` | 品牌色文字/链接，count:116 |
| text-icon | `--color-text-icon` | `#8893AA` | `rgb(136,147,170)`，图标专用色，count:24 |

### 边框色 / Border

| 令牌 | CSS 变量 | 值 | 来源 |
|------|---------|-----|------|
| border | `--color-border` | `#E5E6EB` | `rgb(229,230,235)`，来自 shadow divider 实测 |
| border-brand | `--color-border-brand` | `#00BF8A` | 激活态描边，count:585 |

### 语义色 / Semantic

| 令牌 | CSS 变量 | 值 |
|------|---------|-----|
| success | `--color-success` | `#00BF8A` |
| warning | `--color-warning` | `#FF7D00` |
| error | `--color-error` | `#F53F3F` |
| info | `--color-info` | `#165DFF` |
| success-bg | `--color-success-bg` | `rgba(0,191,138,0.08)` |
| warning-bg | `--color-warning-bg` | `rgba(255,125,0,0.08)` |
| error-bg | `--color-error-bg` | `rgba(245,63,63,0.08)` |

---

## 排版系统 (Typography)

### 字体栈

> 实测来源：`count:9169`，Helvetica Neue 排首位（非 PingFang SC）

```
--font-sans:   "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif
--font-number: "dinFont", "Helvetica Neue", sans-serif          ← 大数字展示专用
--font-chart:  PingFangSC-Regular, "PingFang SC"                ← 图表文字
--font-icon:   bi-icons, element-icons                          ← 图标字体
```

### 字号 + 行高

> 实测主导：**14px 是绝对主导字号**，覆盖 8000+ 元素

| 字号 | 行高 | 字重 | count | 典型用途 |
|------|------|------|-------|---------|
| 14px | 20px | 400 | 2223 | **默认正文**（最主要） |
| 14px | 20px | 500 | 160 | 强调正文、表单 label |
| 14px | 22px | 500 | 121 | 重要标签、标题 |
| 14px | 34px | 400 | 628 | 列表项（list item）行高 |
| 14px | 50px | 400 | 123 | 大尺寸容器内文字 |
| 16px | 18.4px | 400 | 147 | 小标题 |
| 16px | 50px | 500 | 55 | 大标题/主导航 |

### 字号变量

```
--font-size-xs: 12px
--font-size-sm: 13px
--font-size-base: 14px    ← 默认，最常用
--font-size-md: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 32px
```

---

## 间距系统 (Spacing)

> 间距不是严格的 4px 倍数体系，**10px 是实际最高频值**（count:1224）

| 令牌 | 值 | count | 主要用途 |
|------|-----|-------|---------|
| `--space-1` | `4px` | 44 | 图标间隙、微间距 |
| `--space-2` | `8px` | 30 | 小 gap |
| `--space-2-5` | `10px` | **1224** | **标准间距，最高频** |
| `--space-3` | `12px` | 128 | 输入框内边距 |
| `--space-4` | `16px` | 35 | 卡片内边距 |
| `--space-5` | `20px` | 362 | 区块/面板内边距 |
| `--space-item` | `44px` | 298 | 列表项高度、表格行高 |

---

## 圆角系统 (Border Radius)

> **4px 是绝对主导**（count:543），适用于输入框/按钮/卡片/图片等几乎所有组件

| 令牌 | 值 | count | 用途 |
|------|-----|-------|------|
| `--radius-xs` | `2px` | 15 | Tag、Badge |
| `--radius-sm` | `3px` | 16 | 小按钮变体 |
| `--radius-md` | `4px` | **543** | **默认，绝大多数组件** |
| `--radius-lg` | `6px` | 8 | 较大卡片/面板 |
| `--radius-xl` | `8px` | 7 | 大弹层 |
| `--radius-full` | `9999px` | — | 胶囊形 |

---

## 阴影系统 (Shadow)

> 实测来源于 box-shadow 频率统计

| 令牌 | 值 | count | 用途 |
|------|-----|-------|------|
| `--shadow-sm` | `rgba(0,21,41,0.08) 0px 1px 4px 0px` | 4 | 顶部栏、细微浮起 |
| `--shadow-md` | `rgba(0,0,0,0.1) 0px 4px 10px 0px` | **41** | **主阴影，下拉/悬浮面板** |
| `--shadow-strong` | `rgba(0,0,0,0.3) 0px 1px 3px 0px` | 5 | 强调阴影 |
| `--shadow-modal` | `rgba(0,0,0,0.2) 0px 8px 10px -5px, rgba(0,0,0,0.14) 0px 16px 24px 2px, rgba(0,0,0,0.12) 0px 6px 30px 5px` | 4 | 模态框/抽屉 |
| `--shadow-divider` | `rgb(229,230,235) 0px -1px 0px 0px` | 1 | 底部分割线阴影 |

---

## 过渡动画 (Motion)

> 实测来源于 transition 频率统计

| 令牌 | 值 | count | 用途 |
|------|-----|-------|------|
| `--transition-interactive` | `border-color 0.3s, background-color 0.3s, color 0.3s` | 57 | 按钮、菜单项、交互元素 |
| `--transition-bg` | `background-color 0.3s` | 41 | 单纯背景变化 |
| `--transition-row` | `background-color 0.25s` | 1100 | 表格行 hover |
| `--transition-opacity` | `opacity 0.12s ease-out` | 32 | 遮罩出现/消失 |
| `--transition-transform` | `transform 0.3s` | 28 | 展开箭头、折叠动画 |
| `--transition-fast` | `0.1s` | 24 | 快速点击反馈 |

### 动画关键帧

| 名称 | 参数 | 用途 |
|------|------|------|
| `loading-rotate` | 2s linear infinite | 加载旋转 |
| `loading-dash` | 1.5s ease-in-out infinite | 加载描边 |
| `rtl-drawer-out` | 0.3s ease | 抽屉关闭 |
