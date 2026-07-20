---
name: default-resource-recommendations
description: 默认图表/图标/字体/动画资源推荐（已对齐 zhangwan-design，不引入与之冲突的资源）。按需查阅 references；选型与掌图技术栈冲突时以 zhangwan-design 为准。
---

# 默认资源推荐（掌图 / zhangtu）

按需查阅以下文档（**不要一次性全部加载**）：

- `references/default-chart-libraries.md`
- `references/default-icon-libraries.md`
- `references/default-font-combinations.md`
- `references/default-animation-libraries.md`

## 总原则

1. **设计权威源**始终是 `.agents/skills/project/zhangwan-design/`（tokens + components + guidelines）。  
2. 本技能只在「规范未覆盖的实现库选型」时提供建议；**视觉令牌、圆角、阴影、字体栈不得被推荐库带偏**。  
3. 已对齐说明：推荐优先落在掌图已用栈（React 18、Vite、antd、lucide-react、页面级 CSS），不引入与 zhangwan-design 冲突的主题包或重设计系统。  
4. 新建页视觉仍必须先读 zhangwan-design tokens，再谈是否加库。  
