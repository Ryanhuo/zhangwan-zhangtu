/**
 * 自动挂载 loading 态的按钮 — 对应 `LoadingBtn` 组件：点击时自动进入 loading，
 * 异步任务结束（无论成功/失败）后自动复位，调用方无需手动维护 loading 变量。
 * 其余外观、variant、size 与 Button 完全一致。
 */
export interface LoadingBtnProps {
  children: React.ReactNode;
  variant?: 'primary' | 'default' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  icon?: React.ReactNode;
  /** 异步点击处理函数；组件会在调用期间自动显示 loading，结束后自动复位 */
  onClick?: () => Promise<void> | void;
}
