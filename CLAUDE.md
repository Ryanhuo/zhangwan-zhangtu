# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目定位

`zhangwan-zhangtu` 是**内部原型系统的种子项目**(内部原型系统),不是生产业务应用。它的目的是让产品经理在本地绘制、标注、比较和评审多页面原型。范围被刻意限制在:本地页面发现、原型预览、需求锚点读取、迭代管理。发布、权限、SSO、审计、远程存储、审批流都**明确不在范围内** —— 未经明确要求不要添加。

大部分文字内容(spec、README、需求正文、界面文案)是中文,生成用户可见内容时保持中文。

## 常用命令

```bash
npm install
npm run dev                                   # Vite 开发服务器(多页面,端口 51730)
npm run build                                 # 生产构建(每页一个入口)
npm run typecheck                             # tsc --noEmit
npm run check:pages                           # 校验每个页面的入口契约
npm run zhangtu -- inspect-pages --json       # 页面发现
npm run zhangtu -- list-iterations --json
npm run zhangtu -- create-iteration "<名称>" "<描述>" "<页面引用?>"
npm run zhangtu -- update-iteration <id|slug|name> "<新名称>" "<描述>" "<页面引用>"
npm run zhangtu -- preview                    # 项目预览 shell + Vite
npm run zhangtu -- preview-iteration <id|slug|name>
```

没有测试运行器。**交付前至少运行**(见 `AGENTS.md`):`npm run check:pages`、`npm run typecheck`、`npm run build`、`npm run zhangtu -- inspect-pages --json`。

## 页面契约

每个页面是 `src/pages/<slug>/` 下的独立目录(允许嵌套;嵌套的 slug 会成为分组)。只有当目录**同时**包含 `index.html` 和 `index.tsx` 时才会被识别为页面 —— 只有其一会产生诊断并被拒绝。`check-pages.mjs` 还额外强制:

- `index.tsx` 必须调用 `createRoot(...).render(...)`(真实入口,不能只是组件片段)。
- `index.html` 必须包含 `<div id="root">` 和 `<script type="module" src="./index.tsx">`。

页面目录内的约定 sidecar 文件:

- `spec.md` —— 产品事实源;首个 `# 标题` 会作为页面名称。
- `styles/page.css`、`data/mock.ts` —— 页面级 CSS 和 mock 数据。
- `zhangtu.requirements.ts` —— 可选的需求模块(见下)。

这些保留子目录名(`assets`、`data`、`styles`、`node_modules`、`dist`)永远不会被当作嵌套页面。

## 架构

**页面发现是主干。** `scripts/zhangtu/discovery.mjs` 遍历 `src/pages`(由配置驱动),输出包含页面、候选项、诊断的 JSON 模型。两个独立的消费方必须对"什么算一个页面"保持一致:

1. `vite.config.ts` 的 `collectPageInputs()` 把 `index.html` 收集进 `build.rollupOptions.input`(每页一个 Rollup 入口)。
2. `discovery.mjs` 的 `walkPageRoots()` 构建更丰富的页面模型,供 CLI 和预览 shell 使用。

修改页面识别规则时,这两处都要改,外加 `scripts/check-pages.mjs`(它自带一份入口契约 + 保留目录的逻辑副本)。

**配置解析**(`loadConfig`):`zhangtu.config.json` → 内置默认值。配置设定标题/品牌、include/exclude 目录、`pageNameMap`(显式的源路径 → 显示名覆盖)和主题 token。页面名称优先级:`pageNameMap` > `spec.md` H1 > `<title>` > slug。

**需求锚点**把原型区域与 PM 需求模块关联起来:

- `zhangtu.requirements.ts` 导出 `zhangtuRequirementAnnotations`(数组)。发现逻辑会去掉 `export const` 后在 Node `vm` 沙箱(1 秒超时)中运行 —— 因此该文件必须是**可静态求值、无 import、无运行时依赖**的纯字面量数组。
- 页面中,用 `data-zhangtu-requirement-anchor="<anchorId>"` 标记区域,并用 `src/common/zhangtu-requirement.tsx` 的 `<RequirementBadge>` 渲染。徽标会调用 `window.parent.openRequirementByAnchor(anchorId)`,让预览 shell 打开对应需求;独立(非 iframe)预览时静默忽略。

**迭代**(`scripts/zhangtu/iterations.mjs` + CLI)是命名的、带版本的页面子集,以 JSON 持久化在 `.zhangtu/iterations/`。创建/更新迭代时还会把预览 manifest 写入 `.zhangtu/preview/<slug>/manifest.json`。`.zhangtu/` 是生成的状态,不要手动编辑。

**预览**(`scripts/zhangtu/preview-server.mjs` + `shell.html`)会同时启动两个服务:渲染真实页面的 Vite 开发服务器,以及掌图 shell(页面列表、文件夹树、设备框切换、需求抽屉、版本管理、iframe 容器)。启动命令:`node scripts/zhangtu/cli.mjs preview`

## 技术基线

Vite + React 18 + TypeScript(strict)。当前仓库已安装 `antd` 与 `@ant-design/icons`，其中 `src/pages/skills/` 直接使用 `antd`；业务原型页也可能只用页面级 CSS 和 `lucide-react` 实现。若引入其他组件库，需同步补齐 npm 依赖、版本和 import 说明。路径别名 `@` → `src`。全局样式在 `src/styles/tokens.css` 和 `src/styles/app.css`;项目名称品牌逻辑集中在 `src/common/branding.ts`(localStorage 存储、事件驱动)。

**zhangwanUI** 是本项目的设计系统(掌玩风格,高密度中文运营后台),权威资产在 `.agents/skills/project/zhangwanUI/`,内容是全局 `~/.claude/skills/zhangwan-ui/`(掌玩通用 UI)的镜像:令牌基准 `references/design-tokens.md`、组件规范 `references/components.md`、技能说明 `SKILL.md`。它是文档/参考,不被运行时页面 import —— 页面通过在自己的 `styles/page.css` 中落地 zhangwanUI 令牌来套用它的视觉规范。此外目录内还有一份由令牌派生的 `css.json` + `library-consumption.json`,**仅供预览 shell 的 zhangwanUI 面板渲染**,不是设计来源;改令牌时以 `references/design-tokens.md` 为准,并同步 `css.json`。

> ⚠️ 本项目的 zhangwanUI 已替换为全局 `~/.claude/skills/zhangwan-ui/`(掌玩通用 UI)的镜像,两者现在同源。**仍以本项目 `.agents/skills/project/zhangwanUI/` 目录下的文件为准直接读取**(每次读当前内容,不要依赖记忆或缓存),不要凭旧印象套用已作废的令牌值(如旧的主色 `#16a56f`、`Noto Sans SC`/`Inter` 字体栈等)。

## 新建页面的前端设计:必须用 zhangwanUI

**新建页面时一律按 zhangwanUI 设计系统设计前端。** 在写页面实现前:

1. 直接读取 `.agents/skills/project/zhangwanUI/SKILL.md`、`references/design-tokens.md`、`references/components.md`(每次都读取当前文件内容,不要依赖记忆或缓存——该 Skill 由用户持续维护更新,必须拿到最新版本),理解令牌基准与组件规范。
2. 用 zhangwanUI 令牌设计页面并落到该页 `styles/page.css`:主色 `#00BF8A`(仅主操作/成功/激活态;hover `#00A87A`、active `#009468`)、画布 `#F2F3F5` + 白卡片/浮层 `#FFFFFF`、正文主色 `#323335` / 次要 `#4A4C4F` / 辅助 `#4E5969` / 占位 `#86909C`、描边 `#E5E6EB`、语义色 warning `#FF7D00` / error `#F53F3F` / info `#165DFF`、输入 32px / 按钮默认 32px(large 40)/ 列表行 44px、间距高频 `10px`(4/8/10/12/16/20/44)、圆角统一 `4px`(大卡 6/8、胶囊 9999)、字体 `Helvetica Neue`/`PingFang SC` 栈(大数字用 `dinFont`)、主阴影 `rgba(0,0,0,0.1) 0 4px 10px`。这组值可能随 Skill 更新而变化,以第 1 步实际读到的 `references/design-tokens.md` 为准,本条仅为当前值的备忘。
3. 结构优先复用 `references/components.md` 的组件规范:按钮、输入框/下拉、数据表格、KPI 数据卡、标签、Tabs、弹窗/抽屉、分页、面包屑、侧边导航(默认浅色,深色面板仅用于数据大屏/独立演示)。`antd` 仅用于该规范未覆盖的复杂交互控件,并对齐其令牌与密度。文案中文优先、专业克制、数据导向。

仅当用户明确要求别的视觉风格/品牌时才偏离 zhangwanUI。
