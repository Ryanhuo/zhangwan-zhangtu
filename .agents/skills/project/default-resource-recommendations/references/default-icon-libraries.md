# 默认图标库推荐（掌图 / zhangtu）

**使用时机**：用户未指定图标库时。掌图技术栈已内置两类图标依赖。

## 推荐列表

| 图标库 | 地位 | 风格 | 适用 |
|-------|------|------|------|
| **lucide-react** | **默认首选**（项目已用） | 线性、清晰、现代 | 业务原型页通用图标 |
| **@ant-design/icons** | 次选 / 与 antd 控件配套 | 偏商务、线框/实心 | antd 复杂控件旁、需要 antd 图标集时 |

一般 **不推荐** 再引入 Heroicons、React Icons 全量聚合等，避免风格混用与体积膨胀。

## 选择策略

1. **默认** → `lucide-react` 具名导入  
2. **页面已大量用 antd 控件** → 控件内用 `@ant-design/icons`，业务装饰图标仍优先 lucide  
3. **同页混用** → 允许「antd 控件内 + lucide 业务区」，但同一信息架构层级不要两种描边粗细混搭  

## 示例

```tsx
import { Search, Download, Settings } from 'lucide-react';
import { PlusOutlined } from '@ant-design/icons';
```

## 注意事项

1. 颜色用文色/品牌绿令牌，不要写死与规范无关的图标色  
2. 尺寸贴近高密度后台（常见 14–16px），避免过大装饰图标  
3. 按需具名导入，禁止 `import * as Icons`  
