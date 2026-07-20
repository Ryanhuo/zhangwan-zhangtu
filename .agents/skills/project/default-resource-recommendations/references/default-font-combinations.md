# 默认字体组合推荐（掌图 / zhangtu）

**使用时机**：讨论字体方案时。掌图 **不以** Inter / Noto 自由组合覆盖规范，而以 **zhangwan-design 字体栈** 为唯一默认。

## 权威字体栈（必须优先）

来源：`.agents/skills/project/zhangwan-design/tokens/typography.css`（每次读当前文件）。

| 用途 | 约定 |
|------|------|
| **界面中文/西文 UI** | `Helvetica Neue, PingFang SC, Microsoft YaHei, Arial`（及令牌中的完整回退） |
| **数字** | 统一 `DIN-Medium`（不与中文混在同一 text run 里生硬拼接时注意排版） |
| **字号/字重** | 以 typography 令牌与 guidelines 为准，不自造梯度 |

## 与「通用 Web 推荐」的关系

| 外部常见推荐 | 在掌图中的处理 |
|-------------|----------------|
| Inter + System Sans | **不替换** zhangwan-design 栈；无需为原型强行引入 Inter |
| Noto Sans SC | 仅当用户**明确**要求营销页/特殊展示且接受偏离时；业务后台默认不用 |
| JetBrains Mono | 仅代码展示块可选；不进业务表格主数字 |
| Noto Serif SC | 长文/公文模拟可选；不做运营后台默认 |

## 实现注意

1. 在页面 `styles/page.css` 继承/复写时对齐 typography 令牌，不要另写一套 font-family  
2. 数字列、KPI、表格指标优先 DIN-Medium  
3. 不默认从 Google Fonts 拉一堆 Web Font（国内与性能）；设计系统若已带 DIN 等资源，走项目既有 assets  
4. **禁止**用字体推荐覆盖品牌绿、间距、圆角等其它令牌  

## 选择策略（简化）

1. **99% 业务原型** → 只用 zhangwan-design 字体栈  
2. **用户明确要特殊阅读/代码展示** → 局部使用等宽或衬线，并在 spec 注明例外  
