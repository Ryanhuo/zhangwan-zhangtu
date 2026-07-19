/**
 * 数值区间输入框 — 对应真实的 InputNumberRange：两个用 "~" 连接的输入框
 * （最小值 / 最大值），带一个尾部清除图标。用于数值类筛选字段（价格区间、
 * 花费区间等）。默认宽度 240px，对应应用的标准筛选控件宽度（Input/Select/
 * DatePicker 共用同样的 240px 默认值，保证筛选行尺寸统一）。
 */
export interface InputNumberRangeProps {
  from?: string | number;
  to?: string | number;
  placeholderFrom?: string;
  placeholderTo?: string;
  disabled?: boolean;
  clearable?: boolean;
  onChange?: (from: string, to: string) => void;
}
