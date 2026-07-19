/**
 * 留存热力表 — 掌玩标志性的分析视图。行是日期（或渠道）；前几列是新增用户/花费
 * 数字，末尾的日偏移列（次日/3日/7日…）渲染成热力渐变，对应
 * game/preserveAnalysis 的 analysisColorOpacity()（正值基准 rgb(133,221,131)，
 * 负值/对比基准 rgb(252,145,138)，透明度按数值缩放）。
 * 内置"着色设置"弹窗（对应 components/PreserveAnalysis/Color.vue：阶梯着色/
 * 平滑着色单选，加仅阶梯模式下显示的 ROI梯度%/收入梯度元 输入框），以及可选的
 * "累计至今"内联进度条列。
 */
export interface RetentionRow {
  /** 左侧标签 — 一个日期如 "2026-07-01" 或一个渠道名 */
  label: string;
  /** 该行的新增用户数 */
  newUsers: number;
  /** 该行的花费/成本 */
  cost: number;
  /** 各日偏移列的留存/ROI 百分比，与 `dayLabels` 对齐。负值渲染在红色刻度上。 */
  values: (number | null)[];
  /** 可选的"累计至今"列数值（渲染成内联进度条） */
  cumulative?: number;
}
export interface RetentionTableProps {
  /** 日偏移列表头，例如 ['次日','3日','7日','14日','30日'] */
  dayLabels: string[];
  rows: RetentionRow[];
  /** 热力列分组显示的指标标签，例如 '新增ROI' | '留存率' */
  metricLabel?: string;
  /** 用于归一化热力透明度的最大值（百分比类指标默认为 100） */
  maxValue?: number;
  /** 数值末尾是否带 % (true) 还是纯数字 (false) */
  percent?: boolean;
  /** 可选的"累计至今"列标签（渲染成内联进度条）；不传则隐藏该列 */
  cumulativeLabel?: string | null;
  /** 是否在表格上方显示"着色设置"按钮 */
  allowColorSettings?: boolean;
}
