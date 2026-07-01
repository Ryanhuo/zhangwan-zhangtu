# pm-prd-html-writer 触发词参考

`SKILL.md` 的 `description` 已包含高频触发场景。以下为扩展词表，供 Agent 在模糊匹配时参考；**不必每次读取本文件**。

## 明确触发（高频场景）

- 生成 **HTML 版 PRD**、输出 **HTML 格式**
- **PRD 转 HTML**、Markdown 转 HTML
- **可视化 PRD**、带截图的 PRD
- **交互式 PRD**、网页版需求文档
- 用 **Playwright 截图**、自动截图
- **双模式展示**（静态+交互）
- **多状态截图**、每种 UI 状态一张图
- **离线交付**、打包 HTML、file:// 打开
- 目录折叠、章节编号 TOC
- **颜色标签**、状态色块、#hex 展示
- **PRD 评审用 HTML 版本**

## 模式相关触发

| 用户表述               | 触发模式         |
| ------------------ | ------------ |
| HTML 版、网页版、可视化     | 标准 HTML PRD  |
| 带截图、含原型图、可演示       | HTML + 多状态截图  |
| 交互式、可点击原型、离线打开      | HTML + 离线 iframe |
| 交互式、可点击原型          | HTML + 双模式展示 |
| 轻量 HTML、简单 HTML 页面 | 轻量 HTML 模式   |
| 企业后台 HTML、B端 HTML  | 企业后台 HTML 模式 |

## 不触发（改用其他 Skill）

| 场景               | 应使用的 Skill          |
| ---------------- | ------------------- |
| 写普通 Markdown PRD | pm-prd-writer       |
| 纯截图/图片处理         | pm-image2proto      |
| 生成交互原型（非文档）      | pm-image2proto      |
| Word/docx 输出     | pm-prd-writer（后手动转） |
| PDF 输出           | 浏览器打印功能             |
| 技术架构文档           | 其他 Skill            |

## 易混淆场景辨析

- 「帮我转成网页」→ 可能是 **HTML PRD** 或纯前端页面，需确认
- 「做个能点的 demo」→ 可能是**原型**（pm-image2proto）而非 PRD
- 「截个图」→ 可能是单纯截图，不一定是完整 HTML PRD
- 「评审用的版本」→ 推荐使用 **HTML 版**（比 MD 更直观）

## 调用时机建议

- **最佳时机**：在 `pm-prd-writer` 完成 Markdown 初稿后升级
- **从原型生成**：读取 `spec.md`，按 `prototype-to-html-mapping.md` + `prd-html-conventions.md`（3.x 五段）
- **也可独立使用**：直接从需求生成 HTML PRD
- **协作流程**：PM 用 pm-prd-writer → 本 Skill 升级 → 团队评审
