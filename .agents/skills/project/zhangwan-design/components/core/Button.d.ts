/**
 * 掌玩主操作按钮 — 对应 Element UI 的 el-button，主题为品牌绿色，4px 圆角，
 * 用于搜索/表格工具栏。
 *
 */
export interface ButtonProps {
  /** 按钮文字 */
  children: React.ReactNode;
  /** 视觉样式。'primary' = 填充绿色（主操作），'default' = 描边灰色（次要操作），'text' = 无边框（三级/类链接） */
  variant?: 'primary' | 'default' | 'text' | 'danger';
  /** 尺寸，对应 el-button 的 size 属性 */
  size?: 'small' | 'medium' | 'large';
  /** 显示加载图标并禁用交互（BiForm 的 loading 约定：请求进行中时设为 true） */
  loading?: boolean;
  disabled?: boolean;
  /** 可选的前置图标元素（例如图标字体或 svg-icon） */
  icon?: React.ReactNode;
  onClick?: () => void;
}
