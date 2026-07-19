/**
 * 对应 el-radio-group + el-radio-button 的分段控件，用于分析工具栏中的展示
 * 模式/粒度切换。
 *
 */
export interface RadioOption {
  label: string;
  value: string | number;
}
export interface RadioButtonGroupProps {
  options: RadioOption[];
  value: string | number;
  onChange?: (value: string | number) => void;
}
