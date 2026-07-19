/**
 * 折线图 — 对应 `components/chartsNew/lineChart.vue`（基于 @antv/g2plot 的
 * `Line`）。浅绿色面积填充 + 折线 + 描边圆点，Y 轴虚线网格，X 轴类目标签，
 * 悬停高亮数据点并显示提示框。支持多系列（叠加同一坐标系，顶部图例）。
 * 无数据（`series` 为空或全零）时显示"暂无数据"占位，对应源码的
 * `v-if="!showChart"` 分支。
 */
export interface ChartPoint {
  label: string;
  value: number;
}
export interface ChartSeries {
  name: string;
  data: ChartPoint[];
  /** 线条/面积颜色，默认取品牌色系调色板 */
  color?: string;
}
export interface LineChartProps {
  series: ChartSeries[];
  height?: number;
  /** 内部 viewBox 宽度（SVG 自适应容器宽度，仅影响长宽比） */
  width?: number;
  /** 单系列时提示框里的数值前缀标签 */
  valueLabel?: string;
  formatValue?: (v: number) => string;
}
