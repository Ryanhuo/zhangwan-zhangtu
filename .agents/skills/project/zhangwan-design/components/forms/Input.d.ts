/**
 * 对应 el-input 样式的搜索栏文本输入框，用于 BiFormItem 字段。默认宽度 240px，
 * 对应应用的标准筛选控件宽度（Select/DatePicker/InputNumberRange 共用同样的
 * 240px 默认值，保证筛选行尺寸统一）。
 */
export interface InputProps {
  value?: string;
  placeholder?: string;
  size?: 'small' | 'medium';
  disabled?: boolean;
  clearable?: boolean;
  onChange?: (value: string) => void;
}
