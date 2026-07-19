# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目定位

`zhangwan-zhangtu` 是**内部原型系统的种子项目**(内部原型系统),不是生产业务应用。它的目的是让产品经理在本地绘制、标注、比较和评审多页面原型。范围被刻意限制在:本地页面发现、原型预览、需求锚点读取、迭代管理、proto-hub 发布。权限、SSO、审计、远程存储、审批流都**明确不在范围内** —— 未经明确要求不要添加。

大部分文字内容(spec、README、需求正文、界面文案)是中文,生成用户可见内容时保持中文。

与 `AGENTS.md` 描述同一套规则;本文件面向 Claude Code,AGENTS 面向 Codex 等通用 agent。规则冲突时以**代码与 AGENTS 最新约定**为准并回写本文件。

## 常用命令

```bash
npm install
npm start                                     # 启动掌图预览 Shell 并打开浏览器(主入口)
npm run dev                                   # 同 npm start:Shell :6320 + Vite :51720
npm run dev:page                              # 仅裸 Vite,调试单个原型页
npm run build                                 # 生产构建(每页一个入口)
npm run typecheck                             # tsc --noEmit
npm run check:pages                           # 校验每个页面的入口契约
npm run zhangtu -- inspect-pages --json       # 页面发现
npm run zhangtu -- doctor                     # 项目健康检查(页面/迭代/需求源/文档引用)
npm run zhangtu -- list-iterations --json
npm run zhangtu -- create-iteration "<名称>" "<描述>" "<页面引用?>"
npm run zhangtu -- update-iteration <id|slug|name> "<新名称>" "<描述>" "<页面引用>"
npm run zhangtu -- preview                    # 项目预览 shell + Vite
npm run zhangtu -- preview-iteration <id|slug|name>
npm run zhangtu -- sync-system-files          # 从框架包同步系统文件到工作区(勿在种子仓自身运行)
```

没有测试运行器。**交付前至少运行**:

```bash
npm run typecheck
npm run check:pages
npm run build
npm run zhangtu -- doctor
```

需要核对页面列表时再跑 `npm run zhangtu -- inspect-pages --json`。

## 页面契约

每个页面是 `src/pages/<slug>/` 下的独立目录(允许嵌套;嵌套的 slug 会成为分组)。只有当目录**同时**包含 `index.html` 和 `index.tsx` 时才会被识别为页面 —— 只有其一会产生诊断并被拒绝。`check-pages.mjs` 还额外强制:

- `index.tsx` 必须调用 `createRoot(...).render(...)`(真实入口,不能只是组件片段)。
- `index.html` 必须包含 `<div id="root">` 和 `<script type="module" src="./index.tsx">`。

页面目录内的约定 sidecar 文件:

- `spec.md` —— 产品事实源;首个 `# 标题` 会作为页面名称。
- `styles/page.css`、`data/mock.ts` —— 页面级 CSS 和 mock 数据。
- `zhangtu.requirements.ts` —— 可选的需求模块(见下;可 `{ ref }` 引用全局需求)。

这些保留子目录名(`assets`、`data`、`styles`、`node_modules`、`dist`)永远不会被当作嵌套页面。

系统内置页(勿删、从常规列表拆出):`src/pages/skills/`、`src/pages/design-system/`。

## 新建页面:内容优先,壳层归掌图

掌图 Shell(`shell.html`)已经提供**页面列表/文件夹树、设备框、需求抽屉**。每个 `src/pages/<slug>/` 在预览里是 iframe **内容页**,不是独立完整后台。

**默认生成内容区即可**,推荐骨架:

```text
.page → .page-header(标题+主操作) → 可选 .page-toolbar(筛选/Tabs/本页面包屑) → .page-body(表格/卡片/表单)
```

**默认不要**:

- 再做一层全局 `SidebarNav` / 整站菜单(与 Shell 侧栏重复)
- 再做整站 `Navbar`(Logo、系统切换、消息中心壳)
- 把 design-system UI Kit 的整页后台框架当每个业务页的模板
- 在页内维护「全部模块」菜单或仿生产 SPA 路由

**页内可用**:Breadcrumb(本页层级)、Tabs、FilterBar、步骤条——仅服务本页信息架构。

**仅当用户明确要求**「完整后台壳 / 脱离 Shell 演示 layout」时才做 Sidebar+Navbar,并在 `spec.md` 注明。

生成顺序:写 `spec.md` → 读 tokens(不要先抄 navigation 示例) → 搭 header+body 内容组件 → 需要再加筛选/页签 → `check:pages` + Shell 预览验收。

完整表格与禁令见 `AGENTS.md`「新建页面流程：内容优先，壳层归掌图」。

## 架构

**页面发现是主干。** `scripts/zhangtu/discovery.mjs` 遍历 `src/pages`(由配置驱动),输出包含页面、候选项、诊断的 JSON 模型。两个独立的消费方必须对"什么算一个页面"保持一致:

1. `vite.config.ts` 的 `collectPageInputs()` 把 `index.html` 收集进 `build.rollupOptions.input`(每页一个 Rollup 入口)。
2. `discovery.mjs` 的 `walkPageRoots()` 构建更丰富的页面模型,供 CLI 和预览 shell 使用。

修改页面识别规则时,这两处都要改,外加 `scripts/check-pages.mjs`(它自带一份入口契约 + 保留目录的逻辑副本)。

**配置解析**(`loadConfig`):`zhangtu.config.json` → 内置默认值。配置设定标题/品牌、include/exclude 目录、`pageNameMap`(显式的源路径 → 显示名覆盖)和主题 token。页面名称优先级:`pageNameMap` > `spec.md` H1 > `<title>` > slug。

**需求锚点**把原型区域与 PM 需求模块关联起来:

- `zhangtu.requirements.ts` 导出 `zhangtuRequirementAnnotations`(数组)。发现逻辑会去掉 `export const` 后在 Node `vm` 沙箱(1 秒超时)中运行 —— 因此该文件必须是**可静态求值、无 import、无运行时依赖**的纯字面量数组。
- 页面中,用 `data-zhangtu-requirement-anchor="<anchorId>"` 标记区域,并用 `src/common/zhangtu-requirement.tsx` 的 `<RequirementBadge>` 渲染。徽标会调用 `window.parent.openRequirementByAnchor(anchorId)`,让预览 shell 打开对应需求;独立(非 iframe)预览时静默忽略。

**全局需求源(需求先于原型)**:一条需求的事实源可放在全局目录 `src/requirements/<分组>/<id>.md` —— 一文件一条需求,frontmatter 放 `id / title / category / color / block / order`,正文写 Markdown(描述 + 验收)。需求是人写的、可 diff、进 git 的产品资产,一条可被**多个页面/区域**引用(一对多)。页面侧 `zhangtu.requirements.ts` 的条目用 `{ ref: "<全局需求 id>", anchorId: "<页面锚点>", order }` 引用全局需求,发现逻辑会从全局 `.md` 拉取 title/正文/分类,页面本地字段可覆盖。**旧的内联条目(直接写 title/bodyMarkdown、无 ref)仍向后兼容**,机制未推翻。`ref` 指向不存在的全局需求会在 `doctor` 的「需求源」检查里报 warning。

**能力清单**(`zhangtu.capabilities.json`,框架侧单一事实源)列出掌图开箱的六条 PM 能力(需求对齐/老系统迁移/从零到一/原型修改/PRD 输出/版本管理),`discovery.mjs` 加载(工作区文件覆盖内置默认)、进 manifest、随 `init`/`sync-system-files` 下发。PRD 能力的 `defaultChannel` = `prd-generator`。对应 [docs/pm-capability-map.md](docs/pm-capability-map.md)。

**技能分层(第 4 期)**:`scripts/zhangtu/skills.mjs` 的 `buildSkillSummary` 输出 `tier: "capability" | "ops"`。运维技能由顶部 `OPS_SKILL_SLUGS` 判定(以 `.agents/skills/project/` 实际目录名为准;当前含 `zhangtu-installer`、`zhangtu-init-prototype-project` 等)。技能页(`src/pages/skills/`)能力技能默认展开,运维技能收入「框架运维」分组且**默认折叠**。`/api/skills` 返回体含 `tier`。

**迭代**(`scripts/zhangtu/iterations.mjs` + CLI)是命名的、带版本的页面子集,以 JSON 持久化在 `.zhangtu/iterations/`。创建/更新迭代时还会把预览 manifest 写入 `.zhangtu/preview/<slug>/manifest.json`。`.zhangtu/` 是生成的状态,不要手动编辑。

**预览**(`scripts/zhangtu/preview-server.mjs` + `shell.html`)会同时启动两个服务:

- Vite 开发服务器(默认端口 **51720**):渲染真实页面
- 掌图 Shell(默认端口 **6320**):页面列表、文件夹树、**工作流**只读引导(消费 `manifest.capabilities`)、**技能**/**设计系统**系统入口、设备框、需求抽屉、版本管理、iframe 容器

启动命令:`npm start` 或 `node scripts/zhangtu/cli.mjs preview`。系统页 skills / design-system 由 `splitPreviewPages` 从常规列表拆出。

**系统文件同步**:`sync-system-files` 从当前安装的框架包镜像 `src/common`、`src/pages/skills`、`src/pages/design-system`、`.agents/skills/project`、`zhangtu.capabilities.json` 到工作区(覆盖本地,不碰 `imported` 技能)。**禁止在种子仓自身 cwd 运行**(`rootDir === PACKAGE_ROOT` 时 CLI 中文报错退出),否则 `rm+cp` 同路径会删光框架文件。

**健康检查**:`npm run zhangtu -- doctor` 检查页面发现、入口契约、迭代引用、全局需求源、文档中的页面目录引用。

## 技术基线

Vite + React 18 + TypeScript(strict)。当前仓库已安装 `antd` 与 `@ant-design/icons`，其中 `src/pages/skills/` 直接使用 `antd`；业务原型页也可能只用页面级 CSS 和 `lucide-react` 实现。若引入其他组件库，需同步补齐 npm 依赖、版本和 import 说明。路径别名 `@` → `src`。全局样式在 `src/styles/tokens.css` 和 `src/styles/app.css`;项目名称品牌逻辑集中在 `src/common/branding.ts`(localStorage 存储、事件驱动)。

**zhangwan-design** 是本项目的设计系统(掌玩风格,高密度中文运营后台),权威资产在 `.agents/skills/project/zhangwan-design/`。它不是一份纯 Markdown 文档,而是一整套可直接引用的真实资产:事实源说明 `readme.md`、技能说明 `SKILL.md`、令牌 `tokens/{colors,typography,spacing}.css`、组件源码+类型+用法说明 `components/<category>/<Name>.{jsx,d.ts,prompt.md}`(分 `core`/`data`/`feedback`/`forms`/`navigation` 五类)、规范可视化卡片 `guidelines/*.html`、完整点击式 UI Kit `ui_kits/zhangwan-console/`,以及索引这一切的 `_ds_manifest.json`。它是文档/参考,不被运行时页面直接 import —— 页面通过在自己的 `styles/page.css` 中落地 zhangwan-design 令牌来套用它的视觉规范。可视化浏览入口见 `src/pages/design-system/`(把该 skill 的资产镜像进了自己的 `assets/zhangwan-design/` 目录,通过 iframe 直接渲染真实的 guidelines/组件/UI Kit 页面)。

> ⚠️ **直接读取本项目 `.agents/skills/project/zhangwan-design/` 目录下的文件为准**(每次读当前内容,不要依赖记忆或缓存——该 skill 由用户持续维护更新)。不要凭旧印象套用已作废的令牌值或已删除的旧 skill(`zhangwanUI`)路径/文件名(如 `DESIGN.md`、`references/design-tokens.md`、`references/components.md`、旧主色 `#16a56f`)——那是这份 skill 被替换前的产物,现已不存在。

## 页面前端设计:一律以 zhangwan-design 为视觉源

**任何页面——新建、还原、复刻、重建——一律按 zhangwan-design 设计系统落视觉。** 在写页面实现前:

1. 直接读取 `.agents/skills/project/zhangwan-design/SKILL.md`、`readme.md`(事实源)、`tokens/colors.css`、`tokens/typography.css`、`tokens/spacing.css`(每次都读取当前文件内容,不要依赖记忆或缓存——该 skill 由用户持续维护更新,必须拿到最新版本),理解令牌基准。需要参考组件结构时读 `components/<category>/<Name>.prompt.md`(用法)与 `.d.ts`(props)。
2. 用 zhangwan-design 令牌设计页面并落到该页 `styles/page.css`:主色 `#00bf8a`(`--color-brand-green`,仅主操作/激活态;悬停/激活背景 `#e1fff0`)、画布 `#e5e5e5` + 白卡片 `#ffffff`(嵌套统计卡片用 `#f7f8fa`)、正文主色 `#323335` / 次要 `#606266` / 辅助 `#4e5969` / 占位 `#8893aa`、描边 `#e0e0e0`(表格用 `#ebeef5`)、数据分类色青色 `#02b8de` / 粉色 `#f2595c`(不是情绪化的成功/错误色,是"男/女"分组一类的分类标签色)、遗留强调色蓝 `#409eff`(仅顶级激活菜单文字,不要新用)、按钮高度 small 28 / medium 34 / large 40、筛选控件(Input/Select/DatePicker/InputNumberRange)默认宽度统一 `240px`、间距 4px 基准(`4/8/12/16/20/24/32/40`,卡片内边距 20px)、圆角 `2px`(主卡片)/`4px`(统计卡/输入框/按钮)/`5px`(登录字段/抽屉)/`11px`(胶囊标签,唯一例外)、字体栈 `Helvetica Neue, PingFang SC, Microsoft YaHei, Arial`(数字统一用 `DIN-Medium`,不与中文混排)、阴影极弱(悬停卡片 `0 0 5px #e8e8e8`、固定顶栏/侧栏 `0 1px 4px rgba(0,21,41,.08)`)。这组值可能随 skill 更新而变化,以第 1 步实际读到的 `tokens/*.css` 为准,本条仅为当前值的备忘。
3. 结构优先复用 `components/` 下的**内容区组件**(核心:Button/Tag/Tabs/Panel/SectionTitle/LoadingBtn;数据:StatCard/DataTable/...;表单:Input/Select/...;反馈:Dialog/Drawer/Tooltip)。**页内**可用 Breadcrumb/FilterBar/Tabs。**默认不要**用 SidebarNav/Navbar/Hamburger/SystemLink 拼整站壳(见上文「内容优先,壳层归掌图」)。组件演示见 `src/pages/design-system/`。`antd` 仅用于规范未覆盖的复杂控件并对齐令牌密度。文案中文优先、专业克制、数据导向,不用表情符号或第一人称营销口吻。

### 本项目不使用 compass-ui,一切走 zhangwan-design

**本项目一律不使用 `compass-ui` skill。** 即使某个页面参考罗盘真实页(如 stain 染色页:三级树形表格、详情/参考抽屉、多列可排序、未达标标红、账户维度切换等),也**只用 zhangwan-design 的令牌与组件规范来实现结构与视觉**。

- **不要触发 compass-ui,不要从 `assets/eui-kit/` 复制任何 element-ui/bi-eleme 成品 `.tsx`/`.css`**——直接抄这些成品正是"还原页面还是旧 UI、组件有出入"的根因。
- 需要罗盘那类**页面结构/交互**(树形表格、可排序列、抽屉、标红、维度切换等)时,用 zhangwan-design 的 DataTable/Drawer/Tag/Tabs 等组件规范**自行搭建**,不照抄罗盘的 DOM 与 CSS。
- 两套主色恰好都是 `#00bf8a`(同出掌玩品牌),但**同源只到主色为止**;其余令牌一律以 zhangwan-design 的 `tokens/*.css` 为唯一来源,不引用 compass-ui 的任何值。

仅当用户明确要求别的视觉风格/品牌时才偏离 zhangwan-design。
