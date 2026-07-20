# 设计 Review 报告（掌图 / zhangtu）

## 审查摘要

| 项目 | 内容 |
|------|------|
| **审查时间** | YYYY-MM-DD HH:mm |
| **审查范围** | （列出 `src/pages/<slug>/` 业务页，不含 skills/design-system） |
| **审查依据** | zhangwan-design：`tokens/{colors,typography,spacing}.css` + guidelines + components（注明已读当前文件） |
| **上次 Review** | YYYY-MM-DD HH:mm（或「首次 Review」） |

### 统计

| 指标 | 数值 |
|------|------|
| 审查页数 | N |
| 🔴 Critical 问题 | N |
| 🟡 Warning 问题 | N |
| 🔵 Info 建议 | N |
| 回归 zhangwan-design 建议 | N |

---

## Part A：规范合规性问题

> 页面实现中不符合 zhangwan-design 的问题清单。

| # | 文件 | 问题描述 | 维度 | 严重度 | 建议修改 |
|---|------|---------|------|--------|---------|
| 1 | `src/pages/xxx/styles/page.css` | 主色使用硬编码 `#16a56f` 而非 `#00bf8a` / 品牌绿令牌 | 色彩 | 🔴 Critical | 对齐 `tokens/colors.css` 品牌绿 |
| 2 | `src/pages/yyy/styles/page.css` | 按钮高度 `32px` 不在 28/34/40 | 控件尺寸 | 🟡 Warning | 改为 medium 34 或 small 28 |
| 3 | `src/pages/zzz/index.tsx` | 页内实现全局 Sidebar，与掌图 Shell 双导航 | 布局 | 🔵 Info | 改为内容区 header + body |

---

## Part B：回归 zhangwan-design 建议

> 不创建每项目主题；将可统一的表现收敛回令牌与内容区组件规范。

| # | 类型 | 来源 | 描述 | 建议操作 |
|---|------|------|------|---------|
| 1 | 令牌映射 | `src/pages/xxx/styles/page.css` | 自创间距 `18px` 多处 | 改为 16 或 20（4px 基准） |
| 2 | 组件对齐 | `src/pages/yyy/index.tsx` | 自研表格交互 | 对照 `components/data/DataTable` 规范重组 |
| 3 | 壳层清理 | `src/pages/zzz/` | 顶栏 Logo + 系统切换 | 删除整站壳，保留业务内容 |

---

## 优先处理建议

1. **优先修复** 🔴 Critical（错误主色、严重偏离、破坏内容优先约定）  
2. **建议处理** 🟡 Warning（硬编码可令牌化、尺寸/圆角/间距）  
3. **统一回归** Part B 中多页重复的自创模式  
4. **后续跟进** 🔵 Info（优化与组件复用）  
