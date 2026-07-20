# 默认图表库推荐（掌图 / zhangtu）

**使用时机**：用户未指定图表方案，且 zhangwan-design 未直接覆盖所需图表类型时。

## 优先顺序

1. **zhangwan-design 数据组件**（首选）  
   路径：`.agents/skills/project/zhangwan-design/components/data/`  
   含：`LineChart`、`ColumnChart`、`PieChart`、`StatCard`、`RetentionTable` 等。  
   原型中按对应 `.prompt.md` / `.d.ts` **用页面 CSS + 结构复刻视觉**，不要另起一套图表皮肤。

2. **实现库兜底**（仅当需要可运行交互且规范组件不够用时）：

| 库 | 推荐理由 | 注意 |
|----|---------|------|
| **Recharts** | React 组件化，折线/柱/面积常见 | 颜色/字号/网格对齐 zhangwan-design 令牌，勿用默认鲜艳主题原样 |
| **@ant-design/plots** | 国内 B 端图表全、交互强 | 项目已可能用 antd；样式仍要对齐令牌密度与色板 |
| **ECharts** | 大屏/地图/复杂系列 | 仅复杂可视化时用；默认主题必须改成品牌绿与弱阴影风格 |

## 选择策略

1. **运营后台常规 KPI/趋势** → 先对照 zhangwan-design `LineChart` / `ColumnChart` / `PieChart` / `StatCard`  
2. **需要可交互原型且规范结构不够** → Recharts，并映射 `tokens/colors.css`  
3. **复杂漏斗/桑基等** → @ant-design/plots  
4. **大屏/地理** → ECharts  

## 安装示例（仅兜底库）

```bash
npm install recharts
# 或
npm install @ant-design/plots
# 或
npm install echarts echarts-for-react
```

## 禁止

- 引入会覆盖全局主题、与主色 `#00bf8a` 冲突的 Dashboard 主题包  
- 图表装饰性重阴影、大圆角、营销风配色  
