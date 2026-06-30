---
name: zhangtu-link
description: 掌图(zhangtu)内部原型系统的 AI 助手编排技能。把 IDE 里的自然语言请求转换成本项目本地 zhangtu CLI 的最短操作序列，完成项目预览、迭代预览、查看本地迭代、创建/更新迭代、页面发现诊断，并把结果整理成可点击的本地预览链接或简短列表。只要用户提到本地预览、页面发现、迭代、版本管理或“看看现在有哪些页面/迭代”，优先用这个技能。
author: Ryan
metadata:
  category: project
  maintainer: Ryan
  targets: zhangtu-cli
---

# 掌图内部原型 Skill

你负责把用户在 IDE 里的自然语言请求，转换成当前 `zhangwan-zhangtu` 工作区里本地 `zhangtu` CLI 的最短操作序列，并把结果整理成可直接点击的本地预览链接、简短列表或页面诊断摘要。

本项目只做本地能力：页面发现、项目预览、迭代管理、迭代预览、需求锚点读取。发布、在线预览链接、权限、SSO、审计、远程存储、审批流、CLI/Skill 自安装更新都不在范围内。

## 常用意图

- 打开当前项目预览 / 给我本地预览地址 → `preview`
- 看看现在有哪些本地迭代 → `list-iterations --json`
- 看看现在有哪些页面 / 页面发现结果 → `inspect-pages --json` 或 `list-pages --json`
- 创建迭代 → `inspect-pages --json` → `create-iteration` → `preview-iteration`
- 更新迭代 → `list-iterations --json` → `inspect-pages --json` → `update-iteration` → `preview-iteration`
- 本地预览某个迭代 → `preview-iteration`

## 命令约定

所有命令统一在项目根目录执行：

```bash
npm run zhangtu -- <command>
```

常用命令：

```bash
npm run zhangtu -- inspect-pages --json
npm run zhangtu -- list-pages --json
npm run zhangtu -- list-iterations --json
npm run zhangtu -- create-iteration "内部评审 V1" "说明"
npm run zhangtu -- update-iteration <id|slug|name> "<新名称>" "<描述>" "<页面引用>"
npm run zhangtu -- preview
npm run zhangtu -- preview-iteration <id|slug|name>
```

`preview` / `preview-iteration` 会启动并持续占用一个本地服务，告诉用户用 `Ctrl+C` 停止。

## 页面和迭代规则

- 页面选择先用 `inspect-pages --json`，不要猜页面 id；`list-pages --json` 只是同一份结果的别名。
- 迭代选择先用 `list-iterations --json`，不要猜迭代名。
- `create-iteration <name> [description] [pageIdsOrNamesCommaSeparated] [--json]`
  - 页面引用留空 = 收录全部页面。
- `update-iteration <id|slug|name> [nextName] [description] [pageIdsOrNamesCommaSeparated] [--json]`
  - 一旦传了页面引用，就会整体替换 pageIds，不是增量追加。

## 失败处理

- 找不到迭代：先列出当前迭代让用户确认。
- 页面匹配不到：展示最接近的候选页面名和 id。
- 页面没被发现：检查目录是否同时有 `index.html` 和 `index.tsx`，入口是否调用 `createRoot(...).render(...)`，HTML 是否包含 `#root` 和 `./index.tsx` module script。
- 端口被占用：用 `--port` / `--vite-port` 换端口。
