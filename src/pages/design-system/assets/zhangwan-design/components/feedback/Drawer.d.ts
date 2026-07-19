/**
 * 侧滑抽屉 — 对应 BiDrawer，应用里详情/编辑视图的主要面板模式（在掌玩全站比
 * 居中 Dialog 更常用）。从右侧滑入（direction: rtl），使用品牌标准的快速/功能性
 * 缓动；BiDrawer 自身的默认尺寸是视口宽度的 80%（移动端同样收窄到 80%），而不是
 * 固定像素宽度。
 */
export interface DrawerProps {
  open: boolean;
  title: string;
  /** 默认 '80%'，对应 BiDrawer 自身的默认尺寸（不是固定像素宽度） */
  width?: number | string;
  children: React.ReactNode;
  /** 是否显示底部 取消/确定 按钮条（默认 true） */
  footer?: boolean;
  confirmLoading?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}
