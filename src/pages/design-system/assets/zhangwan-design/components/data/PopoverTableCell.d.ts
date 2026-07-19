/**
 * 表格单元格多值展示 — 对应 components/popoverTableCell/index.vue：顿号连接
 * 展示前 3 项，超过 3 项时末尾显示 "..."，悬停弹出完整列表（滚动区域）。用于
 * 一个单元格需要显示多个渠道/标签/关联对象的场景。
 */
export interface PopoverTableCellProps {
  items: any[];
  /** 如何把一个 item 渲染成文字，默认取 item.label */
  renderLabel?: (item: any) => React.ReactNode;
}
