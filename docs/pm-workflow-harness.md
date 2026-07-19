# 产品经理工作流 harness

本文件是**产品经理视角的流程主索引**：把从「一句模糊需求」到「发布带链接的版本」的完整闭环，按阶段映射到本项目里已经存在的权威功能文件（docs 指南、`.agents/skills/project/` 技能、`scripts/zhangtu/` 脚本）。

它只做「阶段 → 该读哪个文件 → 怎么触发 → 产出什么」的编排，不重复各文件的正文；每一阶段的规则以其权威文件为准。AGENTS.md 里的技能表是「按技能名」组织的；本文件是「按流程阶段」组织的，两者互补。

## 闭环总览

```text
需求描述澄清 ──▶ 原型侧落地 ──▶ 原型调整 ──▶ PRD 生成 ──▶ 版本管理
     ▲          (导入/新建/调整)                              │
     └───────────────── 评审反馈 / 需求变更 ──────────────────┘
```

- 需求锚点（`zhangtu.requirements.ts` + `RequirementBadge`）**贯穿全程**，不是单独一个阶段。
- 闭环是可回退的：版本评审出的反馈会回到需求澄清或原型调整，不是一条直线。

## 阶段 → 权威文件映射

| 阶段 | 权威功能文件 | 触发方式 | 产出 |
|------|------|------|------|
| 1. 需求描述澄清 | [requirement-design-alignment.md](requirement-design-alignment.md)（默认对齐流程）；`.agents/skills/project/requirements-exploration/`（用户明确要求深挖需求时） | 新建 / 明显改版自动触发对齐；用户明确说「做需求探索」时叠加 exploration | 已确认的需求 + 设计决策快照 |
| 2a. 原型落地 · 新建 | `.agents/skills/project/zhangtu-init-prototype-project/`（脚手架）+ `.agents/skills/project/zhangwan-design/`（视觉令牌/组件，必读）+ [prototype-development-guide.md](prototype-development-guide.md)（实现规范与验收） | 新建页面 / 原型 | 满足页面契约的 `src/pages/<slug>/` |
| 2b. 原型落地 · 历史系统导入 | [legacy-prototype-import-guide.md](legacy-prototype-import-guide.md)；截图/设计稿另走 `.agents/skills/project/screenshot-to-prototype/` | 参考旧系统真实页 / 截图 / 旧导出原型来还原 | 结构借鉴、视觉一律 zhangwan-design 重做的新页面 |
| 3. 原型调整 | [prototype-development-guide.md](prototype-development-guide.md)（实现边界/验收）+ `.agents/skills/project/explore-options/`（方向不明确时先出 2–3 个方向） | 修改已有页面 | 调整后的页面 + 验收通过 |
| 4. PRD 生成 | `.agents/skills/project/prd-generator/`（面向研发测试的结构化 PRD）；发布时兜底见下 | 用户显式要求出 PRD；或发布迭代时自动合并 | Markdown PRD |
| 5. 版本管理 | `.agents/skills/project/zhangtu-link/`（自然语言编排）→ `scripts/zhangtu/iterations.mjs`（本地版本）+ `scripts/zhangtu/proto-hub.mjs`（远程发布） | 「看看有哪些迭代」「发布这个版本给我链接」 | `.zhangtu/iterations/*.json` + 分享链接 |
| 贯穿 · 需求锚点 | `src/common/zhangtu-requirement.tsx`（`RequirementBadge`）+ 页面内 `zhangtu.requirements.ts`；HTML 评审标注层见 `.agents/skills/project/zw-prototype-annotation-v1.3/` | 页面区域标 `data-zhangtu-requirement-anchor` | 预览侧栏可点击定位到需求 |

## 阶段落地要点

### 1. 需求描述澄清

- 默认先跑 [requirement-design-alignment.md](requirement-design-alignment.md) 的对齐流程：读上下文 → 产品需求对齐 → 设计基底确认（固定为 zhangwan-design）→ 设计决策确认 → 归档快照。
- 局部文案 / 样式 / 素材替换 / 明确 bug 修复可跳过正式对齐，但仍记录本轮关键假设。
- 只有用户**明确**要求做需求探索、或要在动手前产出确认过的需求文档时，才叠加 `requirements-exploration` 技能。

### 2. 原型落地（三种模式）

原型落地不是单一动作，实际有三种来源，走不同的权威文件：

- **新建**：从零生成页面。先读 zhangwan-design 令牌与组件，再按 [prototype-development-guide.md](prototype-development-guide.md) 落地，页面必须满足页面契约（`index.html` + `index.tsx`）。
- **历史系统导入**：参考旧系统（如罗盘）真实页、截图或旧导出原型来还原。**只借结构与交互，视觉一律用 zhangwan-design 重做**，不迁移旧代码。规则见 [legacy-prototype-import-guide.md](legacy-prototype-import-guide.md)。
- **调整**：见阶段 3。

### 3. 原型调整

改已有页面时的默认顺序：

1. 先读该页 `spec.md` 与需求锚点（`zhangtu.requirements.ts`），确认改动落在哪个需求点。
2. 方向不明确时先用 `explore-options` 出 2–3 个方向并收敛，再动手；方向明确的局部改直接改。
3. 视觉与组件一律回到 zhangwan-design 令牌，不引入另一套 token。
4. 按 [prototype-development-guide.md](prototype-development-guide.md) 的实现边界与验收流程收尾。

### 4. PRD 生成

- 面向研发测试的正式 PRD：用 `prd-generator` 技能，基于页面实现 + `spec.md` 匹配模板生成。
- 发布迭代时的兜底：`publish-iteration` 未显式传 `--prd-file` / `--prd-url` 时，会自动合并版本内页面的 `spec.md` 与需求标注，生成临时 Markdown PRD 随版本上传（见 [zhangtu.md](zhangtu.md) 的「发布输入约定」）。

### 5. 版本管理

- 用自然语言表达意图，交给 `zhangtu-link` 技能转成最短 CLI 序列。
- 本地版本 = 迭代，持久化在 `.zhangtu/iterations/itr_*.json`（勿手改）。
- 远程发布经 `proto-hub`：先 `publish-status` 看配置，再 `configure-publish`，最后 `publish-iteration` 拿分享链接。完整命令见 [zhangtu.md](zhangtu.md)。

## 交付前验证

任一阶段产出页面改动后，交付前至少运行（见 AGENTS.md「验证要求」）：

```bash
npm run check:pages
npm run typecheck
npm run build
npm run zhangtu -- inspect-pages --json
npm run zhangtu -- doctor        # 发布/交接前聚合诊断
```
