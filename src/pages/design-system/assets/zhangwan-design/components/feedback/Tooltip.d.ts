/**
 * 深色气泡提示 — 对应 el-tooltip 的 effect="dark" 深色样式。设置
 * `onlyOnOverflow` 后行为对应项目自有的 TextTooltip：仅当子内容因
 * `text-overflow: ellipsis` 被截断时才显示提示气泡，否则悬停不显示任何内容。
 */
export interface TooltipProps {
  /** 气泡内显示的文字/内容 */
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: 'top' | 'bottom';
  disabled?: boolean;
  /** 仅当 children 因单行省略而被截断时才显示（对应 TextTooltip 的 checkTextOverflow） */
  onlyOnOverflow?: boolean;
}
