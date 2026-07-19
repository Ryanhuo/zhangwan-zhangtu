# 原型开发与验收指南

本指南用于 `src/prototypes/<name>/` 下的原型实现、局部修改、多页面组织和预览验收。主题创建、派生和主题页验收优先参考 [docs/theme-guide.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/theme-guide.md)。

## 开发流程

```text
读取已确认需求和设计决策 -> 修改原型目录内代码 -> 运行验收脚本 -> 按错误信息修复 -> 重新验收
```

## 实现边界

- 一个原型目录就是主要隔离边界，页面组件、样式和素材优先留在对应原型目录内。
- 不为单个原型随意修改 `src/common/`、全局主题或共享工具。
- 多步骤或高风险修改先拆成短任务，逐项处理并维护当前状态。
- 一次只处理一个明确问题；遇到构建、运行或验收失败，先定位原因再继续。
- 完成后必须通过预览验收；纯视觉、文案、布局和素材调整不要求测试驱动。

## 文件结构与命名

```text
src/prototypes/<name>/
├── index.tsx
├── style.css
├── components/
├── pages/
├── docs/
└── assets/
```

- 原型入口文件必须是 `index.tsx`。
- 原型目录名使用小写字母、数字、连字符，如 `order-review`。
- 当目录名为 `untitled`、`untitled-*` 或显示名为“未命名”时，开始生成实际内容前应更新为有意义的目录名和 `@name`。
- 本项目当前不产出独立 components 资源；原型内部组件放在对应原型目录下的 `components/`。
- 原型目录文档放在当前原型的 `docs/` 下，例如 `src/prototypes/order-review/docs/prd-03-status.md`。
- `annotation-source.json` 的目录文档节点优先使用相对当前原型目录的 `markdownPath`，例如 `"markdownPath": "docs/prd-03-status.md"`；不要写绝对路径、`..` 或跨原型引用。
- 普通预览和 `@axhub/annotation` 阅读页不显示目录文档编辑入口；编辑 URL 由 Make 批注宿主回调生成，不写进 annotation 包或目录节点数据。
- 只有 Make 批注/编辑工具启用、且当前选中的是带安全本地 `markdownPath` 的目录 Markdown 正文子节点时，批注气泡卡片才显示“文档编辑”按钮。
- 导出或发布时会在构建期内联 `markdownPath` 正文，不依赖运行时请求 `.md` 文件。
- 每个原型的 `index.tsx` 顶部建议包含面向用户的中文 `@name`，用于预览列表展示名。

```ts
/**
 * @name 评审工作台
 */
```

## 多页面原型

- 单个原型可以包含多个页面，通过 URL hash 参数 `#page=<pageId>` 定位。

```text
/prototypes/express-app/#page=home
/prototypes/express-app/#page=detail
```

- 多页面仍属于同一个原型目录；页面组件放在原型内部的 `pages/`，跨页面共享组件放在原型内部的 `components/`。
- 使用公共 hook `src/common/useHashPage.ts`：

```ts
import { useHashPage } from '../../common/useHashPage';

export default function MyApp() {
  const { page, setPage } = useHashPage('home');
  // page === 'home' | 'detail' | ...
}
```

- `pageId` 命名使用小写字母、数字、连字符。
- 不带 `#page=` 时自动使用 `defaultPage`。
- 此路由完全在原型内部，不影响构建。
- 参考实现：`src/prototypes/ref-app-home/index.tsx`。

## 依赖与样式

- React 与 Hooks 直接从 `react` 导入。
- 第三方库按需导入，新增依赖必须同步更新 `package.json`。
- 使用 Tailwind CSS V4 时，入口样式文件需包含：

```css
@import "tailwindcss";
```

- 使用主题 CSS Variables 时，按 zhangwan-design 的 `readme.md`/`tokens/*.css` 和主题规则引入，不复制另一套 token。

## 验收流程

- 运行原型验收脚本：

```bash
node scripts/check-app-ready.mjs /prototypes/[原型目录]
```

- 关键返回字段：
  - `status`: `READY` / `ERROR` / `TIMEOUT`
  - `targetUrl`: 本次验收目标地址
  - `errors`: 构建、运行时或页面加载错误列表

### 错误处理

- `ERROR`：按 `errors` 修复后重新执行验收脚本，直到通过。
- `TIMEOUT`：优先排查 dev server 启动、端口、长任务和运行时阻塞。
- 修复时先处理构建、启动和运行时报错，再处理交互与视觉问题；一次只修一个明确问题，修完重新验收。

## 最小清单

- `index.tsx` 完整存在。
- `index.tsx` 顶部有清晰的 `@name`。
- 占位原型已更新为有意义的目录名和显示名。
- 新增依赖已写入 `package.json`。
- `check-app-ready.mjs` 原型验收通过。

## 当前仓库兼容说明

- 当前仓库仍以 `src/pages/` 作为主要可运行页面目录，本指南用于后续引入 `src/prototypes/` 时的实现和验收约定。
- 在 `src/prototypes/` 尚未启用前，现有页面继续遵循 `src/pages/*/index.tsx + index.html + spec.md` 约定，不强制迁移。
- 若未来新增 `src/prototypes/`，优先按本指南组织原型内部组件、文档和素材，并将页面私有资源留在各自原型目录中。

## `src/pages` 新建页：内容优先（与掌图 Shell 分工）

掌图预览 Shell 已提供左侧页面树与全局工具。**全新业务页默认只做 iframe 内容区**，不要再嵌一套 Sidebar/Navbar 整站壳。

推荐结构：`page-header`（标题+主操作）→ 可选 `page-toolbar`（筛选/Tabs/本页面包屑）→ `page-body`（表格/卡片/表单）。

权威细则与禁令表见根目录 [AGENTS.md](../AGENTS.md)「新建页面流程：内容优先，壳层归掌图」。设计令牌仍以 zhangwan-design 为准，但生成时**先读 tokens 与内容组件**，不要先抄 navigation 示例页。
