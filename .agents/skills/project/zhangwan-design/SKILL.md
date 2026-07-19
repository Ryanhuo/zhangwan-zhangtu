---
name: zhangwan-design
description: Use this skill to generate well-branded interfaces and assets for Zhangwan (掌玩), an internal BI/analytics console for a Chinese mobile games/short-drama/novel publisher, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

阅读本技能文件夹内的 README.md，并浏览其他可用文件。

如果是在制作视觉类产出物（幻灯片、原型、一次性 mock 等），把素材复制出来，
创建静态 HTML 文件供用户查看。如果是在写生产代码，可以复制素材、阅读这里的
规则，成为这个品牌的设计专家。

如果用户在没有其他指引的情况下调用本技能，先问清楚想做什么，问几个问题，
然后以专家设计师的身份产出 HTML 制品或生产代码（视需求而定）。

需要牢记的关键事实：这是一个密集的内部企业 BI 工具（简体中文界面），不是营销
产品——优先使用青绿色 (#00bf8a) 强调色、2–5px 的紧凑圆角、微弱阴影、浅灰画布
上的扁平白色卡片，以及功能化/流程化的文案，避免任何"精致 SaaS"或"消费级 App"
的视觉套路。

## 在掌图（zhangtu）原型项目中使用

若当前仓库是掌图种子/工作区（存在 `scripts/zhangtu/` 与预览 Shell）：

- **页面切换导航由掌图 Shell 提供**，业务页默认只画**内容区**（页头 + 工具条 + 主体）。
- 生成新页时优先读 `tokens/` 与 core/data/forms/feedback 组件；**不要默认套用** `components/navigation` 里的 SidebarNav/Navbar 拼整站壳。
- Breadcrumb / FilterBar / Tabs 仅用于**本页**信息架构。完整壳层仅当用户明确要求脱离 Shell 演示时再做。
- 细则见仓库根目录 `AGENTS.md`「新建页面流程：内容优先，壳层归掌图」。
