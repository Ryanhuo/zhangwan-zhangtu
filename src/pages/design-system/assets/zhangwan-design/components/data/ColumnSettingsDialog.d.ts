/**
 * "自定义列"列可见性弹窗 — 对应 components/showTableColumn/index.vue：分组
 * 复选框（每组一个"选中本组全部"的父级复选框，上方是一排换行铺开的子列
 * 复选框），底部左侧有一个全局"全选"复选框，旁边是单一"关闭"按钮 —— 真实场景
 * 每次勾选即时保存，因此没有独立的取消/确定按钮对。
 */
export interface ColumnSettingsChild {
  label: string;
  checked: boolean;
}
export interface ColumnSettingsGroup {
  /** 分组标题，例如表格分区名如 "基础信息" */
  label: string;
  children: ColumnSettingsChild[];
}
export interface ColumnSettingsDialogProps {
  open: boolean;
  groups: ColumnSettingsGroup[];
  /** 每次勾选切换时触发，携带完整的更新后 groups 数组 */
  onChange?: (groups: ColumnSettingsGroup[]) => void;
  onClose?: () => void;
}
