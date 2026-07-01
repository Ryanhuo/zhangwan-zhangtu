# CLAUDE.md

本文件指导 Claude Code 在这个「掌图(zhangtu)」原型工作区里的行为。这是一个本地原型项目,由 `zhangtu init` 生成。

## 常用命令

```bash
npm install
npm start                     # 启动掌图预览 Shell 并自动打开浏览器(主入口)
npm run dev                   # 同 npm start
npm run dev:page              # 仅裸 Vite,调试单个原型页时用
npm run build                 # 生产构建
npm run typecheck             # tsc --noEmit
npm run check:pages           # 校验每个页面的入口契约
npm run zhangtu -- inspect-pages --json
npm run zhangtu -- list-iterations --json
npm run zhangtu -- create-iteration "<名称>" "<描述>" "<页面引用?>"
npm run zhangtu -- preview-iteration <id|slug|name>
```

## 页面契约

每个页面是 `src/pages/<slug>/` 下的独立目录(允许嵌套;嵌套的 slug 会成为分组)。只有当目录**同时**包含 `index.html` 和 `index.tsx` 时才会被识别为页面。`index.tsx` 必须调用 `createRoot(...).render(...)`;`index.html` 必须包含 `<div id="root">` 和 `<script type="module" src="./index.tsx">`。

页面目录内的约定 sidecar 文件:

- `spec.md` —— 产品事实源;首个 `# 标题` 会作为页面名称。
- `styles/page.css`、`data/mock.ts` —— 页面级 CSS 和 mock 数据。
- `zhangtu.requirements.ts` —— 可选需求模块,导出 `zhangtuRequirementAnnotations`(纯字面量数组,无 import)。页面中用 `data-zhangtu-requirement-anchor="<anchorId>"` 标记区域,并用 `src/common/zhangtu-requirement.tsx` 的 `<RequirementBadge>` 渲染。

`assets`、`data`、`styles`、`node_modules`、`dist` 是保留目录名,不会被当作嵌套页面。

## 技术基线

Vite + React 18 + TypeScript(strict)。路径别名 `@` → `src`。全局样式在 `src/styles/tokens.css` 和 `src/styles/app.css`;项目名称品牌逻辑集中在 `src/common/branding.ts`。

## 新建页面的前端设计:必须用 zhangwanUI

**zhangwanUI** 是本项目的设计系统(高密度中文运营后台风格),唯一权威资产在 `.agents/skills/project/zhangwanUI/`(token `css.json`、运行时样式 `colors_and_type.css`、组件合同 `components/*.json`、预览 `preview/*.html`)。它是文档/参考,不被运行时页面 import —— 页面通过在自己的 `styles/page.css` 中落地 zhangwanUI 令牌来套用它的视觉规范。

> ⚠️ **不要通过 Skill 工具按名字 `zhangwan-ui` 调用。** 这个名字在个人全局技能库里可能已被另一套无关的设计系统占用,按名调用会静默拿到错误的设计规范。**必须直接读取本项目 `.agents/skills/project/zhangwanUI/` 目录下的文件**作为唯一来源。

**新建页面时一律按 zhangwanUI 设计系统设计前端。** 在写页面实现前:

1. 直接读取 `.agents/skills/project/zhangwanUI/README.md`、`css.json`、相关 `components/*.json` + `preview/*.html`(每次都读取当前文件内容,不要依赖记忆或缓存——该 Skill 由用户持续维护更新,必须拿到最新版本),理解令牌与组件合同。
2. 用 zhangwanUI 令牌设计页面并落到该页 `styles/page.css`。当前基线值(以第 1 步实际读到的内容为准):主色 `#16a56f`(仅主操作/成功)、画布 `#f4f6f8` + 白卡片 `#ffffff`、正文中性 `#6b7683`、描边 `#d8e0e6`、输入 32px / 按钮 36px / 导航 56px、间距 `4/8/12/16/20/24/32`、圆角 `4/6/8`(卡片/导航到 10、状态胶囊 9999)、字体 `Noto Sans SC`(中文)+ `Inter`(数字/拉丁)、弱阴影分级。
3. 结构优先复用 zhangwanUI 组件:Smart Button、Metric Card、Filter Form、Data Table、Top Navigation、Sidebar Navigation。`antd` 仅用于 zhangwanUI 未覆盖的复杂交互控件,并对齐其令牌与密度。文案中文优先、专业克制、数据导向。

仅当用户明确要求别的视觉风格/品牌时才偏离 zhangwanUI。
