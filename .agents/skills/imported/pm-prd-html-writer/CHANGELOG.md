# pm-prd-html-writer Skill 修订历史

本文件记录 **本 Skill 自身**（`skills/pm-prd-html-writer/`）的每次修订，与具体产品 PRD 文档的修订历史无关。

**当前 Skill 版本**：`v1.5.7`

---

## 修订记录（最新在上）

### v1.5.7 — 2026-06-12 19:30:00

| 字段 | 内容 |
|------|------|
| **变更类型** | 新增 |
| **修订人** | Agent |
| **涉及文件** | `references/business-rules-template.md`（新建）、`references/prd-html-conventions.md`、`SKILL.md`、`INSTALL.md`、`CHANGELOG.md`；联动更新 `skills/pm-prd-writer/references/prd-template-enterprise.md` |
| **变更说明** | ① 新增 `business-rules-template.md`：规定 `3.x.5 业务规则` **六类**结构（排序/搜索/加载/交互/校验/删除），收录用户提供的 **核算架构** 完整示例（编号 (1)(2) 写法、按钮【查询】【编辑】【删除】【操作】【增加子项】等），附 Markdown/HTML 片段及与 2.3 全局说明的分工表。② `prd-html-conventions.md` 新增 §1.5；交付检查清单增加业务规则项。③ `pm-prd-writer` 企业模板业务规则节替换为完整示例并指向 HTML 模板文件。 |
| **影响范围** | Agent 生成各功能模块时，`3.x.5` 按六类模板书写模块特有规则；全站通用规则仍引用 2.3，不在 3.x.5 重复。 |

---

### v1.5.6 — 2026-06-12 18:00:00

| 字段 | 内容 |
|------|------|
| **变更类型** | 新增 |
| **修订人** | Agent |
| **涉及文件** | `references/global-rules-template.md`（新建）、`references/prd-html-conventions.md`、`SKILL.md`、`INSTALL.md`、`CHANGELOG.md`；联动更新 `skills/pm-prd-writer/references/prd-template-enterprise.md` |
| **变更说明** | ① 新增 `global-rules-template.md`：收录企业后台 **2.3 全局说明** 完整示例——开篇「统一说明、后续不重复」、规则 (1)–(11)（多语言、唯一性、说明字段、列表排序、编码、权限并集/交集及推演表、下拉加载更多、分页、列表、禁用数据、维度枚举表）、与各章节引用写法、HTML 嵌入片段。② `prd-html-conventions.md` 新增 §1.4 规定位置与引用约定。③ `SKILL.md` 映射表、写作原则、质量检查清单与参考索引同步。④ `pm-prd-writer` 企业模板 2.3 改为摘要表并指向 HTML 模板文件。 |
| **影响范围** | Agent 生成企业后台 HTML PRD 时默认产出第二章 `2.3 全局说明`；各 3.x 模块通过「遵循 2.3 全局说明」引用，避免重复 11 条全局规则。 |

---

### v1.5.5 — 2026-06-12 16:00:00

| 字段 | 内容 |
|------|------|
| **变更类型** | 修改 |
| **修订人** | Agent |
| **涉及文件** | `SKILL.md`、`references/prd-html-conventions.md`、`INSTALL.md`、`CHANGELOG.md`；联动更新 `skills/pm-prd-writer/references/prd-template-enterprise.md` |
| **变更说明** | ① 在 `prd-html-conventions.md` §1.3 新增「必填校验与提示」：Ant Design 5 约定——标签旁红色 *、点击【保存/提交】时校验、**字段下方**内联错误（非顶部 Toast 替代单项必填）；多项未填同时报错并滚动至首个错误。② 「说明」列扩展第四段 `必填提示：…`；必填=否 写「无」；必填=是 写 `字段下方，请输入/请选择/请上传{字段名称}` 等模板（含验证码、开关等特例）。③ 格式/长度/唯一性错误与「未填」区分，写在限制段或 3.x.5 校验规则。④ 附示例 6 与 3.x.5 业务规则片段；更新既有示例行与交付检查清单。 |
| **影响范围** | Agent 生成 HTML PRD 时对必填字段须写清提示位置与文案；业务规则须说明校验触发与顶部 Message 仅用于全局反馈。 |

---

### v1.5.4 — 2026-06-12 14:30:00

| 字段 | 内容 |
|------|------|
| **变更类型** | 修改 |
| **修订人** | Agent |
| **涉及文件** | `SKILL.md`、`references/prd-html-conventions.md`、`references/prototype-to-html-mapping.md`、`INSTALL.md`、`CHANGELOG.md`；联动更新 `skills/pm-prd-writer/references/prd-template-enterprise.md` |
| **变更说明** | ① 在 `prd-html-conventions.md` §1.3 新增「控件类型」标准枚举（37 项，含日期/时间、输入、选择、地址手机、上传等），禁止旧称。② 规定「说明」列固定三段：`格式：…；限制：…；联动：…`，无则写「无」；日期/时间类须在格式段标注如 `YYYY-MM-DD`；输入类写字符/数值限制；联动写带出、级联、计算等规则。③ 附 5 组 Markdown/HTML 示例（日期、限制、联动、状态可编辑、全无）。④ `SKILL.md`、交付检查清单、`INSTALL.md` 同步；`pm-prd-writer` 企业模板控件类型与说明列规则对齐。 |
| **影响范围** | Agent 生成 HTML PRD 时字段表控件类型与说明写法统一；评审人编辑时「说明」列可自由写长文本，「必填」「可修改」仍仅允许是/否。 |

---

### v1.5.3 — 2026-06-12 10:00:00

| 字段 | 内容 |
|------|------|
| **变更类型** | 修改 |
| **修订人** | Agent |
| **涉及文件** | `SKILL.md`、`references/prd-html-conventions.md`、`references/prototype-to-html-mapping.md`、`references/assets/scripts/prd-inline-editor.js`、`INSTALL.md`、`CHANGELOG.md` |
| **变更说明** | ① 在 `prd-html-conventions.md` 新增 §1.3「字段说明表（8 列）」：明确「必填」「可修改」列**只允许**填「是」或「否」；状态/角色等条件（如初始可改、审批中不可改）须写入「说明」列，并附 Markdown/HTML 示例行。② `SKILL.md` 阶段二映射表与写作原则同步该规则。③ `prd-inline-editor.js` 识别 8 列字段表，对「必填」「可修改」单元格做 blur/保存校验，非法值高亮并阻止保存，退出编辑时回滚无效输入。④ `INSTALL.md` 补充字段表校验说明。 |
| **影响范围** | Agent 生成 HTML PRD 时字段表写法更统一；评审人在页面内编辑字段表时「可修改」列被约束为是/否，复杂条件应写在「说明」列。已有 PRD 需重新运行 `init-assets.mjs` 或手动复制新版 `prd-inline-editor.js` 到 `assets/scripts/` 方可获得校验能力。 |

---

### v1.5.2 — 2026-06-11 17:15:00

| 字段 | 内容 |
|------|------|
| **变更类型** | 修改（文档补充） |
| **修订人** | Agent |
| **涉及文件** | `INSTALL.md`、`SKILL.md`、`CHANGELOG.md` |
| **变更说明** | 补充「页面内联编辑」对外说明：① 在 `INSTALL.md` 新增专节，说明工具栏操作（进入编辑 / 保存 / 下载 HTML）、可编辑与跳过的 DOM 范围、`prd-inline-editor.js` 与 `init-assets.mjs` 的复制关系、`#prd-update-meta` 中 `htmlFile` 的配置要求；② 区分三种保存场景（Axhub dev server 的 `/api/html-file`、自建 API、`file://` 下载覆盖）及对外分享时的限制；③ 交付检查清单与 FAQ 增加编辑器相关项；④ 在 `SKILL.md` 参考文件索引中登记 `references/assets/scripts/prd-inline-editor.js`。 |
| **影响范围** | 不影响生成逻辑；接收 skill zip 的用户可通过 `INSTALL.md` 了解页面内编辑能力与保存前提。 |

---

### v1.5.1 — 2026-06-11 16:30:00

| 字段 | 内容 |
|------|------|
| **变更类型** | 新增 |
| **修订人** | Agent |
| **涉及文件** | `INSTALL.md`（新建）、`CHANGELOG.md` |
| **变更说明** | 新增对外分发用的 `INSTALL.md`：① 说明 Skill 本质（Agent 工作流包，非独立软件）及 Cursor / Claude Code / 本仓库三种安装路径；② 列出必须依赖（AI 环境、Node.js）与按需依赖（Playwright、mermaid.min.js、Axhub 仓库）；③ 定义三种使用模式（仅 AI / AI+基础脚本 / 完整 Axhub 工作流），含非本仓库用户的路径传参示例；④ 补充配套 Skill、脚本速查表、交付检查清单与 FAQ，便于压缩 zip 后直接随包分发。 |
| **影响范围** | 不影响 Agent 生成逻辑；对外分享本 Skill 时可将 `INSTALL.md` 作为入门文档，降低接收方配置成本。 |

---

### v1.5.0 — 2026-06-11 14:20:41

| 字段 | 内容 |
|------|------|
| **变更类型** | 修改（交付路径规范） |
| **修订人** | Agent |
| **涉及文件** | `SKILL.md`、`references/asset-management.md`、`references/prd-html-conventions.md`、`references/html-template.html`、`references/prototype-to-html-mapping.md`、`scripts/init-assets.mjs`、`scripts/export-prototype-for-prd.mjs`、`CHANGELOG.md` |
| **变更说明** | 将 HTML PRD 的**唯一正式交付路径**统一为 `src/docs/PRD/[文档名称]/`：① 每个 PRD 按文档名称建独立子文件夹，根级放主 HTML（`[文档名称]_PRD_V[版本].html`）与 `README.md`；② 配套资源（screenshots、prototypes、scripts/mermaid.min.js）放在该文件夹下的 `assets/`，禁止再写入 `src/docs/` 根目录或共享 `src/docs/assets/`；③ 更新 SKILL 阶段三路径表、阶段四验收归档步骤、自动化命令示例、质量检查清单第 4 项；④ 更新 `asset-management.md` 目录树，标注旧路径已废弃；⑤ 参考实现路径改为 `src/docs/PRD/管理模式/管理模式_PRD_V1.0.html`；⑥ 同步更新 `src/docs/PRD/README.md` 索引，并将「地图模式消息报送」PRD 迁移至 `src/docs/PRD/地图模式消息报送/`。 |
| **影响范围** | 此后 Agent 使用本 Skill 生成 PRD 时，必须直接在 `src/docs/PRD/[文档名称]/` 落盘；`init-assets.mjs`、`validate-assets.mjs`、`export-prototype-for-prd.mjs` 等脚本的目标路径参数应指向该 PRD 文件夹。 |

---

### v1.4.0 — 2026-06-11 09:44:16

| 字段 | 内容 |
|------|------|
| **变更类型** | 新增 |
| **修订人** | Agent |
| **涉及文件** | `CHANGELOG.md`（新建）、`SKILL.md`、`references/changelog-format.md`（新建）、`references/asset-management.md` |
| **变更说明** | 建立 Skill 修订历史强制机制：① 新建 `CHANGELOG.md`，按时间倒序记录本 Skill 每次修订，并回填 v1.0.0～v1.3.0 历史变更；② 新建 `references/changelog-format.md`，规定修订时间须为 `YYYY-MM-DD HH:mm:ss`、变更说明须逐条详述（禁止一句话带过）、版本号语义化递增规则；③ 在 `SKILL.md` 新增「Skill 修订历史（强制）」章节，质量检查清单增加第 12 项「已更新 CHANGELOG」；④ 在 `asset-management.md` 区分产品级 CHANGELOG 与 Skill 级 `CHANGELOG.md` 的路径，避免混淆。 |
| **影响范围** | 后续所有 Agent 修改本 Skill 的流程；不影响已生成的 HTML PRD 交付物。 |

---

### v1.3.0 — 2026-06-11 09:40:04

| 字段 | 内容 |
|------|------|
| **变更类型** | 修改（视觉主题升级） |
| **修订人** | Agent |
| **涉及文件** | `references/prd-antd-theme.css`（新建）、`scripts/sync-prd-theme.mjs`（新建）、`references/html-template.html`、`references/prd-html-conventions.md`、`SKILL.md`、`src/docs/管理模式_PRD_V1.0.html`、`src/docs/PRD/管理模式/管理模式_PRD_V1.0.html` |
| **变更说明** | 将 HTML PRD 文档 UI 从 Tailwind 风格蓝（`#2563EB`）整体切换为 **Ant Design 5** 设计语言，主色 `#1677ff`。具体包括：① 新增独立主题源文件 `prd-antd-theme.css`，集中管理设计令牌（主色、文字、边框、圆角、阴影）；② 侧栏改为白底 Menu 风格，标题区纯色 Ant Design 蓝；③ 正文区改为灰底布局 + 白色 Card 容器；④ 表格改为 Ant Design Table（浅灰表头 `#fafafa`、细边框、行悬停）；⑤ 状态标签改为 Ant Design Tag（浅色底 + 彩色边框，替代实心色块）；⑥ 原型区改为 Card + 下划线 Tabs；⑦ 引用块改为 Alert info 样式；⑧ 截图画廊每张图增加 Card 边框；⑨ 新增 `sync-prd-theme.mjs` 脚本，可将主题 CSS 批量注入模板与已有 PRD HTML；⑩ 在 `prd-html-conventions.md` 新增「§0 视觉规范（Ant Design 主题）」章节。 |
| **影响范围** | 此后由本 Skill 新生成或同步主题的 HTML PRD 均使用 Ant Design 蓝主题；已有 PRD 需运行 `sync-prd-theme.mjs` 才能更新样式。 |

---

### v1.2.1 — 2026-06-11 09:29:47

| 字段 | 内容 |
|------|------|
| **变更类型** | 修改（文档约定 + 评测用例扩充） |
| **修订人** | Agent |
| **涉及文件** | `references/prd-html-conventions.md`、`references/asset-management.md`、`references/triggers.md`、`evals/evals.json` |
| **变更说明** | ① 完善 `prd-html-conventions.md`：明确 3.x 五段结构、prototype-gallery 多状态截图规范、prototype-iframe-preview 预览缩放 + 点击全屏交互（避免宽屏原型右侧裁切）、侧栏 `#sidebarDocHint` 文档维护提示、颜色标签 `prd-status-tag` / `prd-hex-tag` 用法；② 更新 `asset-management.md` 资源目录规范、版本管理策略、交付流水线命令速查；③ 扩充 `evals/evals.json` 评测用例（轻量 HTML、多状态截图、离线 Mermaid/iframe、全屏交互、颜色标签、TOC 编号折叠、英文标注等场景）；④ 更新 `triggers.md` 扩展触发词表。 |
| **影响范围** | Agent 生成/维护 HTML PRD 时的结构约束与验收标准；不改变 HTML 模板 DOM 结构。 |

---

### v1.2.0 — 2026-06-11 09:25:12

| 字段 | 内容 |
|------|------|
| **变更类型** | 新增（原型直出流水线） |
| **修订人** | Agent |
| **涉及文件** | `references/prototype-to-html-mapping.md`、`scripts/export-prototype-for-prd.mjs`、`scripts/capture-prototype-states.mjs` |
| **变更说明** | ① 新增 `prototype-to-html-mapping.md`，定义 Axhub Make 原型（`spec.md` + `index.tsx`）到 HTML PRD 章节的完整映射规则，含信息缺口处理、双模式原型区 HTML 片段、多状态截图命名规范；② 新增 `export-prototype-for-prd.mjs`，将可运行原型导出为离线 iframe 包（`assets/prototypes/<name>/`），支持 `--prd` 自动 patch iframe src；③ 增强 `capture-prototype-states.mjs`，支持对管理模式原型各功能模块、各 UI 状态批量 Playwright 截图。以 `management-mode` 为参考实现完成端到端流水线验证。 |
| **影响范围** | 支持「从原型直接生成 HTML PRD」模式；管理模式 PRD 成为参考实现。 |

---

### v1.1.0 — 2026-06-11 09:19:43

| 字段 | 内容 |
|------|------|
| **变更类型** | 新增（脚本工具链 + 离线能力） |
| **修订人** | Agent |
| **涉及文件** | `SKILL.md`、`scripts/_utils.mjs`、`scripts/init-assets.mjs`、`scripts/validate-assets.mjs`、`scripts/package-prd.mjs`、`scripts/screenshot.mjs`、`scripts/clean-assets.mjs`、`scripts/splice-html-content.mjs`、`scripts/localize-prd-english.mjs`、`scripts/capture-prototype-states.mjs`、`references/mermaid-integration.md`、`references/html-template.html` |
| **变更说明** | ① 建立完整 Skill 工作流（阶段零～四：上下文加载、模式选择、内容映射、资源处理、验收输出）；② 新增资源初始化脚本 `init-assets.mjs`；③ 新增资源完整性验证 `validate-assets.mjs`（检查截图、原型、Mermaid 等相对路径引用）；④ 新增交付打包 `package-prd.mjs`（支持 `--include-prototypes`）；⑤ 新增 Playwright 截图 `screenshot.mjs`；⑥ 新增孤儿资源清理 `clean-assets.mjs`；⑦ 新增 HTML 内容拼接 `splice-html-content.mjs`；⑧ 新增英文术语标注 `localize-prd-english.mjs`；⑨ 完善 `html-template.html`：TOC 章节号解析与折叠、Lightbox 图片放大、Mermaid 本地 `mermaid.min.js` 渲染、`prototype-section` 双模式 Tab；⑩ 新增 `mermaid-integration.md` 规定离线 Mermaid 集成规范（禁止 CDN 依赖）。 |
| **影响范围** | 本 Skill 从未定稿脚本升级为可自动化验收的完整工具链；所有 HTML PRD 须通过 `validate-assets.mjs` 方可交付。 |

---

### v1.0.0 — 2026-06-10 17:17:19

| 字段 | 内容 |
|------|------|
| **变更类型** | 新增（初始版本） |
| **修订人** | Agent |
| **涉及文件** | `SKILL.md`、`references/html-template.html`、`references/html-prd-example.html`、`references/triggers.md` |
| **变更说明** | 创建 `pm-prd-html-writer` Skill，定位是将 Markdown PRD 或 Axhub Make 原型升级为可评审的 HTML 版 PRD。初始能力包括：标准五大章 HTML 结构、侧栏 TOC 导航、表格/代码块/引用块排版、截图展示、基础 Lightbox、与 `pm-prd-writer` 的协作关系定义。提供 `html-template.html` 主模板与 `html-prd-example.html` 企业后台参考样例。 |
| **影响范围** | 项目新增 HTML PRD 可视化交付能力。 |

---

## 书写规范

详见 [`references/changelog-format.md`](references/changelog-format.md)。

**强制要求**：每次修改本 Skill 后，在本文档顶部（「修订记录」章节最上方）追加一条新记录，不得跳过或合并多条变更为一条模糊描述。
