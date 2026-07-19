"更新时间"标签，对应 `components/updateTime/index.vue`，展示数据最后更新
时间，常见于分析页顶部。

```jsx
<UpdateTime time="2026-07-14 09:30" />
<UpdateTime
  time="2026-07-14 09:30"
  breakdown={[{ key: '巨量引擎', time: '09:30' }, { key: '磁力引擎', time: '09:15' }]}
/>
```

用法：不传 `breakdown` 时是纯静态文字标签，不会有任何悬停行为——只有当数据
确实来自多个渠道/数据源、且各自更新时间不同步时才传 `breakdown`，用来解释
为什么顶部展示的是一个"综合"时间。`breakdown` 为空数组时同样不响应悬停，
与不传等效。

搭配惯例：与 Breadcrumb 同一行，右侧对齐（Breadcrumb 居左，UpdateTime
居右）；不单独成行，也不需要额外的分隔线或背景色。

边界情况：`breakdown` 项过多时弹层不做滚动限制、会一直向下延伸——数据源
通常只有个位数（巨量引擎/磁力引擎/腾讯ADQ 等已知渠道），暂不需要处理超长
列表场景。
