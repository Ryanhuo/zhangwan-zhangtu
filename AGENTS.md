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
| zhangwanUI 设计系统 | 所有新页面的视觉规范，资产在 `.agents/skills/project/zhangwanUI/` |
| Node.js ESM | 所有脚本（`scripts/zhangtu/`）均为 ESM |

路径别名：`@` → `src`。全局样式：`src/styles/tokens.css`、`src/styles/app.css`。

---

## 目录结构

```
zhangwan-zhangtu/
├── src/
│   ├── pages/               # 原型页面（每个子目录是一个独立入口）
│   │   └── skills/          # 系统内置技能页（勿删）
│   ├── common/              # 共享组件：branding.ts, site-brand.tsx, zhangtu-requirement.tsx
│   ├── styles/              # 全局样式：tokens.css, app.css
│   ├── design-system/       # 设计系统参考资产（不被运行时 import）
│   └── resources/           # 项目长期资料、模板、业务文档
├── scripts/
│   └── zhangtu/             # 所有工具脚本
│       ├── cli.mjs          # 统一 CLI 入口
│       ├── preview-server.mjs # 本地预览 HTTP 服务（默认端口 6320）
│       ├── shell.html       # 预览 Shell UI（侧边栏/版本管理/需求抽屉）
│       ├── discovery.mjs    # 页面发现
│       ├── iterations.mjs   # 版本/迭代管理
│       ├── page-library.mjs # 页面库（文件夹/排序持久化）
│       ├── proto-hub.mjs    # 发布组件（wraps proto-hub CLI）
│       ├── skills.mjs       # 技能页后端
│       └── zhangwanui.mjs   # zhangwanUI 资产服务
├── .zhangtu/                # 本地生成状态（勿手改）
│   ├── iterations/          # 版本 JSON（itr_*.json）
│   ├── preview/             # 各版本预览 manifest
│   └── publish-config.json  # 发布配置（token、systemName）
├── docs/                    # 补充说明文档
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
| `zhangtu.requirements.ts` | 需求模块（纯字面量数组，无 import） |

保留子目录名（不会被识别为页面）：`assets`、`data`、`styles`、`node_modules`、`dist`。

新建页面**必须**遵循 zhangwanUI 设计规范——详见 CLAUDE.md「新建页面的前端设计」章节。

---

## 架构：页面发现

`scripts/zhangtu/discovery.mjs` 是核心，遍历 `src/pages` 输出页面 JSON 模型。有两处独立消费方必须对"什么算页面"保持一致：

1. `vite.config.ts` → `collectPageInputs()` → Rollup 多入口构建
2. `scripts/zhangtu/discovery.mjs` → `walkPageRoots()` → CLI & 预览 Shell

**改页面识别规则时，三处都要同步**：`discovery.mjs`、`vite.config.ts`、`scripts/check-pages.mjs`。

---

## 架构：预览 Shell

`npm run zhangtu -- preview` 同时启动两个进程：

- **Vite 开发服务器**（端口 51720）：渲染实际页面
- **Shell HTTP 服务**（端口 6320）：承载 `shell.html` UI，提供侧边栏、版本管理、需求抽屉、发布入口、iframe 容器

`shell.html` 是一个单 HTML 文件，包含全部 CSS 和 JS，通过 `/api/*` 端点与 Shell 服务通信。修改后即时生效，无需重启。

**版本预览**（`/iterations/:slug`）：Shell 以只读模式加载，仅显示该版本包含的页面，侧边栏隐藏"技能"和"zhangwanUI"入口，空文件夹（版本内无页面的文件夹）自动隐藏，顶栏显示版本名、编辑版本/发布/删除/返回项目按钮。

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

---

## Shell API 端点（preview-server.mjs）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/manifest` | 当前项目/版本 manifest |
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
| GET | `/api/skills` | 技能列表 |
| GET/DELETE | `/api/skills/:id` | 技能详情/删除 |
| GET | `/api/zhangwanui/*` | zhangwanUI 资产文件代理 |

---

## 常用命令

```bash
npm install
npm start                                      # 启动掌图预览 Shell 并自动打开浏览器（主入口）
npm run dev                                    # 同 npm start
npm run dev:page                               # 仅裸 Vite，调试单个原型页时用
npm run build                                  # 生产构建
npm run typecheck                              # tsc --noEmit
npm run check:pages                            # 页面入口契约校验

# zhangtu CLI
npm run zhangtu -- inspect-pages --json        # 页面发现（查 slug、路径、诊断）
npm run zhangtu -- list-iterations --json      # 列出所有版本
npm run zhangtu -- create-iteration "名称" "说明" "[页面引用?]"
npm run zhangtu -- update-iteration <id|slug|name> "新名称" "说明" "页面引用"
npm run zhangtu -- preview                     # 项目预览（Shell + Vite）
npm run zhangtu -- preview-iteration <id|slug|name>   # 特定版本预览
```

---

## 验证要求

**交付前至少运行：**

```bash
npm run check:pages
npm run typecheck
npm run build
npm run zhangtu -- inspect-pages --json
```

确保无错误、无诊断警告，且 `inspect-pages` 输出的页面列表与预期一致。

---

## 开发注意事项

1. **最小改动原则**：只改任务需要的部分，不顺手重构无关代码。
2. **页面发现三处同步**：改识别规则时，`discovery.mjs`、`vite.config.ts`、`check-pages.mjs` 三处同步修改。
3. **Shell 是单文件**：`shell.html` 包含全部 CSS/JS，修改后即时生效，无需重启 Vite。
4. **需求 sidecar 约束**：`zhangtu.requirements.ts` 必须是无 import 的纯字面量文件，否则 vm 沙箱执行会失败。
5. **zhangwanUI 优先，且必须读本项目文件**：新建页面必须先读取本项目 `.agents/skills/project/zhangwanUI/` 下的令牌与组件合同（`README.md`、`css.json`、`components/*.json`）再动手实现，每次都读取当前文件内容、不依赖记忆或缓存——该资产由用户持续维护更新。**不要信任任何外部/全局同名技能或缓存定义**（不同 AI 工具的个人技能库里可能存在名字相似但内容完全无关的设计系统，按名调用可能静默拿到错误规范）；本项目目录下的文件是唯一权威来源。
6. **`.zhangtu/` 只读**：该目录是运行时生成的，不要手动编辑；版本状态通过 CLI 或 API 操作。
7. **发布 body 读取**：`/api/versions/:id/publish` 的 POST handler 需先 `await readJsonBody(req).catch(() => ({}))` 再访问 body 字段。
