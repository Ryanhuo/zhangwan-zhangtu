# pm-prd-html-writer 安装与使用指南

**Skill 版本**：`v1.5.7`  
**适用对象**：想把 Markdown PRD 或原型升级为可评审 HTML 文档的 Cursor / Claude Code 用户

---

## 这是什么

`pm-prd-html-writer` 是一个 **Agent Skill**（AI 工作流包），不是独立桌面软件。它包含：

| 内容 | 作用 |
|------|------|
| `SKILL.md` | 教 AI 如何生成 HTML PRD |
| `references/` | HTML 模板、样式约定、Mermaid 集成说明 |
| `scripts/` | Node.js 自动化脚本（初始化目录、验证、截图、打包等） |

解压后需要装进 **支持 Agent Skills 的 AI 环境**（Cursor 或 Claude Code），由 AI 读取并执行。

---

## 环境要求

### 必须

| 项目 | 要求 |
|------|------|
| AI 环境 | Cursor 或 Claude Code（或其他兼容 Skills 的 Agent 产品） |
| Node.js | 18 或更高版本（运行 `scripts/` 时需要） |

### 按需

| 项目 | 何时需要 |
|------|----------|
| Playwright | 使用自动截图（`screenshot.mjs`、`capture-prototype-states.mjs`）时 |
| `mermaid.min.js` | HTML PRD 含流程图且需**离线**打开时（约 3MB，需自行下载） |
| 完整 Axhub Make 仓库 | 使用「从原型导出离线 iframe」时 |

---

## 安装步骤

### 1. 获取 Skill 包

将 `pm-prd-html-writer` 文件夹打成 zip 分享，或从仓库复制整个目录：

```
pm-prd-html-writer/
├── SKILL.md
├── INSTALL.md          ← 本文件
├── CHANGELOG.md
├── references/
├── scripts/
└── evals/
```

### 2. 解压到 Skills 目录

根据你使用的工具，选择以下**一种**安装位置：

**Cursor — 个人全局（所有项目可用）**

```
~/.cursor/skills/pm-prd-html-writer/
```

Windows 示例：`C:\Users\<用户名>\.cursor\skills\pm-prd-html-writer\`

**Cursor — 仅当前项目**

```
<你的项目>/.cursor/skills/pm-prd-html-writer/
```

**Claude Code**

```
~/.claude/skills/pm-prd-html-writer/
```

**Axhub Make 仓库（本仓库）**

```
<仓库根>/skills/pm-prd-html-writer/
```

项目已配置 `skills/` 为技能目录时，无需额外设置，对话中直接描述任务即可。

### 3. 验证安装

在 AI 对话中说：

> 用 pm-prd-html-writer，帮我把这份 Markdown PRD 转成 HTML 评审版

若 Agent 能读取 `SKILL.md` 并按模板生成 HTML，说明安装成功。

---

## 三种使用模式

按你的环境和需求选择：

### 模式 A：仅 AI 生成（最低门槛）

**适合**：任意项目，有 Markdown PRD，不需要自动截图。

1. 安装 Skill 到 Cursor / Claude Code
2. 提供 Markdown PRD 内容或文件路径
3. 让 AI 按 `references/html-template.html` 生成 HTML

**产出建议**：HTML 与 `assets/` 放在同一文件夹，保持相对路径自包含：

```
my-prd/
├── 产品_PRD_V1.0.html
└── assets/
    ├── screenshots/
    ├── prototypes/      （可选）
    └── scripts/
        └── mermaid.min.js   （含流程图时放入）
```

### 模式 B：AI + 基础脚本（推荐）

**适合**：需要初始化目录、验证资源、打包 zip。

1. 完成模式 A 的安装
2. 确保已安装 Node.js 18+
3. 用脚本辅助（路径可自定义，不必是 `src/docs/PRD/`）：

```bash
# 初始化资源目录（将 ./my-prd 换成你的 PRD 文件夹）
node <skill路径>/scripts/init-assets.mjs ./my-prd

# 交付前验证（必须通过，退出码 0）
node <skill路径>/scripts/validate-assets.mjs ./my-prd/产品_PRD_V1.0.html

# 打包 zip 外发（可选）
node <skill路径>/scripts/package-prd.mjs ./my-prd/产品_PRD_V1.0.html --output ./deliverable
```

`<skill路径>` 示例：

- Cursor 全局：`~/.cursor/skills/pm-prd-html-writer`
- 本仓库：`skills/pm-prd-html-writer`

### 模式 C：完整 Axhub Make 工作流

**适合**：在本仓库内，从 `src/prototypes/` 原型导出截图、离线 iframe、多状态 gallery。

额外依赖：

- 完整 aipn / Axhub Make 仓库（含 `src/prototypes/`、`admin/html-template.html`、项目 `node_modules`）
- 本地 dev server（截图时，如 `http://127.0.0.1:51720/prototypes/<name>/`）
- Playwright

标准产出路径（本仓库约定）：

```
src/docs/PRD/[文档名称]/
├── README.md
├── [文档名称]_PRD_V[版本].html
└── assets/
    ├── screenshots/
    ├── prototypes/
    └── scripts/mermaid.min.js
```

详细命令见 `SKILL.md` 阶段三「自动化命令」。

---

## 页面内联编辑

生成的 HTML PRD 自带**页面内编辑**能力，评审时可直接在浏览器里改文字，无需回 IDE 手改 HTML。

### 功能说明

页面顶部工具栏提供三个操作：

| 按钮 | 作用 |
|------|------|
| **进入编辑** | 开启 `contenteditable`，标题、段落、列表、表格单元格等变为可编辑 |
| **保存** | 将修改写回项目中的 HTML 文件（需开发服务器支持） |
| **下载 HTML** | 将当前页面序列化为 HTML 文件并触发浏览器下载 |

**默认可编辑**：`h1`–`h6`、`p`、`li`、`td`、侧栏标题与版本号、`blockquote`

**自动跳过**（不可编辑）：Mermaid 流程图、原型 gallery / iframe、表头、TOC、脚本块、工具栏自身

**字段说明表校验**：识别表头含「字段名称」+「可修改」的 8 列字段表；「必填」「可修改」列进入编辑后只能填 **是** 或 **否**。生成时「说明」列建议写 `格式/限制/联动/必填提示` 四段；必填字段的 `必填提示` 须写「字段下方」+ 具体文案（如 `请输入编码`），详见 `prd-html-conventions.md` §1.3。

### 文件与初始化

| 文件 | 说明 |
|------|------|
| `references/assets/scripts/prd-inline-editor.js` | 编辑器源码（Skill 包内） |
| `assets/scripts/prd-inline-editor.js` | PRD 交付物中的副本 |
| `references/html-template.html` | 模板已引入 `<script src="./assets/scripts/prd-inline-editor.js" defer></script>` |

运行 `init-assets.mjs` 时会自动将编辑器复制到 PRD 的 `assets/scripts/`。

### 保存方式

编辑器通过 HTML 内的 `#prd-update-meta` 读取目标文件路径：

```html
<script type="application/json" id="prd-update-meta">
{
    "productName": "[项目名称]",
    "htmlFile": "src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html"
}
</script>
```

| 打开方式 | 保存行为 |
|----------|----------|
| **Axhub Make 开发服务器**（`http://127.0.0.1:51720/...`） | 点「保存」→ `PUT /api/html-file?path=...` 写回项目文件 |
| **其他 http/https 服务** + 自建 `/api/html-file` 接口 | 同上（需自行实现写文件 API） |
| **双击 HTML**（`file://`）或未配置 `htmlFile` | 「保存」改为**下载 HTML**，需手动覆盖原文件 |

> **对外分享注意**：仅拿 skill zip、没有开发服务器的用户，编辑后请用「下载 HTML」覆盖原文件；「保存」写回功能依赖服务端 API，不在 skill 包内。

### 本仓库开发环境

aipn 仓库的 Vite 插件 `vite-plugins/docsApiPlugin.ts` 提供 `/api/html-file` 接口。在本仓库启动 dev server 后，通过浏览器打开 PRD 页面即可直接保存到 `src/docs/PRD/...`。

### 使用步骤

1. 确保 HTML 已引入 `prd-inline-editor.js`，且 `assets/scripts/` 下有该文件
2. 生成 HTML 时填写正确的 `htmlFile` 路径（模板占位符需替换为实际值）
3. 用开发服务器打开页面（本仓库用户启动 `npm run dev` 即可）
4. 点「进入编辑」→ 修改内容 → 点「保存」
5. 若仅离线使用，改完后点「下载 HTML」覆盖原文件

---

## 可选依赖安装

### Playwright（自动截图）

```bash
npm install playwright
npx playwright install chromium
```

首次运行 `screenshot.mjs` 时，脚本也会尝试自动安装；网络受限时请手动执行上述命令。

### Mermaid 离线库

1. 从 [Mermaid 发布页](https://github.com/mermaid-js/mermaid/releases) 下载 `mermaid.min.js`
2. 放入 PRD 的 `assets/scripts/mermaid.min.js`
3. HTML 中引用：`<script src="./assets/scripts/mermaid.min.js" defer></script>`

详见 `references/mermaid-integration.md`。

> **注意**：Skill 包内不含 `mermaid.min.js`（体积约 3MB），需自行下载。

---

## 配套 Skill（推荐，非必须）

| Skill | 关系 |
|-------|------|
| `pm-prd-writer` | 先写 Markdown PRD，再转 HTML（推荐流水线） |
| `pm-image2proto` | 从截图快速生成可点原型，再嵌入 HTML PRD |
| `huashu-design` | 高保真 HTML 原型 / 演示，适合视觉要求高的模块 |

最小可用组合：**仅 `pm-prd-html-writer`** + 一份已有的 Markdown PRD。

---

## 非 Axhub 项目的路径说明

脚本默认假设 Skill 位于 `[仓库根]/skills/pm-prd-html-writer/scripts/`，默认文档目录为 `[仓库根]/src/docs/`。

若你把 Skill 装在 `~/.cursor/skills/`，**不要依赖默认路径**，始终在命令中传入你的 PRD 文件夹或 HTML 文件路径（见模式 B 示例）。

AI 生成 HTML 时，可明确告诉 Agent：

> 产出目录用 `./docs/my-feature/`，资源用相对路径 `./assets/...`

---

## 脚本能力速查

| 脚本 | 作用 | 最低依赖 |
|------|------|----------|
| `init-assets.mjs` | 创建 `assets/` 子目录结构 | Node.js |
| `validate-assets.mjs` | 检查资源引用完整性（交付前必跑） | Node.js |
| `package-prd.mjs` | 打包 zip 交付物 | Node.js |
| `localize-prd-english.mjs` | 英文术语加中文标注 | Node.js |
| `sync-prd-theme.mjs` | 同步 Ant Design 主题 CSS 到 HTML | Node.js |
| `screenshot.mjs` | Playwright 全页/分节截图 | Node.js + Playwright |
| `capture-prototype-states.mjs` | 原型多状态批量截图 | Node.js + Playwright + dev server |
| `export-prototype-for-prd.mjs` | 导出离线 iframe 原型 | **完整 Axhub Make 仓库** |
| `clean-assets.mjs` | 清理未引用资源 | Node.js |

---

## 交付前检查清单

- [ ] HTML 与 `assets/` 在同一 PRD 文件夹，相对路径可移植
- [ ] 含 Mermaid 时已放入本地 `mermaid.min.js`（离线场景）
- [ ] 运行 `validate-assets.mjs` 退出码为 0
- [ ] 浏览器双击 HTML 可正常打开（图片、TOC、Lightbox）
- [ ] 含 iframe 时离线原型路径为 `./assets/prototypes/...`
- [ ] `assets/scripts/prd-inline-editor.js` 存在（需页面内编辑时）
- [ ] `#prd-update-meta` 中 `htmlFile` 路径与实际文件一致（需保存写回时）
- [ ] 无敏感信息（密钥、内网地址等）

---

## 常见问题

### Q：解压后不能直接双击生成 PRD？

Skill 是给 AI 读的指令包，不是可执行程序。需要 Cursor / Claude Code 中的 Agent 来执行。

### Q：没有 Node.js 能用吗？

可以。AI 仍可生成 HTML；但无法运行验证、截图、打包等脚本。

### Q：截图脚本报 Playwright 错误？

```bash
npm install playwright
npx playwright install chromium
```

### Q：流程图不显示？

确认 `assets/scripts/mermaid.min.js` 存在，且 HTML 引用的是相对路径，不是 CDN（`file://` 打开时 CDN 常失败）。

### Q：`export-prototype-for-prd.mjs` 报错缺少 `admin/html-template.html`？

该脚本仅适用于 Axhub Make 完整仓库。非本仓库用户请用模式 A/B，手动嵌入原型或截图。

### Q：和 `pm-prd-writer` 有什么区别？

- `pm-prd-writer`：写 **Markdown** PRD 正文
- `pm-prd-html-writer`：把 MD 或原型 **转成 HTML 评审稿**（含截图 gallery、离线 iframe 等）

### Q：页面编辑后点「保存」没反应？

常见原因：

1. 用 `file://` 双击打开 — 请改用开发服务器，或点「下载 HTML」手动覆盖
2. `#prd-update-meta` 未配置 `htmlFile` — 补全路径后刷新页面
3. 非 aipn 项目 — 需自行实现 `PUT /api/html-file` 接口，否则只能用「下载 HTML」

---

## 更多文档

| 文件 | 内容 |
|------|------|
| `SKILL.md` | 完整工作流、模式选择、质量检查清单 |
| `references/prd-html-conventions.md` | 3.x 五段结构、TOC、颜色标签、§1.4 全局说明 |
| `references/global-rules-template.md` | 第二章 2.3 全局说明完整模板（规则 1–11） |
| `references/business-rules-template.md` | 3.x.5 业务规则六类模板（核算架构示例） |
| `references/html-template.html` | HTML PRD 主模板 |
| `references/asset-management.md` | 资源目录与命名规范 |
| `references/mermaid-integration.md` | Mermaid 离线集成 |
| `references/assets/scripts/prd-inline-editor.js` | 页面内联编辑器（进入编辑 / 保存 / 下载） |
| `CHANGELOG.md` | Skill 版本修订历史 |

---

## 获取帮助

- 在对话中 @ 本 Skill 或说明「按 pm-prd-html-writer 规范生成」
- 附上你的 Markdown PRD 或原型 `spec.md`
- 说明目标模式：轻量 HTML / 完整五大章 / 含截图 / 含离线 iframe
