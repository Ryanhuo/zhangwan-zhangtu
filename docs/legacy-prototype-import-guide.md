# 历史系统原型导入指南

本指南用于「原型落地」阶段里的一种特殊来源：**参考一个已有系统来还原页面**——旧内部后台真实页（如罗盘 compass.zwnet.cn）、界面截图/设计稿，或旧的 Axhub / Make 导出原型。它是 [prototype-development-guide.md](prototype-development-guide.md) 在「有历史参照物」场景下的补充。

## 核心底线：借结构，不抄皮

任何历史来源都只提供**页面结构与交互逻辑**的参照；**视觉与组件实现一律回到 zhangwan-design 令牌与组件规范重做**，不迁移旧系统的 DOM 与 CSS。

- 需要旧系统那类页面结构 / 交互（树形表格、可排序列、抽屉、标红、维度切换、复杂筛选区等）时，用 zhangwan-design 的 `DataTable / Drawer / Tag / Tabs / FilterBar` 等组件规范**自行搭建**，不照抄旧页面的 DOM 结构与样式。
- 不复制旧系统的成品 `.tsx` / `.css` 到本项目。直接抄成品，正是「还原出来还是旧 UI、组件有出入」的根因。
- 令牌一律以 zhangwan-design 的 `.agents/skills/project/zhangwan-design/tokens/*.css` 为唯一来源；即使旧系统主色恰好也是 `#00bf8a`（同出掌玩品牌），同源也只到主色为止，其余令牌不引用旧系统的任何值。

## 三种来源，走不同流程

### A. 旧系统真实页面（如罗盘）

- **不触发 `compass-ui` 技能，不从任何 `assets/eui-kit/` 之类目录复制 element-ui / bi-eleme 成品文件**。本项目一律走 zhangwan-design。
- 把旧页面当作「结构与交互的说明书」：拆出信息层级、列定义、筛选维度、抽屉内容、状态标记规则，再用 zhangwan-design 组件重新搭。
- 数据用页面级 `data/mock.ts`，不接旧系统真实接口。

### B. 截图 / 设计稿

- 走 `.agents/skills/project/screenshot-to-prototype/` 技能：先提取必要素材，再写 React/CSS，最后做真实运行截图回归。
- 仅当用户**明确**要求把截图/设计稿还原成可运行原型时才走该技能；图片只作参考图 / 风格上下文时不触发。
- 还原时同样只借布局与信息结构，颜色/字体/圆角/间距回到 zhangwan-design 令牌。

### C. 旧 Axhub / Make 导出原型

- 只读其 `spec` 与交互逻辑，理解产品意图与页面流程，重新在 `src/pages/<slug>/` 落地。
- 不搬运旧导出包的运行时脚本、内联样式或组件实现。

## 落地检查

导入还原完成后，除 [prototype-development-guide.md](prototype-development-guide.md) 的验收外，额外自检：

- 页面视觉是否**看起来就是 zhangwan-design**，而不是旧系统换色版本。
- 有没有残留从旧来源直接复制的 `.tsx` / `.css` 片段。
- 令牌值是否全部来自 zhangwan-design `tokens/*.css`，没有硬编码旧系统的颜色/圆角/阴影。
- 结构借鉴是否准确表达了旧页面的核心交互，而非像素级复刻其外观。

> 仅当用户明确要求保留旧系统的视觉风格 / 品牌时，才偏离 zhangwan-design；默认一律以 zhangwan-design 为唯一视觉源。
