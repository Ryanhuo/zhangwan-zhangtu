/**
 * 环形图 — 对应 `components/chartsNew/pieChart.vue`（基于 @antv/g2 的
 * theta 坐标系，`innerRadius: 0.6` / `radius: 0.75`，逐字复用其分类调色板）。
 * 右侧纵向图例（名称 + 占比），悬停高亮扇区/图例项并显示 名称/数值/占比
 * 提示框。无数据或总和为 0 时显示"暂无数据"占位。
 */
export interface PieChartDatum {
  label: string;
  value: number;
  color?: string;
}
export interface PieChartProps {
  data: PieChartDatum[];
  height?: number;
  /** 是否在提示框外始终展示 "名称：数值(占比%)"，对应源码 showLabelText prop */
  showLabelText?: boolean;
  formatValue?: (v: number) => string;
}
