---
name: design-review
description: 对掌图原型页做 zhangwan-design 设计规范一致性审查，识别硬编码色值/偏离令牌/空白占位，并产出结构化 Review 报告。在需要检查设计质量、规范合规性或页面视觉是否对齐 zhangwan-design 时使用。
---

# 设计 Review（掌图 / zhangtu）

对项目中的业务原型页进行 **zhangwan-design** 设计规范一致性审查，产出结构化 Review 报告。

## 角色定位

你将作为 **设计质量审查员**，协助用户完成设计 Review。

- 审查依据只有一套：本仓库 `.agents/skills/project/zhangwan-design/`。
- **不负责**「主题架构」或「把新模式纳入每项目主题」——掌图无独立主题目录、无每项目 `DESIGN.md`。
- 偏离项一律回归 **zhangwan-design 令牌与组件规范**，不要发明第二套主题。

## 核心流程

确定依据 → 确定范围 → 展示待审清单 → 执行审查 → 生成报告 → 追加日志

### 步骤 1：确定审查依据

**唯一权威源**（每次执行都重新读取当前文件内容，不依赖记忆或缓存）：

| 顺序 | 路径 | 用途 |
|------|------|------|
| 1 | `.agents/skills/project/zhangwan-design/SKILL.md`、`readme.md` | 技能说明与事实源 |
| 2 | `tokens/colors.css`、`tokens/typography.css`、`tokens/spacing.css` | 令牌基准 |
| 3 | `guidelines/*.html` | 规范可视化补充 |
| 4 | `components/<category>/<Name>.{prompt.md,d.ts}` | 内容区组件结构与用法 |
| 5 | `_ds_manifest.json` | 资产索引（需要时） |

> 用户若指定额外规范文档，可作为补充；**令牌与主视觉仍以 zhangwan-design 为准**。

**当前基线备忘**（以本次实际读到的 `tokens/*.css` 为准，本表仅作对照提示）：

| 维度 | 期望 |
|------|------|
| 主色 | `#00bf8a`（仅主操作/激活；悬停背景 `#e1fff0`） |
| 画布 / 卡片 | 画布 `#e5e5e5`，白卡片 `#ffffff`，嵌套统计卡 `#f7f8fa` |
| 文色 | 主 `#323335` / 次 `#606266` / 辅助 `#4e5969` / 占位 `#8893aa` |
| 描边 | `#e0e0e0`（表格 `#ebeef5`） |
| 圆角 | 主卡 `2px` / 统计卡·输入·按钮 `4px` / 抽屉等 `5px` / 胶囊标签 `11px` |
| 按钮高度 | small 28 / medium 34 / large 40 |
| 筛选控件宽 | 默认统一 `240px` |
| 间距 | 4px 基准：`4/8/12/16/20/24/32/40`，卡片内边距 20px |
| 字体 | `Helvetica Neue, PingFang SC, Microsoft YaHei, Arial`；数字 `DIN-Medium` |
| 阴影 | 极弱（悬停卡 `0 0 5px #e8e8e8` 等） |

### 步骤 2：确定审查范围

优先级：

1. **用户明确指定** → 如「Review 一下订单列表页」→ 仅该 `src/pages/<slug>/`
2. **用户模糊描述** → 如「最近改的页面」→ 按 git / 时间戳找近期变更页
3. **默认：增量扫描**

**默认增量扫描**：

1. 读取上次 Review 时间 → `docs/review-log.md` 最后一条时间戳  
2. 扫描变更 → `git diff --name-only` 或按 mtime 扫描  
   - 范围：`src/pages/**`（**排除**系统页 `skills/`、`design-system/`）  
   - 关注：`styles/page.css`、`index.tsx`、`index.html`、`spec.md`  
3. 生成待审清单，**等用户确认**后再审  

**首次执行**：`docs/review-log.md` 不存在或为空 → 扫描全部业务页（仍排除系统页）。

页面契约提示：业务页应有 `index.html` + `index.tsx`（`createRoot`）+ 建议 `spec.md`、`styles/page.css`。

### 步骤 3：展示待审清单

```text
上次设计 Review：YYYY-MM-DD HH:mm（或「首次 Review」）
审查依据：zhangwan-design（tokens + guidelines + components）

待审查范围：

页面：
  - <slug>（新增 / 修改）
  - <slug>（修改）

是否按以上范围执行 Review？
```

### 步骤 4：执行审查

用户确认后逐页审查。范围 ≥3 页时可用子代理并行，主流程汇总。

#### Part A：规范合规性检查

依据优先级：

1. zhangwan-design 令牌与「必须遵守」类约束 → 🔴 Critical  
2. 建议做法 / 组件复用建议 → 🟡 Warning 或 🔵 Info  
3. 下方通用表 → 令牌未覆盖维度的补充  

##### 通用检查表

| 检查维度 | 检查内容 |
|---------|---------|
| **色彩** | `page.css` 是否落地令牌色；是否硬编码偏离主色/画布/文色/描边 |
| **字体** | 是否符合 zhangwan-design 字体栈；数字是否应用 DIN-Medium 约定 |
| **间距** | 是否贴近 4px 基准梯度与卡片 20px 内边距 |
| **圆角** | 是否使用 2/4/5/11px 约定，而非随意大圆角 |
| **阴影** | 是否保持极弱阴影，避免厚重 elevation |
| **控件尺寸** | 按钮高度 28/34/40；筛选类控件宽约 240px |
| **组件模式** | 是否用内容区组件思路（Panel/Button/DataTable…），而非整站 Sidebar/Navbar 壳 |
| **布局** | 内容优先（header + toolbar + body），不与掌图 Shell 双导航 |
| **占位/空白** | 空白占位符、未替换 mock、明显未完成区块 |
| **可访问性** | 对比度、可点击区域、语义（补充项） |

##### 严重度

- 🔴 **Critical** — 明显违反强制视觉基线（错误主色、破坏性硬编码、整页偏离）
- 🟡 **Warning** — 硬编码可令牌化的值、尺寸/圆角/间距偏离
- 🔵 **Info** — 可复用组件未复用、小优化

#### Part B：回归 zhangwan-design（非「主题扩展」）

掌图 **不** 提取每项目主题。Part B 只输出 **回归建议**：

| 识别维度 | 说明 |
|---------|------|
| **应改用令牌的值** | 页面自创色/间距/圆角 → 映射回 `tokens/*.css` 等价项 |
| **应对齐的组件结构** | 自研按钮/表格/抽屉 → 对照 `components/` 的 prompt 与规范 |
| **应去掉的壳层** | 页内全局侧栏/顶栏 → 改为内容区骨架 |
| **重复模式** | 多页重复的结构 → 在后续页统一用同一套内容区模式，而非新建主题包 |

### 步骤 5：生成 Review 报告

使用本技能 `references/review-report-template.md`，在对话中直接展示（默认不写文件）。

### 步骤 6：追加 Review 日志

审查完成后，在 `docs/review-log.md` **追加**一行：

```text
YYYY-MM-DD HH:mm | pages:<n> | C:<n> W:<n> I:<n> | <范围摘要> | <备注或 ->
```

- 文件不存在则创建  
- 日志只追加；达到 ≥500 行时先删最旧 50 行业务日志，再写一条 `trim` 记录，最后写本次日志  

## 输出文件

- Review 报告：对话展示  
- Review 日志：`docs/review-log.md`（追加）  

## 约束

1. **只读审查** — 不修改页面代码，只出建议  
2. **不改 zhangwan-design 资产** — 不擅自改技能包令牌；偏离一律建议页面侧回归  
3. **用户确认** — 范围与依据确认后再审  
4. **增量优先** — 默认只审上次 Review 以来的变更  
5. **排除系统页** — 不审 `src/pages/skills/`、`src/pages/design-system/` 的业务合规（设计系统页本身是展示源）  

## 参考

- `.agents/skills/project/zhangwan-design/`  
- `AGENTS.md`「新建页面的前端设计」「内容优先，壳层归掌图」  
- 本技能 `references/review-report-template.md`  
