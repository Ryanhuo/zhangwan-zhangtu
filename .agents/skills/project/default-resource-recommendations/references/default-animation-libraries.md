# 默认动画库推荐（掌图 / zhangtu）

**使用时机**：需要动效且用户未指定方案时。

## 总原则（对齐 zhangwan-design）

- **阴影极弱、克制动效** — 运营后台以信息密度与稳定感优先  
- 默认 **不要** 为装饰引入重动画库  
- 过渡以短时长、低位移、低缩放为主；尊重 `prefers-reduced-motion`  

## 推荐列表

| 方案 | 地位 | 适用 |
|------|------|------|
| **CSS 原生动画** | **默认首选** | hover、focus、抽屉/对话框显隐、简单 fade |
| **浏览器/组件已有过渡** | 次选 | antd Modal/Drawer/Tooltip 自带动效，对齐即可 |
| **Framer Motion 等** | 慎用 | 仅用户明确要求复杂手势/布局动画的演示原型 |

**不推荐** 为掌图默认安装 Tailwind Animate、为炫技上 AutoAnimate 全站列表弹跳等。

## 选择策略

1. **不需要动画** → 不引入  
2. **少量反馈（&lt; 5 处）** → CSS `transition` / 简单 `@keyframes`  
3. **antd 控件** → 用组件默认，不叠第二套  
4. **复杂编排** → 先确认产品需要，再考虑 Framer Motion，并保持弱阴影与克制位移  

## CSS 示例（克制）

```css
.btn {
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

/* 避免大幅度 scale、弹跳、长时延 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 注意事项

1. 不为「好看」加页面入场动画污染评审焦点  
2. 动效颜色/阴影仍服从 zhangwan-design（禁止厚重 elevation 动画）  
3. 同一项目方案统一  
