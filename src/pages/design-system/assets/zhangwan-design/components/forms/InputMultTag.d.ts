/**
 * 自由输入多标签框 — 对应 `InputMultTag` 组件：回车提交为标签、去重、支持
 * multipleLimit 上限，退格删除最后一个标签。区别于 Select 多选——没有下拉
 * 选项列表，用户输入任意文本（如批量 ID/关键词），每一项变成可删除的 chip。
 */
export interface InputMultTagProps {
  /** 当前标签值数组 */
  value?: string[];
  placeholder?: string;
  disabled?: boolean;
  /** 显示清空全部图标 */
  clearable?: boolean;
  /** 折叠为 "第一个 +N"，而不是自动换行铺开 */
  collapseTags?: boolean;
  /** 最多可输入的标签数，0 为不限 */
  multipleLimit?: number;
  onChange?: (next: string[]) => void;
}
