/**
 * 对应 el-checkbox 的复选框，用于自定义列选择器与表格行选择。
 *
 */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
}
