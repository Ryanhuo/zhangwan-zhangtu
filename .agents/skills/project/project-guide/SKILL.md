---
name: project-guide
description: 掌图（zhangtu）项目全流程引导——判断项目状态，指导用户高效使用页面发现、预览、需求、迭代与 zhangwan-design。新人上手、意图不清或需要工作流指引时使用。
---

# 掌图项目引导（zhangtu）

你正在协助用户使用 **掌图（zhangtu）** 内部原型系统。先读 `AGENTS.md`（及 Claude 场景下的 `CLAUDE.md`）获取工作流与规范索引。

## 项目参考资料

| 位置 | 作用 |
|------|------|
| `AGENTS.md` | 项目总入口：页面契约、内容优先、技能表、CLI、架构 |
| `CLAUDE.md` | Claude Code 向指引（与 AGENTS 同系规则） |
| `docs/pm-capability-map.md` | PM 能力地图与分期 |
| `docs/pm-workflow-harness.md` | 按阶段组织的工作流主索引 |
| `docs/prototype-development-guide.md` | 原型开发边界与验收 |
| `docs/legacy-prototype-import-guide.md` | 老系统导入：结构可借，视觉重做 |
| `.agents/skills/project/` | 项目技能（zhangwan-design、prd-generator、design-review 等） |
| `zhangtu.config.json` | 项目标题、主题 token、pageNameMap 等 |
| `zhangtu.capabilities.json` | 开箱 PM 能力清单 |
| `scripts/zhangtu/` | CLI 与预览 Shell（`cli.mjs`、`preview-server.mjs`、`shell.html`） |

### 常用命令

```bash
npm start                              # 预览 Shell :6320 + Vite :51720
npm run zhangtu -- doctor              # 健康检查
npm run zhangtu -- inspect-pages --json
npm run zhangtu -- list-iterations --json
npm run check:pages
```

工作流只读引导也可在预览 Shell 侧栏「工作流」查看（数据来自 `manifest.capabilities`）。

---

## 项目状态检测

用户意图不清、新人、或请求指导时执行：

### 检查 1：是否为新项目

- 查看 `src/pages/`  
- **排除**系统页：`skills/`、`design-system/`  
- 仅有系统页、无其他业务页 → **新项目**  
- 存在业务页（含 `index.html` + `index.tsx`）→ **已有项目**  
- 可用：`npm run zhangtu -- inspect-pages --json`  

### 检查 2：项目信息是否完善

- 读 `zhangtu.config.json` 的标题/品牌相关字段（如 `title` 等）  
- 为空、占位或默认名 → **建议补充项目名称与一句话简介**  

### 检查 3：设计规范是否就位

- 掌图 **恒用** `.agents/skills/project/zhangwan-design/`，**无**「创建默认主题」步骤  
- 检测：该目录是否存在且含 `tokens/colors.css` 等  
- 存在 → 提示新建/改版页前 **每次读取当前 tokens**  
- 缺失（异常）→ 建议 `sync-system-files`（**勿在种子仓自身 cwd 执行**）或从框架包恢复  

### 检查 4：内容是否需要沉淀

- 业务页较多，但 `src/requirements/` 很少、各页 `spec.md` 缺失、`docs/` 无项目说明 → **建议** 补 spec、挂需求锚点、用 `project-memory` 整理  
- 有页面集合但无版本 → 建议 `create-iteration`  

### 检查 5：设计是否需要 Review

- 近期有业务页新增/大改且未做设计审查 → **建议** 触发 `design-review`  

### 检查 6：Git 版本管理（仅已有项目）

- 无 `.git` → 建议开启 Git（防丢失、可追溯）  
- 已有 → 无需额外操作  

### 检查 7：健康状态（可选）

```bash
npm run zhangtu -- doctor
```

应尽量 healthy；error 需优先处理。

---

## 推荐流程

### 新项目用户

1. **补充** `zhangtu.config.json` 项目名称/简介  
2. **读** zhangwan-design tokens（不要先抄整站导航示例）  
3. **创建 1–2 个业务页**：`src/pages/<slug>/`（`index.html` + `index.tsx` + `spec.md` + 可选 `styles/page.css`、`data/mock.ts`）  
4. **`npm start`** 在 Shell 侧栏点进页面验收  
5. 扩展到 5–10 个模块；需要时挂 `src/requirements/` 与需求锚点  
6. 用迭代（`.zhangtu/iterations/`）做版本快照与发布  

### 已有项目用户（最佳实践循环）

```text
完善项目信息（zhangtu.config.json）
  ↓
确认 zhangwan-design 可读（tokens 当前内容）
  ↓
创建/改业务页（内容区 only，壳归 Shell）
  ↓
doctor / inspect-pages / 本地预览验收
  ↓
定期 design-review
  ↓
沉淀需求与文档（requirements + project-memory）
  ↓
create/update-iteration → 预览/发布
  ↓
继续迭代
```

### 推荐检查点

| 阶段 | 触发条件 | 推荐动作 |
|------|----------|----------|
| 起步 | 无业务页 | 先建 1–2 页 + 预览 |
| 基础 | 有页但未读设计规范 | 读 zhangwan-design 再改视觉 |
| 扩展 | 3+ 业务页 | 扩到 5–10 模块，补 spec |
| 对齐 | 需求散落口头 | `requirements-exploration` / 全局需求 md |
| 整理 | 页多文档少 | `project-memory` |
| 审查 | 有新增未 review | `design-review` |
| 版本 | 要交付评审 | `list-iterations` / 创建迭代 / 发布 |
| 循环 | 以上完成 | 继续迭代 |

---

## 对话技巧

| 主题 | 建议 |
|------|------|
| 沟通素材 | 多给截图、链接、旧系统页；可用语音描述需求 |
| 会话方式 | 一个任务一个对话，避免多任务混杂 |
| 资料提供 | 有 PRD/表格/接口说明优先给全 |
| 预览验收 | 改完用 Shell 预览，不要只看裸 Vite 页（除非调试单页） |
| 设计 | 一律 zhangwan-design；不要引入冲突的外部「同名」设计技能 |

## 首次回复模板

```text
我可以先带你一起用掌图（zhangtu）开始工作。

几条高效建议：
1. 尽量提供截图、链接或文档；语音描述需求也可以
2. 一个任务放在一个对话里，输出更稳
3. 视觉以项目内 zhangwan-design 为准；页面只做内容区，侧栏/设备框由预览 Shell 提供

如果愿意，告诉我这个项目的名称和一句话定位，我可以帮你写进 zhangtu.config.json。

接下来可以：生成第一个业务原型页，或一起检查现有项目状态（doctor / 页面列表 / 迭代）。
```
