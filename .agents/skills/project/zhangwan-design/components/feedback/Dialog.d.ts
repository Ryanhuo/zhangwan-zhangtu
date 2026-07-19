/**
 * 模态弹窗 — 对应 el-dialog + 项目自有的 DialogDefaultFooter 约定：始终是一个
 * 朴素的"取消"按钮加一个主色"确定"按钮。
 *
 */
export interface DialogProps {
  open: boolean;
  title: string;
  width?: number | string;
  children: React.ReactNode;
  confirmLoading?: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
}
