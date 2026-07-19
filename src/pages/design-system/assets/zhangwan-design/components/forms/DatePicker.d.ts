/**
 * BiDatePicker 还原 — 文本触发器 + 面板，显示日期区间和快捷时间段
 * （今天/昨天/近7天/近30天…），是掌玩分析页里主要的日期筛选模式。精确的日历
 * 网格本身做了简化，因为 bi-element-ui 选择器的内部实现不在已挂载源码中；
 * 快捷时间段与触发器/面板外观对应真实用法。触发器外观（高度、边框、圆角）与
 * Select/Input 完全一致，保证筛选行视觉统一；默认宽度 240px，对应应用的标准
 * 筛选控件宽度（filterItemNew.vue 的日期区间编辑器使用 style="width:240px"，
 * 分隔符为 "~"，本组件沿用）。
 */
export interface DatePreset {
  label: string;
  /** 返回该预设选中的 [start, end] 日期区间 */
  range: () => [Date, Date];
}
export interface DatePickerProps {
  value?: [Date | null, Date | null];
  /** 覆盖默认的 今天/昨天/近7天/近30天 预设列表 */
  presets?: DatePreset[];
  /** 起止占位符与分隔符，对应 el-date-picker daterange 的 start/end-placeholder 与 range-separator */
  startPlaceholder?: string;
  endPlaceholder?: string;
  separator?: string;
  onChange?: (range: [Date, Date]) => void;
}
