/**
 * 柱状图 — 对应 `components/chartsNew/columnChart.vue`（基于 @antv/g2plot 的
 * `Column`）。品牌绿填充、圆角柱顶，Y 轴虚线网格，悬停高亮当前柱并显示数值
 * 提示框。无数据时显示"暂无数据"占位。
 */
export interface ColumnChartDatum {
  label: string;
  value: number;
}
export interface ColumnChartProps {
  data: ColumnChartDatum[];
  height?: number;
  width?: number;
  /** 柱体颜色，默认品牌绿 */
  color?: string;
  formatValue?: (v: number) => string;
}
