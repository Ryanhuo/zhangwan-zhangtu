/**
 * KPI 统计卡 — 对应 dataOverviewChart 中的 "small-card" 模式，用于头条指标
 * （新增用户、留存率等），可选内嵌图表插槽。
 *
 */
export interface StatCardProps {
  title: string;
  value: string | number;
  /** 数值下方的小号说明文字，例如涨跌幅或单位说明 */
  caption?: string;
  /** 选中/激活态 — 显示绿色描边环，用于卡片驱动相邻图表时 */
  active?: boolean;
  onClick?: () => void;
  /** 右侧可选内容（通常是一个小型迷你图） */
  aside?: React.ReactNode;
}
