---
id: req-example
title: 示例需求 · KPI 概览卡片
category: 数据看板
color: "#02b8de"
block: requirements-alignment
order: 1
---

> 这是全局需求源的示例条目（`src/requirements/`）。需求先于原型：一条需求作为独立、可 diff、进 git 的产品资产存在，可被多个页面 / 区域引用。

## 背景

运营在仪表盘首页需要一眼看到本产品线的核心指标（今日活跃、新增、付费、留存），无需下钻。

## 需求描述

- 首屏顶部展示一组 KPI 概览卡片，指标随「产品线 + 时间范围」筛选联动刷新。
- 每张卡片显示：指标名、当前值（DIN-Medium 数字）、环比涨跌幅（涨绿跌红）。

## 验收标准

- 切换产品线 / 时间范围后，卡片数值在 1s 内刷新。
- 无数据时卡片显示占位「—」，不报错、不塌陷布局。

## 如何被页面引用

在页面的 `zhangtu.requirements.ts` 里用 `ref` 指向本需求 id，并给出页面本地锚点：

```ts
export const zhangtuRequirementAnnotations = [
  { ref: "req-example", anchorId: "kpi-cards", order: 1 },
];
```

页面区域用 `data-zhangtu-requirement-anchor="kpi-cards"` 标记即可。多个页面可同时 `ref` 同一条需求（一对多）。
