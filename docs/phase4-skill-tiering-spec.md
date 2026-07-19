# 第 4 期实现需求文档（交给 grok 执行）

> 状态提示:`docs/pm-capability-map.md` 与 `AGENTS.md` 已把第 4 期标为「已完成」,但**代码尚未实现**（已核验:`skills.mjs`/`api.ts` 无 `tier` 字段、`index.tsx` 无运维折叠、`cli.mjs` 无自同步护栏）。本文档补齐这三项代码,让文档成真。
>
> 仓库根:`/Users/ryan/Desktop/zhangwan-zhangtu`。执行顺序:任务 1 → 任务 2（任务 2 依赖任务 1 的 `tier` 字段）;任务 3 独立可并行。
>
> 全部完成后统一验证:`npm run typecheck && npm run check:pages && npm run build && npm run zhangtu -- doctor`。

---

## 任务 1 · 技能分层字段 `tier`（脚本层 + 类型）

**目标**:每个技能带一个 `tier` 字段,`"capability"`（能力技能）或 `"ops"`（框架运维技能）。

### 1a. `scripts/zhangtu/skills.mjs`
- 顶部加常量:
  ```js
  // 框架运维类技能（安装/初始化/CLI 运维），在技能页默认折叠，与"能力技能"区分。
  const OPS_SKILL_SLUGS = new Set(["zhangtu-installer", "zhangtu-init-prototype-project", "zhangtu-link"]);
  ```
  ⚠️ 执行前先 `ls .agents/skills/project/` 核对真实目录名,以实际 slug 为准增删这个集合（`protolink`/`init-prototype-project` 等可能是别名）。
- 在 `buildSkillSummary(rootDir, entry, lock, callableNameCounts)` 的返回对象里加一个字段:
  ```js
  tier: OPS_SKILL_SLUGS.has(entry.slug) ? "ops" : "capability",
  ```
  （`entry.slug` 在该函数里已可用,参考同函数里 `slug: entry.slug` 的写法。）

### 1b. `src/pages/skills/data/api.ts`
- `SkillSummary` 接口加一行:
  ```ts
  tier: "capability" | "ops";
  ```

**验收**:`node scripts/zhangtu/cli.mjs preview` 后 `curl -s localhost:6320/api/skills | python3 -c "import json,sys;print([(s['slug'],s['tier']) for s in json.load(sys.stdin)['skills']])"` —— 每个技能带 `tier`,运维技能为 `ops`。

---

## 任务 2 · 技能页运维技能折叠区（前端,依赖任务 1）

**文件**:`src/pages/skills/index.tsx`（配套样式 `src/pages/skills/styles/page.css`）。

**现状**:左侧 `SkillFolder` 组件按 `category`（project/user）分两组渲染,见 `SkillsPage` 里的 `projectSkills`/`userSkills`（`useMemo` 过滤）与两处 `<SkillFolder .../>` 调用。

**改法**:
- 新增按 `tier` 的拆分:能力技能（`tier !== "ops"`）默认展示,运维技能（`tier === "ops"`）收进一个**默认折叠**的分组。
  ```tsx
  const capabilitySkills = useMemo(() => skills.filter((s) => s.tier !== "ops"), [skills]);
  const opsSkills = useMemo(() => skills.filter((s) => s.tier === "ops"), [skills]);
  const [isOpsOpen, setIsOpsOpen] = useState(false);
  ```
- 侧栏渲染:能力技能区照旧（可继续按 project/user 分,或直接平铺 `capabilitySkills`);运维技能区做成可点击展开的折叠块,标题「框架运维」+ 数量徽标（复用现有 `.skills-folder-count` class),折叠时不渲染列表项。
- 复用现有 `.skills-folder` / `.skills-folder-header` / `.skills-folder-count` / `.skills-item` 样式;折叠箭头可参考 `shell.html` 里 `.nav-folder-toggle` 的写法,或用一个简单的 `▸/▾` 字符。
- **不改**:技能详情渲染、上传弹窗、`selectedSkillId` 选中逻辑。

**验收**:`node scripts/zhangtu/cli.mjs preview` → 技能页运维技能默认收起,点击「框架运维」展开正常;能力技能照常展示;点选任一技能详情正常;无控制台报错。

---

## 任务 3 · sync-system-files 自同步护栏（隐患修复,独立）

**文件**:`scripts/zhangtu/cli.mjs`,函数 `handleSyncSystemFiles(options)`。

**隐患**:该函数对每个同步目标做 `rmSync(destination, {recursive:true, force:true})` 再 `cpSync(source, destination)`。当在种子仓自身运行（`rootDir === PACKAGE_ROOT`,即 `process.cwd()` 等于包根）时,source 与 destination 同路径 → 先删源再从已删的源复制,会**永久删除 `src/common`、`src/pages/skills`、`src/pages/design-system`、`.agents/skills/project`、`zhangtu.capabilities.json` 等框架文件**。

**改法**:在 `handleSyncSystemFiles` 函数体最开头加护栏:
```js
if (resolve(rootDir) === resolve(PACKAGE_ROOT)) {
  throw new Error("sync-system-files 只能在工作区运行,不能在 zhangwan-zhangtu 种子仓自身运行,否则会 rm+cp 同一路径删除框架文件。");
}
```
（`PACKAGE_ROOT`/`rootDir`/`resolve` 均已在 cli.mjs 顶部定义,直接用。）

**验收**:在种子仓 `npm run zhangtu -- sync-system-files` 应立即中文报错退出、不动任何文件;用一个临时工作区目录（含 zhangtu 结构）跑仍能正常同步。

---

## 完成后收尾
- 若 3 项全绿,`docs/pm-capability-map.md` 与 `AGENTS.md` 的「第 4 期已完成」表述即成真,无需再改文档。
- 如某项未做,请把对应文档表述改回「待做」,保持文档与代码一致。
