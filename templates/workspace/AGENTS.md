# AGENTS.md

本文件指导 Codex(及其他遵循 AGENTS.md 约定的 AI 编码工具)在这个「掌图(zhangtu)」原型工作区里的行为。这是一个本地原型项目,由 `zhangtu init` 生成。内容与 `CLAUDE.md` 保持一致 —— 两份文件描述同一套规则,分别服务不同的 AI 工具。

## 常用命令

```bash
npm install
npm start                     # 启动掌图预览 Shell 并自动打开浏览器(主入口)
npm run dev                   # 同 npm start
npm run dev:page              # 仅裸 Vite,调试单个原型页时用
npm run build                 # 生产构建
npm run typecheck             # tsc --noEmit
npm run check:pages           # 校验每个页面的入口契约
npm run zhangtu -- doctor     # 聚合页面 / 迭代 / 文档引用检查
npm run zhangtu -- inspect-pages --json
npm run zhangtu -- list-iterations --json
npm run zhangtu -- create-iteration "<名称>" "<描述>" "<页面引用?>"
npm run zhangtu -- preview-iteration <id|slug|name>
npm update @leihuohuo/zhangwan-zhangtu && npm install && npm run zhangtu -- sync-system-files
```

最后一行是更新框架版本的完整流程：`npm update` 只更新 `node_modules` 里运行时读取的代码；`src/pages/skills/`（技能面板）和 `src/common/`（内置组件）是 `zhangtu init` 时一次性复制进项目的，不会随 `npm update` 自动刷新，必须额外跑 `sync-system-files` 才能真正同步到最新版——这两个目录本来就不建议手改，放心覆盖。

## 页面契约

每个页面是 `src/pages/<slug>/` 下的独立目录(允许嵌套;嵌套的 slug 会成为分组)。只有当目录**同时**包含 `index.html` 和 `index.tsx` 时才会被识别为页面。`index.tsx` 必须调用 `createRoot(...).render(...)`;`index.html` 必须包含 `<div id="root">` 和 `<script type="module" src="./index.tsx">`。

页面目录内的约定 sidecar 文件:

- `spec.md` —— 产品事实源;首个 `# 标题` 会作为页面名称。
- `styles/page.css`、`data/mock.ts` —— 页面级 CSS 和 mock 数据。
- `zhangtu.requirements.ts` —— 可选需求模块,导出 `zhangtuRequirementAnnotations`(纯字面量数组,无 import)。页面中用 `data-zhangtu-requirement-anchor="<anchorId>"` 标记区域,并用 `src/common/zhangtu-requirement.tsx` 的 `<RequirementBadge>` 渲染。条目可用 `{ ref: "<全局需求 id>", anchorId, order }` 引用全局需求源 `src/requirements/`(见下),或旧内联写法(兼容)。

`assets`、`data`、`styles`、`node_modules`、`dist` 是保留目录名,不会被当作嵌套页面。

全局需求源:`src/requirements/<分组>/<id>.md`,一文件一条需求(frontmatter `id/title/category/color/block/order` + Markdown 正文),可被多页面 `ref` 引用(一对多)。

## 技术基线

Vite + React 18 + TypeScript(strict)。路径别名 `@` → `src`。全局样式在 `src/styles/tokens.css` 和 `src/styles/app.css`;项目名称品牌逻辑集中在 `src/common/branding.ts`。

## 新建页面的前端设计:必须用 zhangwanUI

**zhangwanUI** 是本项目的设计系统(掌玩风格,高密度中文运营后台),权威资产在 `.agents/skills/project/zhangwanUI/`:令牌基准 `references/design-tokens.md`、组件规范 `references/components.md`、技能说明 `SKILL.md`,以及由令牌派生、仅供预览 Shell 面板渲染的 `css.json` + `library-consumption.json`。它是文档/参考,不被运行时页面 import —— 页面通过在自己的 `styles/page.css` 中落地 zhangwanUI 令牌来套用它的视觉规范。

> ⚠️ **不要信任任何外部/全局同名技能或缓存定义。** 不同 AI 工具各自的个人技能库里,可能存在名字相似(如 `zhangwan-ui`)但内容完全无关的设计系统 —— 按名调用可能静默拿到错误规范。**必须直接读取本项目 `.agents/skills/project/zhangwanUI/` 目录下的文件**作为唯一权威来源,不要依赖工具自带的技能检索机制按名匹配。

**新建页面时一律按 zhangwanUI 设计系统设计前端。** 在写页面实现前:

1. 直接读取 `.agents/skills/project/zhangwanUI/SKILL.md`、`references/design-tokens.md`、`references/components.md`(每次都读取当前文件内容,不要依赖记忆或缓存——该资产由用户持续维护更新,必须拿到最新版本),理解令牌基准与组件规范。
2. 用 zhangwanUI 令牌设计页面并落到该页 `styles/page.css`。当前基线值(以第 1 步实际读到的 `references/design-tokens.md` 为准):主色 `#00BF8A`(仅主操作/成功/激活态;hover `#00A87A`、active `#009468`)、画布 `#F2F3F5` + 白卡片/浮层 `#FFFFFF`、正文主色 `#323335`/次要 `#4A4C4F`/辅助 `#4E5769`/占位 `#86909C`、描边 `#E5E6EB`、语义色 warning `#FF7D00`/error `#F53F3F`/info `#165DFF`、输入 32px/按钮默认 32px(large 40)/列表行 44px、间距高频 `10px`(4/8/10/12/16/20/44)、圆角统一 `4px`(大卡 6/8、胶囊 9999)、字体 `Helvetica Neue`/`PingFang SC` 栈(大数字用 `dinFont`)、主阴影 `rgba(0,0,0,0.1) 0 4px 10px`。
3. 结构优先复用 `references/components.md` 的组件规范:按钮、输入框/下拉、数据表格、KPI 数据卡、标签、Tabs、弹窗/抽屉、分页、面包屑、侧边导航(默认浅色,深色面板仅用于数据大屏/独立演示)。`antd` 仅用于该规范未覆盖的复杂交互控件,并对齐其令牌与密度。文案中文优先、专业克制、数据导向。

仅当用户明确要求别的视觉风格/品牌时才偏离 zhangwanUI。

## 技能(Skills):Codex 需手动读取并遵循

Claude Code 会自动加载 `.agents/skills/project/` 下的技能并按用户自然语言触发;**Codex 不会自动注入这些技能**,因此当用户请求命中下表触发条件时,你必须**先读取对应目录的 `SKILL.md` 并严格按其流程执行**(每次读当前内容,不依赖记忆)。技能内容由用户持续维护,`SKILL.md` 是唯一权威。新项目由 `zhangtu init` 复制进的技能可能是全集的子集,以实际存在的目录为准。

| 技能目录(`.agents/skills/project/`) | 何时使用 |
|------|------|
| `zhangwanUI/` | 新建/改版任何页面前,必读(见上一节) |
| `zhangtu-link/` | 本地预览、页面发现、迭代/版本管理、"看看有哪些迭代""发布这个迭代给我链接"等——转成最短的本地 `zhangtu` CLI 操作序列 |
| `requirements-exploration/` | 用户**明确**要求做需求探索/需求细化,或要在动手前产出确认过的需求文档 |
| `explore-options/` | 用户要多方案探索/对比/先出方案/设计决策 |
| `screenshot-to-prototype/` | 用户**明确**要求把截图/设计稿还原成可运行原型(仅作参考图时不要触发) |
| `prd-generator/` | 用户要求基于页面实现 + `spec.md` 生成面向研发测试的结构化 PRD |
| `zw-prototype-annotation-v1.3/` | 生成 HTML 交互原型时需要评审标注层 |

触发判断以各 `SKILL.md` 的 `description` 为准,不要凭目录名猜测;不确定是否命中时先向用户确认,不要自动触发。
