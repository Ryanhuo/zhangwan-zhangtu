/**
 * 罗盘下拉选择器 — 对应 el-select。支持可筛选搜索框（代替真实的远程搜索防抖）、
 * 多选时折叠标签 + "+N" 溢出提示，以及全选行。默认宽度 240px，对应应用的标准
 * 筛选控件宽度（filterItemNew.vue 中 el-input/el-select/日期区间编辑器都使用
 * style="width:240px"）。
 */
export interface SelectOption {
  label: string;
  value: string | number;
}
export interface SelectProps {
  options: SelectOption[];
  value?: (string | number) | (string | number)[];
  placeholder?: string;
  multiple?: boolean;
  /** 在下拉顶部显示搜索输入框（客户端过滤；代替真实的远程搜索）。 */
  filterable?: boolean;
  /** 多选时，将已选标签折叠为前两个 + 一个 "+N" 徽标，而不是换行铺开。 */
  collapseTags?: boolean;
  /** 多选时在选项列表上方显示一行"全选"。 */
  showSelectAll?: boolean;
  /** 显示一个回形针风格的图标按钮，点击打开批量粘贴文本框（对应 customSelect.vue
   * 的批量输入）。按标签或值逐行匹配。 */
  showBatchInput?: boolean;
  batchTitle?: string;
  onChange?: (value: any) => void;
}
