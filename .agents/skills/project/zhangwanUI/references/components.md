# 掌玩 UI 组件规范

> 通用组件规范，适用于掌玩旗下所有产品。色值来自 reference.css 实测数据。
> 品牌主色：`#00BF8A` | 主圆角：`4px` | 主阴影：`rgba(0,0,0,0.1) 0px 4px 10px 0px`

---

## 按钮 (Button)

### 尺寸

| 尺寸 | 高度 | 内边距 | 字号 |
|------|------|--------|------|
| small | 24px | 0 8px | 12px |
| default | 32px | 0 16px | 14px |
| large | 40px | 0 20px | 16px |

圆角统一 `4px`，过渡 `background-color 0.3s`。

### 状态矩阵

| 状态 | Primary | Secondary |
|------|---------|-----------|
| default | bg `#00BF8A`，text `#FFFFFF` | bg `#FFFFFF`，border `#E5E6EB`，text `#323335` |
| hover | bg `#00A87A` | border `#00BF8A`，text `#00BF8A` |
| active | bg `#009468` | border `#009468`，text `#009468` |
| disabled | bg `#F3F4F5`，text `#C9CDD4`，cursor: not-allowed | 同左 |
| loading | spinner + opacity 50% | — |

### 切换按钮组 (Toggle Group)

适用于"按天/按月"、"列表/卡片"等视图切换：
- 激活项：bg `#00BF8A`，text `#FFFFFF`，radius `4px`
- 非激活项：bg `#FFFFFF`，text `#4A4C4F`
- 容器：border `1px solid #E5E6EB`，内部无间隙

---

## 输入框 (Input / Select)

### 规格

- 高度：32px（default），24px（small），40px（large）
- 圆角：`4px`
- 字号：14px，placeholder `#86909C`
- 内边距：0 12px
- 过渡：`border-color 0.3s, background-color 0.3s, color 0.3s`

### 状态

| 状态 | 边框 | 背景 | 文字 | 额外 |
|------|------|------|------|------|
| default | `#E5E6EB` | `#FFFFFF` | `#323335` | — |
| hover | `#00BF8A` | `#FFFFFF` | — | — |
| focus | `#00BF8A` | `#FFFFFF` | — | `box-shadow: 0 0 0 2px rgba(0,191,138,0.1)` |
| filled | `#E5E6EB` | `#FFFFFF` | `#323335` | — |
| error | `#F53F3F` | `#FFFFFF` | — | 下方展示红色提示文字 |
| disabled | `#E5E6EB` | `#F3F4F5` | `#C9CDD4` | cursor: not-allowed |

### 下拉 (Select / Dropdown)

- 触发器：与 Input 相同外观，右侧 `▼` 箭头（`#86909C`）
- 展开时：箭头旋转 180°，过渡 `transform 0.3s`
- 下拉面板：bg `#FFFFFF`，shadow `rgba(0,0,0,0.1) 0px 4px 10px 0px`，radius `4px`
- 选项高度：44px，hover bg `#F7F8FA`
- 选中项：bg `rgba(0,191,138,0.1)`，text `#00BF8A`
- 搜索输入框集成在面板顶部（多选时）

### 日期选择器 (DatePicker)

- 触发器：Input 外观 + 日历图标（`#86909C`）
- 日期范围：`开始日期 — 结束日期` 格式
- 选中区间：bg `rgba(0,191,138,0.1)`，首尾日期 bg `#00BF8A`，text `#FFFFFF`

---

## 数据表格 (Data Table)

### 表头规格

- 背景：`#F5F7FA`（`rgb(245,247,250)`）
- 文字：14px，`#4E5969`，font-weight 500
- 高度：~50px
- Tooltip 图标（`?`）：`#8893AA`
- 排序图标（`↕`）：默认 `#C9CDD4`，激活 `#00BF8A`
- 边框：底部 `1px solid #E5E6EB`

### 数据行规格

- 行高：44px（实测，count:298）
- 分割线：`1px solid #E5E6EB`（仅底部）
- hover bg：`#F7F8FA`，过渡 `background-color 0.25s`（实测 count:1100）
- 选中行：bg `rgba(0,191,138,0.08)`，左侧 `2px solid #00BF8A`

### 列类型规范

| 类型 | 对齐 | 格式 | 字色 |
|------|------|------|------|
| 文字列 | 左对齐 | 直接输出 | `#323335` |
| 数字列 | 右对齐 | 千位分隔符，`font-variant-numeric: tabular-nums` | `#4A4C4F` |
| 货币列 | 右对齐 | `$` 前缀 + 千位分隔符，如 `$1,842.25` | `#4A4C4F` |
| 百分比列 | 右对齐 | `%` 后缀，正增长 `#00BF8A`，负增长 `#F53F3F` | 按值着色 |
| 高亮数字 | 右对齐 | 异常/关注值 | `#00BF8A` |
| 状态列 | 居中 | Tag 组件 | — |
| 操作列 | 居中/右对齐 | 文字按钮，`#00BF8A` | — |

### 特殊行

- **汇总行**（"汇总"/"总计"）：bg `#F5F7FA`，font-weight 600，top border `2px solid #E5E6EB`
- **展开子行**：缩进 `16px`，bg `#F7F8FA`，text `#4E5969`

### 工具栏

- 右上角标准配置：`≡ 自定义列`、`↑ 导出`（白底 border 按钮）
- 左上角视图切换：Toggle Group（按天/按月 等）

### 空状态

- 图标：SVG，64px，`#C9CDD4`
- 主文字：14px，`#86909C`，"暂无数据"
- 容器最小高度：240px

---

## KPI 数据卡 (Metric Card)

- 背景：`#FFFFFF`，圆角 `4px`，padding `20px`
- 布局：flex，title 行 + 数字行 + （可选）环比行
- 标题：14px，`#4E5969`，右侧 `?` 图标（`#8893AA`）
- 数字：20–24px，`#323335`，font-weight 500，`font-family: var(--font-number)`
- 图标区（可选）：圆形彩色背景（各业务线独立色），白色 SVG，~20px
- 环比指标：正增长 `#00BF8A`，负增长 `#F53F3F`，12px

### 网格布局

- 通常 4 列，gap `20px`
- 响应式：≤768px 时 2 列，≤480px 时 1 列

---

## 标签 (Tag / Badge)

| 变体 | 背景 | 文字色 | 圆角 |
|------|------|--------|------|
| success | `rgba(0,191,138,0.1)` | `#00BF8A` | 2px |
| warning | `rgba(255,125,0,0.1)` | `#FF7D00` | 2px |
| error | `rgba(245,63,63,0.1)` | `#F53F3F` | 2px |
| default | `#F3F4F5` | `#4A4C4F` | 2px |
| outline | transparent | `#4A4C4F` | 2px，border `1px solid #E5E6EB` |

- 高度：22px，内边距：0 8px，字号：12px

---

## Tabs 标签页

- 激活 Tab：text `#00BF8A`，底部 `2px solid #00BF8A`
- 非激活 Tab：text `#4A4C4F`，hover text `#00BF8A`
- 切换动画：`0.3s`
- 容器底部：`1px solid #E5E6EB`

---

## 深色面板 (Dark Panel)

适用于侧边导航、数据大屏侧栏、深色卡片等场景：

- 背景：`#1A1C20`
- 主文字：`rgba(255,255,255,0.85)`
- 次文字：`rgba(255,255,255,0.55)`
- 分割线：`rgba(255,255,255,0.08)`
- 激活文字：`#00BF8A`
- 激活背景：`rgba(0,191,138,0.1)`
- 过渡：`border-color 0.3s, background-color 0.3s, color 0.3s`

---

## 弹窗 / 抽屉 (Modal / Drawer)

- 遮罩：`rgba(134,144,156,0.3)`，出现 `opacity 0.12s ease-out`
- 容器阴影：`rgba(0,0,0,0.2) 0px 8px 10px -5px, rgba(0,0,0,0.14) 0px 16px 24px 2px, rgba(0,0,0,0.12) 0px 6px 30px 5px`
- 圆角：`8px`（弹窗），`0`（全屏抽屉）
- 关闭动画：`rtl-drawer-out 0.3s ease`
- 内边距：`20px`

---

## 分页 (Pagination)

- 按钮尺寸：32×32px，圆角 `4px`
- 激活页：bg `#00BF8A`，text `#FFFFFF`
- 非激活页：bg `#FFFFFF`，border `#E5E6EB`，text `#323335`
- hover：border `#00BF8A`，text `#00BF8A`
- 每页数量选择器：Select 组件，宽度 ~100px
- 过渡：`border-color 0.3s, background-color 0.3s, color 0.3s`

---

## 加载态 (Loading)

- Spinner 颜色：`#00BF8A`
- 旋转：`loading-rotate 2s linear infinite`
- 描边动画：`loading-dash 1.5s ease-in-out infinite`
- 全屏 loading 遮罩：`rgba(134,144,156,0.3)`

---

## 面包屑 (Breadcrumb)

- 字号：14px
- 当前页：`#323335`，不可点击
- 历史页：`#4E5969`，hover `#00BF8A`
- 分隔符：`>` 或 `›`，颜色 `#86909C`

---

## 通用布局规范

### 页面层级

```
Layout bg (#F2F3F5)
└── Container bg (#FFFFFF) — 卡片/面板
    └── Elevated bg (#FFFFFF) — 下拉/浮层
```

### 常用间距

- 页面内边距：`20px`（实测 count:362）
- 卡片内边距：`20px`（标准）
- 组件间 gap：`10px`（实测 count:1224）
- 行内元素间距：`4–8px`

### 边框规则

- 标准边框：`1px solid #E5E6EB`
- 组件仅在需要区分层级时才使用边框，平铺内容区避免过多边框
