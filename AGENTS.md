# AGENTS.md

本项目是 `zhangwan-zhangtu` 内部原型系统，以 `zhangtu` 为唯一命名与执行入口，服务产品经理在本地绘制、标注、评审和管理多页面原型。

---

## 项目定位

- 本项目是**原型系统种子工程**，不是生产业务应用。
- 核心范围：本地页面发现、原型预览、需求锚点读取、版本（迭代）管理、通过 `proto-hub` 发布。
- **明确不在范围内**：远程权限、SSO、审计、远程存储、审批流——未经明确要求不要添加。
- 界面文案和文档以中文为主。

---

## 技术基线

| 技术 | 版本/说明 |
|------|-----------|
| Vite + React 18 + TypeScript (strict) | 多页面多入口构建 |
| antd + @ant-design/icons | 复杂交互控件兜底 |
| lucide-react | 通用图标 |
| zhangwan-design 设计系统 | 所有新页面的视觉规范，资产在 `.agents/skills/project/zhangwan-design/` |
| Node.js ESM | 所有脚本（`scripts/zhangtu/`）均为 ESM |

路径别名：`@` → `src`。全局样式：`src/styles/tokens.css`、`src/styles/app.css`。

---

## 目录结构

```
zhangwan-zhangtu/
├── src/
│   ├── pages/               # 原型页面（每个子目录是一个独立入口）
│   │   ├── skills/          # 系统内置技能页（勿删）
│   │   └── design-system/   # 系统内置设计系统浏览页（勿删）
│   ├── common/              # 共享组件：branding.ts, site-brand.tsx, zhangtu-requirement.tsx
│   ├── styles/              # 全局样式：tokens.css, app.css
│   ├── requirements/        # 全局需求源（需求先于原型，.md + frontmatter）
│   └── resources/           # 项目长期资料、模板、业务文档
├── scripts/
│   └── zhangtu/             # 所有工具脚本
│       ├── cli.mjs          # 统一 CLI 入口
│       ├── preview-server.mjs # 本地预览 HTTP 服务（默认端口 6320）
│       ├── shell.html       # 预览 Shell UI（侧边栏/工作流/版本管理/需求抽屉）
│       ├── discovery.mjs    # 页面发现
│       ├── doctor.mjs       # 项目健康检查
│       ├── iterations.mjs   # 版本/迭代管理
│       ├── page-library.mjs # 页面库（文件夹/排序持久化）
│       ├── proto-hub.mjs    # 发布组件（wraps proto-hub CLI）
│       └── skills.mjs       # 技能页后端（含 tier 分层）
├── .zhangtu/                # 本地生成状态（勿手改）
│   ├── iterations/          # 版本 JSON（itr_*.json）
│   ├── preview/             # 各版本预览 manifest
│   └── publish-config.json  # 发布配置（token、systemName）
├── docs/                    # 补充说明文档
├── zhangtu.capabilities.json # 框架侧 PM 能力清单（可被工作区覆盖）
├── CLAUDE.md                # Claude Code 专用指引
├── AGENTS.md                # 本文件
├── zhangtu.config.json      # 项目配置（title、theme、pageNameMap 等）
└── vite.config.ts           # 多入口 Vite 配置
```

---

## 页面契约

一个目录被识别为页面，**必须同时**存在：

- `index.html`：含 `<div id="root">` 和 `<script type="module" src="./index.tsx">`
- `index.tsx`：必须调用 `createRoot(...).render(...)`，是真实入口

约定 sidecar 文件（可选）：

| 文件 | 用途 |
|------|------|
| `spec.md` | 产品事实源；首个 `# 标题` 作为页面名 |
| `styles/page.css` | 页面级 CSS |
| `data/mock.ts` | Mock 数据 |
| `zhangtu.requirements.ts` | 需求模块（纯字面量数组，无 import；可 `{ ref }` 引用全局需求） |

保留子目录名（不会被识别为页面）：`assets`、`data`、`styles`、`node_modules`、`dist`。

新建页面**必须**遵循 zhangwan-design 设计规范——完整流程见下文「新建页面的前端设计：必须用 zhangwan-design」。

---

## 新建页面的前端设计：必须用 zhangwan-design

> 本节是自包含的，不依赖 `CLAUDE.md`。Codex 及任何遵循 AGENTS.md 的工具都以本节为准。

**zhangwan-design** 是本项目的设计系统（掌玩风格，高密度中文运营后台），权威资产在 `.agents/skills/project/zhangwan-design/`：事实源说明 `readme.md`、技能说明 `SKILL.md`、令牌 `tokens/{colors,typography,spacing}.css`、组件源码+类型+用法说明 `components/<category>/<Name>.{jsx,d.ts,prompt.md}`（`core`/`data`/`feedback`/`forms`/`navigation` 五类）、规范可视化卡片 `guidelines/*.html`、完整点击式 UI Kit `ui_kits/zhangwan-console/`、索引一切的 `_ds_manifest.json`。它是文档/参考，不被运行时页面 import——页面通过在自己的 `styles/page.css` 中落地 zhangwan-design 令牌来套用其视觉规范。可视化浏览入口见 `src/pages/design-system/`。

> ⚠️ **不要信任任何外部/全局同名技能或缓存定义。** 不同 AI 工具各自的个人技能库里，可能存在名字相似（如 `zhangwan-ui`）但内容完全无关的设计系统——按名调用可能静默拿到错误规范。**必须直接读取本项目 `.agents/skills/project/zhangwan-design/` 目录下的文件**作为唯一权威来源，不要依赖工具自带的技能检索机制按名匹配，也不要沿用已删除的旧 skill（`zhangwanUI`）的路径/文件名（`DESIGN.md`、`references/design-tokens.md`、`references/components.md`）或旧数值（如旧主色 `#16a56f`）。

**新建页面时一律按 zhangwan-design 设计系统设计前端。** 写页面实现前：

1. 直接读取 `.agents/skills/project/zhangwan-design/SKILL.md`、`readme.md`（事实源）、`tokens/colors.css`、`tokens/typography.css`、`tokens/spacing.css`（每次都读当前内容，不依赖记忆或缓存——该资产由用户持续维护更新），理解令牌基准。需要具体组件结构时读 `components/<category>/<Name>.prompt.md`（用法）与 `.d.ts`（props）。
2. 用 zhangwan-design 令牌设计页面并落到该页 `styles/page.css`。当前基线值（以第 1 步实际读到的 `tokens/*.css` 为准）：主色 `#00bf8a`（`--color-brand-green`，仅主操作/激活态；悬停/激活背景 `#e1fff0`）、画布 `#e5e5e5` + 白卡片 `#ffffff`（嵌套统计卡片 `#f7f8fa`）、正文主色 `#323335`/次要 `#606266`/辅助 `#4e5969`/占位 `#8893aa`、描边 `#e0e0e0`（表格 `#ebeef5`）、数据分类色青 `#02b8de`/粉 `#f2595c`（分类标签色，非情绪化成功/错误色）、遗留强调蓝 `#409eff`（仅顶级激活菜单文字，不要新用）、按钮高度 small 28/medium 34/large 40、筛选控件默认宽度统一 `240px`、间距 4px 基准（`4/8/12/16/20/24/32/40`，卡片内边距 20px）、圆角 `2px`（主卡片）/`4px`（统计卡/输入框/按钮）/`5px`（登录字段/抽屉）/`11px`（胶囊标签，唯一例外）、字体栈 `Helvetica Neue, PingFang SC, Microsoft YaHei, Arial`（数字统一用 `DIN-Medium`）、阴影极弱（悬停卡片 `0 0 5px #e8e8e8`、固定顶栏/侧栏 `0 1px 4px rgba(0,21,41,.08)`）。
3. 结构优先复用 `components/` 下的组件（核心：Button/Tag/Tabs/Panel/SectionTitle/LoadingBtn；数据：StatCard/DataTable/LineChart/ColumnChart/PieChart/RetentionTable/DownloadCenter/ColumnSettingsDialog/UpdateTime/PopoverTableCell；表单：Input/Select/DatePicker/Checkbox/RadioButtonGroup/InputNumberRange/InputMultTag/SelectTimezone；导航：SidebarNav/Navbar/Breadcrumb/FilterBar/Hamburger/ViewSet/SystemLink；反馈：Dialog/Drawer/Tooltip），可在 `src/pages/design-system/` 页面里直接看到每个组件的真实渲染效果。`antd` 仅用于该规范未覆盖的复杂交互控件，并对齐其令牌与密度。文案中文优先、专业克制、数据导向，绝不用表情符号或第一人称营销口吻。

仅当用户明确要求别的视觉风格/品牌时才偏离 zhangwan-design。

---

## 技能（Skills）：Codex 需手动读取并遵循

Claude Code 会自动加载 `.agents/skills/project/` 下的技能并按用户自然语言触发；**Codex 不会自动注入这些技能**，因此当用户的请求命中下表触发条件时，你必须**先读取对应目录的 `SKILL.md` 并严格按其流程执行**（每次读当前内容，不依赖记忆）。技能内容由用户持续维护，`SKILL.md` 是唯一权威。

**技能分层（第 4 期）**：`skills.mjs` 的 `SkillSummary` 带 `tier: "capability" | "ops"`。运维技能 slug 由 `OPS_SKILL_SLUGS` 判定（以 `.agents/skills/project/` 实际目录名为准，当前含 `zhangtu-installer`、`zhangtu-init-prototype-project` 等）。能力技能在技能页默认展开；运维技能收入「框架运维」分组且**默认折叠**。

| 技能目录（`.agents/skills/project/`） | 何时使用 |
|------|------|
| `zhangwan-design/` | 新建/改版任何页面前，必读（见上一节） |
| `zhangtu-link/` | 用户提到本地预览、页面发现、迭代/版本管理、"看看有哪些迭代""发布这个迭代给我链接"等——把请求转成最短的本地 `zhangtu` CLI 操作序列 |
| `zhangtu-init-prototype-project/` | 初始化/规范化掌图原型项目结构（多页面、可被页面发现识别） |
| `zhangtu-installer/` | "在这里安装掌图""初始化掌图工作区"等安装类请求 |
| `requirements-exploration/` | 用户**明确**要求做需求探索/需求细化，或要在动手做原型前产出确认过的需求文档 |
| `explore-options/` | 用户要多方案探索/多方案对比/先出方案/设计决策（在动手改一个方向前先给 2–3 个方向） |
| `screenshot-to-prototype/` | 用户**明确**要求把截图/设计稿还原成可运行原型（仅作参考图时不要触发） |
| `prd-generator/` | 用户要求基于页面实现 + `spec.md` 生成面向研发测试的结构化 PRD |
| `zw-prototype-annotation-v1.3/` | 生成 HTML 交互原型时需要评审标注层（编号角标 + 说明面板 + 可拖动弹窗） |

触发判断以各 `SKILL.md` 的 `description` 为准，不要凭目录名猜测；不确定是否命中时先向用户确认，不要自动触发。

---

## PM 工作流阶段编排

产品经理的完整闭环（需求描述澄清 → 原型侧落地 → 原型调整 → PRD 生成 → 版本管理）按流程阶段映射到权威功能文件的主索引见 [docs/pm-workflow-harness.md](docs/pm-workflow-harness.md)。该文件是「按阶段」组织的入口，与上面「按技能名」组织的表互补。两个易被忽略的阶段约定：

- **原型落地 · 历史系统导入**：参考旧系统真实页（如罗盘）、截图或旧导出原型来还原时，**只借结构与交互，视觉一律用 zhangwan-design 重做**，不迁移旧代码。规则见 [docs/legacy-prototype-import-guide.md](docs/legacy-prototype-import-guide.md)。
- **原型调整** 的默认顺序：先读该页 `spec.md` 与需求锚点（`zhangtu.requirements.ts`）定位改动 → 方向不明确时先用 `explore-options` 出 2–3 个方向并收敛 → 视觉回到 zhangwan-design 令牌 → 按 [docs/prototype-development-guide.md](docs/prototype-development-guide.md) 的边界与验收收尾。

能力地图与分期进度见 [docs/pm-capability-map.md](docs/pm-capability-map.md)。

---

## 架构：页面发现

`scripts/zhangtu/discovery.mjs` 是核心，遍历 `src/pages` 输出页面 JSON 模型。有两处独立消费方必须对"什么算页面"保持一致：

1. `vite.config.ts` → `collectPageInputs()` → Rollup 多入口构建
2. `scripts/zhangtu/discovery.mjs` → `walkPageRoots()` → CLI & 预览 Shell

**改页面识别规则时，三处都要同步**：`discovery.mjs`、`vite.config.ts`、`scripts/check-pages.mjs`。

---

## 架构：预览 Shell

`npm start` / `npm run dev` / `npm run zhangtu -- preview` 同时启动两个进程：

- **Vite 开发服务器**（默认端口 **51720**）：渲染实际页面
- **Shell HTTP 服务**（默认端口 **6320**）：承载 `shell.html` UI

Shell 提供：页面列表/文件夹树、**工作流**只读引导（四大块 + 贯穿层，数据来自 `manifest.capabilities`）、**技能**入口、**设计系统**入口、设备框、需求抽屉、版本管理、发布入口、iframe 容器。`shell.html` 是单 HTML 文件，修改后即时生效，无需重启。

系统页 `skills` / `design-system` 从常规页面列表拆出，在侧栏系统区单独展示（见 `preview-server.mjs` 的 `splitPreviewPages`）。

**版本预览**（`/iterations/:slug`）：Shell 以只读模式加载，仅显示该版本包含的页面；侧边栏隐藏技能、设计系统、工作流等系统入口；空文件夹（版本内无页面的文件夹）自动隐藏；顶栏显示版本名、编辑版本/发布/删除/返回项目按钮。

---

## 架构：版本管理

- 版本 = 迭代（iteration），以 JSON 持久化在 `.zhangtu/iterations/itr_*.json`。
- 版本包含：`id`、`name`、`slug`、`description`、`pageIds`、`pageSnapshots`（含 requirementModules）、`publishedAt`、`publishedMeta`。
- 创建/更新版本时，同步写 `.zhangtu/preview/<slug>/manifest.json`。
- 勿手动编辑 `.zhangtu/` 目录下文件。

---

## 架构：需求锚点

- `zhangtu.requirements.ts` 导出 `zhangtuRequirementAnnotations`（纯字面量数组，无 import，在 Node `vm` 沙箱执行，超时 1 秒）。
- 页面区域用 `data-zhangtu-requirement-anchor="<anchorId>"` 标记，用 `<RequirementBadge>` 渲染徽标。
- 徽标点击调用 `window.parent.openRequirementByAnchor(anchorId)` 打开需求侧栏；独立预览时静默忽略。
- **全局需求源（需求先于原型）**：需求事实源可上移到全局 `src/requirements/<分组>/<id>.md`（frontmatter `id/title/category/color/block/order` + Markdown 正文），一条需求可被多页面引用（一对多）。页面条目用 `{ ref: "<id>", anchorId, order }` 引用，`discovery.mjs` 从全局 `.md` 解析 title/正文/分类；**旧内联条目仍兼容**。坏 `ref` 在 `doctor` 的「需求源」检查报 warning。

## 架构：能力清单

- `zhangtu.capabilities.json`（框架侧单一事实源）列六条 PM 能力，`discovery.mjs` 的 `loadCapabilities()` 加载（工作区文件覆盖内置默认），进 manifest，随 `init`/`sync-system-files` 下发。PRD 能力 `defaultChannel = prd-generator`。详见 [docs/pm-capability-map.md](docs/pm-capability-map.md)。

## 架构：系统文件同步

- `npm run zhangtu -- sync-system-files` 从**当前安装的框架包**把框架自有路径镜像到当前工作区（覆盖本地）：`src/common`、`src/pages/skills`、`src/pages/design-system`、`.agents/skills/project`、`zhangtu.capabilities.json`。
- **不会**覆盖 `.agents/skills/imported`（用户导入技能）。
- **禁止在种子仓自身 cwd 上运行**：`rootDir === PACKAGE_ROOT` 时 CLI 直接中文报错退出，避免 `rm+cp` 同路径删光框架文件。

---

## Shell API 端点（preview-server.mjs）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/manifest` | 当前项目/版本 manifest（含 capabilities） |
| GET | `/api/project/pages` | 实时页面列表（用于版本页面选择） |
| GET/POST | `/api/page-library` | 页面库（文件夹结构持久化） |
| GET | `/api/versions` | 版本列表 |
| POST | `/api/versions` | 新建版本 |
| PUT | `/api/versions/:id` | 更新版本 |
| DELETE | `/api/versions/:id` | 删除版本 |
| POST | `/api/versions/:id/publish` | 发布版本（body 可含 changelog/prdFile/prdUrl） |
| PUT | `/api/versions/:id/requirements/:pageId` | 更新版本内页面需求快照 |
| GET | `/api/publish/status` | 读取发布配置和 proto-hub 可用状态 |
| POST | `/api/publish/config` | 保存发布配置（token、systemName） |
| GET | `/api/skills` | 技能列表（含 `tier`） |
| GET/DELETE | `/api/skills/:id` | 技能详情/删除 |

---

## 常用命令

```bash
npm install
npm start                                      # 启动掌图预览 Shell 并自动打开浏览器（主入口）
npm run dev                                    # 同 npm start（Shell :6320 + Vite :51720）
npm run dev:page                               # 仅裸 Vite，调试单个原型页时用
npm run build                                  # 生产构建
npm run typecheck                              # tsc --noEmit
npm run check:pages                            # 页面入口契约校验

# zhangtu CLI
npm run zhangtu -- inspect-pages --json        # 页面发现（查 slug、路径、诊断）
npm run zhangtu -- doctor                      # 项目健康检查（页面/迭代/需求源/文档引用）
npm run zhangtu -- list-iterations --json      # 列出所有版本
npm run zhangtu -- create-iteration "名称" "说明" "[页面引用?]"
npm run zhangtu -- update-iteration <id|slug|name> "新名称" "说明" "页面引用"
npm run zhangtu -- preview                     # 项目预览（Shell + Vite）
npm run zhangtu -- preview-iteration <id|slug|name>   # 特定版本预览
npm run zhangtu -- sync-system-files           # 从框架包同步系统文件到工作区（勿在种子仓自身运行）
```

---

## 验证要求

**交付前至少运行：**

```bash
npm run typecheck
npm run check:pages
npm run build
npm run zhangtu -- doctor
```

需要核对页面列表时再跑：`npm run zhangtu -- inspect-pages --json`。确保无错误、doctor 无 error，且页面列表与预期一致。

---

## 开发注意事项

1. **最小改动原则**：只改任务需要的部分，不顺手重构无关代码。
2. **页面发现三处同步**：改识别规则时，`discovery.mjs`、`vite.config.ts`、`check-pages.mjs` 三处同步修改。
3. **Shell 是单文件**：`shell.html` 包含全部 CSS/JS，修改后即时生效，无需重启 Vite。
4. **需求 sidecar 约束**：`zhangtu.requirements.ts` 必须是无 import 的纯字面量文件，否则 vm 沙箱执行会失败。
5. **zhangwan-design 优先，且必须读本项目文件**：新建页面必须先读取本项目 `.agents/skills/project/zhangwan-design/` 下的令牌基准与组件规范（`SKILL.md`、`readme.md`、`tokens/*.css`、`components/`）再动手实现，每次都读取当前文件内容、不依赖记忆或缓存——该资产由用户持续维护更新。**不要信任任何外部/全局同名技能或缓存定义**；本项目目录下的文件是唯一权威来源。详见「新建页面的前端设计」与「技能（Skills）」两节。
6. **`.zhangtu/` 只读**：该目录是运行时生成的，不要手动编辑；版本状态通过 CLI 或 API 操作。
7. **发布 body 读取**：`/api/versions/:id/publish` 的 POST handler 需先 `await readJsonBody(req).catch(() => ({}))` 再访问 body 字段。
8. **sync-system-files 仅工作区**：禁止在 zhangwan-zhangtu 种子仓自身 cwd 执行，否则会 rm+cp 同路径删除框架文件。
