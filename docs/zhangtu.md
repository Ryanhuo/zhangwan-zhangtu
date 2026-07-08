# 掌图工具说明

这个工具提供适合公司内部复用的原型闭环能力：页面发现、项目预览、需求锚点读取、迭代管理、迭代预览，以及通过 `proto-hub` 上传原型、补传新快照、更新 PRD 和获取分享链接。

权限、SSO、审计和远程存储暂不包含。

## 输入约定

- 页面目录默认扫描 `src/pages`。
- 长期项目资料默认放在 `src/resources`，模板放在 `src/resources/templates`。
- 一个页面至少包含 `index.html` 和 `index.tsx`。
- `spec.md` 是页面产品事实源。
- `zhangtu.requirements.ts` 可选；存在时会被读取为预览侧栏的需求模块。
- 页面里的 `data-zhangtu-requirement-anchor` 会作为需求定位锚点。

## 当前仓库实况

- 当前可发现页面以仓库实况为准，可通过 `npm run zhangtu -- inspect-pages --json` 查看。
- 目前实际存在的页面目录是 `src/pages/hr-management/`、`src/pages/hr-attendance-statistics/`、`src/pages/skills/`。
- `src/pages/demo-workbench/` 当前并不在仓库内，若后续补入，需要按页面契约一起补齐入口和本地依赖文件。

## 新接入页面补充清单

- 必填入口：`index.html`、`index.tsx`。
- 常见页面本地依赖：`styles/page.css`、`data/mock.ts` 或其他 `data/*` 模块、`spec.md`。
- 按需补充的需求 sidecar：`zhangtu.requirements.ts`。
- 当前仓库已存在、可直接复用的共享文件：`src/common/branding.ts`、`src/common/site-brand.tsx`、`src/common/zhangtu-requirement.tsx`、`src/styles/app.css`。
- 当前仓库已安装的通用前端依赖：`react`、`react-dom`、`lucide-react`、`antd`、`@ant-design/icons`。
- 如果页面使用其他组件库，补充时不要只写“饿了么组件”这类泛称，需要给出准确的 npm 包名、版本和 import 写法；本仓库运行时是 React，只有给出 React 可用的组件依赖，页面才能直接接入。

## 需求与设计对齐

- 新建或明显更新原型、主题、项目文档等资源时，默认先执行需求与设计对齐流程，再进入规格、计划和实施。
- 对齐流程包含上下文读取、产品需求确认、掌玩UI `DESIGN.md` 基底确认、设计决策确认和归档要求。
- 详细规则见 [docs/requirement-design-alignment.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/requirement-design-alignment.md)。

## 主题规则

- 本项目主题只能使用掌玩UI。
- 对应 skill 文件为 `.agents/skills/project/zhangwanUI/SKILL.md`，对应设计事实源为 `.agents/skills/project/zhangwanUI/DESIGN.md`。
- 主题创建、更新和验收规则见 [docs/theme-guide.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/theme-guide.md)。

## 资源管理

- 新建项目文档时，默认保存到 `src/resources/`。
- 长期项目资料、模板、图表、数据样例和业务附件的目录边界，按资源指南执行。
- 资源只读链接、Markdown 预览链接和 Make 管理端 deep link 规则见 [docs/resource-guide.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/resource-guide.md)。

## 原型开发与验收

- 当前仓库主目录仍为 `src/pages/`，后续若引入 `src/prototypes/`，原型实现、多页面组织和验收默认遵循原型开发与验收指南。
- 该指南覆盖原型目录边界、`index.tsx` 与 `@name` 约定、多页面 `#page=` 路由、依赖管理和 `check-app-ready.mjs` 验收流程。
- 详细规则见 [docs/prototype-development-guide.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/prototype-development-guide.md)。

## 常用命令

```bash
npm run zhangtu -- inspect-pages --json
npm run zhangtu -- create-iteration "内部评审 V1" "原型工作台首轮评审"
npm run zhangtu -- list-iterations --json
npm run zhangtu -- preview
npm run zhangtu -- preview-iteration "内部评审 V1"
npm run zhangtu -- publish-status
npm run zhangtu -- configure-publish "信鸽" --token pth_xxx --base-url https://chanyan.wozhangwan.com
npm run zhangtu -- upload-prototype ./dist "信鸽" "V8.10 账单优化" --prd-file ./prd.md
npm run zhangtu -- update-remote-version "信鸽" "V8.10 账单优化" --folder ./dist --changelog "按评审反馈调了账单页"
npm run zhangtu -- publish-iteration "内部评审 V1" --prd-url https://bytedance.larkoffice.com/docx/xxx
```

## 本地预览

`preview` 和 `preview-iteration` 会同时启动：

- Vite dev server：负责渲染真实页面。
- Zhangtu shell：负责页面目录、设备预览、需求模块侧栏和 iframe 容器。

预览 manifest 会写入 `.zhangtu/preview/<scope>/manifest.json`，迭代数据会写入 `.zhangtu/iterations/`。

## 发布能力

- `publish-status`：检查当前工作区、环境变量或 `~/.codex/config.toml` 里是否已配置 `PROTO_HUB_TOKEN`，并检测本地是否已有 `proto-hub-mcp` 运行时缓存；缺失时会自动从 `https://chanyan.wozhangwan.com/mcp/proto-hub-mcp.tgz` 下载并缓存（首次执行需要联网，之后复用缓存）。
- `configure-publish`：把默认系统名、token、base URL 写入 `.zhangtu/publish-config.json`，后续发布命令默认复用。
- `list-remote-systems` / `list-remote-versions` / `get-share-link`：查询你有权限操作的系统、版本和分享链接。
- `upload-prototype`：把本地原型目录直接上传到远端系统；若版本名不存在则创建新版本，已存在则追加新快照。
- `update-remote-version`：给已有远端版本补传新原型，或单独更新 PRD 文件 / 在线 PRD 链接。
- `publish-iteration`：把掌图本地迭代构建后打包上传，并把分享链接、PRD 信息和发布时间写回本地版本元数据；已发布版本也可以再次上传新快照。

## 发布输入约定

- 原型目录里必须存在至少一个 `.html` 文件；Vite / React 项目请先 `npm run build`，再指向 `dist/`。
- `prd-file` 仅支持 `.md`、`.markdown`、`.txt`。
- `prd-file` 和 `prd-url` 二选一；若都提供，优先使用 `prd-file`。
- `publish-iteration` 会自动先执行 `npm run build`，再基于当前迭代包含的页面生成上传包。
- `publish-iteration` 未显式传 `--prd-file` 或 `--prd-url` 时，会自动合并版本内页面的 `spec.md` 与需求标注，生成临时 Markdown PRD 并随版本上传。
