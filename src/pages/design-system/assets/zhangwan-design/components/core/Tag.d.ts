/**
 * 掌玩状态胶囊 — 对应分析表格中使用的 el-tag--type / el-tag--nanpin / el-tag--nvpin
 * 类（内容分类、性别分组、状态）。
 *
 */
export interface TagProps {
  children: React.ReactNode;
  /** 'success' = 绿色（类型/分类），'info' = 青色（男频/nanpin 分组），'danger' = 粉色（女频/nvpin 分组），'neutral' = 默认灰色 */
  tone?: 'success' | 'info' | 'danger' | 'neutral';
}
