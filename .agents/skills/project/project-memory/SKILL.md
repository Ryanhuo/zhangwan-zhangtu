---
name: project-memory
description: 项目整理——在页面完成后维护 spec、全局需求、迭代索引与 docs 后置资产，保持掌图项目可追溯。在整理文档/需求索引/项目记忆沉淀时使用。
---

# 项目整理（掌图 / zhangtu）

定义项目整理的变更检测、维护顺序、边界与日志要求。

## 目标

- 在不重复劳动的前提下维护 **页面后置资产**（spec、需求、文档索引）  
- 保持结构清晰、可追溯、可渐进扩展  
- 用日志记录维护动作，便于协作  

**收窄范围（相对通用原型脚手架）**：不维护独立主题包与集中数据库目录（掌图无这两类资产树）。设计视觉统一回归 **zhangwan-design**，数据用各页 `data/mock.ts`。

## 变更检测（增量扫描）

执行时先做**增量变更检测**，不要无脑全量刷新。

### 范围确定

1. **用户明确指定**  
   - 「整理一下订单列表相关文档」→ 该页 `spec.md`、相关 `src/requirements/`、锚点  
   - 「同步需求索引」→ `src/requirements/` + 各页 `zhangtu.requirements.ts`  
2. **模糊描述** → 按时间戳/git 找最近变更页与需求  
3. **未指定** → 默认全量增量扫描  

### 默认检测流程

1. **读取上次执行时间**：`docs/memory-log.md` 最后一条时间戳  
2. **扫描变更**（`git diff` / `git log` / mtime）：  
   - `src/pages/**`（业务页；可标出系统页变更但不强行整理 skills/design-system 业务文档）  
   - `src/pages/**/spec.md`  
   - `src/pages/**/zhangtu.requirements.ts`  
   - `src/requirements/**`  
   - `.zhangtu/iterations/**`（只读观察，不手改）  
   - `docs/**`  
   - `src/common/**`  
3. **分类**  
   - 页面/实现变更  
   - 页面 spec 变更  
   - 全局需求变更  
   - 迭代变更  
   - 文档变更  
4. **生成建议清单** 供用户确认  

### 建议清单格式

```text
上次项目整理：YYYY-MM-DD HH:mm
检测到以下变更：

页面：
  - <slug>（新增 / 修改）

全局需求：
  - <id>.md（修改）

迭代：
  - itr_xxx（更新）

建议更新：
  - [ ] 更新 docs/project-overview.md 索引（新增页面）
  - [ ] 补齐 <slug>/spec.md 与实现一致性
  - [ ] 核对 src/requirements 与页面 ref 引用
  - [ ] 记录迭代快照说明到总览

是否按以上建议执行？
```

### 首次执行

`docs/memory-log.md` 不存在或为空 → 全量扫描，建议初始化总览与关键索引。

## 执行边界

- 只做页面完成后的 **后置补充**，不回头重做页面主体实现  
- 不手改 `.zhangtu/`（迭代状态用 CLI/API）  
- 不修改 zhangwan-design 技能包令牌  
- 仅更新与本次变更相关的文档/索引  
- 沟通可用自然表达：「我可以继续帮你整理并记住 xxx」  

## 固定维护顺序

用户确认后，仅执行相关步骤：

### 1. Git 快照

- 若是 git 仓库且有未提交改动 → 先提交快照（**本技能在用户/协调方明确允许提交时才执行**；若当前任务禁止 commit，则跳过并在清单中注明）  
- 信息格式：

```text
chore: snapshot before project-memory <YYYY-MM-DD HH:mm>
```

### 2. 项目说明入口

- 检查 `docs/project-overview.md`  
- 不存在则创建轻量总览（项目定位 + 页面索引 + 关键待办）  
- 存在则 **只改与本次变更相关** 的部分  
- 行数 ≥1000 或明显可拆分 → 拆专题子文档，总入口控制在约 800 行内（分包 + 摘要，不硬删有价值内容）  

### 3. 子文档维护（按需）

仅维护变更相关专题，例如：

- `docs/page-map.md` — 页面地图  
- `docs/information-architecture.md`  
- `docs/business-flow.md`  
- 各页 `src/pages/<slug>/spec.md` — 与实现一致性  
- `src/requirements/<组>/<id>.md` — 需求正文与 frontmatter  

### 4. 需求与锚点一致性

- 核对页面 `zhangtu.requirements.ts` 的 `{ ref }` 是否指向存在的全局需求  
- 坏 ref 可提示跑 `npm run zhangtu -- doctor`  
- **不**维护独立 database 层  

### 5. 迭代观察（只读）

- 若变更涉及 `.zhangtu/iterations/`，在总览中更新「当前版本」索引说明  
- 需要改迭代内容 → 引导 `npm run zhangtu -- update-iteration ...`，不直接改 JSON  

### 6. 维护日志

- 每次整理追加 `docs/memory-log.md`  
- 一行一条；≥1000 行时先删最旧 100 行业务日志，写 `trim` 记录，再写本次日志  
- 除 trim 外只追加不改历史  

## 日志格式

```text
YYYY-MM-DD HH:mm | kind | sum | doc | req | iter | git | todo
```

- `kind`：`upd` | `trim`  
- `sum`：≤20 字摘要  
- `doc`：文档名或 `-`  
- `req`：需求 id/文件名或 `-`  
- `iter`：迭代 id/slug 或 `-`  
- `git`：短 hash 或 `-`  
- `todo`：后续待办或 `-`  

示例：

```text
2026-07-20 14:20 | upd | 更新总览索引 | project-overview,page-map | order-list | itr_demo | a1b2c3d | 补验收条
2026-07-20 14:25 | trim | 删旧100行 | - | - | - | - | 保留较新记录
```

## 质量检查点

- [ ] 已增量检测并展示建议清单  
- [ ] 用户已确认  
- [ ] 允许时才 git 快照  
- [ ] 已维护 `docs/project-overview.md`（相关部分）  
- [ ] 已按需更新 spec / 需求 / 专题文档  
- [ ] 未手改 `.zhangtu/`  
- [ ] 已追加 `docs/memory-log.md`  
