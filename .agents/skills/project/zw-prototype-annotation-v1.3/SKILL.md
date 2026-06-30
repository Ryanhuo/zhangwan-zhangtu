---
name: zw-prototype-annotation
version: 1.3.0
description: HTML 原型标注系统（评审专用图层 + 内置编辑器）。在生成 HTML 交互原型时，自动添加三件套标注层：主题色编号角标（annot-marker，默认蓝 #1677FF，可整体改色）、右侧常驻说明面板（annot-sidebar，可拖宽折叠）、可拖动可缩放弹窗卡片（annot-popup），并默认内置编辑器：支持编辑/新增标注（富文本）、改主题色、保存回写原文件（Cmd/Ctrl+S）、本地草稿防丢、导出只读交付版。当用户要求生成原型、创建 HTML 原型页面、添加/编辑需求标注、制作带说明的评审原型时，必须使用此技能。即使用户只说"做个原型""加上标注""编辑原型说明""生成 HTML 页面"也应使用。适用于任何 B 端中后台产品原型。
---

> **版本（SKILL_VERSION）= `1.3.0`** — 集成时同步到 `editorScript` 顶部的 `SKILL_VERSION` 常量；保存时会写入 `<meta name="annot-skill-version">` 以供后续批量识别原型 skill 版本、做迁移。
>
> **v1.3.0(集成体验优化)**:
> - `_closeAllBusinessOverlays` 改为**约定式发现** —— 自动遍历 vm 上所有以 `Dialog`/`Drawer`/`Modal`/`Popup` 结尾且带 `visible` 字段的对象关闭它们,项目侧无需再手工维护字段名列表;不符合命名约定时挂 `window.__ANNOT_CLOSE_OVERLAYS__` 钩子覆盖。
> - SPA bootstrap **默认 ctx 钩子**按常见字段名(`currentView` / `activeTab` / `activeStep` 等)+ `#app` 的 `data-view` / `data-tab` 属性自动推断 viewCtx/tabCtx;绝大多数项目无需手写钩子。
> - SPA bootstrap 抽出 `ROOT_ID` 常量,改根 ID 只需改一处。
> - 新增 `test/REGRESSION.md` 回归用例清单 + `test/fixture-v1.3.0.html` baseline,后续 bump 版本前必须跑完清单。
>
> **v1.2.1**：修复导出只读版后折叠侧栏出现重复角标的 bug。
> - `buildHtml` 新增 `stripRuntimeMarkers` 步骤，剥掉运行期 `body > .annot-marker`（不剥的话源 marker 与 viewerScript 按 pos 重建的 marker 会共存，layout reflow 时 querySelector 只更新第一份）。
> - `reconcileMarkers` 按 `data-annot` 去重 body 级 marker（防 MO 抖动期间偶发的双重 append）。
>
> **v1.2.0（破坏性变更）**：
> - 新增 `annotations[id].pos = { container, left, top, viewCtx?, tabCtx? }` 作为角标位置的**唯一数据源**；DOM 角标由 `renderMarker / reconcileMarkers` 从 pos 派生，MutationObserver 监听 body 变化自动重渲。
> - **移除** 旧字段 `addedMarkers[]` / `movedMarkers{}`（草稿读到时自动迁移到 `pos` 后丢弃，向后兼容一次）。
> - 新增项目级钩子 `window.__ANNOT_VIEW_CTX__` / `window.__ANNOT_TAB_CTX__`，用于同 container 出现在多 view/tab 时去歧义。
> - `containerOpeners` 支持复合 key：`container@viewCtx` → `container@tabCtx` → `container` 顺序查找；侧栏切条目时自动关闭业务弹窗/抽屉再开新容器。
> - `modalAnnotIds` **降级为兼容字段**（默认 `[]`），优先级低于 `containerOpeners`；新原型用 `pos.container` + `containerOpeners` 取代。

# 原型标注系统

为 HTML 交互原型提供「评审专用图层」——三个组件配合使用，让产品评审时能直观对照需求点。

## 架构：三件套

| 组件 | 类名前缀 | 用途 | 位置 |
|------|----------|------|------|
| **编号角标** | `annot-marker` | 在页面 UI 上标记需求点位置 | 放在对应区域的相对定位容器内 |
| **说明面板** | `annot-sidebar` | 右侧固定面板，集中展示所有需求点的分组说明 | 页面右侧 fixed |
| **弹窗卡片** | `annot-popup` | 点击角标弹出的详情说明，可拖动、右下角可缩放（尺寸按条记忆） | fixed，跟随点击位置 |

每个生成的原型都**默认内置编辑器**（编辑工具条 + 编辑弹窗 + 编辑器脚本）。评审时直接在页面上改/增标注、保存回写原文件；对开发交付时用「导出只读版」剥离整个编辑器，得到纯展示 HTML。

三者通过 `data-annot` / `data-annot-target` 属性关联：
- `annot-marker[data-annot="1"]` ← 点击 → 弹出 popup 显示 id=1 的内容
- `annot-item[data-annot-target="1"]` ← 点击 → 滚动高亮对应 marker

## 使用规则

### 何时添加标注

每个 HTML 原型页面都应包含完整标注系统。角标用**从上到下的顺序整数编号**（`1, 2, 3 …`），不要用 PRD 功能编号当角标。标注与 PRD 的对应关系记录在 `ref` 字段（如 `PRD 1.3`），渲染为条目上的灰色 PRD 编号标签，与角标分离。

### PRD 功能需求到原型标注的映射

原型标注内容应直接从 PRD 功能需求中提取，映射关系：

| PRD 功能标注项 | 原型标注中对应内容 |
|----------------|-------------------|
| PRD 功能编号 | 写入 `ref` 字段（如 `PRD 1.3`），以灰色 ref 标签展示，**不作为角标序号** |
| 说明 | 标注标题 + 详情描述 |
| 字段定义表格（筛选/列表/表单） | 标注中的字段规格表格 |
| 异常/逆向场景 | 标注中的"异常处理"小节 |
| 验收标准 | 不放入标注（验收标准留在 PRD 中供测试使用） |

生成标注内容时，优先从 PRD 的结构化表格中提取信息：
- **筛选区标注**：提取筛选项表格（字段/类型/数据来源/默认值），加上交互规则和重置行为
- **列表标注**：提取列定义表格（列名/排序/宽度），加上分页、行操作和异常处理
- **表单标注**：提取字段定义表格（字段名/类型/必填/校验规则/默认值），加上联动规则和异常处理
- **详情页标注**：提取展示字段表格，加上操作按钮和异常处理
- **删除/危险操作标注**：提取二次确认文案和异常处理（如引用阻止）

### 角标放置原则

- 标注落在哪个区域 → 该区域加 `data-annot-container="<unique-name>"`。**marker 由 viewerScript 在 body 顶层 fixed 投影,不再挂进业务子树**(v1.2.0 起);因此父容器不再需要 `position:relative`,marker 也不需要写在源 HTML 里 —— 写在 `annotations[id].pos` 就够。
- 仍可在源模板里写硬编码 `<span class="annot-marker" data-annot="N" style="right:10px;top:8px;">N</span>` 作为"种子",首帧 `migrateBakedMarker` 会读出锚 + container 并撤掉 DOM,之后 marker 在 body 顶层重建。**烤入 marker 会破坏 Vue patch 路径**(Vue 把它当 vnode 子节点纳入 anchor 计算 → 视图切换时 NotFoundError),所以 v1.2.0 起**推荐**直接在 annotations 里写 `pos: { container, right, top, viewCtx }` 而非烤模板。
- 新增/变更功能点必须有角标
- 一个页面不宜超过 10 个角标,过多时合并相关功能点

### 标注内容禁区

1. **禁止写"业务场景"段落**：不在标注中描述使用场景（如"出纳可筛选…来源 → 集中处理…"），标注只说明功能规格本身
2. **禁止列举已有功能并注明"保持不变"**：不写类似"其余原有筛选项（创建时间、审批编号…）保持不变"的 quote-block，标注只覆盖本版本新增/变更的内容
3. **禁止"背景/目的/概述"开场段**：`<h4>PRD…</h4>` 标题后不要放灰色 intro `<p>` 去解释概念背景、功能目的或复述标题。标注只承载可还原交互的规则，标题下直接进入规则区块（识别规则 / 字段表 / 交互规则）。具体禁止：
   - 概念解释——"'先付后补'不是独立单据类型，而是…场景"
   - 目的/收益——"帮助出纳快速感知全局到期情况""提醒财务注意"
   - 复述标题的空概述——"在现有筛选栏基础上新增筛选条件"
   - 下文明细已覆盖的概述——"v8.9 起导入模板移除 6 个付款操作字段…"

   **例外（应保留）**：承载入口条件 / 触发范围 / 系统响应行为的开场句，如"审核通过后（已审核+待付款），操作列显示'提交付款'""仅线下+处理中可回填""校验仅对关联每刻单据的付款单执行""审核结果以顶部 Message 提示、无弹窗、详情页字段只读"。
   **判断标准**：删掉这句后是否丢失"何时出现 / 作用于谁 / 系统怎么响应"这类规格信息——丢了就保留，没丢就删。

4. **禁止给标注按条改色（保持颜色一致）**：所有角标/条目统一用主题色（默认蓝 `#1677FF`，由 `--annot-theme` 驱动，用户可在编辑器里整体改主题色），`annotations[*].color` 一律留空 `""`。不要为了"突出某条变更"给个别标注改成橙色/红色等——一页里多种颜色会让评审误以为有分级语义，造成不一致。颜色按条覆盖能力仅保留给用户在编辑器里手动微调，**生成阶段不主动使用**。
5. **禁止写"本侧不做处理 / 由他方承接"的内容**：本系统不处理、交由对接方/上游/下游系统负责的逻辑，不写进标注。标注只承载本系统在本页**实际要做**的规格；不做的事既不打角标也不在 detail 里说明（如"离职数据由钉钉侧承接""该字段由掌游侧维护"——属边界说明，留在 PRD，不进原型标注）。

### 标注精简原则（弹窗/表单场景）

当弹窗或表单详情页中存在多个关联字段需要标注时，**禁止逐字段打角标**，必须按功能维度合并：

- **一个表单 = 一个标注**：将所有可编辑字段的控件类型、可选值、默认值、是否必填汇总到一张表格中，用一个角标标在弹窗标题栏或表单区域顶部
- **一个校验逻辑 = 一个标注**：将所有校验规则 + 通过/失败展示 + 按钮联动逻辑合并到一个标注中
- 角标放在**区域级别**（如弹窗 header、校验区容器），而不是单个字段旁边
- 标注内容用表格呈现字段规范，用列表补充关键业务规则，避免重复分散

**反例（不要这样做）：**
```
弹窗内 5 个角标：⑤付款账号 ⑥付款类型 ⑦预约时间 ⑧校验规则 ⑩付款模式
→ 角标过多、内容碎片化，评审时来回跳转
```

**正例：**
```
弹窗内 2 个角标：⑦审核详情页规范（一张表覆盖全部可编辑字段） ⑧系统前置校验（校验+按钮联动）
→ 结构清晰，一个角标讲一件完整的事
```

#### 表单字段规范的表格格式

当标注涉及多个可编辑字段的规格说明时，**必须使用表格**展示，表格列固定为：`字段 | 控件 | 可选值 | 默认 | 必填`。

```html
<div style="overflow-x:auto;margin:8px 0;">
  <table style="width:100%;min-width:420px;border-collapse:collapse;font-size:11px;line-height:1.5;">
    <thead>
      <tr style="background:#F4F5F7;">
        <th style="padding:4px 6px;text-align:left;border-bottom:2px solid #D9DCE1;white-space:nowrap;">字段</th>
        <th style="padding:4px 6px;text-align:left;border-bottom:2px solid #D9DCE1;white-space:nowrap;">控件</th>
        <th style="padding:4px 6px;text-align:left;border-bottom:2px solid #D9DCE1;white-space:nowrap;">可选值</th>
        <th style="padding:4px 6px;text-align:left;border-bottom:2px solid #D9DCE1;white-space:nowrap;">默认</th>
        <th style="padding:4px 6px;text-align:center;border-bottom:2px solid #D9DCE1;white-space:nowrap;">必填</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom:1px solid #f0f0f0;">
        <td style="padding:4px 6px;white-space:nowrap;font-weight:600;">字段名</td>
        <td style="padding:4px 6px;white-space:nowrap;">下拉/文本框/日期时间</td>
        <td style="padding:4px 6px;">选项A / 选项B</td>
        <td style="padding:4px 6px;white-space:nowrap;">默认值</td>
        <td style="padding:4px 6px;text-align:center;">是/否</td>
      </tr>
    </tbody>
  </table>
</div>
```

关键样式要点：
- 外层 `div` 设 `overflow-x:auto`，面板宽度不够时可横滚
- 表格 `min-width:420px`，保证列不会被压缩变形
- 表头灰色背景 `#F4F5F7` + 灰色下边框 `#D9DCE1`（详情表头不跟随主题色，保持中性）
- 字段名列加 `font-weight:600` 加粗突出
- 固定文本列加 `white-space:nowrap` 防止换行

#### overflow 容器内的角标(v1.2.0 起自动解决)

v1.2.0 起 marker 在 body 顶层 fixed 投影,**不再被父级 `overflow:auto/hidden` 或 `position:sticky` 裁切**。表头 `<th>`、横滚 tab 栏内的标注直接用默认 `pos: { container: 'xxx', right: 8, top: 4 }` 即可,无需 inline-flex 包装 / `position:relative` 覆盖规则。

仅当 host 自身在 `transform`/`will-change`/`filter` 触发的新 stacking context 内、且 marker 视觉需要"完全跟随 host 内部滚动"时,才需要回退到 v1.1.x 行内定位方案 —— 这种场景在常规 SPA 原型中极少。

- HTML 上去掉 `style="top:...; right:...;"` 的内联定位
- 角标直接跟在文字后面，如 `<th>列名<span class="annot-marker" data-annot="2">2</span></th>`

### 面板内容组织

面板条目由 JS 动态渲染，每个 `annot-item` 包含：
- 编号（与角标一致，背景用该条标注色）
- 标题（简短描述功能点）
- **分类标签**（可选，`annot-cat-tag`，描边样式：白底 + 主题色边框 + 主题色文字）
- **PRD 编号标签**（可选，`annot-ref-tag`，灰底等宽字体）
- 详情（富文本，用 `.rt` 渲染：`<h4>` 分小节，`<ul>/<ol>` 列条目，`<code>` 标代码，`<table>` 表格，`<img>` 图片）

#### 分类（取代旧「位置标签」）

标注用一个可选的「分类」维度归类，枚举固定为 `列表 / 弹窗 / 页签 / 筛选 / 表单 / 操作 / 其他`（`CATEGORIES` 数组）。

- **非必填，默认空**——空则不显示分类标签。
- 取代了旧的「位置标签」强制规则：不再要求每条都标所属页面区域，也不再用 `annot-modal-tag`。
- 藏在业务弹窗/抽屉内的标注用 `category: "弹窗"`；藏在未激活 Tab / 折叠面板内的用 `category: "页签"`。
- 分类在编辑弹窗中以下拉选择，写入 `annotations[id].category`。

### 数据结构

所有标注内容集中定义在 `#annotData` 脚本的单一 `annotations` 对象中——这是**唯一数据源**，侧栏条目由 JS 动态渲染（不要手写 `annot-item`）。

```html
<script id="annotData">
/*ANNOT_DATA_START*/
var annotations = {
  "1": {
    "title": "功能点标题",
    "category": "筛选",
    "color": "",
    "ref": "PRD 3.1.1",
    "detail": "<h4>小标题</h4><ul><li>说明条目</li><li><strong>关键信息</strong>加粗</li></ul>"
  }
  // ...更多标注
};
/*ANNOT_DATA_END*/
</script>
```

字段说明：

| 字段 | 含义 | 备注 |
|------|------|------|
| `title` | 条目标题 | 必填 |
| `category` | 分类 | `列表/弹窗/页签/筛选/表单/操作/其他` 或空，非必填 |
| `color` | 该条标注色 | **生成阶段一律留空 `""`**（用主题色，默认蓝 `#1677FF`，保持全页一致）；按条覆盖仅供用户在编辑器手动微调 |
| `ref` | 对应 PRD/SRS 编号 | 如 `PRD 3.1.1`，作为条目编号标签展示 |
| `pos` | **角标位置（v1.2.0+ 唯一真相）** | `{ container, left, top, viewCtx?, tabCtx? }`。`container` = 所在 `[data-annot-container]` 名；`left/top` = 相对该容器的像素偏移；`viewCtx/tabCtx` 由 `__ANNOT_VIEW_CTX__` / `__ANNOT_TAB_CTX__` 钩子写入，用于同名 container 出现在多 view/tab 时的去歧义。落点时由 add-click 写入；DOM 上的角标由 `renderMarker` 从 pos 派生 |
| `opener` | 兼容字段（已弱化） | 旧版本由用户手选的 `containerOpeners` key；v1.2.0 起 viewer 默认按 `pos.container` 自动匹配 opener，本字段仅在用户显式赋值时生效 |
| `detail` | 富文本 HTML | 用 `.rt` 渲染；运行期弹窗缩放会附加 `w`/`h` |

**关键约束：**
- 必须用 `var`（不能用 `const`）——草稿恢复 / 保存回写需重新赋值。
- `/*ANNOT_DATA_START*/` … `/*ANNOT_DATA_END*/` 标记用于保存时整体替换数据块，**勿删**。
- key（标注编号）与角标 `data-annot` 一一对应，为**从上到下的顺序整数**（`1, 2, 3 …`）——角标直接显示该 key。PRD 编号放 `ref` 字段，不进 key。页面内**新增**的标注由 `nextId` 续号（`while (annotations[id]) id = String(nextId++);` 仅作 ID 占用兜底）。
- 初始数据可用可读 JS 对象书写；一旦在页面内编辑保存，数据块会被替换为 `JSON.stringify` 格式（带转义）。属预期取舍。

## 集成步骤

生成原型 HTML 时，按以下步骤集成标注系统（完整代码见 → `references/annotation-code.md`）：

1. **CSS** — 复制「一、CSS」全部到 `<style>`（含角标/面板/条目/弹窗 + 编辑工具条/编辑弹窗/富文本编辑器样式）
2. **内容区 padding** — 给业务顶层容器（`body` 或 `.content`）加 `padding-right: 360px`，折叠态 `body.annot-collapsed` 为 `60px`
3. **角标位置数据** — v1.2.0 起 marker 不写入 HTML,直接在 `annotations[id].pos = { container, right|left, top|bottom, viewCtx? }` 里给坐标即可,viewerScript 会在 body 顶层 fixed 投影。仍可写硬编码 `<span class="annot-marker">` 当种子(首帧迁移),但不推荐 —— 硬编码 marker 会被 Vue 纳入 vnode 树,触发 v-if 切换时的 `insertBefore` 报错。
4. **侧栏 HTML** — 放置 `<aside class="annot-sidebar">`，内含编辑工具条 `#editorToolbar` + 空容器 `<div id="annotList"></div>`（条目由 JS 渲染，勿手写）
5. **弹窗 HTML** — 放置一个全局可缩放 `<div class="annot-popup" id="popup">`
6. **编辑弹窗 HTML** — 放置 `<div class="annot-edit-overlay" id="editOverlay">`（含分类 select、颜色 picker、PRD 编号、富文本工具栏 `#rtToolbar` + 编辑器 `#rtEditor`）+ toast 容器
7. **SPA bootstrap**（Vue / React 等框架原型**必加**,纯静态可省略,v1.3.0 简化）— 在业务框架脚本（`new Vue` / `ReactDOM.render` 等）**之前**复制「2.5 SPA bootstrap」那段 IIFE。它做三件事:① 把 `#app` 源模板抓到 `window.__ANNOT_APP_TEMPLATE__`(保存时 `buildHtml` 用它覆盖渲染后的 DOM,避免烤死 `@click` / `:visible.sync` / `v-if` / `<el-*>` 指令);② 提供**默认** `__ANNOT_VIEW_CTX__` / `__ANNOT_TAB_CTX__` 钩子,按常见字段名(`currentView` / `activeView` / `activeTab` / `activeStep` …)+ `#app` 的 `data-view`/`data-tab` 属性自动推断;③ 业务根 ID 不是 `#app` 时改 `ROOT_ID` 常量。**v1.3.0 起绝大多数项目直接拷贝即可,无需改字段名;** 仅当 vm 字段名不在默认列表里时,在 bootstrap 脚本**之后**覆写对应钩子。**漏了这一步会让保存功能烤死框架指令、原型保存后失去交互**(`@click` / `:visible.sync` / `v-if` / `<el-*>` 全部失效)。
8. **三段脚本** — 依次放在 `</body>` 前：
   - `#annotData`：填入当前页面的 `annotations` 数据（`var`，包在标记注释内）
   - `#viewerScript`：原样复制；如有弹窗内角标，填 `modalAnnotIds` 并实现 `openModalFor`
   - `#editorScript`：原样复制

### SPA 原型必读（Vue / React 等）

`buildHtml` 用的是 `document.documentElement.cloneNode(true)` —— 克隆的是**渲染后的实时 DOM**。对 Vue/React 等编译型框架，渲染后已经没有源指令（`@click` / `:visible.sync` / `v-if` / `<el-*>` 自定义标签全部被编译/移除），直接保存就会把渲染结果烤进文件，再打开时框架重新挂载在一堆死 HTML 上 —— 按钮不响应、弹窗打不开、列表不渲染。

**解法（已内置于 `#editorScript`）**：保存时若检测到 `window.__ANNOT_APP_TEMPLATE__` 是字符串，`buildHtml` 会用它覆盖 `#app` 的渲染后 DOM。v1.2.0 起 marker 不再回写进源模板 —— annotations[id].pos 是唯一真相，下次打开页面由 viewerScript 在 body 顶层 fixed 投影重建。

**SPA 原型集成约定（必须遵守）：**
- 步骤 7 的 bootstrap IIFE 必须**早于**框架挂载脚本执行
- v1.2.0 起 marker 在 body 顶层 fixed 投影 —— 不强制写进 `#app` 内,但 `data-annot-container` 容器必须在 `#app` 内(viewerScript 需要按容器找投影锚)
- v1.3.0 起 ctx 钩子有默认实现(按 `currentView` / `activeView` / `activeTab` / `activeStep` / `currentStep` 等常见字段名 + `#app` 的 `data-view`/`data-tab` 属性自动推断),**绝大多数项目直接复用,无需手写**。仅当本项目字段名不在默认列表里时,在 bootstrap 脚本之后覆写:
  ```js
  window.__ANNOT_VIEW_CTX__ = function () {
    var vm = document.getElementById('app').__vue__;
    return vm ? (vm.myCustomView || '') : '';   // ← 本项目特殊字段
  };
  ```
  返回 `''` 表示当前不在某 view/tab 内 —— pos 不会写入对应 ctx。
- `openModalFor`（旧字段 `modalAnnotIds` 的回调）和 `containerOpeners` 中的函数都通过 `var vm = document.getElementById('app').__vue__;` 调组件方法（如 `vm.openLog(vm.rows[0])`），不要靠手动 dispatch 假事件
- 业务框架根容器不是 `#app` 时,改 bootstrap 里的 `ROOT_ID` 常量 + `buildHtml` 内 `clone.querySelector('#app')` 同步改成对应 ID

### 弹窗 / 抽屉里手动新增标注的承接锚点

**问题**：在业务弹窗/抽屉/Tab 内打开后，进入编辑模式 → 点「+新增标注」→ 在弹窗内点击落点，默认行为是角标 `document.body.appendChild` + 用页面绝对坐标；弹窗关闭后角标留在 body 上，保存还原时被挂到 `#app` 根级，视觉上**漂到了基础页（如列表区）**。原因：弹窗 DOM 是框架渲染产物，不在 `__ANNOT_APP_TEMPLATE__` 源模板里——没有可承接的位置。

**解法**：在源模板里给弹窗/抽屉/分区内部预留一个 **`data-annot-container`** 承接 div，命名在页面内唯一：

```html
<el-dialog :visible.sync="logDialog.visible">
  <div data-annot-container="dialog-log" style="position:relative;">
    ...弹窗业务内容...
  </div>
</el-dialog>
```

编辑器落点逻辑（`#editorScript`）会做 `e.target.closest('[data-annot-container]')`：
- 命中 → 角标坐标按 `getBoundingClientRect()` 换算成相对坐标，写入 `annotations[id].pos = { container, left, top, viewCtx?, tabCtx? }`；DOM 上的角标由 `renderMarker` 统一从 pos 派生。
- 未命中 → 在弹窗 wrapper 内的话回退到该弹窗内首个 `[data-annot-container]`；连一个都没声明的话 toast 提示并放弃落点（**v1.2.0 起不再回退到 body**——避免角标漂到基础页）。

保存还原（`buildHtml.restoreAppTemplate`）流程：先 `stripAll` 清空模板里所有 `.annot-marker`，再按 `annotations[id].pos.container` 名 `querySelector` 单遍重建。容器在源模板里不存在的标注会被跳过（**不再回退到 #app 根**），保证角标只长在它声明归属的容器里。

**何时建议加 container：**
- 业务弹窗（el-dialog）、抽屉（el-drawer）的内容根 div
- 折叠面板、未激活 Tab 的内容根 div
- **多步表单 / 切换型容器的每个 step（v-show 切换的 step div）必须分别加** —— 例如 `step-run` / `step-contract` / `step-template` / `step-fund` 各占一个 `data-annot-container`。若整组共享一个外层容器（如 `view-compile`），在某个 step 里新增的角标会用相对外层的绝对坐标定位，切到其它 step 后角标依然按那个坐标显示，看起来就是"标在 A 步的角标在 B 步漏出来"。**判断标准**：只要容器靠 `v-show`/`v-if` 切显隐、且多个兄弟容器共用一个父级坐标系，就必须每个都加 container（一个父容器加 N 个 step 容器）。
- **多视图共用的全局单例弹窗（如全局 logDialog 被列表页与任务记录页共用）** —— 给每个视图入口的根容器也加 `data-annot-container`（如 `view-execution-record`），并在 `containerOpeners` 注册组合 opener（先切视图再 open dialog）。原因：落点逻辑只能记下角标 DOM 挂在 dialog 容器内，无法捕获用户从哪个视图入口打开了 dialog；不区分 opener 时跨视图标注会全部回到默认入口。详见下方 containerOpeners 段落。
- 基础页里希望"运行期新增的角标长在卡片里、而非漂在 body 上"的区块（如 `data-annot-container="list-area"`、`data-annot-container="filter-area"`）

**命名约定**：值在页面内唯一（如 `dialog-log` / `drawer-detail` / `tab-abnormal` / `list-area` / `step-fund`）。注意承接容器自身必须是定位元素（编辑器会自动补 `position:relative`，但写在源码里更稳）。

**弹窗内 closest 兜底**：编辑器在用户点击落点时，若 `closest('[data-annot-container]')` 没命中、但点击发生在已知业务弹窗/抽屉容器内（`.el-dialog__wrapper` / `.el-drawer__wrapper` / `.ant-modal-wrap` / `.ant-drawer` / `.n-modal-mask` / `.n-drawer-mask` / `dialog`），会自动 fallback 到该弹窗内的首个 `data-annot-container`。若该弹窗连一个 container 都没声明，编辑器会 toast 提示并放弃本次落点 —— **不会再让角标漂到 body 上、关闭弹窗后落回基础页的列表区**（典型 bug）。所以每个会承接新角标的弹窗，至少要在内容根 div 上加一个 `data-annot-container`。

**侧栏点条目联动开容器（containerOpeners）**：在弹窗/抽屉内 add 进去的角标，默认情况下用户点侧栏条目时只会调 `highlightMarker` 滚到角标——但容器关着、角标不在屏幕上，看起来就是"没反应"。给 `containerOpeners` 加一条映射即可让 viewer 自动开容器：

```js
// 在 #viewerScript 顶部声明
var containerOpeners = {
  'dialog-log': function () { var vm = document.getElementById('app').__vue__; vm.openLog(vm.rows[0]); },
  'drawer-detail': function () { var vm = document.getElementById('app').__vue__; vm.openDetail(); }
};
// 多 step 表单可用 helper 批量生成（先进入承载视图，再切到目标 step）
function _stepOpener(stepKey) {
  return function () {
    var vm = document.getElementById('app').__vue__; if (!vm) return;
    vm.goCompile('add');
    setTimeout(function () { vm.compile.active = stepKey; }, 50);
  };
}
// containerOpeners['step-fund'] = _stepOpener('fund');
```

**复合 key 查找顺序（v1.2.0+）**：`bindItem` 用 `annotations[id].pos.container` 配合 viewCtx/tabCtx 按以下顺序查 opener：

1. `container@viewCtx`（如 `dialog-log@view-execution-record`）—— 最精确，区分多视图入口共用的同名容器
2. `container@tabCtx`（如 `dialog-start@drama`）—— Tab 内独立 opener
3. `container`（如 `dialog-log`）—— 兜底单视图 opener

命中即调 opener。注册 opener 时按需用 `'container@ctx'` 或纯 `'container'` 当 key。

**已声明 `data-annot-container` 的弹窗/抽屉建议都顺手给出 opener**，否则运行期新增到该容器里的角标，侧栏条目就点不动。`annotations[id].opener` 是兼容字段（旧版本由用户手选），优先级最高，但**新原型不需要主动设它**——pos.container + ctx 钩子已经能覆盖绝大多数场景。`modalAnnotIds` 是更老的字段，进一步降级为兜底（默认 `[]`），仅当某标注既无 `pos` 又无对应 opener 时才生效。

**全局单例弹窗 / 多入口共享容器（v1.2.0 推荐方案：viewCtx 复合 key）**：当一个 `el-dialog`（如 `logDialog`）被多个视图入口共用（列表的「日志」按钮、任务记录页的「日志」按钮），落点 add-click 把角标记在 `dialog-log` 容器里——但 `__ANNOT_VIEW_CTX__` 钩子会同时把"当前视图字符串"写入 `pos.viewCtx`。viewer 据此自动选对应的 opener：

```js
// 列表视图入口：默认从 list 视图开
containerOpeners['dialog-log']                          = function () { var vm=document.getElementById('app').__vue__; vm.openLog(vm.rows[0]); };
// 执行计划视图入口：复合 key,先切视图再开 dialog
containerOpeners['dialog-log@view-execution-record']    = function () {
  var vm=document.getElementById('app').__vue__;
  vm.goExecutionRecord(vm.rows[0]);
  setTimeout(function () { vm.openLog(vm.er.rows[0], 'record'); }, 80);
};
```

打标时用户从执行计划视图打开 dialog → `pos.viewCtx = 'view-execution-record'` → viewer 命中 `dialog-log@view-execution-record` → 自动切视图 + 开 dialog。从列表打开则命中 `dialog-log`，从主视图开。**无需用户手选 opener**。

### containerOpeners 的「行匹配」规范（重要）

当一个弹窗模板按 row 字段做 `v-if` 切换字段时（例：发起结算弹窗在 `sett_supply_type_text === '我方'` 时隐藏「结算金额/结算单」字段），opener **不能图省事用 `vm.rows[0]`**——`rows[0]` 可能就是被 `v-if` 隐藏字段的那种 row，导致用户点条目打开的弹窗与他打标时看到的弹窗字段不一致。

**正解**：opener 内部先按打标当时看到的 row 字段分支挑一行匹配的：

```js
'dialog-start': function () {
  var vm = document.getElementById('app').__vue__; if (!vm) return;
  vm.currentView = 'list';
  var row = null;
  if (vm.rows && vm.rows.length) {
    for (var i = 0; i < vm.rows.length; i++) {
      var r = vm.rows[i];
      // 按"打标当时所有字段都齐全"的分支挑选,通常是非默认/非简化分支
      if (r.sett_supply_type_text === '合作方'
          && (r.run_type === '2' || r.run_type === '3')
          && r.is_valid === '1') { row = r; break; }
    }
    if (!row) row = vm.rows[0];
  }
  if (!row) row = { sett_supply_type_text: '合作方', run_type: '2' };
  vm.openStartSettle(row);
}
```

**判断标准**：弹窗里有 `v-if="row.xxx === 'A'"` / `v-show` / 三元渲染的字段——就一定要匹配能让这些字段都渲染出来的 row。

### 编辑弹窗已不再展示「关联打开方式」select

v1.2.0 起 `pos.container` + `viewCtx/tabCtx` 已经能让 viewer 自动识别打开方式。原编辑弹窗里的 opener 下拉移除（`emOpener` 字段）；`annotations[id].opener` 字段保留作为兼容（草稿/旧文件读到时尊重它），但生成阶段不再写入。新增/编辑标注无需手选 opener。

## 编辑 / 新增 / 保存 / 交付

每个生成的原型默认内置编辑器，无需密码。

**进入编辑**：点工具条「✎ 编辑」。编辑态下条目出现「✎ 编辑」按钮，工具条显示新增/保存/导出/退出。

**编辑标注**：点条目上的「✎ 编辑」打开编辑弹窗，可改标题、分类、标注颜色、PRD 编号、富文本内容。富文本编辑器支持：字号、加粗、斜体、行内代码、字色、高亮、清除格式、有序/无序列表、插入表格（含行列增删）、插入图片（base64 内嵌）。

> v1.2.0 起编辑弹窗不再展示「关联打开方式」字段——viewer 已能根据 `pos.container` + `viewCtx/tabCtx` 自动识别 opener。

**新增标注**：点「＋ 新增标注」进入落点模式，点页面任意位置放下角标并打开编辑弹窗；取消则撤销该角标。新增 ID 为纯整数（`nextId`，从当前 annotations 已有最大数字 +1 续号——若全部删除后从 1 开始）。落点时自动写入 `annotations[id].pos`，包含 `container`（落在哪个 `[data-annot-container]`）、`left/top`（相对该容器的坐标）、`viewCtx`/`tabCtx`（从钩子读取）。**严格策略：不在 `[data-annot-container]` 内的位置不允许打标，编辑器会 toast 提示。**

**删除标注**：两处入口——编辑弹窗左下角「删除标注」按钮（仅编辑已有标注时显示），或编辑态下每个侧栏条目上的「🗑 删除」。点击后弹原生 `confirm` 二次确认。删除后**自动重排**剩余标注为连续 `1..N`：同步重写每个角标的 `data-annot`/显示文本与 `nextId`，DOM 由 `reconcileMarkers` 兜底重建（无需手动维护 addedMarkers/movedMarkers）。

**移动角标**：进入编辑模式后，鼠标按住任意角标拖动即可改其位置（光标变 move）；拖动阈值 4px 区分点击与拖动，拖动结束的那次 click 不弹说明卡片。`mousedown` 时给角标置 `_dragging = true`、`mouseup` 清掉——这个标志位**至关重要**，它会让 `renderMarker` 在拖动过程中跳过 left/top 同步、不被 MO 触发的 reconcile 把角标"瞬间拖回 pos"。松手时位置写入 `annotations[id].pos.left/top` + 本地草稿；保存到文件时 `buildHtml` 按 `annotations.pos` 重建角标 DOM。

### 拖动机制（v1.2.0 新增，维护者必读）

`annotations[id].pos` 是单一数据源 + MutationObserver 监听 body 变化 → rAF debounce → `reconcileMarkers` 全量重渲。这套机制带来一个反直觉的副作用：**用户在编辑态拖动角标时，光是 Vue 自身的 DOM 抖动就会触发 MO，进而让 `renderMarker` 把正在拖的角标"拽回 pos.left/top"。**

解决方案：

- `bindMarker` 的 `mousedown` 给 marker DOM 置 `m._dragging = true`；`mouseup` 清回 `false`
- `renderMarker` 检测到 `existing._dragging === true` 时：跳过 left/top 同步、不 remove、即便 host 不匹配也不动它
- `reconcileMarkers` 删孤儿那一步同样跳过 `_dragging` 的 marker

不加这条，所有拖动都会失败（角标看似可拖、松手就回原位）。后续维护者重构 reconcile 时**不要把这个标志位拆掉**。

document 级 `click` delegation 用 `m._popupOpenedAt`（80ms 内去重）+ `m._justDragged`（mouseup 后微任务清空）确保即便 bindMarker 因时序未绑上、文档 delegation 也能弹出 popup，且不会与 bindMarker 双触发。

**MO 必须监听 attributes**：MutationObserver 的 options 必须是 `{ childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] }`。Element-UI `el-tab-pane` 的 v-show 切换是 `display:none ↔ display:''` 翻转、不增删 DOM——只听 childList 的话 reconcile 永远不跑、tabCtx 标注切回 tab 也不会重新投影出来。`reconcileMarkers` 末尾重启 observe 时也要带同样的 options。

**侧栏点条目联动 opener 后必须排两次 reconcile**：`bindItem` 调 `opener()` 切换 view/tab 是 Vue 异步 patch（el-tabs 还有切换动画），host 不会立刻 visible。代码已内置两阶段：`requestAnimationFrame(scheduleReconcile)` 抢同步 patch 完成那一帧；`setTimeout(scheduleReconcile + highlight, 320)` catch el-tabs 切换动画稳定后的布局。两阶段都跑完才 highlight，保证用户点条目能看到 marker 出现并高亮。维护者**不要把这两阶段简化成只一个 setTimeout**，否则在 records-tab 这类延迟显示容器上会出现"点条目没反应"。

**保存到文件**：点「◉ 保存到文件」，或在编辑态按 `Cmd+S`(Mac) / `Ctrl+S`(Win) 直接触发保存（仅编辑态拦截，视图态放行浏览器默认）。Chromium 系浏览器用 File System Access API 直接覆盖原 HTML；其它浏览器降级为下载。保存成功后清除本地草稿。**首次保存选定原文件后，句柄写入 IndexedDB（按文件路径记忆）**：之后每次保存都直接覆盖该文件、不再弹「另存为」找路径（权限失效时自动回退到选择框，且 picker 用 `id` 记住上次目录、预填原文件名）。注：受浏览器安全限制，`file://` 页面首次保存无法自动定位到自身所在目录，需手动选一次。

**保存中的视觉反馈与重入保护**：点「◉ 保存到文件」后按钮立即 `disabled = true`、文字变「↻ 保存中…」、`cursor: wait`；保存中用户连点或再按 `Cmd+S` 会被入口的 `if (btn.disabled) return;` 短路拦截，避免并发写入同一文件句柄。整个写入流程包在 `try/finally` 里，无论成功/失败/取消都会还原按钮状态。

**保存位置（`▤ 保存位置`）**：用于纠正首次保存挑错路径的场景——hover 该按钮可看「当前文件:xxx.html」（tooltip 显示文件名，picker 弹出窗口里能看完整路径）；点击会先把 `fileHandle` 置空 + 删 idb（必须提前置空，否则 picker 不弹出），再调 `showSaveFilePicker` 让用户挑新位置。**用户取消（AbortError）时**自动还原到上次的句柄并写回 idb，不丢绑定。每次成功保存后 `btnSave` 会调 `refreshResavePathTip()` 同步更新 tooltip。

**本地草稿防丢**：每次确定/新增自动写入 localStorage（键 `annotDraft:` + 路径）；刷新自动恢复未保存内容；有未落盘改动时刷新/关闭会触发原生确认拦截。保存到文件成功后清空草稿。

**弹窗按条缩放**：弹窗右下角可缩放，尺寸记录在该条 `annotations[id].w/h`，各条互不影响。

**改主题色**：编辑态工具条有「主题色」取色器（`#annotThemeColor`）。改色即时驱动整个标注层（角标、编号、条目边框、弹窗顶栏、按钮等）——所有未单独设 `color` 的标注都跟随；默认蓝 `#1677FF`。改后的色写入 `<html>` 行内 `--annot-theme`，随保存落盘、本地草稿亦记忆。角标/编号/弹窗顶栏的文字色由 `fgOn()` 按背景明暗自动取深色或白色，保证对比度。

**拖宽面板**：面板左缘有拖拽把手，按住左右拖即可调宽（280–720px）；宽度写入 `--annot-sidebar-w`，存 localStorage 供刷新恢复，并随保存落盘。

**显隐角标**：面板 header 的「隐藏角标/显示角标」文字开关，切换 `body.annot-hide-markers` 类一键隐藏/显示页面全部编号角标；偏好存 localStorage（键 `annotHideMarkers:` + 路径），视图态/只读交付版亦可用。保存时不写入隐藏态（`buildHtml` 会剥离该类）。

**交付开发**：点「↗ 导出只读版」生成 `*-readonly.html`，剥离 `#editorToolbar`/`#editOverlay`/`#editorScript`，无任何编辑入口，用于对开发交付。

> **权限说明（诚实标注）**：去掉密码后，谁打开原型都能编辑。限制开发不可改的方式是交付「只读版」——它物理移除了编辑器。静态 HTML 无后端，做不到文件级真权限。

## 视觉规范

| 项 | 值 |
|---|---|
| 主题色 | 默认蓝 `#1677FF`（独立于业务 UI 配色，由 `--annot-theme` 统一驱动 chrome + 每条默认色）；编辑器取色器可整体改色，**生成阶段不按条改色**，`color` 留空即用主题色 |
| 角标 | 圆角胶囊形，背景=该条标注色，文字色由 `fgOn()` 按明暗自适应（深色底白字 / 浅色底深字），min-width 28px，白边框，扁平无阴影 |
| 面板 | 宽默认 340px（可拖宽 280–720），白底，左 border 1px，左缘拖拽把手；flex 列布局（header / 编辑条 / 内容滚动区）；header 有「隐藏角标/显示角标」文字开关 |
| 弹窗 | 默认 380×320，min 260×160，主题色顶栏（文字自适应明暗），白底内容区，扁平 1px 主题色描边，**可拖动 + 右下角可缩放（按条记忆尺寸）** |
| 条目 | 直角卡片，左 3px 边框（该条色），浅色背景（该条色 8% 透明），两行布局（标题行：编号+名称；元信息行：分类/PRD 标签 + 编辑/删除），hover 边框微变 |
| 编辑弹窗 | 720px 宽，白底圆角，蓝色确定按钮 `#1677ff`，遮罩 z-index 5000 |

## 面板底部提示语模板

```html
<div style="margin-top:20px;padding-top:14px;border-top:1px dashed #e2e8f0;font-size:11px;color:#94a3b8;line-height:1.65;">
  点击编号 → 弹出说明卡片（可拖动、右下角可缩放）<br>
  点击「✎ 编辑」进入编辑模式，可改/增标注、改主题色；改完点「保存到文件」落盘（编辑态 Cmd/Ctrl+S 亦可）<br>
  对外交付请用「导出只读版」，剥离编辑功能<br>
  拖面板左缘可调宽，点击右上角 ›/‹ 折叠/展开本栏
</div>
```

## 自适应

- 面板宽度可拖拽调整（左缘把手，280–720px），写入 `--annot-sidebar-w` 并存 localStorage
- 面板可折叠（点击 ›/‹ 按钮，宽度收缩到 40px）
- **折叠时完全透明**：隐藏背景、边框、阴影、顶部分隔线，仅保留 toggle 按钮图标
- 折叠态 CSS：`.annot-sidebar.collapsed { width: 40px; background: transparent; border-left: none; box-shadow: none; }` + `.annot-sidebar.collapsed .annot-header { border-bottom: none; }`
- 内容区 padding-right 跟随 `--annot-sidebar-w` 同步（折叠态 40px）
- 弹窗定位避免超出视口（右侧预留面板宽度）

## z-index 分层契约（必须遵守）

标注图层与业务弹窗共存时，三类元素的层级关系是固定的，**不可随意调高角标 z-index**：

| 层级 | 元素 | z-index | 说明 |
|------|------|---------|------|
| 底 | 基础页角标 `annot-marker` | `90` | 低于业务遮罩层。**弹窗/抽屉打开时，基础页角标必须被自动覆盖** |
| 中 | 业务遮罩/弹窗/抽屉 `overlay`/`drawer` | `1000~1100` | 项目自定，须 > 90 且 < 3000 |
| 顶 | 标注面板 `annot-sidebar` / 弹窗 `annot-popup` | `3000` / `3010` | 始终最上层，评审时不被业务弹窗遮挡 |
| — | 弹窗/抽屉**内部**的 marker（`.annot-marker.in-modal`） | `2050` | 高于 el-drawer wrapper（z≈2001）；旧版用 1500 会被盖住——v1.2.0 起统一 2050 |

**关键原则：**
- 基础页（列表/筛选/工具栏）的角标 z-index 必须**低于**业务遮罩层。否则弹窗打开后，下层页面的角标会浮在弹窗之上（典型 bug：列表操作列的角标 7/8、工具栏角标 13 盖在"回填结果"弹窗上）。
- 弹窗/抽屉**内部**的角标无需高 z-index：它处在弹窗自身的堆叠上下文里，用默认 `90` 即可正确显示在弹窗内容之上。
- 不要给某个角标单独写 `z-index: 2000` 之类的高值来"让它显示"——那会破坏分层，让它在弹窗打开时也漏出来。判断角标该不该露出，看它在 DOM 中属于基础页还是属于弹窗，而非靠 z-index 硬顶。
- **业务居中弹窗让位**：标注面板常驻右侧会遮住居中的业务浮层。代码层已内置规则——展开标注面板时，常见框架的弹窗/抽屉容器自动右移让出面板宽度，折叠态仅右移 60px，使弹窗内容完整可见、不被侧栏盖住。**已内置覆盖：** Element-UI（`.el-dialog__wrapper` / `.el-drawer__wrapper`）、Ant Design Vue（`.ant-modal-wrap` / `.ant-drawer`）、Naive UI（`.n-modal-mask` / `.n-drawer-mask`）、原生 `<dialog>`。其它框架在 `annotation-code.md` 的让位规则列表里追加对应选择器即可。

## 隐藏标注的 NEW 标识与联动（弹窗 / 抽屉 / Tab / 折叠面板）

当标注点藏在业务弹窗（modal/overlay）、抽屉、未激活 Tab 或折叠面板内、用户在主页面无法直接看到时，需要提供视觉引导和自动联动。

### 何时使用

只要原型中存在标注点藏在需用户主动打开才能看到的容器内（弹窗/抽屉/Tab/折叠面板），就应提供下述视觉引导（NEW 标识）与点击联动。NEW 标识按页面实际形态选用其中适配的几处，不必强求齐全；联动配置（modalAnnotIds + openModalFor）则建议都接上。

### 1. NEW 标识系统（CSS）

用主题色底白字的 `NEW` 标签作为改动标识（默认蓝 `#1677FF`，用 `var(--annot-theme)` 跟随主题色），与标注系统一致但不会和业务 UI 混淆。

```css
/* 操作列 NEW 标签 — 放在"详情"链接旁 */
.annot-change-dot {
  display: inline-flex; align-items: center;
  margin-left: 4px;
  font-size: 10px; font-weight: 700;
  color: #fff; background: var(--annot-theme, #1677FF);
  padding: 0 4px; border-radius: 2px;
  line-height: 16px; letter-spacing: .5px;
  vertical-align: middle; flex-shrink: 0;
}

/* 弹窗标题栏 NEW 标签 */
.annot-modal-badge {
  display: inline-flex; align-items: center;
  background: var(--annot-theme, #1677FF); color: #fff;
  font-size: 10px; font-weight: 700;
  padding: 0 6px; border-radius: 2px;
  margin-left: 8px; vertical-align: middle;
  line-height: 18px; letter-spacing: .5px;
}

/* 左侧菜单 NEW 标签 */
.nav-new-tag {
  font-size: 10px; font-weight: 700;
  color: #fff; background: var(--annot-theme, #1677FF);
  padding: 0 4px; border-radius: 2px;
  line-height: 16px; letter-spacing: .5px;
  margin-left: auto; flex-shrink: 0;
}
```

> 这些 NEW 标签由 Claude 在业务 HTML 中**手写**，不归编辑器管理（编辑器只渲染 `annotList` 内的条目）。

### 2. 放置位置（HTML）

按页面实际形态选用以下手写 NEW 标识（哪种入口存在就用哪种），归属由第四处分类标签体现：

**a) 左侧菜单 — 当前有改动的菜单项加 NEW**
```html
<div class="nav-sub-item active">付款管理<span class="nav-new-tag">NEW</span></div>
```

**b) 表格操作列 — "详情"链接旁加 NEW**
```html
<a class="text-link" onclick="openDetail()">详情</a><span class="annot-change-dot">NEW</span>
```

**c) 弹窗标题栏 / Tab 标签 — 加 NEW 徽章**
```html
<h3>付款单详情 — #18021 <span class="annot-modal-badge">NEW</span></h3>
<!-- 或 Tab：--> <div class="tab" onclick="switchTab('abnormal')">异常人员<span class="annot-modal-badge">NEW</span></div>
```

**d) 右侧面板条目 — 用 `category: "弹窗"` 体现归属**
弹窗内的标注在 `#annotData` 里设 `"category": "弹窗"`，渲染出的分类标签即表示该条藏在弹窗内（取代旧的 `annot-modal-tag`「详情弹窗」标签）。

### 3. 侧栏点击联动（已内置于 viewer）

点击侧栏条目时，viewer 自动按 `pos.container` + viewCtx/tabCtx 命中 `containerOpeners`，先关闭旧的业务弹窗/抽屉、切换 tab、再调 opener 打开新容器，最后展开 `<details>` 并滚动高亮——此逻辑**已并入 `#viewerScript` 的 `bindItem`**，无需再额外写监听。

**v1.2.0 推荐路径**：用 `containerOpeners` + `pos.container`（落点 add-click 自动写入），不再需要手填 `modalAnnotIds`。复合 key（如 `'dialog-log@view-execution-record'`）解决多入口共享单例弹窗。

**侧栏切条目前自动关业务遮罩（`_closeAllBusinessOverlays`,v1.3.0 改为约定式发现）**：bindItem 第一行调 `_closeAllBusinessOverlays()`,会关闭：① 之前打开的 annot popup；② vm 上**所有以 `Dialog`/`Drawer`/`Modal`/`Popup` 结尾、且值是带 `visible` 字段的对象**。v1.3.0 起项目侧**无需维护字段名列表**——新增 dialog 自动覆盖,不会再因漏改而出现"切条目时旧弹窗盖在新位置上"。

```js
// v1.3.0 内置实现:按命名约定自动发现,新原型无需改这段
function _closeAllBusinessOverlays() {
  try { closeAnnotPopup(); } catch (e) {}
  try {
    var vm = document.getElementById('app') && document.getElementById('app').__vue__;
    if (!vm) return;
    if (typeof window.__ANNOT_CLOSE_OVERLAYS__ === 'function') { window.__ANNOT_CLOSE_OVERLAYS__(vm); return; }
    Object.keys(vm).forEach(function (k) {
      if (!/(Dialog|Drawer|Modal|Popup)$/.test(k)) return;
      var v = vm[k];
      if (v && typeof v === 'object' && 'visible' in v && v.visible) v.visible = false;
    });
  } catch (e) {}
}
```

**项目命名不遵循 `*Dialog/*Drawer/*Modal/*Popup` 约定时**(如 `vm.popoverA`、`vm.sheet1`),挂全局钩子覆盖默认实现:

```js
window.__ANNOT_CLOSE_OVERLAYS__ = function (vm) {
  try { closeAnnotPopup(); } catch (e) {}
  if (vm.popoverA && vm.popoverA.visible) vm.popoverA.visible = false;
  if (vm.sheet1   && vm.sheet1.visible)   vm.sheet1.visible   = false;
};
```

### modalAnnotIds（兼容字段，已弱化）

```js
// #viewerScript 顶部 —— v1.2.0 起默认空数组,仅作兜底
var modalAnnotIds = [];
function openModalFor(id) {
  // 兜底:某标注既无 pos 又无对应 containerOpener 时使用,通常用不到
  // var vm = document.getElementById('app').__vue__; vm.goCompile('add');
}
```

新原型不需要主动用 `modalAnnotIds`——pos.container + containerOpeners 已经覆盖所有场景。这两个保留位仅在迁移老原型 / 极端兜底时有用：bindItem 优先级是 `containerOpeners` > `modalAnnotIds`。

---

## Changelog

- **v1.2.0** — `annotations[id].pos` 成为单一数据源（取代 addedMarkers/movedMarkers）;**marker DOM 改挂 body 顶层 `position:fixed`、按 host bbox 动态投影**(避开 Vue patch 路径,根除 v-if 切换时的 `Failed to execute 'insertBefore'` 报错);`pos` 支持 right/bottom 锚字段(resize 不飘);新增 `window.resize` + `scroll(capture)` → `scheduleReconcile` 重投影;新增 `__ANNOT_VIEW_CTX__` / `__ANNOT_TAB_CTX__` 钩子与 `containerOpeners` 复合 key（`container@viewCtx` / `container@tabCtx`）;`bindMarker` 加 `_dragging` 标志位避免 MutationObserver 回拉;opener 优先级反转、`modalAnnotIds` 降级为兜底;`add-click` 严格策略（无 `data-annot-container` 不再回退 body）;编辑弹窗移除「关联打开方式」字段（reconcile 自动识别）;新增 `_closeAllBusinessOverlays`,侧栏切条目前自动关业务遮罩;document 级 click 兜底打开 popup;草稿自动迁移 v1.1.x 老字段到 `pos`;`nextId` 在 restoreDraft 后按 annotations max+1 重算。
  - **v1.2.0 patch（2026-06-22）** — 弹窗内 marker `z-index` 1500 → **2050**（修被 el-drawer wrapper z≈2001 盖住）;`_deepFindLastContainer` 找不到可见 host 时返回 **null**（修 list/detail 同名 `card-area` 串投影到不可见 host 的 bug）;`renderMarker` 头部加 **viewCtx/tabCtx 守卫**（跨视图/跨 tab 不再串显）;MutationObserver options 加 **`attributes: true, attributeFilter: ['style','class']`**（修 el-tab-pane v-show 切换不触发 reconcile）;`bindItem` 调 opener 后改两阶段 reconcile（`requestAnimationFrame` + `setTimeout 320ms`）再 highlight（修点侧栏切到延迟显示容器后 marker 不出现）;`btnSave` 加 **loading/disabled 重入保护**（保存中按钮变灰、文字「↻ 保存中…」、cursor:wait）;新增 `▤ 保存位置` 按钮（含 `idbDeleteHandle` / `refreshResavePathTip` / AbortError 复原句柄）用于纠正首次保存挑错路径的场景;工具条按钮图标统一为扁平单字符 Unicode（`◉ 保存到文件` / `▤ 保存位置` / `↗ 导出只读版`，与 `✎` `＋` 同风），剔除彩色 emoji `💾📁📤`;折叠态侧栏 header 透明化 + toggle 按钮改主题色实底（修折叠后白底浅字看不清不像可点击）;编辑工具条 button disabled 态加 `cursor:wait; opacity:.6` 视觉。
- **v1.1.x** — 编辑器内置（富文本工具栏 / 主题色 / 面板拖宽 / 隐藏角标 / 只读导出）；NEW 标识系统；containerOpeners 雏形；modalAnnotIds 用于弹窗内联动。
