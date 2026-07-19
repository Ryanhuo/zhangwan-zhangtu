/**
 * 对应 BiSearchBlock + BiForm + BiFormItem 的搜索/筛选工具栏 — 每个分析页顶部
 * 的标准筛选行，搜索/重置按钮始终紧跟在最后一个字段之后。
 *
 */
export interface FilterBarProps {
  /** 每个筛选项一个 FilterField 形态的子元素，末尾跟一个搜索/重置操作组 */
  children: React.ReactNode;
}
export interface FilterFieldProps {
  /** 标签渲染在控件左侧、同一行（BiFormItem 左右布局） */
  label: string;
  children: React.ReactNode;
}
