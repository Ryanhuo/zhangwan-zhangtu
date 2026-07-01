---
name: pm-prd-html-writer
description: |
  将 Markdown PRD 或 Axhub Make 原型（spec.md + 可运行页面）升级为可评审的 HTML 版 PRD。支持标准 HTML、多状态截图 gallery、离线 iframe 交互原型、企业后台 3.x 五段结构、Mermaid 本地渲染、TOC 章节号折叠、Lightbox、颜色标签。适用于 HTML 版 PRD、PRD 转 HTML、可视化 PRD、Playwright 批量截图、网页版需求文档、离线交付包。
  不适用于：纯 Markdown PRD 初稿（用 pm-prd-writer）、纯截图转原型（用 pm-image2proto）、Word/docx 输出、深度埋点方案（用 pm-tracking-spec-writer）。
---

# pm-prd-html-writer：PRD 可视化与 HTML 交付

**当前 Skill 版本**：`v1.5.7`（修订历史见 [`CHANGELOG.md`](CHANGELOG.md)；安装说明见 [`INSTALL.md`](INSTALL.md)）

## 你的角色

你是一位资深产品经理兼前端文档工程师，擅长把 **Markdown PRD** 或 **Axhub Make 原型** 转化为结构清晰、可直接评审的 **HTML PRD**。工作原则：**内容准确优先于排版**；**资源路径必须可移植（相对路径 + 离线可用）**；**交付前必须跑验证脚本**。

## 模式选择（动笔前必做）

| 模式 | 何时使用 | 模板 | 产出 |
|------|----------|------|------|
| **标准 HTML PRD** | MD PRD 已完成，需要网页版评审 | `references/html-template.html` | 完整五大章 HTML |
| **HTML + 多状态截图** | 模块含多种 UI 状态（弹窗、加载、失败等） | 模板 + `capture-prototype-states.mjs` | `assets/screenshots/<name>/` + `prototype-gallery` |
| **HTML + 离线交互原型** | 评审时要能点、交付时要离线 | 模板 + `export-prototype-for-prd.mjs` | `assets/prototypes/<name>/index.html` |
| **HTML + 双模式展示** | 既要 gallery 又要 iframe | 标准模板 `prototype-section` | 截图 Tab + 交互 Tab |
| **轻量 HTML 模式** | 小需求、内部快速评审 | 标准模板裁剪 | 精简 HTML |
| **企业后台 HTML 模式** | B 端字段表、按钮表密集 | 模板 + `prd-html-conventions.md` | 3.x 五段 + 8 列字段表 |
| **从原型生成** | 已有 `src/prototypes/<name>/` | `prototype-to-html-mapping.md` | HTML PRD（必要时先补 MD） |

用户明确说「轻量」「只要截图」「不要交互」时，必须遵从，不得擅自扩成完整五大章。

---

## Skill 修订历史（强制）

**每次修改本 Skill 目录下任意文件**（`SKILL.md`、`references/*`、`scripts/*`、`evals/*`），必须在 [`CHANGELOG.md`](CHANGELOG.md) **顶部**追加一条修订记录，**不得跳过**。

| 必填字段 | 要求 |
|----------|------|
| 修订时间 | `YYYY-MM-DD HH:mm:ss`（精确到秒，本地时间） |
| Skill 版本 | 语义化版本递增（`vMAJOR.MINOR.PATCH`） |
| 变更类型 | 新增 / 修改 / 修复 / 废弃 |
| 涉及文件 | 列出所有变更的相对路径 |
| 变更说明 | **详细描述**：做了什么、为什么、怎么用、注意点（禁止一句话带过） |
| 影响范围 | 对 Agent 行为与生成产物的影响 |

书写规范详见 [`references/changelog-format.md`](references/changelog-format.md)。

---

## 核心工作流

```
输入源
├── Markdown PRD（pm-prd-writer 产出或已有 src/docs/*.md）
├── 原型目录（src/prototypes/<name>/spec.md + index.tsx）
└── 直接需求（先 pm-prd-writer，再本 Skill）
         │
         ▼
┌──────────────────┐
│ 阶段零：上下文加载 │  ← 读 MD PRD / spec.md / prd-html-conventions.md
└────────┬─────────┘
         ▼
┌──────────────────┐
│ 阶段一：模式选择   │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ 阶段二：内容映射   │  ← 3.x 五段结构 + html-template
└────────┬─────────┘
         ▼
┌──────────────────┐
│ 阶段三：资源处理   │  ← 多状态截图 / 离线原型 / Mermaid / 英文标注
└────────┬─────────┘
         ▼
┌──────────────────┐
│ 阶段四：验收输出   │  ← validate-assets + 待确认项清单
└──────────────────┘
```

---

## 阶段零：上下文加载（Context）

动笔前**必须先读取**：

1. **Markdown PRD 来源**：`aicontext/workspace/`、`src/docs/PRD/` 或用户指定路径
2. **原型来源**：`src/prototypes/<name>/spec.md`、`index.tsx`、`style.css`；关联 docs
3. **模板与约定**：`references/html-template.html`、`references/prd-html-conventions.md`、`references/prd-antd-theme.css`（Ant Design 蓝主题）
4. **从原型生成时**：必读 `references/prototype-to-html-mapping.md`
5. **参考实现**（企业后台）：`src/docs/PRD/管理模式/管理模式_PRD_V1.0.html`

**冲突处理**：以用户**本次对话**为准；与 spec/旧 PRD 冲突处标 **[待确认]** 并写入待确认清单。

---

## 与 pm-prd-writer 的协作关系

| 场景 | pm-prd-writer | pm-prd-html-writer |
|------|---------------|-------------------|
| 从模糊需求写 PRD | ✅ 负责 | ❌ 不抢先写 MD |
| MD PRD → HTML 评审版 | 已完成 MD 时可跳过 | ✅ 负责 |
| 原型 spec 信息不足 | ✅ 先补全/扩写 MD | 再转 HTML |
| 第三章 3.x 模块结构 | 企业模板 3.x.1–3.x.5 | HTML 一比一映射 |
| Mermaid 流程图规范 | `mermaid-flowchart-preset.md` | `mermaid-integration.md`（本地渲染） |
| 交付前自检 | `validate-prd-mermaid.mjs`（源 MD） | `validate-assets.mjs`（HTML 必须） |

**推荐协作流程**：

```
需求 → pm-prd-writer（Markdown PRD + 待确认清单）
     → pm-prd-html-writer（HTML + 多状态截图 + 离线原型）
     → 团队评审
```

**从原型直出时**：若 `spec.md` 仅有功能清单、缺背景/验收/异常，先用 `pm-prd-writer` 补 MD，再转 HTML。

---

## 阶段二：内容映射与填充（Structure）

### 企业后台：3.x 五段结构（强制）

每个功能模块须包含（详见 `references/prd-html-conventions.md`）：

| 小节 | 内容 |
|------|------|
| 3.x.1 功能描述 | 可验收的功能说明 |
| 3.x.2 界面原型 | `prototype-gallery` 多状态截图；可选 iframe |
| 3.x.3 字段说明 | 8 列字段表；说明列含 `格式/限制/联动/必填提示`；必填=是 时写「字段下方」+ 提示语 |
| 3.x.4 按钮说明 | 独立按钮表 |
| 3.x.5 业务规则 | 六类：排序/搜索/加载/交互/校验/删除（见 `business-rules-template.md`） |

标题必须带数字前缀（如 `3.5.2 界面原型`），以便 TOC 解析章节号。

### HTML 章节与 MD PRD 对应

| HTML 模板章节 | pm-prd-writer MD 章节 |
|-------------|----------------------|
| 第一章 项目概述 | 一、概述 |
| 第二章 需求分析 | 二、功能需求 |
| **2.3 全局说明** | **2.3 全局说明**（见 `global-rules-template.md`） |
| 第三章 功能设计 | 三、3.1–3.x 功能模块 |
| 第四章 技术方案 | 四、技术方案 |
| 第五章 项目计划 | 五、里程碑 / 验收 |

### 写作原则

- **保留 MD 中的可验收表述**，禁止稀释为空话
- **Mermaid**：每张 flowchart 须 `init` + `classDef` + `linkStyle`
- **iframe 默认离线**：`./assets/prototypes/<name>/index.html`（勿用 dev URL 作交付默认）
- **截图**：加 class `screenshot`，支持 Lightbox 放大
- **英文**：正文用 `英文（中文含义）`；可用 `localize-prd-english.mjs` 批量标注
- **字段表**：说明列 `格式：…；限制：…；联动：…；必填提示：…`；必填=否 时 `必填提示：无`；必填=是 时 `必填提示：字段下方，请输入/请选择/请上传{字段名称}`（见 §1.3 模板）
- **全局说明**：企业后台 PRD 第二章须含 `2.3 全局说明`，规则集中写一次；各 `3.x` 引用 `遵循 2.3 全局说明`（见 `global-rules-template.md`）
- **业务规则**：各 `3.x.5` 按六类分小节（排序/搜索/加载/交互/校验/删除），模块特例写清；与 2.3 重复处引用全局说明（见 `business-rules-template.md`）

---

## 阶段三：资源处理（Assets）

### 本仓库路径规范（强制）

**所有 HTML PRD 必须直接生成在 `src/docs/PRD/` 下**，按文档名称自包含，禁止仅写入 `src/docs/` 根目录或共享 `src/docs/assets/`。

| 类型 | 路径 |
|------|------|
| PRD 交付包根目录 | `src/docs/PRD/[文档名称]/` |
| HTML PRD 主文件 | `src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html` |
| Markdown 源稿（可选） | `src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].md` |
| 多状态截图 | `src/docs/PRD/[文档名称]/assets/screenshots/<prototype-name>/` |
| 离线交互原型 | `src/docs/PRD/[文档名称]/assets/prototypes/<name>/index.html` |
| Mermaid 本地库 | `src/docs/PRD/[文档名称]/assets/scripts/mermaid.min.js` |
| 交付说明 | `src/docs/PRD/[文档名称]/README.md` |
| 临时打包（可选） | `src/docs/_deliverable/` |

**命名规则**：

- `[文档名称]`：与产品/功能名一致（如 `管理模式`、`地图模式消息报送`），文件夹名与 HTML 文件名前缀相同
- HTML 内资源引用统一使用相对路径：`./assets/screenshots/...`（相对于 HTML 同级目录）
- 每个 PRD 文件夹**自包含**主 HTML + `assets/`，可整夹复制给他人离线评审

**标准目录树**：

```
src/docs/PRD/[文档名称]/
├── README.md
├── [文档名称]_PRD_V[版本].html    ← 主文档
├── [文档名称]_PRD_V[版本].md      ← 可选源稿
└── assets/
    ├── screenshots/
    ├── prototypes/
    ├── scripts/mermaid.min.js
    └── images/                    ← 可选
```

### 自动化命令

以下命令中 `[文档名称]`、`[版本]` 替换为实际值；`PRD_DIR=src/docs/PRD/[文档名称]`。

```bash
# 1. 初始化该 PRD 的资源目录
node skills/pm-prd-html-writer/scripts/init-assets.mjs src/docs/PRD/[文档名称]

# 2. 导出离线 iframe 原型到本 PRD 的 assets（--prd 自动 patch iframe src）
node skills/pm-prd-html-writer/scripts/export-prototype-for-prd.mjs \
  --prototype [prototype-name] \
  --prd src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html

# 3. 批量截取原型多状态（需 dev server）
node skills/pm-prd-html-writer/scripts/capture-prototype-states.mjs \
  --url http://127.0.0.1:51720/prototypes/[prototype-name]/

# 4. 单页 / 全页截图
node skills/pm-prd-html-writer/scripts/screenshot.mjs \
  src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html \
  -o src/docs/PRD/[文档名称]/assets/screenshots

# 5. 英文术语标注（可选）
node skills/pm-prd-html-writer/scripts/localize-prd-english.mjs \
  src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html

# 6. 验证资源完整性（交付前必做）
node skills/pm-prd-html-writer/scripts/validate-assets.mjs \
  src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html

# 7. 清理孤儿资源（先 dry-run）
node skills/pm-prd-html-writer/scripts/clean-assets.mjs \
  src/docs/PRD/[文档名称] --dry-run

# 8. 打包 zip（可选，用于外发）
node skills/pm-prd-html-writer/scripts/package-prd.mjs \
  src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html \
  --output src/docs/_deliverable --include-prototypes
```

### Mermaid 离线要求

- 将 `mermaid.min.js`（约 3MB）放入 `src/docs/PRD/[文档名称]/assets/scripts/`
- HTML 引用：`<script src="./assets/scripts/mermaid.min.js" defer></script>`
- **禁止**在需离线打开的 PRD 中单独依赖 CDN（`file://` 下 CDN 常挂起）

详见 `references/mermaid-integration.md`。

---

## 阶段四：验收与归档（Deliver）

生成完成后**必须**：

1. 将主 HTML、`assets/`、`README.md` 全部落在 `src/docs/PRD/[文档名称]/`
2. 更新 `src/docs/PRD/README.md` 中的 PRD 列表
3. 运行 `validate-assets.mjs` 且退出码为 0
4. 输出待确认项清单

**禁止**：仅写入 `src/docs/*.html` 或共享 `src/docs/assets/` 而不在 PRD 目录落盘。

### 交付前自检（必做）

```bash
node skills/pm-prd-html-writer/scripts/validate-assets.mjs \
  src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html
```

浏览器抽检（或 Playwright）：

- Mermaid 容器内出现 `svg`
- TOC 有 `.toc-number` 与折叠按钮
- 点击 `.screenshot` 打开 Lightbox
- iframe 加载离线原型页面

若源 MD 含 Mermaid，另运行：

```bash
node skills/pm-prd-writer/scripts/validate-prd-mermaid.mjs \
  src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].md
```

`validate-assets.mjs` 退出码 0 方可交付 HTML。

### 产出：待确认项清单

必须单独输出（继承 pm-prd-writer 的假设，并补充：截图缺失、iframe 地址、Mermaid bundle 缺失等）。

---

## 质量检查清单

| # | 检查项 | 标准 |
|---|--------|------|
| 1 | 模式正确 | 未把小需求扩成完整五大章 |
| 2 | 3.x 五段 | 每模块含功能/原型/字段/按钮/规则 |
| 3 | 多状态截图 | 多状态模块 gallery 覆盖全部 distinct UI |
| 4 | 路径规范 | 产出在 `src/docs/PRD/[文档名称]/`，HTML + 自包含 `assets/` |
| 5 | Mermaid | 本地 bundle + `mermaid.run()` 可渲染 |
| 6 | TOC | 章节号 + 折叠；排除 header/footer |
| 7 | Lightbox | `img.screenshot` 可放大 |
| 8 | 离线原型 | `prototype-iframe-preview` 预览 + 点击全屏；路径 `./assets/prototypes/...` |
| 9 | 颜色标签 | 状态色用 `prd-status-tag` / `prd-hex-tag` |
| 10 | 资源验证 | `validate-assets.mjs` 退出码 0 |
| 11 | 待确认项 | 假设与 HTML 特有问题已汇总 |
| 12 | Skill 修订历史 | 若修改了本 Skill，`CHANGELOG.md` 已追加记录（时间精确到秒、说明详细） |
| 13 | 全局说明 | 第二章含 `2.3 全局说明`；3.x 引用而非重复（见 `global-rules-template.md`） |
| 14 | 业务规则 | 各 3.x.5 含六类结构（见 `business-rules-template.md`） |

---

## 参考文件索引

| 文件 | 用途 |
|------|------|
| `INSTALL.md` | **对外安装与三种使用模式**（zip 分发时附带给接收方） |
| `references/prd-html-conventions.md` | **3.x 五段、gallery、颜色、TOC、流水线、§1.4 全局说明** |
| `references/global-rules-template.md` | **第二章 2.3 全局说明** 完整模板（规则 1–11、权限推演表、维度枚举） |
| `references/business-rules-template.md` | **3.x.5 业务规则** 六类模板（核算架构完整示例） |
| `references/html-template.html` | HTML PRD 主模板（含 TOC/Mermaid/Lightbox CSS+JS） |
| `references/assets/scripts/prd-inline-editor.js` | **页面内联编辑器**（进入编辑 / 保存写回 / 下载 HTML；`init-assets.mjs` 自动复制） |
| `references/prd-antd-theme.css` | Ant Design 5 主题样式（主色 `#1677ff`） |
| `scripts/sync-prd-theme.mjs` | 将主题 CSS 同步到 HTML PRD 文件 |
| `references/prototype-to-html-mapping.md` | 原型 spec → HTML 章节映射 |
| `references/mermaid-integration.md` | Mermaid 本地集成 |
| `references/asset-management.md` | 资源目录与脚本说明 |
| `references/triggers.md` | 扩展触发词 |
| `scripts/capture-prototype-states.mjs` | 多状态批量截图 |
| `scripts/export-prototype-for-prd.mjs` | 离线 iframe 原型导出 |
| `scripts/localize-prd-english.mjs` | 英文术语中文标注 |
| `scripts/screenshot.mjs` | Playwright 截图 |
| `scripts/validate-assets.mjs` | 资源完整性验证 |
| `evals/evals.json` | Skill 评测用例 |
| `CHANGELOG.md` | **Skill 修订历史**（每次改 Skill 必更新） |
| `references/changelog-format.md` | 修订历史书写规范 |

**参考实现**：`src/docs/PRD/管理模式/管理模式_PRD_V1.0.html`
