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

**zhangwanUI** 是本项目的设计系统(高密度中文运营后台风格),实际资产在 `.agents/skills/project/zhangwanUI/`,通过 `zhangwan-ui` 技能调用(token `css.json`、运行时样式 `colors_and_type.css`、组件合同 `components/*.json`、预览 `preview/*.html`)。它是文档/参考,不被运行时页面 import —— 页面通过在自己的 `styles/page.css` 中落地 zhangwanUI 令牌来套用它的视觉规范。

## 新建页面的前端设计:必须用 zhangwanUI

**新建页面时一律按 zhangwanUI 设计系统设计前端。** 在写页面实现前:

1. 先调用 `zhangwan-ui` 技能(或读取 `.agents/skills/project/zhangwanUI/README.md` 与 `css.json`、相关 `components/*.json` + `preview/*.html`),理解令牌与组件合同。
2. 用 zhangwanUI 令牌设计页面并落到该页 `styles/page.css`:主色 `#16a56f`(仅主操作/成功)、画布 `#f4f6f8` + 白卡片 `#ffffff`、正文中性 `#6b7683`、描边 `#d8e0e6`、输入 32px / 按钮 36px / 导航 56px、间距 `4/8/12/16/20/24/32`、圆角 `4/6/8`(卡片/导航到 10、状态胶囊 9999)、字体 `Noto Sans SC`(中文)+ `Inter`(数字/拉丁)、弱阴影分级。
3. 结构优先复用 zhangwanUI 组件:Smart Button、Metric Card、Filter Form、Data Table、Top Navigation、Sidebar Navigation。`antd` 仅用于 zhangwanUI 未覆盖的复杂交互控件,并对齐其令牌与密度。文案中文优先、专业克制、数据导向。

仅当用户明确要求别的视觉风格/品牌时才偏离 zhangwanUI。
