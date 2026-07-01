# 原型 → HTML PRD 映射指南

本文档定义如何将 **Axhub Make 原型**（`src/prototypes/<name>/`）映射为 **HTML PRD**（`src/docs/`），供 `pm-prd-html-writer` 在「从原型生成」模式下使用。

***

## 1. 输入与输出

### 1.1 输入（必读）

| 文件 | 路径 | 用途 |
|------|------|------|
| 原型规格 | `src/prototypes/<name>/spec.md` | 功能清单、交互要点、布局、视觉 |
| 原型实现 | `src/prototypes/<name>/index.tsx` | 验证实际控件、状态、弹窗 |
| 样式 | `src/prototypes/<name>/style.css` | 布局尺寸、视觉 token |
| 关联 PRD | `src/docs/*.md` | 若 spec 引用了完整 PRD，必须通读 |
| HTML 模板 | `skills/pm-prd-html-writer/references/html-template.html` | 输出结构 |

### 1.2 输出

| 文件 | 路径 |
|------|------|
| HTML PRD | `src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html` |
| Markdown 源（推荐） | `src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].md` |
| 全页截图 | `src/docs/PRD/[文档名称]/assets/screenshots/<name>-fullpage.png` |
| 分节截图（可选） | `src/docs/PRD/[文档名称]/assets/screenshots/<section-id>.png` |

命名示例：`管理模式_PRD_V1.0.html`、`management-mode-fullpage.png`

***

## 2. spec.md 章节 → HTML 章节映射

Axhub Make 的 `spec.md` 通常包含「业务与功能」「内容规划」「布局与结构」「视觉规范」等节。映射关系如下：

| spec.md 常见章节 | HTML PRD 目标章节 | 转换要点 |
|----------------|------------------|----------|
| 1.x 核心目标 | 第一章 1.1 项目背景 | 提炼「为什么做」；不足时用 **[假设]** 补背景 |
| 1.2 功能清单 | 第二章 2.1 功能需求 | 每条功能扩为可验收描述；可附用户故事 |
| 1.3 交互要点 | 第二章 2.1 + 第三章 3.2 | 交互流程转 Mermaid flowchart；关键路径写入 3.2 |
| 2.1 信息架构 | 第一章 1.3 项目范围 + 第二章 | 树状结构保留；标注 in-scope / out-of-scope |
| 2.2 数据来源 / 关键字段 | 第二章 字段表 | 企业后台模式用 8 列字段表 |
| 2.3 内容示例 | 第二章 示例数据 / 验收用例 | 写入验收标准或示例表格 |
| 3.x 布局与结构 | 第三章 3.1 界面原型 | 配合截图说明布局；iframe 嵌入原型 |
| 4.x 视觉规范 | 第二章或附录 | 摘要级写入；细节可引用 spec |
| spec 中的按钮/操作 | 第二章 按钮说明表 | 独立表格，不并入字段表 |

### 2.1 信息缺口处理

`spec.md` **不是**完整 PRD。以下 content 若 spec 中缺失，须先调用 `pm-prd-writer` 补入 MD，再转 HTML：

- 量化业务目标
- 非功能需求（性能、安全）
- 异常与边界（网络失败、权限、空数据）
- 里程碑与风险评估
- 完整验收标准

***

## 3. HTML 模板第三章：双模式原型区

对每个需要展示的原型页面，在 HTML 第三章插入标准 `prototype-section`：

```html
<div class="prototype-section">
  <div class="prototype-tabs">
    <button class="prototype-tab active" data-tab="screenshot">静态截图</button>
    <button class="prototype-tab" data-tab="interactive">交互原型</button>
  </div>
  <div class="prototype-content">
    <div class="prototype-panel active" id="panel-screenshot">
      <img src="./assets/screenshots/management-mode-fullpage.png"
           alt="管理模式主界面" class="screenshot">
      <p>图 3-1：管理模式主界面</p>
    </div>
    <div class="prototype-panel" id="panel-interactive">
      <div class="prototype-iframe-preview" data-design-width="1280" data-design-height="800">
        <div class="prototype-iframe-hint">点击全屏交互</div>
        <div class="prototype-iframe-scale">
          <iframe class="interactive-prototype interactive-prototype--preview"
                  src="./assets/prototypes/management-mode/index.html"
                  title="管理模式 - 交互原型"
                  sandbox="allow-scripts allow-same-origin allow-forms">
          </iframe>
        </div>
        <div class="prototype-iframe-placeholder" hidden>全屏交互中…</div>
      </div>
      <p>图 3-2：预览区等比缩放完整布局，点击全屏交互</p>
    </div>
  </div>
</div>
```

### 3.1 iframe 地址策略

| 场景 | iframe src | 说明 |
|------|-----------|------|
| 仓库内在线评审 | `/prototypes/<name>/` | `npm run dev` 或部署后的预览地址 |
| **离线交付（默认）** | `./assets/prototypes/<name>/index.html` | `export-prototype-for-prd.mjs` 导出 |
| 不可用 | 隐藏交互 Tab，仅保留截图 Tab | 交付前不得留 `about:blank` |

### 3.2 截图生成

```bash
# 方式 A：对原型本地 index.html 截图（需先生成 index.html）
node skills/pm-prd-html-writer/scripts/screenshot.mjs \
  src/prototypes/management-mode/index.html \
  -o src/docs/assets/screenshots \
  --type both

# 方式 B：对 HTML PRD 成品截图
node skills/pm-prd-html-writer/scripts/screenshot.mjs \
  src/docs/管理模式_PRD_V1.0.html \
  -o src/docs/assets/screenshots
```

截图文件名建议与原型目录名对应：`management-mode-fullpage.png`。

### 3.3 功能模块：字段 / 按钮 / 多状态截图

每个 `3.x` 功能模块在 `3.x.5 界面及交互` 中须包含五段：**功能描述、界面原型、字段说明、按钮说明、业务规则**。

**界面原型**要求：

| 模块类型 | 截图要求 |
|----------|----------|
| 单一页面模块（如顶栏、列表） | 至少 1 张该区域截图 |
| 多状态模块（如图像增强） | **每种不同 UI 状态各 1 张**（生成中、成功、失败、各类提示、只读等） |

多状态模块示例（图像增强）须覆盖：缩略图 idle / generating / ready；弹窗 generating / success / failed / 失败 Tab 提示 / 重新生成成功 / 并发超限 warning / 只读已增强 / 只读仅原图。

HTML 使用 `prototype-gallery` + `prototype-figure` 网格展示；参考 `src/docs/管理模式_PRD_V1.0.html` 第 3.5 节。

批量截取可使用：

```bash
node skills/pm-prd-html-writer/scripts/capture-prototype-states.mjs \
  --url http://127.0.0.1:51720/prototypes/management-mode/
```

输出目录：`src/docs/assets/screenshots/<prototype-name>/`，文件名建议 `3x-状态名.png`（如 `35-modal-success.png`）。

***

## 4. Mermaid 流程图：从交互要点生成

将 spec 中的交互要点转为 `flowchart TD` 或 `stateDiagram-v2`：

**来源示例**（spec 1.3）：

> 点击图片 → 打开增强弹窗 → 自动发起增强 → 成功/失败分支

**HTML 输出**（嵌入 `<div class="mermaid">` 或 `<pre class="mermaid">`）：

- 必须包含 `init` + `classDef` + `linkStyle`（见 `mermaid-integration.md`）
- 单图节点 ≤ 12；复杂流程拆为多张图

状态类交互（如报警处置状态）优先用 `stateDiagram-v2`。

***

## 5. 多原型 / 多页面

一个 HTML PRD 可嵌入多个原型：

| 情况 | 处理方式 |
|------|----------|
| 单原型多状态 | 同一 prototype-section，截图 Tab 放多张图；交互 Tab 一个 iframe |
| 多原型模块 | 3.1、3.1.2、3.1.3 各一个 prototype-section |
| 原型 + 关联 docs | 第一章或概述中链接 `src/docs/` 下的 MD PRD |

***

## 6. 完整工作流示例

以 `src/prototypes/management-mode/` 为例（详见 `prd-html-conventions.md`）：

```
1. 读取 spec.md、index.tsx、关联 docs/图像增强功能PRD-v1.3.md
2. 判断信息是否足够 → 不足则 pm-prd-writer 补 MD（3.x 五段结构）
3. 复制 html-template.html → src/docs/管理模式_PRD_V1.0.html
4. 按映射表填充各章节；每 3.x 含功能/原型/字段/按钮/规则
5. init-assets.mjs src/docs
6. capture-prototype-states.mjs → assets/screenshots/management-mode/
7. export-prototype-for-prd.mjs --prototype management-mode --prd ...
8. 复制 mermaid.min.js → assets/scripts/
9. localize-prd-english.mjs（可选）
10. validate-assets.mjs 验收
11. package-prd.mjs --include-prototypes（交付时）
12. 输出待确认项清单
```

**参考实现**：`src/docs/PRD/管理模式/管理模式_PRD_V1.0.html`

***

## 7. 质量检查（原型专向）

- [ ] 已读取 spec.md **和** index.tsx，字段/按钮与实现一致
- [ ] 每个 3.x 含五段：功能描述 / 界面原型 / 字段说明 / 按钮说明 / 业务规则
- [ ] `3.x.5 业务规则` 按六类书写，见 `business-rules-template.md`
- [ ] 字段表「必填」「可修改」列仅为「是」或「否」；「控件类型」「说明」符合 `prd-html-conventions.md` §1.3
- [ ] 多状态模块 `prototype-gallery` 覆盖全部 distinct UI
- [ ] 交互要点已转为 Mermaid 或第二章文字流程
- [ ] 截图来自真实原型，class 含 `screenshot`，Lightbox 可用
- [ ] iframe 指向 `./assets/prototypes/...` 或有效 dev URL
- [ ] Mermaid 使用 `./assets/scripts/mermaid.min.js`，页面内 SVG 正常
- [ ] TOC 显示章节号且可折叠
- [ ] 状态色使用 `prd-status-tag` / `prd-hex-tag`
- [ ] `validate-assets.mjs` 通过

***

**文档版本**: v1.1  
**最后更新**: 2026-06-10  
**适用范围**: Axhub Make 仓库内 `src/prototypes/` → HTML PRD 转换
